import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";

// 查询表单打印模版列表
export const listFormPoster = (formKey: string): Promise<ResultData<PosterEntity[]>> =>
  requestHttp.get(`/report/poster/list`, { formKey });

// 查询表单打印模版详细
export const getFormPoster = (id: number): Promise<ResultData<PosterEntity>> => requestHttp.get("/report/poster/" + id);

// 查询表单打印模版详细
export const getPosterByKey = (key: string): Promise<ResultData<PosterEntity>> => requestHttp.get(`/report/poster/key/${key}`);

// 新增表单打印模版
export const addFormPoster = (data: any) => requestHttp.post("/report/poster/add", data);

// 修改表单打印模版
export const updateFormPoster = (data: any) => requestHttp.post("/report/poster/update", data);

// 删除表单打印模版
export const delFormPoster = (id: number) => requestHttp.post("/report/poster/delete/" + id);

// 预览表单打印模版
export const previewFormPoster = (data: PosterEntity) => requestHttp.post("/report/poster/preview", data);

// 下载
export const downloadFormPoster = (data: { posterKey: string; selectedIds: number[] }) =>
  requestHttp.download("/report/poster/download", data);

/**
 * 打印模板对象 rp_report_print
 */
export interface PosterEntity {
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 唯一标识
   */
  formKey?: null | string;
  /**
   * 主键 避免超出长度 前端丢失精度
   */
  id?: number | null;
  /**
   * 项目名
   */
  name?: null | string;
  /**
   * 海报页面配置
   */
  posterConfig?: any;
  /**
   * 唯一标识
   */
  posterKey?: null | string;
  /**
   * 组件列表
   */
  posterWidgetList?: any[] | null;
  /**
   * 更新时间
   */
  updateTime?: null | string;
  /**
   * 用户Id
   */
  userId?: number | null;
}
