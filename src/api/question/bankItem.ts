import { requestHttp } from "@/utils/request";
import { ReqPage, ResultData } from "@/api/types";

//查询题库项列表
export const pageQuestionBankItem = (params?: PageQuestionBankItemParam): Promise<ResultData> =>
  requestHttp.get("/form/questionBankItem/page", params);

//获取表单题库详细信息
export const getQuestionBankItem = (id: number): Promise<ResultData<QuestionBankItem>> =>
  requestHttp.get("/form/questionBankItem/" + id);

//新增表单题库
export const batchSaveQuestionBankItem = (data: QuestionBankItem[]): Promise<ResultData<QuestionBankItem>> =>
  requestHttp.post("/form/questionBankItem/batchSave", data);
// 添加到题库
export const addToQuestionBank = (data: QuestionBankItem): Promise<ResultData<QuestionBankItem>> =>
  requestHttp.post("/form/questionBankItem/add/" + data.bankId, data);

// 根据Id删除
export const delQuestionBankItemById = (id: any): Promise<ResultData> =>
  requestHttp.post("/form/questionBankItem/deleteById", { id: id });

//修改表单题库
export const updateQuestionBankItem = (data: QuestionBankItem): Promise<ResultData<QuestionBankItem>> =>
  requestHttp.post("/form/questionBankItem/update", data);
//删除表单题库
export const deleteQuestionBank = (id: number | number[]): Promise<ResultData<QuestionBankItem>> =>
  requestHttp.post("/form/questionBankItem/delete/" + id);

export const deleteQuestionBankItem = (id: any): Promise<ResultData> => requestHttp.post("/form/questionBankItem/delete/" + id);
/**
 * QuestionBankItemEntity
 */
export interface QuestionBankItem {
  /**
   * 项目key
   */
  bankId?: number | null;
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 主键 避免超出长度 前端丢失精度
   */
  id?: number | null;
  /**
   * 表单项类型
   */
  itemType?: string | null;
  /**
   * 表单项标题
   */
  label?: null | string;
  /**
   * 题目定义json
   */
  scheme?: any;
  /**
   * 更新时间
   */
  updateTime?: null | string;
}

export interface PageQuestionBankItemParam extends ReqPage {
  label: string | null;
  bankId: number | null;
}
