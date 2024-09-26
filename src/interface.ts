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
   * 自定义
   */
  custom?: () => Record<string, string>;
}
