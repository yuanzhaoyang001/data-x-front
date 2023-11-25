/**
 * 流程详情
 */
export interface ProcessDetail {
  processName: string;
  status: number;
  statusDesc: string;
  startUser: TaskUser;
  processTaskNodes?: ProcessTaskNode[];
}

/**
 * 流程节点
 */
export interface ProcessTaskNode {
  taskName: string;
  multiUser: boolean;
  taskUsers: TaskUser[];
  createTime: string;
}

/**
 * 节点用户
 */
export interface TaskUser {
  userName: string;
  deptName?: any;
  avatar: string;
  handleType: number;
  handleTypeDesc: string;
  comment?: any;
  handleTime?: any;
}

/**
 * 审批印章类型
 */
export enum SealColorType {
  /**
   * 默认
   */
  DEFAULT,
  /**
   * 成功
   */
  SUCCESS,
  /**
   * 失败
   */
  FAIL,
  /**
   * 警告
   */
  WARNING
}
