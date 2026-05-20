import { IOption } from './interface';
import { getConsole } from './helpers/console';
import Git from './helpers/git';

/** 空值显示字符 */
export const EMPTY_STR = '-';

/** nil 时输出空值字符 */
export const defaultToEmpty = (value: string | undefined | null) => value ?? EMPTY_STR;

/** 安全转义供内联 script 使用 */
const escapeScript = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/** 聚合 console */
export const combineConsole = (option: IOption) => {
  const items: ReturnType<typeof getConsole>[] = [];

  if (option.NODE_ENV) {
    const env = process.env['NODE_ENV'];
    items.push(getConsole('NODE_ENV', defaultToEmpty(env), { keyBgColor: '#20e014' }));
  }

  if (option.git) {
    const { git } = option;
    const gitIns = new Git();

    if (git.branch) {
      items.push(getConsole('git 分支', defaultToEmpty(gitIns.branch())));
    }
    if (git.hash) {
      const h = gitIns.commithash();
      items.push(getConsole('git hash', defaultToEmpty(h?.slice(0, git.hash))));
    }
    if (git.version) {
      items.push(getConsole('git 版本', defaultToEmpty(gitIns.version())));
    }
    if (git.lastCommitDateTime) {
      items.push(getConsole('git 最近提交时间', defaultToEmpty(gitIns.lastcommitdatetime())));
    }
  }

  if (option.custom) {
    for (const [k, v] of Object.entries(option.custom())) {
      items.push(getConsole(k, defaultToEmpty(v)));
    }
  }

  return items;
};

/** 获取注入 HTML 的 script 内容 */
export const getHtmlScript = (option: IOption) => {
  const items = combineConsole(option);
  const calls = items.map(
    (item) => `console.log(${item.map((f) => `'${escapeScript(f)}'`).join(',')})`
  );
  return `;${calls.join(';')};`;
};
