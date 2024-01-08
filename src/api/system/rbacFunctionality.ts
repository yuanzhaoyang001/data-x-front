//新增表单题库
import { ResultData } from "@/api/types";
import { requestHttp } from "@/utils/request";

export const saveRbacFunctionality = (data: SaveParam): Promise<ResultData<Boolean>> =>
  requestHttp.post("/sys/rbacFunctionality/save", data);

export const listRbacFunctionality = (data: { funcType: string; funcId: string }): Promise<ResultData<RbacInfo[]>> =>
  requestHttp.get("/sys/rbacFunctionality/list", data);

interface SysRbacFunctionalityEntity {
  id: number;
  funcType: string;
  funcId: string;
  rbacType: string;
  rbacId: number;
}

export interface RbacInfo {
  rbacType: string;
  rbacId: number;
  rbacName?: string;
  id?: number;
}

export interface SaveParam {
  funcType: string;
  funcId: string;
  rbacList: RbacInfo[];
}

export const USER_TYPE = "USER";

export const ROLE_TYPE = "ROLE";

export const DEPT_TYPE = "DEPT";

export const POST_TYPE = "POST";
