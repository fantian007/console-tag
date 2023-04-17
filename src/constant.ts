import { IOption } from "./interface";

/** 插件名 */
export const PLUGIN_NAME = 'pretty-console-webpack-plugin';

/** 默认配置 */
export const DEFAULT_OPTION: Partial<IOption> = {
  NODE_ENV: true,
}