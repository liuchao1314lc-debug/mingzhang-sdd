import * as fs from 'node:fs/promises';
import path from 'node:path';
import { Reader, CheckError, digest } from './file-access.mjs';

const supportedCollectorVersions = new Set(['mingzhang-collect/0.1.0', 'mingzhang-collect/0.1.1', 'mingzhang-collect/0.1.2']);
const diagnosticCollectorVersions = new Set(['mingzhang-collect/0.1.1', 'mingzhang-collect/0.1.2']);
const failureCodes = ['INPUT_INVALID', 'CONTRACT_UNSUPPORTED', 'IDENTITY_INSUFFICIENT', 'CONDITION_INSUFFICIENT', 'READ_BOUNDARY', 'READ_FAILED', 'OBJECT_CHANGED'];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const nonempty = x => typeof x === 'string' && x.trim() !== '';
const keys = (v, names) => v && typeof v === 'object' && !Array.isArray(v)
  && Object.keys(v).length === names.length && names.every(k => Object.hasOwn(v, k));
const insufficient = message => { throw new CheckError('CONDITION_INSUFFICIENT', message); };
const identity = message => { throw new CheckError('IDENTITY_INSUFFICIENT', message); };
const hashVersion = x => /^sha256:[a-f0-9]{64}$/u.test(x ?? '');
const relative = p => typeof p === 'string' && p !== '' && !path.isAbsolute(p) && !p.includes('\0')
  && p.split('/').every(x => x !== '..' && x !== '.' && x !== '');
const inDirectory = (d, p) => p === d || p.startsWith(`${d}/`);
const statKeys = ['dev', 'ino', 'mode', 'size', 'mtimeMs', 'ctimeMs'];
const statShape = st => keys(st, statKeys) && statKeys.every(k => Number.isFinite(st[k]));

export async function rawJSON(reader, ref) {
  if (!keys(ref, ['object', 'locator', 'version', 'sourceKind']) || !nonempty(ref.object) || !nonempty(ref.locator)
    || ref.sourceKind !== 'tool' || !hashVersion(ref.version)) insufficient('原始依据需要实际工具来源及内容指纹，普通版本标签不足');
  const bytes = await reader.content(ref.object);
  if (digest(bytes) !== ref.version) throw new CheckError('OBJECT_CHANGED', '原始依据版本与实际文件不符');
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { insufficient('原始依据不是支持的 UTF-8 JSON；不能从可读推定真实结果'); }
}

function snapshot(value, taskId, root) {
  if (!keys(value, ['format', 'collectorVersion', 'captureId', 'taskId', 'projectRoot', 'observedAt', 'scope', 'objects', 'git', 'limitations'])
    || value.format !== 'sdd-snapshot/1' || !supportedCollectorVersions.has(value.collectorVersion)
    || !nonempty(value.captureId) || !Number.isFinite(Date.parse(value.observedAt))
    || !keys(value.scope, ['files', 'directories']) || !['files', 'directories'].every(k => Array.isArray(value.scope[k]) && value.scope[k].every(relative))
    || !value.objects || typeof value.objects !== 'object' || Array.isArray(value.objects)
    || !keys(value.git, ['state', 'head', 'status', 'index']) || !['git', 'notGit'].includes(value.git.state)
    || !(value.git.head === null || /^[a-f0-9]{40,64}$/u.test(value.git.head))
    || typeof value.git.status !== 'string' || typeof value.git.index !== 'string'
    || !Array.isArray(value.limitations) || !value.limitations.every(nonempty)) insufficient('基准／后状态结构或采集版本不可核验');
  if (value.taskId !== taskId || value.projectRoot !== root) identity('原始观察不属于本次任务／真实项目根');
  for (const [p, obj] of Object.entries(value.objects)) {
    if (!relative(p) || !(value.scope.files.includes(p) || value.scope.directories.some(d => inDirectory(d, p)))) insufficient('原始观察含未覆盖对象');
    if (obj.type === 'absent' && keys(obj, ['type'])) continue;
    if (obj.type === 'file' && keys(obj, ['type', 'version', 'stat']) && hashVersion(obj.version) && statShape(obj.stat)) continue;
    if (obj.type === 'directory' && keys(obj, ['type', 'entries', 'stat']) && statShape(obj.stat)
      && Array.isArray(obj.entries) && new Set(obj.entries).size === obj.entries.length
      && obj.entries.every(x => relative(x) && !x.includes('/'))) {
      if (obj.entries.some(name => name !== '.git' && !Object.hasOwn(value.objects, `${p}/${name}`))) insufficient('目录成员未取得对应原始观察');
      continue;
    }
    if (obj.type === 'unsupported' && keys(obj, ['type', 'stat']) && statShape(obj.stat) && value.limitations.length) continue;
    insufficient('对象观察不完整或类型不支持');
  }
  if ([...value.scope.files, ...value.scope.directories].some(p => !Object.hasOwn(value.objects, p))) insufficient('观察范围有缺失根项');
  return value;
}

const state = s => ({ scope: s.scope, objects: s.objects, git: s.git });
const absent = { type: 'absent' };
function checkAction(op, taskId, root) {
  const fields = ['format', 'collectorVersion', 'taskId', 'projectRoot', 'operation', 'before', 'after', 'execution', 'limitations'];
  if (diagnosticCollectorVersions.has(op?.collectorVersion)) fields.push('errorCode', 'category', 'reason');
  if (!keys(op, fields)
    || op.format !== 'sdd-local-action/1' || !supportedCollectorVersions.has(op.collectorVersion)
    || !keys(op.operation, ['action', 'fromPath', 'toPath', 'contentVersion'])
    || !['create', 'modify', 'delete', 'rename'].includes(op.operation.action)
    || !Array.isArray(op.limitations) || !op.limitations.every(nonempty)
    || !['已执行', '执行失败'].includes(op.execution)) insufficient('动作不是支持的采集入口原始回执');
  if (diagnosticCollectorVersions.has(op.collectorVersion)
    && (op.execution === '已执行' ? op.errorCode !== null || op.category !== null || op.reason !== null
      : !failureCodes.includes(op.errorCode) || !nonempty(op.category) || !nonempty(op.reason))) insufficient('文件动作诊断与执行状态不一致');
  if (op.taskId !== taskId || op.projectRoot !== root) identity('动作原始回执身份不匹配');
  const a = op.operation;
  if ((a.action === 'create' && !(a.fromPath === null && relative(a.toPath)))
    || (a.action === 'modify' && !(relative(a.fromPath) && a.fromPath === a.toPath))
    || (a.action === 'delete' && !(relative(a.fromPath) && a.toPath === null))
    || (a.action === 'rename' && !(relative(a.fromPath) && relative(a.toPath) && a.fromPath !== a.toPath))
    || (['create', 'modify'].includes(a.action) ? !hashVersion(a.contentVersion) : a.contentVersion !== null)) insufficient('动作端点／内容基准不一致');
  snapshot(op.before, taskId, root); snapshot(op.after, taskId, root);
  return op;
}

function actionDelta(op) {
  const { before, after, operation: a } = op;
  const oldFrom = before.objects[a.fromPath] ?? absent;
  const newFrom = after.objects[a.fromPath] ?? absent;
  const oldTo = before.objects[a.toPath] ?? absent;
  const newTo = after.objects[a.toPath] ?? absent;
  if (a.action === 'create' && !(oldTo.type === 'absent' && newTo.type === 'file' && newTo.version === a.contentVersion)) return false;
  if (a.action === 'modify' && !(oldFrom.type === 'file' && newTo.type === 'file' && newTo.version === a.contentVersion)) return false;
  if (a.action === 'delete' && !(oldFrom.type === 'file' && newFrom.type === 'absent')) return false;
  if (a.action === 'rename' && !(oldFrom.type === 'file' && newFrom.type === 'absent' && oldTo.type === 'absent'
    && newTo.type === 'file' && newTo.version === oldFrom.version)) return false;
  const endpoints = [a.fromPath, a.toPath].filter(x => x !== null);
  for (const p of new Set([...Object.keys(before.objects), ...Object.keys(after.objects)])) {
    if (endpoints.includes(p)) continue;
    const x = before.objects[p] ?? absent; const y = after.objects[p] ?? absent;
    if (same(x, y)) continue;
    if (x.type === 'directory' && y.type === 'directory' && endpoints.some(e => inDirectory(p, e))) {
      if (!['dev', 'ino', 'mode'].every(k => x.stat[k] === y.stat[k])) return false;
      const wanted = new Set(x.entries);
      for (const e of endpoints) if (path.posix.dirname(e) === p) {
        const name = path.posix.basename(e);
        if ((after.objects[e] ?? absent).type === 'absent') wanted.delete(name); else wanted.add(name);
      }
      if (!same([...wanted].sort(), [...y.entries].sort())) return false;
    } else return false;
  }
  return true;
}

async function currentState(reader, after) {
  for (const [p, expected] of Object.entries(after.objects)) {
    const real = await reader.guard(p);
    let st;
    // Capture records unsupported objects themselves, never their resolved target.
    // Keep the boundary guard above; lstat does not read symlink/FIFO content.
    try { st = await fs.lstat(expected.type === 'unsupported' ? reader.lexical(p) : real); }
    catch (e) { if (['ENOENT', 'ENOTDIR'].includes(e.code) && expected.type === 'absent') continue; throw e; }
    if (expected.type === 'absent' || !same(expected.stat, Object.fromEntries(statKeys.map(k => [k, st[k]])))) {
      throw new CheckError('OBJECT_CHANGED', '收尾后对象变化，原始观察不适用于当前版本');
    }
    if (expected.type === 'file' && await reader.fingerprint(p) !== expected.version) throw new CheckError('OBJECT_CHANGED', '当前内容与收尾观察不同');
    if (expected.type === 'directory' && !same((await fs.readdir(real)).sort(), [...expected.entries].sort())) throw new CheckError('OBJECT_CHANGED', '当前目录与收尾观察不同');
  }
}

export async function collection(reader, input) {
  const { taskId, baselineRef, operationRefs, afterRef, verificationRefs = [] } = input;
  const before = snapshot(await rawJSON(reader, baselineRef), taskId, reader.root);
  const after = snapshot(await rawJSON(reader, afterRef), taskId, reader.root);
  const limitations = [...before.limitations, ...after.limitations];
  if (!same(before.scope, after.scope)) limitations.push('开工与收尾观察范围不同');
  if (Date.parse(after.observedAt) < Date.parse(before.observedAt)) limitations.push('原始观察时序不成立');
  let previous = before; const changes = []; const observations = []; const seen = new Set();
  for (let i = 0; i < operationRefs.length; i++) {
    const ref = operationRefs[i];
    if (seen.has(ref.version)) { limitations.push('动作原始回执重复'); continue; } seen.add(ref.version);
    const op = checkAction(await rawJSON(reader, ref), taskId, reader.root);
    if (!same(state(previous), state(op.before)) || Date.parse(op.before.observedAt) < Date.parse(previous.observedAt)
      || Date.parse(op.after.observedAt) < Date.parse(op.before.observedAt)) limitations.push('动作前基准断链／并发或未覆盖动作');
    if (!same(op.before.scope, op.after.scope) || !same(before.scope, op.before.scope)) limitations.push('动作观察范围发生变化');
    if (op.execution !== '已执行' || op.limitations.length || !actionDelta(op)) limitations.push('动作未完整成功或实际后状态含未归属变化');
    if (op.before.git.state !== op.after.git.state || op.before.git.head !== op.after.git.head
      || op.before.git.index !== op.after.git.index) limitations.push('动作期间提交／索引变化未被本文件动作采集覆盖');
    limitations.push(...op.before.limitations, ...op.after.limitations);
    const a = op.operation; const observationRef = { ...ref, locator: 'operation' };
    const subjectPath = a.toPath ?? a.fromPath;
    observations.push({ id: `action-${i + 1}`, subject: { object: subjectPath, locator: '正文',
      version: (op.after.objects[subjectPath] ?? op.before.objects[subjectPath] ?? absent).version ?? null, sourceKind: 'tool' },
    action: a.action, execution: op.execution, rawRef: ref, postStateRef: { ...ref, locator: 'after' }, limitations: op.limitations });
    if (op.execution === '已执行' && actionDelta(op)) {
      changes.push({ action: a.action, fromPath: a.fromPath, toPath: a.toPath,
        beforeRef: a.fromPath === null ? null : { ...ref, locator: `before.objects[${a.fromPath}]` },
        afterRef: a.toPath === null ? null : { ...ref, locator: `after.objects[${a.toPath}]` }, observationRefs: [observationRef] });
    } else {
      // A failed rename can leave both endpoints. Preserve the actual file delta, not the requested action.
      for (const p of new Set([...Object.keys(op.before.objects), ...Object.keys(op.after.objects)])) {
        const x = op.before.objects[p] ?? absent; const y = op.after.objects[p] ?? absent;
        if ((x.type === 'file' || y.type === 'file') && !same(x, y)) {
          const action = x.type === 'absent' ? 'create' : y.type === 'absent' ? 'delete' : 'modify';
          changes.push({ action, fromPath: action === 'create' ? null : p, toPath: action === 'delete' ? null : p,
            beforeRef: action === 'create' ? null : { ...ref, locator: `before.objects[${p}]` },
            afterRef: action === 'delete' ? null : { ...ref, locator: `after.objects[${p}]` }, observationRefs: [observationRef] });
        }
      }
    }
    previous = op.after;
  }
  if (!same(state(previous), state(after))) limitations.push('收尾与最后动作后状态不一致，存在未覆盖变化');
  await currentState(reader, after);
  const facts = { factsVersion: 'sdd-facts/1', taskId, projectRoot: reader.root, baselineId: before.captureId,
    observedAt: after.observedAt, observations, baselineRefs: [baselineRef],
    beforeDirtyRefs: before.git.status ? [{ ...baselineRef, locator: 'git.status' }] : [], afterRefs: [afterRef], changes,
    coverage: { state: limitations.length ? 'partial' : 'complete', basisRefs: [baselineRef, ...operationRefs, afterRef], limitations: [...new Set(limitations)] }, verificationRefs };
  return facts;
}

export async function buildFacts(input) {
  const root = await fs.realpath(input.projectRoot);
  const reader = new Reader(root, input.readScope); await reader.initialize();
  if (!Array.isArray(input.operationRefs) || !Array.isArray(input.verificationRefs)) insufficient('动作／验证引用列表不完整');
  return collection(reader, input);
}

export async function verifyCollection(reader, request, check) {
  const f = request.facts;
  if (f.baselineRefs.length !== 1 || f.afterRefs.length !== 1 || f.coverage.basisRefs.length !== f.observations.length + 2) insufficient('未取得原始基准、逐动作回执与收尾依据；complete 自述不证明全范围满足');
  const operationRefs = f.coverage.basisRefs.slice(1, -1);
  if (!same(f.coverage.basisRefs[0], f.baselineRefs[0]) || !same(f.coverage.basisRefs.at(-1), f.afterRefs[0])) insufficient('采集依据关联不一致');
  const derived = await collection(reader, { taskId: request.taskId, baselineRef: f.baselineRefs[0],
    operationRefs, afterRef: f.afterRefs[0], verificationRefs: f.verificationRefs });
  if (!same(f, derived)) insufficient('传入事实与原始采集独立重建结果不一致');
  if (derived.coverage.state !== 'complete') insufficient(`采集范围未完整闭合：${derived.coverage.limitations.join('；')}`);
  const before = snapshot(await rawJSON(reader, f.baselineRefs[0]), request.taskId, reader.root);
  for (const allowed of check.parameters.allowed) {
    const p = path.relative(reader.root, await reader.canonical(allowed.path)).split(path.sep).join('/');
    const covered = before.scope.directories.some(d => inDirectory(d, p))
      || (allowed.scope === 'file' && before.scope.files.includes(p));
    if (!covered) insufficient('检查的允许边界未被原始观察完整覆盖，部分目录观察不能签全范围满足');
  }
  return derived.coverage.basisRefs;
}

function tapState(output, exitCode) {
  if (/^(?:Warning:.*truncated output|Output truncated|\s*Bail out!)/mu.test(output)) insufficient('原始返回截断或提前终止');
  const lines = output.split(/\r?\n/u);
  if (lines[0] !== 'TAP version 13') insufficient('原始 TAP 开头缺失，不是完整返回');
  const plans = lines.filter(x => /^1\.\.\d+$/u.test(x));
  const totals = {};
  for (const key of ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo']) {
    const values = lines.filter(x => new RegExp(`^# ${key} \\d+$`, 'u').test(x));
    if (values.length !== 1) insufficient('TAP 原始统计缺失或重复，汇总不能代替原始结果');
    totals[key] = Number(values[0].split(' ').at(-1));
  }
  const results = lines.filter(x => /^\s*(?:not )?ok \d+(?: |$)/u.test(x));
  const topResults = lines.filter(x => /^(?:not )?ok \d+(?: |$)/u.test(x));
  if (plans.length !== 1 || !totals.tests || results.length !== totals.tests
    || topResults.length !== Number(plans[0].slice(3))
    || totals.pass + totals.fail + totals.cancelled + totals.skipped + totals.todo !== totals.tests
    || (totals.fail > 0 && !results.some(x => /^\s*not ok/u.test(x)))) insufficient('TAP 计划、逐项结果与统计不一致或没有实际用例');
  if (totals.cancelled || totals.skipped || totals.todo) insufficient('指定验证含取消、跳过或待办，不能给完整通过');
  if (totals.fail > 0 && exitCode !== 0) return '存在偏差';
  if (totals.fail === 0 && exitCode === 0 && !results.some(x => /^\s*not ok/u.test(x))) return '通过';
  insufficient('实际退出码与原始 TAP 结果矛盾');
}

export async function verifyEvidence(reader, request, check) {
  const p = check.parameters;
  if (!request.facts.verificationRefs.some(r => same(r, p.evidenceRef))
    || !request.artifactRefs.some(r => same(r, p.expectedSubject)) || !same(check.subject, p.expectedSubject)) identity('验证引用／对象未关联本次事实及成果');
  if (!request.facts.baselineId || request.facts.baselineRefs.length !== 1) insufficient('指定验证缺少本次真实基准身份');
  const baseline = snapshot(await rawJSON(reader, request.facts.baselineRefs[0]), request.taskId, reader.root);
  if (request.facts.baselineId !== baseline.captureId) identity('指定验证事实的基准身份与原始观察不符');
  const raw = await rawJSON(reader, p.evidenceRef);
  if (!keys(raw, ['format', 'taskId', 'projectRoot', 'subject', 'environment', 'request', 'beforeRef', 'afterRef', 'returns', 'limitations'])
    || raw.format !== 'sdd-codex-exec/1') insufficient('尚不支持该原始宿主格式，不能从可读推定验证合格');
  if (raw.taskId !== request.taskId || raw.projectRoot !== reader.root || !same(raw.subject, p.expectedSubject)) identity('原始验证对象／任务／项目身份不符');
  if (!hashVersion(raw.subject.version) || !keys(raw.environment, ['nodeVersion', 'platform'])
    || !/^v24\.\d+\.\d+$/u.test(raw.environment.nodeVersion) || !nonempty(raw.environment.platform)
    || !keys(raw.request, ['cmd', 'workdir']) || !nonempty(raw.request.cmd) || raw.request.workdir !== reader.root
    || !Array.isArray(raw.limitations) || raw.limitations.length) insufficient('原始验证环境、请求或限制不足');
  const match = /^node --test --test-reporter=tap (?:'([^'\r\n]+)'|"([^"\\$`\r\n]+)"|([^\s;|&<>`$'"\\*?\[\]{}()]+))$/u.exec(raw.request.cmd);
  if (!match || path.resolve(reader.root, match[1] ?? match[2] ?? match[3]) !== path.resolve(reader.root, raw.subject.object)) insufficient('本版只解析明确对象的 Node 24 单文件 TAP 验证调用；不猜其他命令含义');
  const before = snapshot(await rawJSON(reader, raw.beforeRef), request.taskId, reader.root);
  const after = snapshot(await rawJSON(reader, raw.afterRef), request.taskId, reader.root);
  const subjectPath = path.relative(reader.root, path.resolve(reader.root, raw.subject.object)).split(path.sep).join('/');
  if (before.objects[subjectPath]?.version !== raw.subject.version || after.objects[subjectPath]?.version !== raw.subject.version
    || before.limitations.length || after.limitations.length || !same(state(before), state(after))
    || Date.parse(after.observedAt) < Date.parse(before.observedAt)
    || Date.parse(before.observedAt) < Date.parse(baseline.observedAt)) insufficient('验证期间被测对象或依赖观察变化／不足');
  await currentState(reader, after);
  if (!Array.isArray(raw.returns) || !raw.returns.length) insufficient('没有原始宿主返回');
  let session = null; const chunks = new Set(); let output = '';
  for (let i = 0; i < raw.returns.length; i++) {
    const result = raw.returns[i];
    if (!result || Object.keys(result).some(k => !['chunk_id', 'exit_code', 'original_token_count', 'output', 'session_id', 'wall_time_seconds'].includes(k))
      || typeof result.output !== 'string' || !Number.isFinite(result.wall_time_seconds) || result.wall_time_seconds < 0
      || (Object.hasOwn(result, 'exit_code') && result.exit_code !== null && !Number.isInteger(result.exit_code))
      || (Object.hasOwn(result, 'session_id') && result.session_id !== null && !Number.isInteger(result.session_id))) insufficient('Codex 原始返回字段无法核验');
    if (result.chunk_id) { if (chunks.has(result.chunk_id)) insufficient('宿主返回片段重复'); chunks.add(result.chunk_id); }
    if (i < raw.returns.length - 1) {
      if (Number.isInteger(result.exit_code) || !Number.isInteger(result.session_id)) insufficient('宿主返回序列不成立');
      if (session !== null && session !== result.session_id) identity('宿主会话身份断链'); session = result.session_id;
    } else if (!Number.isInteger(result.exit_code) || Number.isInteger(result.session_id)) insufficient('宿主未终止、超时或退出情况未知');
    output += result.output;
  }
  const actual = tapState(output, raw.returns.at(-1).exit_code);
  if (!['通过', '存在偏差', '已执行'].includes(p.expectedState)) insufficient('本版未定义此期望验证状态');
  return { judgement: p.expectedState === '已执行' || p.expectedState === actual ? '满足' : '存在缺口',
    evidenceRefs: [p.evidenceRef, raw.beforeRef, raw.afterRef],
    reason: `已解析 Codex 原始完成返回与 Node TAP：指定验证${actual}；仅核指定对象／状态，不代替产品语义、独立评价或用户验收` };
}
