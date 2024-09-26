import { Compiler, RspackPluginInstance } from '@rspack/core';
import { PLUGIN_NAME, DEFAULT_OPTION } from '../../constant';
import { getHtmlScript } from '../../utils';
import type { IRspackOption } from './interface';

/**
 * rspack 插件
 */
export class ConsoleTagRspackPlugin implements RspackPluginInstance {
  option: IRspackOption;

  constructor(opts: IRspackOption) {
    this.option = Object.assign<Omit<IRspackOption, 'HtmlPlugin'>, Partial<IRspackOption> & Pick<IRspackOption, 'HtmlPlugin'>>(DEFAULT_OPTION, opts);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      const getHooksFn = this.option.HtmlPlugin.getCompilationHooks ?? this.option.HtmlPlugin.getHooks;
      const alterAssetTagGroupsHook = getHooksFn(compilation).alterAssetTagGroups;

      alterAssetTagGroupsHook.tap(PLUGIN_NAME, (args: any) => {
        args.headTags.push(
          this.option.HtmlPlugin.createHtmlTagObject('script', undefined, getHtmlScript(this.option))
        );

        return args;
      })
    });
  }
}
