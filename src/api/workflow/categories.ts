import { requestHttp } from "@/utils/request";
import { ReqPage, ResPage, ResultData } from "@/api/types";

//查询流程分类列表
export const pageCategories = (params: PageCategoriesParam): Promise<ResultData<CategoryPageRes>> =>
  requestHttp.get("/flow/categories/page", params);
//获取流程分类详细信息
export const getCategory = (id: number): Promise<ResultData<Category>> => requestHttp.get("/flow/categories/" + id);
//修改流程分类
export const updateCategory = (data: Category): Promise<ResultData> => requestHttp.post("/flow/categories/update", data);
//新增流程分类
export const addCategory = (data: Category): Promise<ResultData> => requestHttp.post("/flow/categories/add", data);
//删除流程分类
export const delCategory = (id: number | number[]): Promise<ResultData> => requestHttp.post("/flow/categories/delete/" + id);

//查询全部流程分类
export const getCategoriesList = (): Promise<ResultData<Category[]>> => requestHttp.get("/flow/categories/list");

/**
 * 分页参数
 */
export interface PageCategoriesParam extends ReqPage {
  // 名称
  name: string;
}

// 分类的类型
export interface Category {
  id: number;
  createTime?: string;
  updateTime?: string;
  name: string;
  sort: number | null;
}

export interface CategoryPageRes extends ResPage<Category> {
  records: Category[];
  total: number;
}
