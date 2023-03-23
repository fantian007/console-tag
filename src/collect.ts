/**
 * 由 option 收集 console 信息
 */
import { IOption } from './interface';
import { getConsole } from './helpers/console';
import Git from './helpers/git';

/**
 * 空值显示字符
 */
export const EMPTY_STR = '-';

/**
 * 获取环境变量
 */
export const getEnv = (key: string) => process.env[key];

/**
 * nil 时输出 空值字符
 */
export const defaultToEmpty = (value: string | undefined | null) => value ?? EMPTY_STR;

export default (option: IOption) => {
  const consoleArr: ReturnType<typeof getConsole>[] = [];

  // NODE_ENV
  if (option.NODE_ENV) {
    const NODE_ENV = getEnv('NODE_ENV');

    consoleArr.push(getConsole('NODE_ENV', defaultToEmpty(NODE_ENV), { keyBgColor: '#20e014' }));
  }

  // git
  if (option.git) {
    const { git } = option;
    
    const gitIns = new Git();

    // 分支
    if (git.branch) {
      const branch = gitIns.branch();

      consoleArr.push(getConsole('git 分支', defaultToEmpty(branch)));
    }

    // 哈希
    if (git.hash) {
      const hash = gitIns.commithash();

      consoleArr.push(getConsole('git hash', defaultToEmpty(hash?.slice(0, git.hash))));
    }

    // 版本
    if (git.version) {
      const version = gitIns.version();

      consoleArr.push(getConsole('git 版本', defaultToEmpty(version)));
    }

    // 最近提交时间
    if (git.lastCommitDateTime) {
      const lastCommitTime = gitIns.lastcommitdatetime();

      consoleArr.push(getConsole('git 最近提交时间', defaultToEmpty(lastCommitTime)));
    }
  }

  return consoleArr;
}
