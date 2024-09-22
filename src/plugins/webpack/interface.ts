import type { IOption } from '@/interface';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export interface IWebpackOption extends IOption {
  htmlPlugin?: typeof HtmlWebpackPlugin;
}
