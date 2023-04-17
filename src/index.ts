import { Compiler, Compilation } from 'webpack';
// @ts-ignore safe-requre 无类型文件
import safeRequire from 'safe-require';
import { PLUGIN_NAME, DEFAULT_OPTION } from './constant';
import { getConsole } from './helpers/console';
import { log } from './helpers/logger';
import collectConsole from './collect';
import { IOption } from './interface';

const HtmlWebpackPlugin = safeRequire('html-webpack-plugin');

// 判断 插件 主版本号
const htmlWebpackPluginMajarVer = HtmlWebpackPlugin.version;
// 打印版本号
log(`检测到 html-webpack-plugin 主版本号: ${htmlWebpackPluginMajarVer}`);

/**
 * webpack 美化打印 插件
 */
export class PrettyConsoleWebpackPlugin {
  option: IOption;

  constructor(option?: IOption) {
    this.option = Object.assign<IOption, Partial<IOption> | undefined>(DEFAULT_OPTION, option);
  }

  getCompilationHook<R>(compilation: Compilation, name: string) {
    return (compilation.hooks as Record<string, any>)[name] as R;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      /**
       * 兼容旧版本
       */
      const hooksV1 = this.getCompilationHook(compilation, 'htmlWebpackPluginBeforeHtmlProcessing');
      const hooksV2 = this.getCompilationHook(compilation, 'html-webpack-plugin-before-html-processing');
      
      const alterAssetTagGroupsHook = hooksV1 ?? hooksV2 ?? HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups;

      if (alterAssetTagGroupsHook) {
        alterAssetTagGroupsHook.tap(PLUGIN_NAME, (data: any) => {
          const consoleArr: ReturnType<typeof getConsole>[] = collectConsole(this.option);

          const consoleCode = `
          ;${consoleArr
              .map(item => `console.log.apply(this, [${item.map(f => `'${f}'`)}])`)
              .join(';')};
           `;

          const scriptContent = HtmlWebpackPlugin.createHtmlTagObject(
            'script',
            undefined,
            consoleCode,
          );

          data.headTags.unshift(scriptContent);
        });
      }
    });
  }
}

export { default as Git } from './helpers/git';
export { getConsole } from './helpers/console';
