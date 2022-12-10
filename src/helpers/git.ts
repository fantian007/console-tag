import runGitCommand from './run-git-command';

const COMMITHASH_COMMAND = 'rev-parse HEAD';
const VERSION_COMMAND = 'describe --always';
const BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD';
const LASTCOMMITDATETIME_COMMAND = 'log -1 --format=%cI';

export interface GitOptions {
  /**
   * 工作树
   */
  gitWorkTree?: string;
  /**
   * 提交哈希
   */
  commithashCommand?: string;
  /**
   * 版本
   */
  versionCommand?: string;
  /**
   * 是否输出分支名到文件
   */
  branch?: boolean;
  /**
   * 取分支名命令
   */
  branchCommand?: string;
  /**
   * 取最近一次提交时间的命令
   */
  lastCommitDateTimeCommand?: string;
  /**
   * 获取版本时，是否匹配轻量级标签
   */
  lightweightTags?: boolean;
}

export default class Git {
  gitWorkTree?: string;
  commithashCommand: string;
  versionCommand: string;
  createBranchFile: boolean;
  branchCommand: string;
  lastCommitDateTimeCommand: string;

  constructor(options: GitOptions = {}) {
    this.gitWorkTree = options.gitWorkTree;
    this.commithashCommand = options.commithashCommand || COMMITHASH_COMMAND;
    this.versionCommand = options.versionCommand || VERSION_COMMAND + (options?.lightweightTags ? ' --tags' : '');
    this.createBranchFile = options.branch || false;
    this.branchCommand = options.branchCommand || BRANCH_COMMAND;
    this.lastCommitDateTimeCommand = options.lastCommitDateTimeCommand || LASTCOMMITDATETIME_COMMAND;

    if (options.versionCommand && options.lightweightTags) {
      throw new Error("lightweightTags can't be used together versionCommand");
    }
  }

  commithash() {
    return runGitCommand(this.gitWorkTree, this.commithashCommand);
  }

  version() {
    return runGitCommand(this.gitWorkTree, this.versionCommand);
  }

  branch() {
    return runGitCommand(this.gitWorkTree, this.branchCommand);
  }

  lastcommitdatetime() {
    return runGitCommand(this.gitWorkTree, this.lastCommitDateTimeCommand);
  }
}
