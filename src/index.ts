import { Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { IOption } from './interface';
import { getConsole } from './helpers/console';
import collectOptionConsole from './collectOptionConsole';

// 插件名
export const pluginName = 'BuildConsolePlugin';
// 默认配置
const defaultOption: Partial<IOption> = {
  NODE_ENV: true,
  git: {
    branch: true,
    hash: 7,
  },
}

export class BuildConsolePlugin {
  option: IOption;

  constructor(option?: IOption) {
    this.option = Object.assign<IOption, Partial<IOption> | undefined>(defaultOption, option);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(pluginName, compilation => {
      const consoleArr: ReturnType<typeof getConsole>[] = collectOptionConsole(this.option);

      const consoleCode = `
      ;${consoleArr
          .map(item => `console.log.apply(this, [${item.map(f => `'${f}'`)}])`)
          .join(';')};
       `;

      // 判断 插件 主版本号
      const htmlWebpackPluginMajarVer = HtmlWebpackPlugin.version;
      console.info(`[build-console-webpack-plugin] 检测到 html-webpack-plugin 主版本号: ${htmlWebpackPluginMajarVer}`);

      if (htmlWebpackPluginMajarVer === 5) {
        //  @ts-ignore
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(pluginName, (opt, cb) => {
          console.log('[build-console-webpack-plugin] alterAssetTagGroups');

          opt.headTags.unshift(HtmlWebpackPlugin.createHtmlTagObject(
            'script',
            {
              type: 'text/javascript',
            },
            consoleCode
          ));

          cb();
        });
      }
    });
  }
}
export { default as Git } from './helpers/git';
