import { Compiler, Compilation } from 'webpack';
import { PLUGIN_NAME, DEFAULT_OPTION } from '../../constant';
import { getHtmlScript } from '../../utils';
import { IWebpackOption } from './interface';

/**
 * webpack 插件
 * 兼容 html-webpack-plugin v4/v5
 */
export class ConsoleTagWebpackPlugin {
  option: IWebpackOption;

  constructor(opts: IWebpackOption) {
    this.option = Object.assign({}, DEFAULT_OPTION, opts);
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      const hooks =
        (compilation.hooks as Record<string, any>)['html-webpack-plugin-before-html-processing']
        || (compilation.hooks as Record<string, any>)['htmlWebpackPluginBeforeHtmlProcessing'];

      const hook = hooks ?? this.option.HtmlPlugin.getHooks(compilation).alterAssetTagGroups;

      hook?.tap(PLUGIN_NAME, (args: any) => {
        args.headTags.unshift(
          this.option.HtmlPlugin.createHtmlTagObject('script', undefined, getHtmlScript(this.option))
        );
        return args;
      });
    });
  }
}
