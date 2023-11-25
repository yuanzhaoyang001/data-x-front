import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";
import { DimensionConfig } from "@/views/form/dimension/types";

// 查询维度信息
export const getDimensionByKey = (key: string): Promise<ResultData<DimensionConfig>> => requestHttp.get("/form/dimension/" + key);

// 保存维度信息
export const saveDimension = (data: any): Promise<ResultData<DimensionConfig>> => requestHttp.post("/form/dimension/save", data);

// 查看维度测评报告
export const getDimensionReport = (key: string): Promise<ResultData<EvaluationResultReport>> =>
  requestHttp.get("/form/dimension/evaluationResult/" + key);

export interface EvaluationResultReport {
  userFormDimension: DimensionConfig | null;
  userFormDimensionResult: UserFormDimensionResult | null;
}

export interface UserFormDimensionResult {
  id: number;
  formKey: string;
  dataKey: string;
  dimensionId: number;
  evaluationScore: number;
  dimensionScoreList: DimensionScore[];
}

export interface DimensionScore {
  dimensionId: string;
  score: number;
}
