import request, { requestHttp } from "@/utils/request";
import { ReqPage, ResPage, ResultData } from "@/api/types";

//查询答题白名单列表
export const getAnswerWhiteList = (params?: PageAnswerWhiteParam): Promise<ResultData> =>
  requestHttp.get("/form/answerWhitelist/page", params);
//导出答题白名单列表
export const exportAnswerWhitelist = (params?: PageAnswerWhiteParam) =>
  request({
    url: "/form/answerWhitelist/export",
    method: "get",
    responseType: "blob",
    params: params
  });
//导入名单
export const importAnswerWhitelist = (params: AnswerWhite): Promise<ResultData> =>
  requestHttp.post("/form/answerWhitelist/import", params);
//下载导入模板
export const importTemplateAnswerWhitelist = () =>
  request({
    url: "/form/answerWhitelist/importTemplate",
    method: "get",
    responseType: "blob"
  });

//批量新增答题白名单
export const addAnswerWhitelist = (data: BodyAnswerWhite): Promise<ResultData> =>
  requestHttp.post("/form/answerWhitelist/batchAdd", data);
//删除答题白名单
export const deleteAnswerWhitelist = (id: number[]) => requestHttp.post("/form/answerWhitelist/delete/" + id);

// 校验白名单是否正确
export const checkAnswerWhitelist = (data: CheckAnswerWhite): Promise<ResultData> =>
  requestHttp.post("/form/answerWhitelist/checkVal", data);

export interface PageAnswerWhiteParam extends ReqPage {
  value: string;
  type?: number;
  formKey: string;
  status?: number | null;
}

export interface BodyAnswerWhite {
  formKey: string;
  /**
   * 类型
   */
  type: number;
  /**
   * 白名单列表
   */
  whitleList: string[];
}

export interface CheckAnswerWhite {
  formKey: string;
  /**
   * 类型
   */
  type: number;
  /**
   * 白名单列表
   */
  whitleList: string[];
}

export interface AnswerWhite {
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 表单key 导入必填
   */
  formKey?: string;
  /**
   * 主键 避免超出长度 前端丢失精度
   */
  id?: number;
  /**
   * 状态
   */
  status?: number;
  /**
   * 白名单类型 比如邮件 手机号登 导入必填
   * EMAIL :EMAIL
   * PHONE :PHONE
   * TEXT :TEXT
   */
  type?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 白名单值Id
   */
  value?: string;
}
