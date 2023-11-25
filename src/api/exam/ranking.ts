import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";
export const getExamRankList = (uniqueId: any): Promise<ResultData> => requestHttp.get("/form/exam/rankList", { uniqueId });

export interface FormExamRankList {
  /**
   * 考试名称
   */
  examName: string;
  /**
   * 当前排名
   */
  currentRank: number | null;
  /**
   * 总人数
   */
  totalNum: number | null;
  /**
   * 战胜多少人百分比
   */
  winPercent?: number | null;
  /**
   * 排行榜列表
   */
  rankList: RankList[];
  /**
   * 我的排名
   */
  myRank: RankList;
}

export interface RankList {
  /**
   * 答题时间 秒
   */
  answerTime: number;
  /**
   * 参与时间
   */
  createTime: string;
  /**
   * 排名
   */
  rankNum: number;
  /**
   * 分数
   */
  score: number;
}
