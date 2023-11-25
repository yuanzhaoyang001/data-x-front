export interface DimensionConfig {
  id?: number;
  /**
   * 维度列表
   */
  dimensionList: DimensionInfo[];

  /**
   * 维度分值计算方式  1.求和 2.平均值
   */
  dimensionScoreType: number;
  /**
   * 开启设置标准分
   */
  enableStandardScore: boolean;
  /**
   * 开启设置权重
   */
  enableWeight: boolean;
  /**
   * 开启评测说明
   */
  enableEvaluation: boolean;
  /**
   * 评测说明
   */
  evaluationDesc: string;
  /**
   * 开启评测结果显示
   */
  enableEvaluationResult: boolean;
  /**
   * 评测结果及建议
   */
  evaluationResultAdvices: ResultAdvice[];
}

/**
 * 结果及建议
 */
export interface ResultAdvice {
  /**
   * 建议
   */
  advice: string;

  /**
   * 最小分数
   */
  minScore: number;
  /**
   * 最小值比较符式<   <= 1 2
   */
  minCompare: number;

  /**
   * 最大值比较符式< <=
   */
  maxCompare: number;
  /**
   * 最大分数
   */
  maxScore: number;
}

/**
 * 维度基础信息
 */
export interface DimensionInfo {
  /**
   * 名称
   */
  name: string;
  /**
   * id
   */
  id: string;

  /**
   * 该维度绑定的字段id列表
   */
  fieldList: string[];
  /**
   * 该维度的结果及建议
   */
  resultAdvices: ResultAdvice[];

  /**
   * 标准分
   */
  standardScore?: number;
  /**
   * 权重
   */
  weight?: number;
}
