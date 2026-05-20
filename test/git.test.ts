import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExecSync = vi.hoisted(() => vi.fn());
vi.mock('child_process', () => ({ execSync: mockExecSync }));

import Git from '../src/helpers/git';

describe('Git', () => {
  beforeEach(() => {
    mockExecSync.mockReset();
  });

  it('runs branch command', () => {
    mockExecSync.mockReturnValue('main\n');
    const git = new Git();
    expect(git.branch()).toBe('main');
    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('rev-parse --abbrev-ref HEAD'),
      expect.anything()
    );
  });

  it('runs commithash command', () => {
    mockExecSync.mockReturnValue('abc1234\n');
    const git = new Git();
    expect(git.commithash()).toBe('abc1234');
  });

  it('runs version command', () => {
    mockExecSync.mockReturnValue('v1.0.0\n');
    const git = new Git();
    expect(git.version()).toBe('v1.0.0');
  });

  it('runs lastcommitdatetime command', () => {
    mockExecSync.mockReturnValue('2024-01-01\n');
    const git = new Git();
    expect(git.lastcommitdatetime()).toBe('2024-01-01');
  });

  it('uses custom gitWorkTree', () => {
    mockExecSync.mockReturnValue('develop\n');
    const git = new Git({ gitWorkTree: '/custom/path' });
    git.branch();
    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('--git-dir=/custom/path/.git'),
      expect.anything()
    );
  });

  it('returns "-" on error', () => {
    mockExecSync.mockImplementation(() => { throw new Error('fail'); });
    const git = new Git();
    expect(git.branch()).toBe('-');
  });

  it('supports lightweightTags', () => {
    mockExecSync.mockReturnValue('v2.0\n');
    const git = new Git({ lightweightTags: true });
    expect(git.version()).toBe('v2.0');
    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('--tags'),
      expect.anything()
    );
  });

  it('throws if both versionCommand and lightweightTags', () => {
    expect(() => new Git({ versionCommand: 'custom', lightweightTags: true })).toThrow();
  });

  it('accepts custom commands', () => {
    mockExecSync.mockReturnValue('result\n');
    const git = new Git({ commithashCommand: 'custom-cmd' });
    expect(git.commithash()).toBe('result');
    expect(mockExecSync).toHaveBeenCalledWith(
      expect.stringContaining('custom-cmd'),
      expect.anything()
    );
  });
});
