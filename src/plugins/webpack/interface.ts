import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { IOption } from '../../interface';

export interface IWebpackOption extends IOption {
  htmlPlugin?: typeof HtmlWebpackPlugin;
}
