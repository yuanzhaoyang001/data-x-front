import { getRequest, postRequest, putRequest, deleteRequest } from "../baseRequest";
import { requestHttp } from "@/utils/request";
import { ReqPage, ResPage, ResultData } from "@/api/types";

// 查询msg列表
export const listMessage = (params: any) => getRequest("/sys/msg/page", params);

// 查询msg详细
export const getMessage = (id: number) => getRequest("/sys/msg/" + id);

// 新增msg
export const addMessage = (data: any) => postRequest("/sys/msg", data);

// 修改msg
export const updateMessage = (data: any) => putRequest("/sys/msg", data);

// 删除msg
export const delMessage = (id: number) => deleteRequest("/sys/msg/" + id);

// 查询消息发送详情
export const listMessageSendDetails = (params: MessageSendDetailsParam): Promise<ResultData<ResPage<MessageSendDetail>>> =>
  requestHttp.get("sys/msg/sendDetail/page", params);

export interface MessageSendDetailsParam extends ReqPage {
  sourceType: string;
  sourceId: string;
}

export interface MessageSendDetail {
  /**
   * ID
   */
  id: number;
  /**
   * 来源类型
   */
  sourceType: string;
  /**
   * 来源Id
   */
  sourceId: string;
  /**
   * 消息iD
   */
  templateId: number;
  /**
   * 发送条数
   */
  sendCount: number;
  /**
   * 消息类型
   */
  msgType: string;
  /**
   * 消息内容
   */
  msgContent: string;
}

// 查询消息发送操作中的详情
export const listSendDetailsMsgList = (
  sendId: number,
  param: SendDetailsMsgListParam
): Promise<ResultData<ResPage<PushMessage>>> => requestHttp.get(`/sys/msg/sendDetail/${sendId}/page`, param);

export interface SendDetailsMsgListParam extends ReqPage {
  receiver: string;
}

export interface PushMessage {
  /**
   * 消息Id
   */
  msgId: string;

  /**
   * 推送内容
   */
  content: string;

  /**
   * 推送所需参数Json格式
   */
  msgParams: string;

  /**
   * 接收人
   */
  receiver: string;

  /**
   * 推送失败原因
   */
  result: string;

  /**
   * 发送次数
   */
  sendNum: number;

  /**
   * 推送状态 0未推送 1推送成功 2推送失败
   */
  sendStatus: number;

  /**
   * 推送时间
   */
  sendTime: Date;

  /**
   * 消息标题
   */
  title: string;

  /**
   * 推送方式：1短信 2邮件 3微信
   */
  type: number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 发送详情Id
   */
  sendDetailId: number;

  /**
   * 扩展状态
   */
  extStatus: number;
}
