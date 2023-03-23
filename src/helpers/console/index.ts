import type { GetConsole } from './interface';
import { defaultOption } from './constant';

/**
 * 获取 console 信息
 */
export const getConsole: GetConsole = (key, val, option = defaultOption) => {
  const { keyBgColor, valBgColor } = option;

  return [
    `%c ${key} %c${val}`,
    `padding: 2px 4px;font-size: 12px;background:${keyBgColor};color:white;border-radius: 4px 0 0 4px;`,
    `padding: 2px 4px;font-size: 12px;background:${valBgColor};color:white;border-radius: 0 4px 4px 0;`,
  ];
};
