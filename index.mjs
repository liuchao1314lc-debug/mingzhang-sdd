import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const name = 'mingzhang-sdd-skill-provider';
export const inject = ['skills'];

const providerName = 'mingzhang-sdd-bundle';
const entry = new URL('./SKILL.md', import.meta.url);
const resourceBase = { kind: 'directory', path: fileURLToPath(new URL('./', import.meta.url)) };

// This adapter reads the two plain scalar fields in the fixed v0.4 entry.
// It is not a general-purpose YAML parser or a loader for arbitrary skills.
async function readPackagedSkill() {
  const text = await readFile(entry, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  const skillName = match && /^name: ([a-z0-9-]+)\r?$/m.exec(match[1])?.[1];
  const description = match && /^description: ([^\r\n]+)\r?$/m.exec(match[1])?.[1];
  if (skillName !== 'mingzhang-sdd' || !description?.trim()) {
    throw new Error('The packaged frozen mingzhang-sdd entry is missing or invalid.');
  }
  return {
    name: skillName,
    description,
    path: fileURLToPath(entry),
    invocation: { modelInvocable: true, userInvocable: true },
    provider: providerName,
    source: 'bundled',
    resourceBase,
    content: match[2],
  };
}

export function apply(ctx) {
  ctx.skills.registerProvider(() => ({
    name: providerName,
    async list() {
      const { content, ...summary } = await readPackagedSkill();
      // The standard DSH packaged-skill rank: local overrides retain priority.
      return [{ ...summary, rank: 600, locator: entry.href }];
    },
    async get() {
      return readPackagedSkill();
    },
  }));
}
