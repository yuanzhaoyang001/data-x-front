import { requestHttp } from "@/utils/request";
import { ReqPage, ResultData } from "@/api/types";
import { QuestionBankItem } from "@/api/question/bankItem";

//获取表单题库详细信息
export const pageQuestionBank = (params: PageQuestionParam): Promise<ResultData<PageQuestionParam>> =>
  requestHttp.get("/form/questionBank/page", params);

//获取表单题库详细信息
export const listQuestionBank = (bankType: number | null, isPublic?: boolean): Promise<ResultData<Question[]>> =>
  requestHttp.get("/form/questionBank/list", { bankType: bankType, isPublic: isPublic });
//获取表单题库详细信息
export const getQuestionBank = (id: number): Promise<ResultData<Question>> => requestHttp.get("/form/questionBank/" + id);
//新增表单题库
export const addQuestionBank = (data: Question): Promise<ResultData<Question>> =>
  requestHttp.post("/form/questionBank/add", data);
//修改表单题库
export const updateQuestionBank = (data: Question): Promise<ResultData<Question>> =>
  requestHttp.post("/form/questionBank/update", data);
//删除表单题库
export const deleteQuestionBank = (id: number | number[]): Promise<ResultData<Question>> =>
  requestHttp.post("/form/questionBank/delete/" + id);

//查询题库题目列表
export const getAllQuestionBankItemList = (params?: any): Promise<ResultData> =>
  requestHttp.get("/form/questionBank/details", params);

/**
 * 根据id删除
 * @param id id
 */
export const deleteQuestionBankById = (id: number): Promise<ResultData> =>
  requestHttp.post("/form/questionBank/deleteById", { id });

export interface PageQuestionParam extends ReqPage {
  bankType: number | null;
}

/**
 * FormQuestionBankVO
 */
export interface FormQuestionBank {
  /**
   * 个人题库
   */
  personalQuestionBank?: QuestionBankDetails[] | null;
  /**
   * 公共题库
   */
  publicQuestionBank?: QuestionBankDetails[] | null;
}

/**
 * com.tduck.cloud.form.vo.FormQuestionBankVO.QuestionBankDetails
 *
 * QuestionBankDetails
 */
export interface QuestionBankDetails {
  /**
   * 题库
   */
  questionBank?: Question;
  /**
   * 题目
   */
  questionBankItems?: QuestionBankItem[] | null;
}

export interface Question {
  createTime?: string;
  description: string;
  id?: number | null;
  isPublic?: boolean;
  name: string;
  updateTime?: string;
  bankType: number;
}

export interface PageQuestionParam extends ReqPage {
  total: number;
  name: string;
  records?: Question[];
}
