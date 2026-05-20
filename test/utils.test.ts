import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockBranch = vi.hoisted(() => vi.fn());
const mockHash = vi.hoisted(() => vi.fn());
const mockVersion = vi.hoisted(() => vi.fn());
const mockLastCommit = vi.hoisted(() => vi.fn());

vi.mock('../src/helpers/git', () => ({
  default: function () {
    this.branch = mockBranch;
    this.commithash = mockHash;
    this.version = mockVersion;
    this.lastcommitdatetime = mockLastCommit;
  },
}));

import { combineConsole, getHtmlScript, defaultToEmpty } from '../src/utils';

describe('defaultToEmpty', () => {
  it('returns value if present', () => expect(defaultToEmpty('hello')).toBe('hello'));
  it('returns dash for null', () => expect(defaultToEmpty(null)).toBe('-'));
  it('returns dash for undefined', () => expect(defaultToEmpty(undefined)).toBe('-'));
  it('returns empty string as-is', () => expect(defaultToEmpty('')).toBe(''));
});

describe('combineConsole', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    mockBranch.mockReset();
    mockHash.mockReset();
    mockVersion.mockReset();
    mockLastCommit.mockReset();
  });

  it('includes NODE_ENV when option set', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const items = combineConsole({ NODE_ENV: true });
    expect(items).toHaveLength(1);
    expect(items[0][0]).toContain('production');
  });

  it('shows dash when NODE_ENV is unset', () => {
    vi.stubEnv('NODE_ENV', undefined);
    const items = combineConsole({ NODE_ENV: true });
    expect(items[0][0]).toContain('-');
  });

  it('skips NODE_ENV when disabled', () => {
    const items = combineConsole({ NODE_ENV: false });
    expect(items.filter((i) => i[0].includes('NODE_ENV'))).toHaveLength(0);
  });

  it('includes git branch', () => {
    mockBranch.mockReturnValue('main');
    const items = combineConsole({ git: { branch: true } });
    const item = items.find((i) => i[0].includes('git 分支'));
    expect(item).toBeDefined();
    expect(item![0]).toContain('main');
  });

  it('includes git hash', () => {
    mockHash.mockReturnValue('abcdef123456');
    const items = combineConsole({ git: { hash: 7 } });
    const item = items.find((i) => i[0].includes('git hash'));
    expect(item).toBeDefined();
    expect(item![0]).toContain('abcdef1');
  });

  it('includes git version', () => {
    mockVersion.mockReturnValue('v1.2.3');
    const items = combineConsole({ git: { version: true } });
    const item = items.find((i) => i[0].includes('git 版本'));
    expect(item).toBeDefined();
    expect(item![0]).toContain('v1.2.3');
  });

  it('includes last commit time', () => {
    mockLastCommit.mockReturnValue('2024-06-01');
    const items = combineConsole({ git: { lastCommitDateTime: true } });
    const item = items.find((i) => i[0].includes('git 最近提交时间'));
    expect(item).toBeDefined();
    expect(item![0]).toContain('2024-06-01');
  });

  it('includes custom entries', () => {
    const items = combineConsole({
      NODE_ENV: false,
      custom: () => ({ APP: 'myapp', VER: '1.0' }),
    });
    expect(items).toHaveLength(2);
  });

  it('shows dash for null git values', () => {
    mockBranch.mockReturnValue(null);
    const items = combineConsole({ git: { branch: true } });
    expect(items[0][0]).toContain('-');
  });

  it('combines all sources', () => {
    vi.stubEnv('NODE_ENV', 'test');
    mockBranch.mockReturnValue('dev');
    mockHash.mockReturnValue('1234567');
    mockVersion.mockReturnValue('v9.9.9');
    mockLastCommit.mockReturnValue('2024-12-25');

    const items = combineConsole({
      NODE_ENV: true,
      git: { branch: true, hash: 7, version: true, lastCommitDateTime: true },
      custom: () => ({ ext: 'bonus' }),
    });

    expect(items).toHaveLength(6);
  });
});

describe('getHtmlScript', () => {
  it('generates script with console.log calls', () => {
    vi.stubEnv('NODE_ENV', 'prod');
    const script = getHtmlScript({ NODE_ENV: true });
    expect(script).toContain('console.log(');
    expect(script).toContain('prod');
  });

  it('escapes single quotes in values', () => {
    vi.stubEnv('NODE_ENV', "it's-dangerous");
    const script = getHtmlScript({ NODE_ENV: true });
    expect(script).toContain("\\'");
  });

  it('escapes backslashes', () => {
    vi.stubEnv('NODE_ENV', 'path\\dir');
    const script = getHtmlScript({ NODE_ENV: true });
    expect(script).toContain('\\\\');
  });
});
