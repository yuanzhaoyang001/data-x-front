import { deleteRequest, getRequest, postRequest, putRequest } from "../baseRequest";
import { ReqPage, ResultData, ResPage } from "@/api/baseRequest";
import { requestHttp } from "@/utils/request";

// 查询系统通告列表
export const listAnnouncement = (params: any) => getRequest("/sys/announce/page", params);

// 查询系统通告详细
export const getAnnouncement = (id: number) => getRequest("/sys/announce/" + id);

// 新增系统通告
export const addAnnouncement = (data: any) => postRequest("/sys/announce", data);

// 修改系统通告
export const updateAnnouncement = (data: any) => putRequest("/sys/announce", data);

// 删除系统通告
export const delAnnouncement = (id: number) => deleteRequest("/sys/announce/" + id);

// 发布系统公告
export const releaseAnnouncement = (id: number) => postRequest(`/sys/announce/release/${id}`);

// 发布系统公告
export const revokeAnnouncement = (id: number) => postRequest(`/sys/announce/revoke/${id}`);

/**
 * 查询我的消息列表
 * @param params
 */
export const getMyAnnouncementSend = (params: ReqPage): Promise<ResultData<MessagePageRes>> =>
  requestHttp.get("/sys/announce/getMyAnnouncementSend", params);

/**
 * 首页通知列表
 * @param params
 */
export const getMyUnReadAnnouncementSend = (params: any) => getRequest("/sys/announce/unread/list", params);

/**
 * 首页通知列表
 * @param params
 */
export const getMyAnnouncementNotice = (params: any) => getRequest("/sys/announce/notice", params);

/**
 * 标记消息已读
 */
export const readAnnouncementSend = (id: number): Promise<ResultData<Message>> => requestHttp.put("/sys/announce/read/" + id);
/**
 * 标记全部已读
 */
export const readAllAnnouncementSend = (): Promise<ResultData<Message>> => requestHttp.put("/sys/announce/readAll/");

export interface Message {
  anntId?: number;
  msgContent: string;
  priorityDesc: string;
  readFlag?: boolean;
  sendTime: string;
  sender: string;
  title: string;
}

export interface MessagePageRes extends ResPage<Message> {
  current: number;
  pages: number;
  records: Message[];
  size: number;
  total: number;
}
