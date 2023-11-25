import { getRequest, postRequest } from "../baseRequest";
import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";

// 查询填写设置
export const getSettingRequest = (key: string) => getRequest(`/user/form/setting/${key}`);
// 保存提交设置
export const saveSettingRequest = (data: any) => postRequest("/user/form/setting/save", data);

// 获取微信通知用户
export const getWxNotifyUserRequest = (params: any) => getRequest("/user/form/wx/notify-user", params);

// 获取订阅微信通知二维码
export const getWxNotifyQrcodeRequest = (params: any) => getRequest("/user/form/wx/notify-qrcode", params);

// 删除微信通知用户
export const deleteWxNotifyUserRequest = (key: string, openId: string) =>
  postRequest(`/user/form/wx/delete/notify-user?key=${key}&openId=${openId}`);

// 获取填写状态
export const getWriteSettingStatusRequest = (params: any) => getRequest("/user/form/setting-status", params);

//查询表单公开设置
export const getPublicSettingsRequest = (key: string) => getRequest(`/user/form/public/settings/${key}`);

// 检查填写密码是否正确
export const checkWritePwdRequest = (data: any) => postRequest(`/user/form/public/checkWritePwd`, data);
// 查询协作者列表
export const getShareCollaboratorRequest = (formKey: string) => getRequest(`/user/form/collaborator/list`, { formKey });
// 添加协作者
export const addShareCollaboratorRequest = (data: any) => postRequest(`/user/form/collaborator/add`, data);
// 删除协作者
export const deleteCollaboratorRequest = (data: any) => postRequest(`/user/form/collaborator/delete`, data);
// 修改
export const updateCollaboratorRequest = (data: any) => postRequest(`/user/form/collaborator/update`, data);
// 获取考试设置
export const getExamSettingRequest = (key: string): Promise<ResultData<ExamSetting>> =>
  requestHttp.get(`/user/exam/setting/${key}`);
// 保存考试设置
export const saveExamSettingRequest = (data: ExamSetting, formKey: string): Promise<ResultData> =>
  requestHttp.post(`/user/exam/setting/save`, { examSettings: data, formKey: formKey });

export interface ExamSetting {
  // 开启最短答题时间
  enableMinTime: boolean;
  // 最短答题时间
  minTime: number;
  // 开启最长答题时间
  enableMaxTime: boolean;
  // 最长答题时间
  maxTime: number;
  // 显示答题卡
  showAnswerCard: boolean;
  // 开启切屏次数限制
  enableSwitchCount: boolean;
  // 最大切屏次数
  maxSwitchCount: number;
  //练习模式
  practiceMode: boolean;
  // 可查看正确答案和解析
  enableViewAnswer: boolean;
  //  显示成绩单
  showScoreCard: boolean;
  //显示排名
  showRank: boolean;
  // 不允许复制题目
  disableCopyQuestion: boolean;
  // 随机题目顺序
  randomQuestionOrder: boolean;
  // 随机抽题规则
  drawQuestionRuleList: [];
  // 题库抽题规则
  questionBankDrawRuleList: [];
}
