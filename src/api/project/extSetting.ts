import { requestHttp } from "@/utils/request";
import { ReqPage, ResPage, ResultData } from "@/api/types";

//查询题库项列表
export const pageExtSetting = (params?: ExtQueryParams): Promise<ResultData<ResPage<UserFormExtSettingEntity>>> =>
  requestHttp.get("/form/extSetting/page", params);

export const pageExtSettingRequest = async (
  params?: ExtQueryParams
): Promise<ResultData<ResPage<UserFormExtSettingEntity>> | null> => {
  try {
    const res: ResultData<ResPage<UserFormExtSettingEntity>> = await requestHttp.get("/form/extSetting/page", params);
    if (res.data) {
      res.data.records = res.data.records.map((item: UserFormExtSettingEntity) => {
        return { id: item.id, createTime: item.createTime, updateTime: item.updateTime, ...JSON.parse(item.settings) };
      });
    }
    return res;
  } catch (e) {}
  return null;
};

export const listExtSettingRequest = async (params?: ExtQueryParams): Promise<ResultData<UserFormExtSettingEntity[]> | null> => {
  try {
    const res: ResultData<UserFormExtSettingEntity[]> = await requestHttp.get("/form/extSetting/list", params);
    if (res.data) {
      res.data = res.data.map((item: UserFormExtSettingEntity) => {
        return { id: item.id, createTime: item.createTime, updateTime: item.updateTime, ...JSON.parse(item.settings) };
      });
    }
    return res;
  } catch (e) {}
  return null;
};

//获取扩展设置详细信息
export const getExtSetting = (id: number): Promise<ResultData<UserFormExtSettingEntity>> =>
  requestHttp.get("/form/extSetting/" + id);

// 添加到扩展设置
export const addExtSetting = (data: UserFormExtSettingEntity): Promise<ResultData<UserFormExtSettingEntity>> =>
  requestHttp.post("/form/extSetting/add", data);

// 修改到扩展设置
export const updateExtSetting = (data: UserFormExtSettingEntity): Promise<ResultData<UserFormExtSettingEntity>> =>
  requestHttp.post("/form/extSetting/update", data);

//删除扩展设置
export const deleteExtSetting = (id: number | number[]): Promise<ResultData<UserFormExtSettingEntity>> =>
  requestHttp.post("/form/extSetting/delete/" + id);

export interface ExtQueryParams extends ReqPage {
  /**
   * 表单key
   */
  formKey: string;
  /**
   * 扩展设置类型
   */
  type: string;
}

export const COOPERATION_FORM_GROUP: string = "cooperation_form_group";

/**
 * UserFormExtSettingEntity
 */
export interface UserFormExtSettingEntity {
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 表单key
   */
  formKey: string;
  /**
   * 主键 避免超出长度 前端丢失精度
   */
  id?: number | null;
  /**
   * 通用设置内容
   */
  settings: string;
  type: string;
  /**
   * 更新时间
   */
  updateTime?: null | string;

  /**
   * 其他key
   */
  [key: string]: any;
}

export interface AuthGroupInfo {
  btnPerms: string[];
  // 可见字段
  fieldVisiblePerms: string[];
}
