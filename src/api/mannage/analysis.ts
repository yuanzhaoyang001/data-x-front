//获取表单题库详细信息
import { ResultData } from "@/api/types";
import { requestHttp } from "@/utils/request";

export interface BaseIndex {
  /**
   * 答卷完成占比 一个答卷有一条数据试做完成
   */
  completeRate: string;
  /**
   * 完成占比
   */
  completeRatePercent: string;
  /**
   * 表单数量
   */
  formCount: number;
  /**
   * 提交量
   */
  submitCount: number;
  /**
   * 今日新增表单数量
   */
  todayFormCount: number;
  /**
   * 今日新增表单提交量
   */
  todaySubmitCount: number;
  /**
   * 今日新增浏览量
   */
  todayViewCount: number;
  /**
   * 浏览量
   */
  viewCount: number;
}
// 基础指标
export const getFormBaseIndexReq = (): Promise<ResultData<BaseIndex>> => requestHttp.get("/dashboard/form/baseIndex");
// 15天表单提交量
export interface WriteAndViewCountData {
  /**
   * 日期
   */
  date?: string;
  /**
   * 提交量
   */
  submitCount?: number;
  /**
   * 浏览量
   */
  viewCount?: number;
}

export const getFormSubmitCountLineDataReq = (): Promise<ResultData<WriteAndViewCountData[]>> =>
  requestHttp.get("/dashboard/form/writeAndViewCount");

/**
 * com.tduck.cloud.form.vo.FormDashboardAnalysisVO.TopFormInfo
 *
 * TopFormInfo
 */
export interface TopFormInfo {
  /**
   * 浏览量
   */
  count?: number;
  formKey?: string;
  /**
   * 表单名称
   */
  formName?: string;
}
// 查询表单浏览量top10
export const getTopViewFormInfoReq = (): Promise<ResultData<TopFormInfo[]>> => requestHttp.get("/dashboard/form/topViewFormInfo");
// 查询表单浏览量top15
export const getTopSubmitFormInfoReq = (): Promise<ResultData<TopFormInfo[]>> =>
  requestHttp.get("/dashboard/form/topSubmitFormInfo");

/**
 * NameCount
 */
export interface NameCount {
  /**
   * 数量
   */
  count?: number;
  /**
   * 名称
   */
  name?: string;
}
export const getFormSourceCountReq = (): Promise<ResultData<NameCount[]>> => requestHttp.get("/dashboard/form/report/source");
export const getFormDeviceCountReq = (): Promise<ResultData<NameCount[]>> => requestHttp.get("/dashboard/form/report/device");
