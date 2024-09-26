import { Compiler, Compilation } from 'webpack';
import { PLUGIN_NAME, DEFAULT_OPTION } from '../../constant';
import { getHtmlScript } from '../../utils';
import { IWebpackOption } from './interface';

/**
 * webpack 插件
 */
export class ConsoleTagWebpackPlugin {
  option: IWebpackOption & Required<Pick<IWebpackOption, 'HtmlPlugin'>>;

  constructor(opts: IWebpackOption) {
    this.option = Object.assign<Omit<IWebpackOption, 'HtmlPlugin'>, IWebpackOption>(DEFAULT_OPTION, opts);
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

      const alterAssetTagGroupsHook = (hooksV1 ?? hooksV2 ?? this.option.HtmlPlugin.getHooks(compilation).alterAssetTagGroups);

      if (alterAssetTagGroupsHook) {
        alterAssetTagGroupsHook.tap(PLUGIN_NAME, (args: any) => {
          const scriptContent = this.option.HtmlPlugin.createHtmlTagObject(
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
