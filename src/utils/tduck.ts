import { MessageUtil } from "@/utils/messageUtil";
import type { FormInstance } from "element-plus";
import { Ref } from "vue";

// 日期格式化
export function parseTime(time: any, pattern?: string): any {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

// 表单重置
export function resetForm(refName: string): void {
  // @ts-ignore
  if (this.$refs[refName]) {
    // @ts-ignore
    this.$refs[refName].resetFields();
  }
}

/**
 * 表单重置
 * @param formEl
 */
export const resetFormRef = (formEl: Ref<FormInstance> | undefined) => {
  if (!formEl) return;
  formEl.value.resetFields();
};

// 添加日期范围
export function addDateRange(params: any, dateRange: any[], propName?: string): any {
  let search = params;
  if (!search.params) {
    search.params = {};
  }
  if (dateRange != null) {
    if (typeof propName === "undefined") {
      search.params["beginTime"] = dateRange[0];
      search.params["endTime"] = dateRange[1];
    } else {
      search.params["begin" + propName] = dateRange[0];
      search.params["end" + propName] = dateRange[1];
    }
  } else if (Object.keys(search.params)) {
    if (typeof propName === "undefined") {
      delete search.params["beginTime"];
      delete search.params["endTime"];
    } else {
      delete search.params["begin" + propName];
      delete search.params["end" + propName];
    }
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas: any, value: string): string {
  let actions: string[] = [];
  Object.keys(datas).some(key => {
    if (datas[key].dictValue === "" + value) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  });
  return actions.join("");
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas: any, value: string, separator?: string): string {
  let actions: string[] = [];
  let currentSeparator = separator === undefined ? "," : separator;
  let temp: any = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some(val => {
    Object.keys(datas).some(key => {
      if (datas[key].dictValue === "" + temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    });
  });
  return actions.join("").substring(0, actions.join("").length - 1);
}

// 通用下载方法
export function download(data: any, fileName: string, type: string = ".xlsx"): void {
  if (!data) {
    MessageUtil.warning("文件下载失败");
    return;
  }
  // @ts-ignore
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // @ts-ignore
    window.navigator.msSaveBlob(
      new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      fileName + type
    );
  } else {
    let url = window.URL.createObjectURL(
      new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    );
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", fileName + type);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 下载完成移除元素
    window.URL.revokeObjectURL(url); // 释放掉blob对象
  }
}

// 字符串格式化(%s )
export function sprintf(str: string, ...args: any[]): string {
  let flag = true,
    i = 0;
  str = str.replace(/%s/g, function () {
    let arg = args[i++];
    if (typeof arg === "undefined") {
      flag = false;
      return "";
    }
    return arg;
  });
  return flag ? str : "";
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str: any): string {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data: any[], id?: string, parentId?: string, children?: string): any[] {
  let config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children"
  };

  let childrenListMap: { [key: string]: any[] } = {};
  let nodeIds: { [key: string]: any } = {};
  let tree: any[] = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  return tree;
}
