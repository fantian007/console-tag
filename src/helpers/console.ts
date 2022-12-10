/**
 * 获取 console 信息
 */
export const getConsole = (
  /** 键 */
  key: string,
  /** 值 */
  val: string,
  /** 键背景色 */
  keyBgColor = '#363636',
  /** 值背景色 */
  valBgColor = '#175e9c'
): [string, string, string] => {
  return [
    `%c ${key} %c${val}`,
    `padding: 2px 4px;font-size: 12px;background:${keyBgColor};color:white;border-radius: 4px 0 0 4px;`,
    `padding: 2px 4px;font-size: 12px;background:${valBgColor};color:white;border-radius: 0 4px 4px 0;`,
  ];
};
