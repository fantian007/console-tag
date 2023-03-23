import type { GitOptions } from './interface';
import runGitCommand from './run-git-command';
import { BRANCH_COMMAND, COMMITHASH_COMMAND, LASTCOMMITDATETIME_COMMAND, VERSION_COMMAND } from './constant';

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
