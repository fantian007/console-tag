import { IOption } from './interface';

/** 插件名 */
export const PLUGIN_NAME = 'console-tag-plugin';

/** 默认配置 */
export const DEFAULT_OPTION: IOption = {
  NODE_ENV: true,
  git: {
    branch: true,
    hash: 7,
    version: false,
    lastCommitDateTime: false,
  },
};
