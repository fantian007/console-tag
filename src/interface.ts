
/**
 * 插件配置参数
 */
export interface IOption {
  /**
   * NODE_ENV 环境变量
   * 
   * @default true
   */
  NODE_ENV?: boolean;
  /**
   * git 信息
   */
  git?: {
    /**
     * 分支名
     * 
     * @default true
     */
    branch?: boolean;
    /**
     * hash 长度
     * 传入数字，则收集指定固定长度的 hash
     * 
     * @default 7
     */
    hash?: number;
    /**
     * 版本
     * 
     * @default false
     */
    version?: boolean;
    /**
     * 最近一次提交时间
     * 
     * @default false
     */
    lastCommitDateTime?: boolean;
  };
  /**
   * scm 构建信息
   */
  scm?: {
    /**
     * 构建时间
     */
    buildPubDate?: boolean;
    /**
     * 构建版本
     * 
     * @default true
     */
    buildVersion?: boolean;
    /**
     * 构建类型
     * 
     * @default false
     */
    buildType?: boolean;
    /**
     * 构建语言
     * 
     * @default false
     */
    buildLanguage?: boolean;
    /**
     * 构建用户
     * 
     * @default true
     */
    buildUser?: boolean;
    /**
     * git 仓库源
     * 
     * @default false
     */
    buildGit?: boolean;
  };
}
