import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'demiurgejs-architect';
const PACKAGE_SKILL_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../skills/demiurgejs-architect/latest.md');

function parseSimpleFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { attrs: {}, body: content };
  }

  const attrs = {};
  for (const line of match[1].split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) {
      continue;
    }

    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key) {
      attrs[key] = value;
    }
  }

  return { attrs, body: content.slice(match[0].length) };
}

function buildSkillContent(source) {
  const { attrs, body } = parseSimpleFrontmatter(source);
  const name = attrs.name || SKILL_NAME;
  const description = attrs.description || 'DemiurgeJS architecture guidance skill.';
  const version = attrs.version || '1.0.0';

  const headerLines = [
    '---',
    `name: ${name}`,
    `description: ${description}`,
    `version: ${version}`,
    'type: local',
    `source: .agents/skills/${SKILL_NAME}/SKILL.md`,
    '---',
    ''
  ];

  return `${headerLines.join('\n')}${body.trimStart()}`;
}

function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureLockShape(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { version: 1, skills: {} };
  }

  const lock = {
    version: typeof raw.version === 'number' ? raw.version : 1,
    skills: raw.skills && typeof raw.skills === 'object' && !Array.isArray(raw.skills) ? raw.skills : {}
  };

  for (const [key, value] of Object.entries(raw)) {
    if (key !== 'version' && key !== 'skills') {
      lock[key] = value;
    }
  }

  return lock;
}

export function syncSkill({ projectPath = process.cwd() } = {}) {
  const rootPath = path.resolve(projectPath);
  const sourceSkillContent = fs.readFileSync(PACKAGE_SKILL_PATH, 'utf8');
  const normalizedContent = buildSkillContent(sourceSkillContent);

  const skillPath = path.join(rootPath, '.agents', 'skills', SKILL_NAME, 'SKILL.md');
  fs.mkdirSync(path.dirname(skillPath), { recursive: true });
  fs.writeFileSync(skillPath, normalizedContent, 'utf8');

  const lockPath = path.join(rootPath, 'skills-lock.json');
  const existingLock = ensureLockShape(readJsonFile(lockPath));
  existingLock.skills[SKILL_NAME] = {
    source: '@n0m4d-d3v/demiurgejs',
    sourceType: 'npm',
    computedHash: sha256(normalizedContent)
  };

  fs.writeFileSync(lockPath, `${JSON.stringify(existingLock, null, 2)}\n`, 'utf8');

  return {
    rootPath,
    skillPath,
    lockPath,
    skillName: SKILL_NAME
  };
}
