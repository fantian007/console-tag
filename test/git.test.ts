import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExecFileSync = vi.hoisted(() => vi.fn());
vi.mock('child_process', () => ({ execFileSync: mockExecFileSync }));

import Git from '../src/helpers/git';

describe('Git', () => {
  beforeEach(() => {
    mockExecFileSync.mockReset();
  });

  it('runs branch command', () => {
    mockExecFileSync.mockReturnValue('main\n');
    const git = new Git();
    expect(git.branch()).toBe('main');
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['rev-parse', '--abbrev-ref', 'HEAD'],
      expect.anything()
    );
  });

  it('runs commithash command', () => {
    mockExecFileSync.mockReturnValue('abc1234\n');
    const git = new Git();
    expect(git.commithash()).toBe('abc1234');
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['rev-parse', 'HEAD'],
      expect.anything()
    );
  });

  it('runs version command', () => {
    mockExecFileSync.mockReturnValue('v1.0.0\n');
    const git = new Git();
    expect(git.version()).toBe('v1.0.0');
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['describe', '--always'],
      expect.anything()
    );
  });

  it('runs lastcommitdatetime command', () => {
    mockExecFileSync.mockReturnValue('2024-01-01\n');
    const git = new Git();
    expect(git.lastcommitdatetime()).toBe('2024-01-01');
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['log', '-1', '--format=%cI'],
      expect.anything()
    );
  });

  it('uses custom gitWorkTree', () => {
    mockExecFileSync.mockReturnValue('develop\n');
    const git = new Git({ gitWorkTree: '/custom/path' });
    git.branch();
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['--git-dir', '/custom/path/.git', '--work-tree', '/custom/path', 'rev-parse', '--abbrev-ref', 'HEAD'],
      expect.anything()
    );
  });

  it('returns "-" on error', () => {
    mockExecFileSync.mockImplementation(() => { throw new Error('fail'); });
    const git = new Git();
    expect(git.branch()).toBe('-');
  });

  it('supports lightweightTags', () => {
    mockExecFileSync.mockReturnValue('v2.0\n');
    const git = new Git({ lightweightTags: true });
    expect(git.version()).toBe('v2.0');
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['describe', '--always', '--tags'],
      expect.anything()
    );
  });

  it('throws if both versionCommand and lightweightTags', () => {
    expect(() => new Git({ versionCommand: 'custom', lightweightTags: true })).toThrow();
  });

  it('accepts custom commands', () => {
    mockExecFileSync.mockReturnValue('result\n');
    const git = new Git({ commithashCommand: 'custom-cmd arg' });
    expect(git.commithash()).toBe('result');
    expect(mockExecFileSync).toHaveBeenCalledWith(
      'git',
      ['custom-cmd', 'arg'],
      expect.anything()
    );
  });
});
