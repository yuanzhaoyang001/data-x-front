import { deleteRequest, getRequest, postRequest, putRequest } from "../baseRequest";

// 查询项目主题外观模板列表
export const listTheme = (params: any) => getRequest("/form/theme/page", params);

// 查询项目主题外观模板详细
export const getTheme = (id: number) => getRequest("/form/theme/" + id);

// 新增项目主题外观模板
export const addTheme = (data: any) => postRequest("/form/theme", data);

// 修改项目主题外观模板
export const updateTheme = (data: any) => putRequest("/form/theme", data);

// 删除项目主题外观模板
export const delTheme = (id: number) => deleteRequest("/form/theme/" + id);

// 查询单主题分类列表
export const listCategory = (params: any) => getRequest("/form/theme/category/list", params);

// 查询单主题分类详细
export const getCategory = (id: number) => getRequest("/form/theme/category/" + id);

// 新增单主题分类
export const addCategory = (data: any) => postRequest("/form/theme/category", data);

// 修改单主题分类
export const updateCategory = (data: any) => putRequest("/form/theme/category", data);

// 删除单主题分类
export const delCategory = (id: number) => deleteRequest("/form/theme/category/" + id);

/**
 * logo图片
 */
export interface FormThemeType {
  logoImgUrl: string; // logo图片
  logoPosition: string; // logo位置
  headImgUrl: string; // 头部图片
  themeColor: string; // 主题颜色
  submitBtnText: string; // 提交按钮文字
  backgroundType: string;
  backgroundColor: string; // 背景颜色
  backgroundImg: string; // 背景图片
  showFormTitle: boolean; // 是否显示标题
  showFormDescribe: boolean; // 是否显示描述语
  showFormNumber: boolean; // 显示序号
  showSubmitBtn: boolean; // 显示提交按钮
  labelFontSize: string; // 标题字体大小
  labelFontColor: string; // 标题字体颜色
  optionFontSize: string; // 选项字体大小
  optionFontColor: string; // 选项字体颜色
  showSupport: boolean; // 显示技术支持
  showFootDescription: boolean; // 显示页脚文案
  footDescription: string; // 页脚文案
  // 开启水印
  watermark: boolean;
  // 水印文字
  watermarkText: string;
  // 是否显示用户名为水印
  watermarkUserName: boolean;
}
