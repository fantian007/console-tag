import { HtmlRspackPlugin } from '@rspack/core';
import { IOption } from '../../interface';

export interface IRspackOption extends IOption {
  /**
   * html 插件实例
   */
  htmlPlugin: typeof HtmlRspackPlugin;
}
