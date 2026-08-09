import type { Compiler, RspackPluginInstance } from '@rspack/core';
import { PLUGIN_NAME, DEFAULT_OPTION } from '../../constant';
import { getHtmlScript } from '../../utils';
import type { IRspackOption } from './interface';

export class ConsoleTagRspackPlugin implements RspackPluginInstance {
  option: IRspackOption;

  constructor(opts: IRspackOption) {
    this.option = Object.assign({}, DEFAULT_OPTION, opts);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      const getHooksFn = this.option.HtmlPlugin.getCompilationHooks ?? this.option.HtmlPlugin.getHooks;
      const alterAssetTagGroupsHook = getHooksFn(compilation).alterAssetTagGroups;

      alterAssetTagGroupsHook.tap(PLUGIN_NAME, (args: any) => {
        args.headTags.unshift(
          this.option.HtmlPlugin.createHtmlTagObject('script', undefined, getHtmlScript(this.option))
        );
        return args;
      });
    });
  }
}
