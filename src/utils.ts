import { IOption } from './interface';
import { getConsole } from './helpers/console/index';
import Git from './helpers/git/index';

export const EMPTY_STR = '-';

export const getEnv = (key: string) => process.env[key];

export const defaultToEmpty = (value: string | undefined | null) => value ?? EMPTY_STR;

/** 合并 git 配置，保留未传入的默认值 */
const mergeGitOption = (git: IOption['git']): NonNullable<IOption['git']> => ({
  branch: true,
  hash: 7,
  version: false,
  lastCommitDateTime: false,
  ...git,
});

const escapeScript = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/<\//g, '<\\/')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');

export const combineConsole = (option: IOption) => {
  const items: ReturnType<typeof getConsole>[] = [];

  if (option.NODE_ENV) {
    const env = process.env['NODE_ENV'];
    items.push(getConsole('NODE_ENV', defaultToEmpty(env), { keyBgColor: '#20e014' }));
  }

  if (option.git) {
    const git = mergeGitOption(option.git);
    const gitIns = new Git();

    if (git.branch) {
      items.push(getConsole('git 分支', defaultToEmpty(gitIns.branch())));
    }
    if (git.hash) {
      const h = gitIns.commithash();
      items.push(getConsole('git hash', defaultToEmpty(h.slice(0, git.hash))));
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

export const getHtmlScript = (option: IOption) => {
  const items = combineConsole(option);
  const calls = items.map(
    (item) => `console.log(${item.map((f) => `'${escapeScript(f)}'`).join(',')})`
  );
  return `;${calls.join(';')};`;
};
