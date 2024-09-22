import { merge } from 'lodash-es';
import { Compiler, RspackPluginInstance } from '@rspack/core';
import { PLUGIN_NAME, DEFAULT_OPTION } from '@/constant';
import type { IRspackOption } from './interface';
import { getHtmlScript } from '@/utils';

/**
 * rspack 插件
 */
export class PrettyConsoleRspackPlugin implements RspackPluginInstance {
  option: IRspackOption;

  constructor(opts: IRspackOption) {
    this.option = merge<Omit<IRspackOption, 'htmlPlugin'>, Partial<IRspackOption> & Pick<IRspackOption, 'htmlPlugin'>>(DEFAULT_OPTION, opts);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {

      const alterAssetTagGroupsHook = this.option.htmlPlugin.getCompilationHooks(compilation).alterAssetTagGroups;

      alterAssetTagGroupsHook.tap(PLUGIN_NAME, (args) => {
        args.headTags.push(
          this.option.htmlPlugin.createHtmlTagObject('script', undefined, getHtmlScript(this.option))
        );

        return args;
      })
    });
  }
}
