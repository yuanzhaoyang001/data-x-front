import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";
import { ExamSetting } from "@/api/project/setting";

/**
 * 获取考试列表
 * @param uniqueId 考试的唯一id,
 * @param dataId 考试数据id
 */
export const getExamResult = (uniqueId: string, dataId: number): Promise<ResultData<FormExamResultVO>> =>
  requestHttp.get(`/form/exam/result`, { uniqueId: uniqueId, dataId: dataId });

/**
 * 获取考试数据列表
 */
export const getExamDataList = (formKey: string, manualRating: boolean | null): Promise<ResultData<UserFormExamInfoEntity>> =>
  requestHttp.get(`/form/exam/scoreList`, {
    formKey,
    manualRating
  });

/**
 * 保存考试信息
 */
export const saveManualRating = (id: number, manualRatingList: ManualRatingInfo[]): Promise<ResultData<UserFormExamInfoEntity>> =>
  requestHttp.post(`/form/exam/manualRating`, {
    id,
    manualRatingList: JSON.stringify(manualRatingList)
  });

export interface ManualRatingInfo {
  formItemId: string;
  isCorrect: boolean;
  score: number;
}

export interface UserFormExamInfoEntity {
  id: number;
  uniqueId: string;
  formKey: string;
  dataId: number;
  totalScore: number;
  myScore: number;
  userId: number;
  answerTime: number;
  randomQuestionIds: string;
  isManualRating: boolean;
  manualRatingInfoList: ManualRatingInfo[];
  createTime: string;
}

/**
 * 考试结果信息
 */
export interface FormExamResultVO {
  /**
   * 正确或错误的题目
   */
  correctOrErrorMap: { [key: string]: boolean };

  /**
   * 题目分数
   */
  scoreMap: { [key: string]: number };
  /**
   * 考试时长
   */
  examDuration?: null | string;
  /**
   * 考试题目
   */
  examItems?: any[] | null;
  /**
   * 考试名称
   */
  examName?: null | string;
  /**
   * 考试排名
   */
  examRank?: number | null;
  /**
   * 考试结果
   */
  examResult?: MapObject;
  /**
   * 考试时间
   */
  examTime?: null | string;
  /**
   * 我的分数
   */
  myScore?: number | null;
  /**
   * 考试总分
   */
  totalScore?: number | null;
  /**
   * 考试设置
   */
  examSetting?: ExamSetting;
  /*
    考试唯一id
   */
  examUniqueId?: string;

  formKey?: string;
  /**
   * 数据唯一id
   */
  dataUniqueId?: number;
}

/**
 * java.util.Map<java.lang.String,java.lang.Object>
 *
 * Map«Object»
 *
 * 扩展字段 表单项独有字段
 *
 * 考试结果
 */
export interface MapObject {
  /**
   * data.examResult.key
   */
  key?: { [key: string]: any };
}
