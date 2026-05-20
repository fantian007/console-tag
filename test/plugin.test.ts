import { describe, it, expect, vi } from 'vitest';
import { ConsoleTagWebpackPlugin } from '../src/plugins/webpack';
import { ConsoleTagRspackPlugin } from '../src/plugins/rspack';

describe('ConsoleTagWebpackPlugin', () => {
  it('merges default options', () => {
    const plugin = new ConsoleTagWebpackPlugin({ HtmlPlugin: {} as any });
    expect(plugin.option.NODE_ENV).toBe(true);
    expect(plugin.option.git).toBeDefined();
  });

  it('overrides defaults with user options', () => {
    const plugin = new ConsoleTagWebpackPlugin({
      HtmlPlugin: {} as any,
      NODE_ENV: false,
      git: { branch: false },
    });
    expect(plugin.option.NODE_ENV).toBe(false);
    expect(plugin.option.git!.branch).toBe(false);
  });

  it('registers compilation hook on apply', () => {
    const mockTap = vi.fn();
    const mockGetHooks = vi.fn().mockReturnValue({
      alterAssetTagGroups: { tap: mockTap },
    });

    const plugin = new ConsoleTagWebpackPlugin({
      HtmlPlugin: { getHooks: mockGetHooks } as any,
    });

    const compiler = {
      hooks: {
        compilation: { tap: vi.fn((_, fn) => fn({ hooks: {} })) },
      },
    } as any;

    plugin.apply(compiler);
    expect(mockTap).toHaveBeenCalled();
  });
});

describe('ConsoleTagRspackPlugin', () => {
  it('creates plugin instance with options', () => {
    const plugin = new ConsoleTagRspackPlugin({
      HtmlPlugin: { getHooks: vi.fn() } as any,
    });
    expect(plugin.option.NODE_ENV).toBe(true);
  });

  it('registers rspack compilation hook', () => {
    const mockTap = vi.fn();
    const mockGetHooks = vi.fn().mockReturnValue({
      alterAssetTagGroups: { tap: mockTap },
    });

    const plugin = new ConsoleTagRspackPlugin({
      HtmlPlugin: { getHooks: mockGetHooks } as any,
    });

    const compiler = {
      hooks: {
        compilation: { tap: vi.fn((_, fn) => fn({})) },
      },
    } as any;

    plugin.apply(compiler);
    expect(mockTap).toHaveBeenCalled();
  });
});
