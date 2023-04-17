import { PLUGIN_NAME } from '../../constant';

/**
 * 打印日志
 */
export const log = (msg: string) => console.log(`%c [${PLUGIN_NAME}] ${JSON.stringify(msg)}`, 'color: red');
