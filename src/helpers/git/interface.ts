
/**
 * Git 配置项
 */
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
