import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";

export const saveOrUpdateActivities = (data: DrawActivities): Promise<ResultData<DrawActivities>> =>
  requestHttp.post("/lottery/activities/saveOrUpdate", data);

export const getActivitiesBySource = (sourceType: string, sourceId: string): Promise<ResultData<DrawActivities>> =>
  requestHttp.get("/lottery/activities/getBySource", { sourceType, sourceId });

export const getActivitiesByTimeRange = (sourceType: string, sourceId: string): Promise<ResultData<DrawActivities>> =>
  requestHttp.get("/lottery/activities/getByTimeRange", { sourceType, sourceId });

// 开始抽奖
export const startLottery = (param: DrawActivitiesParam): Promise<ResultData<DrawPrizesVO>> =>
  requestHttp.post("/form/lottery/draw", param);

export const updateParticipantInfo = (param: ParticipantInfo): Promise<ResultData<DrawPrizesVO>> =>
  requestHttp.post("/lottery/activities/updateParticipantInfo", param);

// 获取全部中奖信息
export const getDrawPrizesList = (sourceType: string, sourceId: string): Promise<ResultData<DrawPrizesVO[]>> =>
  requestHttp.get("/lottery/activities/getWinners", { sourceType, sourceId });

// 标记已发送奖励
export const markSendStatus = (id: number): Promise<ResultData<DrawPrizesVO>> =>
  requestHttp.post("/lottery/activities/markSendStatus", { id });

export const FORM_LOTTERY = "FORM_LOTTERY";

export interface ParticipantInfo {
  id?: number;
  sourceType?: string | null;
  sourceId?: string | null;
  drawActivityId?: number | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface DrawPrizesVO {
  id: number | null;
  name: string;
  image: string;
  code: string | null;
  participantId: number | null;
}

interface DrawActivitiesParam {
  drawActivitiesId: number | null;
  dataId: string | null;
  sourceType: string | null;
  sourceId: string | null;
}

export interface DrawPrizesEntity {
  id: number | null | string;
  drawActivityId: number | null;
  name: string;
  image: string;
  winProbability: number | null;
  quantity: number | null;
  extraInfo: string | null;
}

export interface DrawActivities {
  id: number | null;
  sourceType: string;
  sourceId: string;
  actName: string;
  actType: number | null;
  actStatus: boolean | null;
  description: string;
  startDate: string; // 这里的类型可能需要根据实际情况调整
  endDate: string; // 同上，根据实际情况调整
  rewardType: number | null;
  extraInfo: Record<string, any> | null;
  drawPrizesList?: DrawPrizesEntity[];
  drawPrizesVoList?: DrawPrizesEntity[] | null;
}
