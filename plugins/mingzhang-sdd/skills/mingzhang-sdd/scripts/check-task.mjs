import * as fs from 'node:fs/promises';
import { Reader, CheckError } from './file-access.mjs';
import { verifyCollection, verifyEvidence } from './facts-evidence.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const contractVersion = 'sdd-check/1';
export const programVersion = 'mingzhang-check/0.2.2';
const executions = ['未执行', '已执行', '执行失败', '执行情况未知'];
const actions = ['create', 'modify', 'delete', 'rename'];
const isObject = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const string = x => typeof x === 'string' && x.trim().length > 0;
const strings = x => Array.isArray(x) && x.every(string);
const ref = x => isObject(x) && Object.keys(x).every(k => ['object', 'locator', 'version', 'sourceKind'].includes(k))
  && string(x.object) && string(x.locator) && (x.version === null || string(x.version)) && string(x.sourceKind);
const refs = x => Array.isArray(x) && x.every(ref);
const sameRef = (a, b) => ['object', 'locator', 'version', 'sourceKind'].every(k => a[k] === b[k]);
const inside = (base, target) => {
  const relative = path.relative(base, target);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
};

const invalid = reason => { throw new CheckError('INPUT_INVALID', reason, '执行失败'); };
function keys(object, expected, label) {
  if (!isObject(object) || Object.keys(object).some(k => !expected.includes(k))
    || expected.some(k => !Object.hasOwn(object, k))) invalid(`${label} 字段缺失或含未知字段`);
}
function validateFacts(facts) {
  if (facts === null) return;
  keys(facts, ['factsVersion', 'taskId', 'projectRoot', 'baselineId', 'observedAt', 'observations',
    'baselineRefs', 'beforeDirtyRefs', 'afterRefs', 'changes', 'coverage', 'verificationRefs'], 'facts');
  if (!string(facts.factsVersion) || !string(facts.taskId) || !string(facts.projectRoot)
    || !(facts.baselineId === null || string(facts.baselineId)) || !string(facts.observedAt)
    || !['baselineRefs', 'beforeDirtyRefs', 'afterRefs', 'verificationRefs'].every(k => refs(facts[k]))) invalid('facts 身份或引用类型错误');
  keys(facts.coverage, ['state', 'basisRefs', 'limitations'], 'coverage');
  if (!['complete', 'partial', 'unknown'].includes(facts.coverage.state)
    || !refs(facts.coverage.basisRefs) || !Array.isArray(facts.coverage.limitations)
    || !facts.coverage.limitations.every(string)) invalid('coverage 类型错误');
  if (!Array.isArray(facts.observations) || !Array.isArray(facts.changes)) invalid('事实列表类型错误');
  const ids = new Set();
  for (const o of facts.observations) {
    keys(o, ['id', 'subject', 'action', 'execution', 'rawRef', 'postStateRef', 'limitations'], 'Observation');
    if (!string(o.id) || ids.has(o.id) || !ref(o.subject) || !string(o.action)
      || !executions.includes(o.execution) || !(o.rawRef === null || ref(o.rawRef))
      || !(o.postStateRef === null || ref(o.postStateRef)) || !Array.isArray(o.limitations)
      || !o.limitations.every(string)) invalid('Observation 类型或 id 错误');
    ids.add(o.id);
  }
  for (const c of facts.changes) {
    keys(c, ['fromPath', 'toPath', 'action', 'beforeRef', 'afterRef', 'observationRefs'], 'Change');
    if (!actions.includes(c.action) || !(c.beforeRef === null || ref(c.beforeRef))
      || !(c.afterRef === null || ref(c.afterRef)) || !refs(c.observationRefs)) invalid('Change 类型错误');
    if ((c.action === 'create' && !(c.fromPath === null && string(c.toPath)))
      || (c.action === 'delete' && !(string(c.fromPath) && c.toPath === null))
      || (c.action === 'modify' && !(string(c.fromPath) && c.fromPath === c.toPath))
      || (c.action === 'rename' && !(string(c.fromPath) && string(c.toPath) && c.fromPath !== c.toPath))) invalid('Change 动作与路径不相符');
  }
}
function validate(input) {
  if (!isObject(input)) invalid('stdin 须是一个 JSON 对象');
  if (!string(input.contractVersion)) invalid('缺少契约版本');
  if (input.contractVersion !== contractVersion) throw new CheckError('CONTRACT_UNSUPPORTED', '不支持此契约版本；未读取目标对象');
  keys(input, ['contractVersion', 'requestId', 'taskId', 'projectRoot', 'readScope',
    'conditionRefs', 'artifactRefs', 'facts', 'checks'], '请求');
  if (!string(input.requestId) || !string(input.taskId) || !string(input.projectRoot)) {
    throw new CheckError('IDENTITY_INSUFFICIENT', '本次请求或任务／项目身份不足；未读取目标对象');
  }
  keys(input.readScope, ['files', 'directories'], 'readScope');
  if (!strings(input.readScope.files) || !strings(input.readScope.directories)
    || !refs(input.conditionRefs) || !refs(input.artifactRefs) || !Array.isArray(input.checks)) invalid('请求范围、引用或检查列表类型错误');
  validateFacts(input.facts);
  const ids = new Set();
  for (const c of input.checks) {
    keys(c, ['id', 'kind', 'subject', 'conditionRef', 'parameters'], 'Check');
    if (!string(c.id) || c.id === '$protocol' || ids.has(c.id) || !ref(c.subject) || !ref(c.conditionRef)) invalid('业务检查身份／引用无效或重复');
    ids.add(c.id);
    if (!['object', 'changes', 'evidence', 'notApplicable'].includes(c.kind)) {
      throw new CheckError('CONDITION_INSUFFICIENT', '未知检查类型；未读取目标对象');
    }
    const p = c.parameters;
    if (c.kind === 'object') {
      keys(p, ['path', 'expected'], 'object.parameters');
      if (!string(p.path) || !['exists', 'readable'].includes(p.expected)) invalid('对象参数类型错误');
    } else if (c.kind === 'changes') {
      keys(p, ['allowed'], 'changes.parameters');
      if (!Array.isArray(p.allowed)) invalid('allowed 须为数组');
      for (const a of p.allowed) {
        keys(a, ['path', 'scope', 'actions'], 'allowed 条目');
        if (!string(a.path) || !['file', 'directory'].includes(a.scope)
          || !strings(a.actions) || !a.actions.every(x => actions.includes(x))) invalid('allowed 类型错误');
      }
    } else if (c.kind === 'evidence') {
      keys(p, ['evidenceRef', 'expectedSubject', 'expectedState'], 'evidence.parameters');
      if (!ref(p.evidenceRef) || !ref(p.expectedSubject) || !string(p.expectedState)) invalid('证据参数类型错误');
    } else {
      keys(p, ['reason', 'basisRef'], 'notApplicable.parameters');
      if (!string(p.reason) || !ref(p.basisRef)) invalid('不适用参数类型错误');
    }
  }
}

export function aggregate(results) {
  if (results.some(x => x.execution === '执行失败')) return 3;
  if (results.some(x => x.judgement === '存在缺口')) return 1;
  if (!results.length || results.some(x => x.judgement === '证据不足'
    || !['已执行'].includes(x.execution))) return 2;
  return 0;
}

async function inspect(c, request, reader) {
  const evidenceRefs = [];
  const condition = request.conditionRefs.find(x => sameRef(x, c.conditionRef));
  if (!condition || condition.version === null) throw new CheckError('CONDITION_INSUFFICIENT', '条件来源未关联本次请求或版本不明');
  await reader.observe(condition.object, true); evidenceRefs.push(condition);
  if (c.kind === 'object') {
    if (path.resolve(reader.root, c.subject.object) !== path.resolve(reader.root, c.parameters.path)) {
      throw new CheckError('IDENTITY_INSUFFICIENT', '对象引用与检查路径不一致');
    }
    await reader.observe(c.parameters.path, c.parameters.expected === 'readable');
    evidenceRefs.push(c.subject);
    return { judgement: '满足', evidenceRefs, reason: '已核实指定对象的存在／可读条件；未判断业务内容' };
  }
  if (c.kind === 'notApplicable') {
    await reader.observe(c.parameters.basisRef.object, true);
    evidenceRefs.push(c.parameters.basisRef);
    return { judgement: '不适用', evidenceRefs, reason: `不适用依据可读且与本次项关联；业务适用性仍由 Agent 评审：${c.parameters.reason}` };
  }
  const facts = request.facts;
  if (facts === null) throw new CheckError('CONDITION_INSUFFICIENT', '未提供改动／验证事实，不能判断相关条件');
  if (facts.factsVersion !== 'sdd-facts/1') throw new CheckError('CONTRACT_UNSUPPORTED', '不支持此事实结构版本');
  if (facts.taskId !== request.taskId || ![reader.root, path.resolve(request.projectRoot)].includes(path.resolve(facts.projectRoot))) {
    throw new CheckError('IDENTITY_INSUFFICIENT', '事实不属于当前任务／真实项目根');
  }
  if (c.kind === 'changes') {
    const allowed = [];
    for (const a of c.parameters.allowed) allowed.push({ ...a, real: await reader.canonical(a.path) });
    const gaps = [];
    for (const change of facts.changes) {
      for (const p of [change.fromPath, change.toPath].filter(x => x !== null)) {
        let real;
        try { real = await reader.canonical(p); }
        catch (e) {
          if (e.code === 'READ_BOUNDARY') { gaps.push({ path: p, action: change.action }); continue; }
          throw e;
        }
        if (!allowed.some(a => a.actions.includes(change.action)
          && (a.scope === 'file' ? a.real === real : inside(a.real, real)))) gaps.push({ path: p, action: change.action });
      }
    }
    if (gaps.length) return { judgement: '存在缺口', evidenceRefs,
      reason: `传入的已观察集合含界外路径／动作：${JSON.stringify(gaps)}；集合完整性和动作真实性仍须核原始来源` };
    const rawRefs = await verifyCollection(reader, request, c);
    return { judgement: '满足', evidenceRefs: [...evidenceRefs, ...rawRefs],
      reason: '已从开工、逐动作与收尾原始观察独立重建本次集合，列出的观察范围内路径／动作满足；不保证未观察范围或模型没有遗漏其他动作' };
  }
  await reader.observe(c.parameters.evidenceRef.object, true);
  const outcome = await verifyEvidence(reader, request, c);
  return { ...outcome, evidenceRefs: [...evidenceRefs, ...outcome.evidenceRefs] };
}

export async function checkRequest(input) {
  const receipt = { contractVersion, requestId: string(input?.requestId) ? input.requestId : null,
    taskId: string(input?.taskId) ? input.taskId : null, programVersion,
    projectRoot: string(input?.projectRoot) ? input.projectRoot : null,
    baselineId: string(input?.facts?.baselineId) ? input.facts.baselineId : null, results: [] };
  const result = (checkId, c, error) => ({ checkId, subject: c?.subject ?? null,
    conditionRef: c?.conditionRef ?? null, execution: error.execution,
    judgement: error.judgement, evidenceRefs: [], reason: error.message, errorCode: error.code });
  try { validate(input); }
  catch (e) {
    const error = e instanceof CheckError ? e : new CheckError('INPUT_INVALID', '无法处理请求', '执行失败');
    receipt.results.push(result('$protocol', null, error));
    return { receipt, exitCode: aggregate(receipt.results) };
  }
  let reader; let preparationError;
  try {
    if (!path.isAbsolute(input.projectRoot)) throw new CheckError('IDENTITY_INSUFFICIENT', 'projectRoot 须是本次绝对项目路径');
    const root = await fs.realpath(input.projectRoot);
    if (!(await fs.stat(root)).isDirectory()) throw new CheckError('IDENTITY_INSUFFICIENT', '项目根不是目录');
    reader = new Reader(root, input.readScope); await reader.initialize(); receipt.projectRoot = root;
  } catch (e) { preparationError = e instanceof CheckError ? e : new CheckError('READ_FAILED', '项目根或读取范围不可核实'); }
  for (const c of input.checks) {
    try {
      if (preparationError) throw preparationError;
      const outcome = await inspect(c, input, reader);
      receipt.results.push({ checkId: c.id, subject: c.subject, conditionRef: c.conditionRef,
        execution: '已执行', judgement: outcome.judgement, evidenceRefs: outcome.evidenceRefs,
        reason: outcome.reason, errorCode: null });
    } catch (e) {
      receipt.results.push(result(c.id, c, e instanceof CheckError ? e
        : new CheckError('READ_FAILED', '分项处理失败', '执行失败')));
    }
  }
  return { receipt, exitCode: aggregate(receipt.results) };
}

async function main() {
  if (process.argv.length === 3 && process.argv[2] === '--help') {
    process.stdout.write(`${programVersion}\n只读检查：Node.js 24.x；请求不授予权限，不执行输入中的命令。\n用法：node check-task.mjs < request.json\n选项：--help 显示本帮助，不读取 stdin 或项目文件，退出 0。\n请求：一个 UTF-8 JSON 对象，contractVersion=sdd-check/1；详见本包 references/check-contract.md。\n业务输出：stdout 单一 JSON 回执；非零结果的安全摘要到 stderr。\n退出：0 确定条件满足或有依据不适用；1 有缺口；2 证据不足；3 处理或运行失败。\n完整字段及当前能力：本包 references/check-contract.md、scripts/README.md。\n`);
    return;
  }
  let input; let output;
  try {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
  } catch {
    output = await checkRequest(null);
    output.receipt.results[0].reason = 'stdin 不是合法 UTF-8 JSON 对象';
  }
  output ??= await checkRequest(input);
  process.stdout.write(`${JSON.stringify(output.receipt)}\n`);
  if (output.exitCode !== 0) {
    const category = { 1: '存在确定缺口', 2: '证据不足', 3: '输入处理或检查运行失败' }[output.exitCode];
    const codes = [...new Set(output.receipt.results.map(r => r.errorCode).filter(Boolean))];
    process.stderr.write(`检查${category}；退出 ${output.exitCode}${codes.length ? `；原因码 ${codes.join(', ')}` : ''}。具体分项见 stdout 回执，不以退出码判阶段通过。\n`);
  }
  process.exitCode = output.exitCode;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
