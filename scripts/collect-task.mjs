import * as fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Reader, CheckError, digest } from './file-access.mjs';

export const collectorVersion = 'mingzhang-collect/0.1.2';
const categories = { INPUT_INVALID: '输入错误', CONTRACT_UNSUPPORTED: '版本不支持', IDENTITY_INSUFFICIENT: '身份不足', CONDITION_INSUFFICIENT: '条件不足', READ_BOUNDARY: '范围越界', READ_FAILED: '读取或文件动作失败', OBJECT_CHANGED: '对象变化' };
function diagnostic(error) {
  const code = error instanceof CheckError && Object.hasOwn(categories, error.code) ? error.code : 'READ_FAILED';
  const nativeReasons = { ENOENT: '必要对象或父目录不存在；须核实际后状态', EACCES: '对象读取或文件动作权限不足；须核实际后状态',
    EPERM: '对象读取或文件动作权限不足；须核实际后状态', EIO: '底层读写失败；须核实际后状态', EEXIST: '新端点已出现，未覆盖既有资产', ELOOP: '链接或对象定位变化；须核实际后状态' };
  return { errorCode: code, category: categories[code], reason: error instanceof CheckError ? error.message
    : nativeReasons[error?.code] ?? '采集或文件动作处理失败；须核实际后状态' };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keys = (value, names) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === names.length && names.every(k => Object.hasOwn(value, k));
const nonempty = x => typeof x === 'string' && x.trim() !== '';
const inside = (base, target) => { const p = path.relative(base, target); return p === '' || (!path.isAbsolute(p) && p !== '..' && !p.startsWith(`..${path.sep}`)); };
const signature = st => ({ dev: st.dev, ino: st.ino, mode: st.mode, size: st.size, mtimeMs: st.mtimeMs, ctimeMs: st.ctimeMs });
const sameStat = (a, b) => same(signature(a), signature(b));
const normalize = (root, p) => path.relative(root, path.resolve(root, p)).split(path.sep).join('/');

export function validateScope(scope) {
  if (!keys(scope, ['files', 'directories']) || !['files', 'directories'].every(k => Array.isArray(scope[k]) && scope[k].every(nonempty))) {
    throw new CheckError('INPUT_INVALID', '观察范围须明确列出 files／directories');
  }
}

// Only fixed, read-only Git commands. No shell, hooks, user-supplied subcommands or repository writes.
function gitState(root, scope) {
  const environment = { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_LITERAL_PATHSPECS: '1' };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES']) delete environment[key];
  const run = args => spawnSync('git', ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-C', root, ...args], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 4 * 1024 * 1024,
    env: environment,
  });
  const top = run(['rev-parse', '--show-toplevel']);
  if (top.status !== 0) {
    if (/not a git repository/u.test(top.stderr ?? '')) return { state: 'notGit', head: null, status: '', index: '' };
    throw new CheckError('READ_FAILED', 'Git 观察未取得有效返回');
  }
  if (path.resolve(top.stdout.trim()) !== root) throw new CheckError('IDENTITY_INSUFFICIENT', 'projectRoot 不是 Git 工作区根');
  const paths = [...scope.files, ...scope.directories];
  const head = run(['rev-parse', '--verify', 'HEAD']);
  const status = paths.length ? run(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--ignore-submodules=all', '--no-renames', '--', ...paths]) : { status: 0, stdout: '' };
  const index = paths.length ? run(['ls-files', '--stage', '-z', '--', ...paths]) : { status: 0, stdout: '' };
  if (status.status !== 0 || index.status !== 0 || (head.status !== 0 && !/unknown revision|Needed a single revision|not a valid object/u.test(head.stderr ?? ''))) {
    throw new CheckError('READ_FAILED', 'Git 原始观察失败或过大');
  }
  return { state: 'git', head: head.status === 0 ? head.stdout.trim() : null, status: status.stdout, index: index.stdout };
}

export async function capture({ taskId, projectRoot, scope }) {
  if (!nonempty(taskId) || !nonempty(projectRoot) || !path.isAbsolute(projectRoot)) throw new CheckError('IDENTITY_INSUFFICIENT', '缺少任务／绝对项目根');
  validateScope(scope);
  const root = await fs.realpath(projectRoot);
  if (!(await fs.stat(root)).isDirectory()) throw new CheckError('IDENTITY_INSUFFICIENT', '项目根不是目录');
  const canonicalScope = {
    files: [...new Set(scope.files.map(p => normalize(root, p)))].sort(),
    directories: [...new Set(scope.directories.map(p => normalize(root, p)))].sort(),
  };
  // Metadata and content fingerprints are limited to the explicit task objects, never an implicit whole tree.
  if (canonicalScope.directories.some(p => p === '' || p === '.')) throw new CheckError('READ_BOUNDARY', '不能以项目根递归采集全仓；须指定相关目录');
  const reader = new Reader(root, canonicalScope); await reader.initialize();
  const objects = {}; const limitations = [];
  if (!canonicalScope.files.length && !canonicalScope.directories.length) limitations.push('观察范围为空，不能证明任务改动集合完整');
  const gitBefore = gitState(root, canonicalScope);
  async function visit(p) {
    p = normalize(root, p);
    if (Object.hasOwn(objects, p)) return;
    const absolute = reader.lexical(p);
    await reader.guard(p);
    let st;
    try { st = await fs.lstat(absolute); }
    catch (e) { if (['ENOENT', 'ENOTDIR'].includes(e.code)) { objects[p] = { type: 'absent' }; return; } throw e; }
    if (st.isSymbolicLink() || (!st.isFile() && !st.isDirectory())) {
      objects[p] = { type: 'unsupported', stat: signature(st) }; limitations.push(`未采集链接或特殊对象：${p}`); return;
    }
    if (st.isDirectory() && canonicalScope.files.includes(p) && !canonicalScope.directories.includes(p)) throw new CheckError('READ_BOUNDARY', 'files 项不能隐含递归目录');
    if (st.isFile()) {
      const version = await reader.fingerprint(p);
      if (!sameStat(st, await fs.lstat(absolute))) throw new CheckError('OBJECT_CHANGED', '采集期间文件变化');
      objects[p] = { type: 'file', version, stat: signature(st) }; return;
    }
    const entries = (await fs.readdir(absolute)).sort();
    objects[p] = { type: 'directory', entries, stat: signature(st) };
    for (const name of entries) {
      if (name === '.git') { limitations.push(`不递归 Git 元数据：${p}/.git`); continue; }
      await visit(path.join(p, name));
    }
    if (!sameStat(st, await fs.lstat(absolute)) || !same(entries, (await fs.readdir(absolute)).sort())) throw new CheckError('OBJECT_CHANGED', '采集期间目录变化');
  }
  for (const p of [...canonicalScope.files, ...canonicalScope.directories]) await visit(p);
  for (const [p, obj] of Object.entries(objects)) {
    if (obj.type === 'absent') {
      try { await fs.lstat(reader.lexical(p)); throw new CheckError('OBJECT_CHANGED', '采集期间缺失对象出现'); }
      catch (e) { if (!['ENOENT', 'ENOTDIR'].includes(e.code)) throw e; }
    } else if (!same(obj.stat, signature(await fs.lstat(reader.lexical(p))))) throw new CheckError('OBJECT_CHANGED', '前后采集期间对象变化');
  }
  const gitAfter = gitState(root, canonicalScope);
  if (!same(gitBefore, gitAfter)) limitations.push('采集期间 Git 状态变化');
  return { format: 'sdd-snapshot/1', collectorVersion, captureId: randomUUID(), taskId,
    projectRoot: root, observedAt: new Date().toISOString(), scope: canonicalScope,
    objects: Object.fromEntries(Object.entries(objects).sort(([a], [b]) => a.localeCompare(b))), git: gitAfter, limitations };
}

// A fixed filesystem action gives an actual operation receipt, instead of treating a model's path list as a log.
export async function perform({ taskId, projectRoot, scope, writeScope, operation }) {
  validateScope(writeScope);
  if (!keys(operation, ['action', 'fromPath', 'toPath', 'content', 'expectedBefore'])) throw new CheckError('INPUT_INVALID', '动作字段不完整');
  const { action, fromPath, toPath, content, expectedBefore } = operation;
  if (!['create', 'modify', 'delete', 'rename'].includes(action)
    || (action === 'create' && !(fromPath === null && nonempty(toPath)))
    || (action === 'modify' && !(nonempty(fromPath) && fromPath === toPath))
    || (action === 'delete' && !(nonempty(fromPath) && toPath === null))
    || (action === 'rename' && !(nonempty(fromPath) && nonempty(toPath) && fromPath !== toPath))
    || (['create', 'modify'].includes(action) ? typeof content !== 'string' : content !== null)
    || !(expectedBefore === null || /^sha256:[a-f0-9]{64}$/u.test(expectedBefore))) throw new CheckError('INPUT_INVALID', '动作／路径／内容／预期基准不符');
  const before = await capture({ taskId, projectRoot, scope });
  const reader = new Reader(before.projectRoot, writeScope); await reader.initialize();
  const from = fromPath === null ? null : normalize(before.projectRoot, fromPath);
  const to = toPath === null ? null : normalize(before.projectRoot, toPath);
  for (const p of [from, to].filter(p => p !== null)) {
    await reader.guard(p);
    if (!(Object.hasOwn(before.objects, p) || before.scope.directories.some(d => inside(path.resolve(before.projectRoot, d), path.resolve(before.projectRoot, p))))) {
      throw new CheckError('CONDITION_INSUFFICIENT', '动作端点未被观察范围覆盖');
    }
  }
  const old = from === null ? null : before.objects[from];
  if (action === 'create' ? expectedBefore !== null : old?.type !== 'file' || expectedBefore !== old.version) throw new CheckError('OBJECT_CHANGED', '实际动作前基准与请求不符');
  if (['create', 'rename'].includes(action) && before.objects[to]?.type !== 'absent' && Object.hasOwn(before.objects, to)) throw new CheckError('OBJECT_CHANGED', '新端点已存在，不覆盖既有资产');
  const absoluteFrom = from === null ? null : reader.lexical(from);
  const absoluteTo = to === null ? null : reader.lexical(to);
  let execution = '已执行'; const limitations = []; let failure = null;
  try {
    if (absoluteFrom && !same(old.stat, signature(await fs.lstat(absoluteFrom)))) throw new CheckError('OBJECT_CHANGED', '动作前对象被并发改变');
    if (action === 'create' || action === 'modify') {
      const flags = constants.O_WRONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK
        | (action === 'create' ? constants.O_CREAT | constants.O_EXCL : 0);
      const handle = await fs.open(absoluteTo, flags, 0o600);
      try {
        if (action === 'modify' && !same(old.stat, signature(await handle.stat()))) throw new CheckError('OBJECT_CHANGED', '打开期间对象变化');
        await handle.truncate(0); await handle.writeFile(content, 'utf8');
      } finally { await handle.close(); }
    } else if (action === 'delete') await fs.unlink(absoluteFrom);
    else {
      // link+unlink refuses an existing destination. A partial action is kept as evidence, never blindly retried.
      await fs.link(absoluteFrom, absoluteTo); await fs.unlink(absoluteFrom);
    }
  } catch (error) {
    execution = '执行失败'; failure = diagnostic(error);
    limitations.push(`${failure.errorCode}：${failure.reason}；文件动作可能部分发生，须核后状态，不自动重跑`);
  }
  const after = await capture({ taskId, projectRoot: before.projectRoot, scope: before.scope });
  return { format: 'sdd-local-action/1', collectorVersion, taskId, projectRoot: before.projectRoot,
    operation: { action, fromPath: from, toPath: to, contentVersion: content === null ? null : digest(Buffer.from(content)) },
    before, after, execution, limitations,
    errorCode: failure?.errorCode ?? null, category: failure?.category ?? null, reason: failure?.reason ?? null };
}

// One classifier owns the exit semantics of each supported observation format.
// File-action failure takes priority; observation limits never undo an action.
export function collectionExitCode(output) {
  if (output.execution === '执行失败') return 3;
  if (output.format === 'sdd-snapshot/1') return output.limitations.length ? 2 : 0;
  if (output.format === 'sdd-local-action/1') {
    return [output.limitations, output.before.limitations, output.after.limitations].some(items => items.length) ? 2 : 0;
  }
  if (output.factsVersion === 'sdd-facts/1') return output.coverage.state === 'complete' ? 0 : 2;
  throw new CheckError('INPUT_INVALID', '采集结果类型不受支持');
}

async function main() {
  if (process.argv.length === 3 && process.argv[2] === '--help') {
    process.stdout.write(`${collectorVersion}\nstdin：capture／action／finish JSON。capture 只观察获准对象；action 执行明确文件动作；finish 只读原始依据生成 sdd-facts/1。无任意命令执行。详见 references/collection.md。\n`); return;
  }
  try {
    const chunks = []; for await (const chunk of process.stdin) chunks.push(chunk);
    let input;
    try { input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))); }
    catch { throw new CheckError('INPUT_INVALID', 'stdin 不是合法 UTF-8 JSON 对象'); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new CheckError('INPUT_INVALID', 'stdin 须是一个 JSON 对象');
    let output;
    if (input.mode === 'capture' && keys(input, ['mode', 'taskId', 'projectRoot', 'scope'])) output = await capture(input);
    else if (input.mode === 'action' && keys(input, ['mode', 'taskId', 'projectRoot', 'scope', 'writeScope', 'operation'])) output = await perform(input);
    else if (input.mode === 'finish' && keys(input, ['mode', 'taskId', 'projectRoot', 'readScope', 'baselineRef', 'operationRefs', 'afterRef', 'verificationRefs'])) {
      const { buildFacts } = await import('./facts-evidence.mjs'); output = await buildFacts(input);
    } else throw new CheckError('INPUT_INVALID', '未知采集模式或字段');
    process.exitCode = collectionExitCode(output);
    process.stdout.write(`${JSON.stringify(output)}\n`);
    if (process.exitCode === 3) {
      process.stderr.write(`采集文件动作失败；${output.errorCode}（${output.category}）：${output.reason}；核后状态，不自动重跑。\n`);
    } else if (process.exitCode === 2) {
      process.stderr.write('采集观察受限；CONDITION_INSUFFICIENT（条件不足）；具体范围见 stdout，不能签完整或阶段通过。\n');
    }
  } catch (error) {
    const failure = diagnostic(error);
    process.stdout.write(`${JSON.stringify({ collectorVersion, execution: '执行失败', ...failure })}\n`);
    process.stderr.write(`采集未完成；${failure.errorCode}（${failure.category}）：${failure.reason}；核原始返回及已发生动作，不自动重跑。\n`); process.exitCode = 3;
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
