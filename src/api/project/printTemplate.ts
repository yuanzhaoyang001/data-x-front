import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";

// 查询表单打印模版列表
export const listFormPrintTemplate = (formKey: string): Promise<ResultData<ReportPrintEntity[]>> =>
  requestHttp.get(`/report/print/list`, { formKey });

// 查询表单打印模版详细
export const getFormPrintTemplate = (id: number): Promise<ResultData<ReportPrintEntity>> =>
  requestHttp.get("/report/print/" + id);

// 新增表单打印模版
export const addFormPrintTemplate = (data: any) => requestHttp.post("/report/print/add", data);

// 修改表单打印模版
export const updateFormPrintTemplate = (data: any) => requestHttp.post("/report/print/update", data);

// 删除表单打印模版
export const delFormPrintTemplate = (id: number) => requestHttp.post("/report/print/delete/" + id);

// 预览表单打印模版
export const previewFormPrintTemplate = (data: ReportPrintEntity) =>
  requestHttp.post("/report/print/preview", data, { responseType: "blob" });

// 下载
export const downloadFormPrintTemplate = (data: { templateKey: string; downloadType: number; selectedIds: number[] }) =>
  requestHttp.post("/report/print/download", data, { responseType: "blob" });

/**
 * 打印模板对象 rp_report_print
 *
 * ReportPrintEntity
 */
export interface ReportPrintEntity {
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 表单key
   */
  formKey?: null | string;
  /**
   * 打印片段参数JSON
   */
  fragmentJson?: null | string;
  /**
   * 主键 避免超出长度 前端丢失精度
   */
  id?: number | null;
  /**
   * 参数数据JSON
   */
  paramJson?: null | string;
  /**
   * 打印配置JSON
   */
  printJson?: null | any;
  /**
   * 名称
   */
  printName?: null | string;
  /**
   * 打印模板类型
   */
  printType?: number | null;
  /**
   * 变量名
   */
  printVariable?: null | string;
  /**
   * luckysheet电子表单原始配置JSON
   */
  sheetDataJson?: null | string;
  /**
   * 电子表格解析后的打印模板配置数据JSON
   */
  templateDataJson?: null | string;
  /**
   * 唯一key
   */
  unionKey?: null | string;
  /**
   * 更新时间
   */
  updateTime?: null | string;
}
