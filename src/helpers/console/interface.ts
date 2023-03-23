/**
 * 配置项
 */
export interface Option {
  /**
   * 键背景色
   * 
   * @default #363636
   */
  keyBgColor?: string;
  /**
   * 值背景色
   * 
   * @default #175e9c
   */
  valBgColor?: string;
}

/**
 * 获取 console 参数 方法
 */
export interface GetConsole {
  /**
   * @param key {string} - 键
   * @param val {string} - 键
   * @param option {Option} - 配置项
   */
  (key: string, val: string, option?: Option): [string, string, string];
}
