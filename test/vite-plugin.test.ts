import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockBranch = vi.hoisted(() => vi.fn().mockReturnValue(''));
const mockHash = vi.hoisted(() => vi.fn().mockReturnValue(''));
const mockVersion = vi.hoisted(() => vi.fn().mockReturnValue(''));
const mockLastCommit = vi.hoisted(() => vi.fn().mockReturnValue(''));

vi.mock('../src/helpers/git', () => ({
  default: function () {
    this.branch = mockBranch;
    this.commithash = mockHash;
    this.version = mockVersion;
    this.lastcommitdatetime = mockLastCommit;
  },
}));

import { ConsoleTagVitePlugin } from '../src/plugins/vite';

describe('ConsoleTagVitePlugin', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    mockBranch.mockReset().mockReturnValue('');
    mockHash.mockReset().mockReturnValue('');
    mockVersion.mockReset().mockReturnValue('');
    mockLastCommit.mockReset().mockReturnValue('');
  });

  it('returns a plugin object with correct name', () => {
    const plugin = ConsoleTagVitePlugin();
    expect(plugin.name).toBe('console-tag-plugin');
  });

  it('has enforce set to post', () => {
    const plugin = ConsoleTagVitePlugin();
    expect(plugin.enforce).toBe('post');
  });

  it('uses default options when none provided', () => {
    vi.stubEnv('NODE_ENV', 'staging');
    const plugin = ConsoleTagVitePlugin();
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags).toHaveLength(1);
    expect(tags[0].tag).toBe('script');
    expect(tags[0].children).toContain('NODE_ENV');
    expect(tags[0].children).toContain('staging');
    expect(tags[0].injectTo).toBe('head-prepend');
  });

  it('overrides NODE_ENV option', () => {
    const plugin = ConsoleTagVitePlugin({ NODE_ENV: false });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).not.toContain('NODE_ENV');
  });

  it('includes git branch in script', () => {
    mockBranch.mockReturnValue('main');
    const plugin = ConsoleTagVitePlugin({
      NODE_ENV: false,
      git: { branch: true },
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).toContain('git 分支');
    expect(tags[0].children).toContain('main');
  });

  it('includes git hash in script', () => {
    mockHash.mockReturnValue('abcdef123456');
    const plugin = ConsoleTagVitePlugin({
      NODE_ENV: false,
      git: { hash: 7 },
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).toContain('git hash');
    expect(tags[0].children).toContain('abcdef1');
  });

  it('includes git version in script', () => {
    mockVersion.mockReturnValue('v3.0.0');
    const plugin = ConsoleTagVitePlugin({
      NODE_ENV: false,
      git: { version: true },
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).toContain('git 版本');
    expect(tags[0].children).toContain('v3.0.0');
  });

  it('includes last commit time in script', () => {
    mockLastCommit.mockReturnValue('2025-06-01T12:00:00+08:00');
    const plugin = ConsoleTagVitePlugin({
      NODE_ENV: false,
      git: { lastCommitDateTime: true },
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).toContain('git 最近提交时间');
    expect(tags[0].children).toContain('2025-06-01');
  });

  it('includes custom entries in script', () => {
    const plugin = ConsoleTagVitePlugin({
      NODE_ENV: false,
      custom: () => ({ APP: 'myapp', VER: '2.0' }),
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).toContain('APP');
    expect(tags[0].children).toContain('myapp');
    expect(tags[0].children).toContain('VER');
    expect(tags[0].children).toContain('2.0');
  });

  it('combines multiple config sources', () => {
    vi.stubEnv('NODE_ENV', 'production');
    mockBranch.mockReturnValue('develop');
    mockHash.mockReturnValue('1234567');
    mockVersion.mockReturnValue('v1.0.0');
    mockLastCommit.mockReturnValue('2024-12-25');

    const plugin = ConsoleTagVitePlugin({
      git: { branch: true, hash: 7, version: true, lastCommitDateTime: true },
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].children).toContain('NODE_ENV');
    expect(tags[0].children).toContain('git 分支');
    expect(tags[0].children).toContain('git hash');
    expect(tags[0].children).toContain('git 版本');
    expect(tags[0].children).toContain('git 最近提交时间');
  });

  it('deep merges git options: partial override keeps defaults', () => {
    mockHash.mockReturnValue('abc1234567');
    const plugin = ConsoleTagVitePlugin({
      NODE_ENV: false,
      git: { branch: false },
    });
    const tags = plugin.transformIndexHtml!('') as any[];
    // hash:7 should be retained from defaults
    expect(tags[0].children).toContain('git hash');
    expect(tags[0].children).toContain('abc1234');
    // branch should not be present
    expect(tags[0].children).not.toContain('git 分支');
    // version/lastCommitDateTime (default false) should not be present
    expect(tags[0].children).not.toContain('git 版本');
    expect(tags[0].children).not.toContain('git 最近提交时间');
  });

  it('renders valid inline script structure', () => {
    vi.stubEnv('NODE_ENV', 'dev');
    const plugin = ConsoleTagVitePlugin();
    const tags = plugin.transformIndexHtml!('') as any[];
    expect(tags[0].tag).toBe('script');
    expect(tags[0].injectTo).toBe('head-prepend');
    expect(typeof tags[0].children).toBe('string');
    expect(tags[0].children).toMatch(/^;console\.log\(/);
  });

  it('does not require any external html plugin', () => {
    const plugin = ConsoleTagVitePlugin({ NODE_ENV: false });
    expect(plugin.transformIndexHtml).toBeDefined();
    // should not throw
    expect(() => plugin.transformIndexHtml!('')).not.toThrow();
  });
});
