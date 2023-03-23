import { PLUGIN_NAME } from '../../constant';

/**
 * 打印日志
 */
export const log = (msg: string) => console.log(`[${PLUGIN_NAME}] ${JSON.stringify(msg)}`);