import * as fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
export const maxEvidenceBytes = 4 * 1024 * 1024;
export const fileRef = (object, bytes, locator = '正文') => ({ object, locator, version: digest(bytes), sourceKind: 'tool' });
const inside = (base, target) => {
  const relative = path.relative(base, target);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
};

export class CheckError extends Error {
  constructor(code, reason, execution = '已执行', judgement = '证据不足') {
    super(reason); this.code = code; this.execution = execution; this.judgement = judgement;
  }
}
const missing = e => ['ENOENT', 'ENOTDIR'].includes(e.code);
const permission = e => ['EACCES', 'EPERM'].includes(e.code);
const stable = (a, b) => ['dev', 'ino', 'size', 'mtimeMs', 'ctimeMs'].every(k => a[k] === b[k]);

// Object probes discard contents. Raw evidence is parsed internally, never copied into a check receipt.
export class Reader {
  constructor(root, scope) { this.root = root; this.scope = scope; }
  lexical(value) {
    if (value.includes('\0')) throw new CheckError('READ_BOUNDARY', '路径含非法字符');
    const absolute = path.resolve(this.root, value);
    if (!inside(this.root, absolute)) throw new CheckError('READ_BOUNDARY', '路径越过项目根');
    return absolute;
  }
  async canonical(value) {
    const absolute = this.lexical(value);
    let probe = absolute; const tail = [];
    for (;;) {
      try {
        const real = await fs.realpath(probe);
        const resolved = path.join(real, ...tail);
        if (!inside(this.root, resolved)) throw new CheckError('READ_BOUNDARY', '真实路径越过项目根');
        return resolved;
      } catch (e) {
        if (e instanceof CheckError) throw e;
        if (!missing(e)) throw new CheckError('READ_FAILED', '无法核实真实路径边界', permission(e) ? '已执行' : '执行失败');
        // A dangling link is not evidence that the intended object is absent.
        try {
          const st = await fs.lstat(probe);
          if (st.isSymbolicLink()) throw new CheckError('READ_BOUNDARY', '链接目标无法确定');
        } catch (lstatError) {
          if (!missing(lstatError)) throw lstatError;
        }
        if (probe === this.root) throw new CheckError('READ_FAILED', '项目根不可定位');
        tail.unshift(path.basename(probe)); probe = path.dirname(probe);
      }
    }
  }
  async initialize() {
    this.files = [];
    this.directories = [];
    for (const f of this.scope.files) this.files.push([this.lexical(f), await this.canonical(f)]);
    for (const d of this.scope.directories) {
      const real = await this.canonical(d);
      try { if (!(await fs.stat(real)).isDirectory()) throw new CheckError('READ_BOUNDARY', '读取目录边界不是目录'); }
      catch (e) { if (!missing(e)) throw e; }
      this.directories.push([this.lexical(d), real]);
    }
  }
  async guard(value) {
    const absolute = this.lexical(value);
    const matches = (i, target) => this.files.some(x => x[i] === target)
      || this.directories.some(x => inside(x[i], target));
    if (!matches(0, absolute)) throw new CheckError('READ_BOUNDARY', '对象不在显式读取范围内');
    const real = await this.canonical(value);
    if (!matches(1, real)) throw new CheckError('READ_BOUNDARY', '链接越过允许读取边界');
    return real;
  }
  async content(value) { return this.read(value, false); }
  async fingerprint(value) { return this.read(value, true); }
  async read(value, fingerprint) {
    const real = await this.guard(value);
    const before = await fs.stat(real);
    if (!before.isFile()) throw new CheckError('CONDITION_INSUFFICIENT', '原始依据不是普通文件');
    if (!fingerprint && before.size > maxEvidenceBytes) throw new CheckError('CONDITION_INSUFFICIENT', '原始 JSON 依据超过 4 MiB 解析容量；未加载完整内容');
    const handle = await fs.open(real, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    try {
      if (!stable(before, await handle.stat())) throw new CheckError('OBJECT_CHANGED', '打开原始依据期间对象变化');
      const chunk = Buffer.alloc(64 * 1024); const chunks = [];
      const hash = fingerprint ? createHash('sha256') : null; let total = 0;
      for (;;) {
        const { bytesRead } = await handle.read(chunk, 0, chunk.length, null);
        if (!bytesRead) break;
        total += bytesRead;
        if (hash) hash.update(chunk.subarray(0, bytesRead));
        else {
          if (total > maxEvidenceBytes) throw new CheckError('CONDITION_INSUFFICIENT', '原始 JSON 依据读取期间超过 4 MiB 解析容量');
          chunks.push(Buffer.from(chunk.subarray(0, bytesRead)));
        }
      }
      if (!stable(before, await handle.stat()) || !stable(before, await fs.stat(real)) || await this.guard(value) !== real) {
        throw new CheckError('OBJECT_CHANGED', '读取原始依据期间对象变化');
      }
      return hash ? `sha256:${hash.digest('hex')}` : Buffer.concat(chunks, total);
    } finally { await handle.close(); }
  }
  async observe(value, readable = false) {
    const real = await this.guard(value);
    try {
      if (!readable) { await fs.stat(real); return; }
      const before = await fs.stat(real);
      if (before.isDirectory()) {
        await fs.readdir(real);
        if (!stable(before, await fs.stat(real))) throw new CheckError('OBJECT_CHANGED', '读取期间目录发生变化');
        if (await this.guard(value) !== real) throw new CheckError('OBJECT_CHANGED', '读取期间对象定位变化');
        return;
      }
      if (!before.isFile()) throw new CheckError('READ_FAILED', '不是可支持的普通文件或目录');
      const handle = await fs.open(real, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
      try {
        if (!stable(before, await handle.stat()) || await this.guard(value) !== real) throw new CheckError('OBJECT_CHANGED', '打开期间对象发生变化');
        const chunk = Buffer.alloc(16 * 1024);
        while ((await handle.read(chunk, 0, chunk.length, null)).bytesRead > 0) { /* discard contents */ }
        if (!stable(before, await handle.stat()) || !stable(before, await fs.stat(real))
          || await this.guard(value) !== real) throw new CheckError('OBJECT_CHANGED', '读取期间对象发生变化');
      } finally { await handle.close(); }
    } catch (e) {
      if (e instanceof CheckError) throw e;
      if (missing(e)) throw new CheckError(null, '指定必需对象不存在', '已执行', '存在缺口');
      if (permission(e)) throw new CheckError('READ_FAILED', '指定必需对象不可读', '已执行', '存在缺口');
      if (e.code === 'ELOOP') throw new CheckError('OBJECT_CHANGED', '打开期间链接或对象发生变化');
      throw new CheckError('READ_FAILED', '对象读取处理失败', '执行失败');
    }
  }
}
