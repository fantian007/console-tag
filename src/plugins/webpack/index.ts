import { merge } from 'lodash-es';
// @ts-ignore safe-requre 无类型文件
import safeRequire from 'safe-require';
import { Compiler, Compilation } from 'webpack';
import HtmlWebpackPlugin, { } from 'html-webpack-plugin';
import { PLUGIN_NAME, DEFAULT_OPTION } from '@/constant';
import { log } from '@/helpers/logger';
import { IWebpackOption } from './interface';
import { getHtmlScript } from '@/utils';

/**
 * webpack 插件
 */
export class PrettyConsoleWebpackPlugin {
  option: IWebpackOption & Required<Pick<IWebpackOption, 'htmlPlugin'>>;

  constructor(opts?: Partial<IWebpackOption>) {
    this.option = merge<IWebpackOption, { htmlPlugin: HtmlWebpackPlugin }, Partial<IWebpackOption> | undefined>(DEFAULT_OPTION, {
      htmlPlugin: safeRequire('html-webpack-plugin')
    }, opts);
  }

  getCompilationHook<R>(compilation: Compilation, name: string) {
    return (compilation.hooks as Record<string, any>)[name] as R;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      // 判断 插件 主版本号
      const htmlWebpackPluginMajarVer = this.option.htmlPlugin.version;
      // 打印版本号
      log(`检测到 html-webpack-plugin 主版本号: ${htmlWebpackPluginMajarVer}`);

      /**
       * 兼容旧版本
       */
      const hooksV1 = this.getCompilationHook(compilation, 'htmlWebpackPluginBeforeHtmlProcessing');
      const hooksV2 = this.getCompilationHook(compilation, 'html-webpack-plugin-before-html-processing');

      const alterAssetTagGroupsHook = (hooksV1 ?? hooksV2 ?? HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups) as HtmlWebpackPlugin.Hooks['alterAssetTagGroups'];

      if (alterAssetTagGroupsHook) {
        alterAssetTagGroupsHook.tap(PLUGIN_NAME, (args) => {
          const scriptContent = HtmlWebpackPlugin.createHtmlTagObject(
            'script',
            undefined,
            getHtmlScript(this.option),
          );

          args.headTags.unshift(scriptContent);

          return args;
        });
      }
    });
  }
}
