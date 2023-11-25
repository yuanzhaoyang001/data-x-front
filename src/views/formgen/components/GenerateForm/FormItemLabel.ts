import { startsWith } from "lodash-es";

/**
 * 是否是具有label值得组件
 */
export function isLabelTag(key: string) {
  if (
    startsWith(key, "radio") ||
    startsWith(key, "checkbox") ||
    startsWith(key, "select") ||
    startsWith(key, "image_select") ||
    startsWith(key, "cascader")
  ) {
    return true;
  }
  return false;
}

export function handleChangeLabel(models: any, item: any, value: any) {
  const key = item.vModel;
  if (isLabelTag(key)) {
    models[`${key}label`] = getCheckedLabel(value, item.config.options, item, models);
  }
}

// 获取选中的值label
export function getCheckedLabel(val: any, options: any, item: any, formModel: any) {
  if (options) {
    // 结果是数据 checkbox 级联等
    if (Array.isArray(val)) {
      const labelArr: string[] = [];
      val.forEach(v => {
        // 非input类型的checkbox
        const obj: any = getObject(options, "value", v);
        labelArr.push(obj ? obj.label : "");
      });
      return labelArr;
    }
    const obj: any = getObject(options, "value", val);
    return obj ? obj.label : "";
  }
  return "";
}

/**
 * 从数组递归查找符合条件的数据
 * @param array
 * @param key
 * @param value
 * @returns {*}
 */
function getObject(array: any[], key: string, value: any) {
  let o;
  array.some(function iter(a) {
    if (a[key] === value) {
      o = a;
      return true;
    }
    return Array.isArray(a.children) && a.children.some(iter);
  });
  return o;
}

/**
 * 级联数据递归查找
 */
export function findLabelsByIds(options: any[], ids: any[]) {
  let labelArr: any[] = [];
  ids.forEach(id => {
    const obj: any = getObject(options, "value", id);
    labelArr.push(obj ? obj.label : "");
  });
  return labelArr;
}
