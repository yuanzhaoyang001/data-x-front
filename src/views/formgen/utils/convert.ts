import { endsWith, isObject, toNumber } from "lodash-es";
import { getAllComponentsObj } from "../components/GenerateForm/config";
import { removeHtmlTag } from "./index";

/**
 * 表单json转换为后台需要的对象
 * @param item
 */
export function formItemConvertData(item: any, formKey: string) {
  const data = {
    type: item.typeId,
    formItemId: item.config.formId,
    label: item.config.label,
    // 转换字符串 防止报错
    defaultValue: isObject(item.config.defaultValue) ? JSON.stringify(item.config.defaultValue) : item.config.defaultValue,
    required: item.config.required,
    placeholder: removeHtmlTag(item.placeholder),
    regList: item.config.regList,
    showLabel: item.config.showLabel,
    span: item.config.span,
    displayType: item.config.displayType,
    description: item.description,
    hideType: item.config.hideType,
    scheme: item,
    formKey
  };
  return data;
}

/**
 * 后台存储的数据转换为elementui表单需要的Json
 * @param data
 */
export function dbDataConvertForItemJson(data: any) {
  const { required, placeholder } = data;
  if (required && !placeholder) {
    // 必填项目验证未填默认提示语
    data.placeholder = "此题为必填项目";
  }
  const jsonItem = data.scheme;
  if (data.id) jsonItem.dId = data.id;
  if (data.sort) jsonItem.sort = data.sort;
  if (data.type) jsonItem.typeId = data.type;
  if (data.hideType !== undefined) jsonItem.hideType = data.hideType;
  // 显示类型的图片
  if (data.displayType !== undefined) jsonItem.displayType = data.displayType;
  if (data.span) jsonItem.config.span = data.span;
  if (data.formItemId) jsonItem.config.formId = data.formItemId;
  if (data.label) jsonItem.config.label = data.label;
  if (data.required !== undefined && data.required !== null) jsonItem.config.required = data.required;
  if (data.regList) jsonItem.config.regList = data.regList;
  if (data.showLabel !== undefined && data.showLabel !== null) jsonItem.config.showLabel = data.showLabel;
  if (data.description) jsonItem.description = data.description;
  if (data.placeholder) jsonItem.placeholder = data.placeholder;
  if (data.formItemId) jsonItem.vModel = data.formItemId;
  if (data.defaultValue) jsonItem.config.defaultValue = data.defaultValue;
  if (data.defaultValue && isJSON(data.defaultValue)) {
    // 转成json对象 不然是String 组件会报错
    jsonItem.config.defaultValue = JSON.parse(data.defaultValue);
  } else if (data.defaultValue && isNumber(data.defaultValue)) {
    // 转换成数字 不然默认选中可能会失效
    jsonItem.config.defaultValue = toNumber(data.defaultValue);
  }
  //url加载全部那前端最新的 避免发生接口修改 数据库里的数据为旧的接口 导致请求失败
  // @ts-ignore
  let config = getAllComponentsObj()[data.type];
  if (config) {
    jsonItem.action = config.action;
  }
  // 结束
  // 文件上传不同项目地址区分 动态修改上传地址
  if (jsonItem.action && endsWith(jsonItem.action, "upload/")) {
    jsonItem.action += data.formKey;
  }
  // key 用来重新渲染组件
  jsonItem.key = data?.formItemId + new Date().getTime() + data.id;
  return jsonItem;
}

function isNumber(val: any) {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  }
  return false;
}

function isJSON(str: string) {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === "object" && obj) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(`error：${str}!!!${e}`);
      return false;
    }
  }
  return false;
}
