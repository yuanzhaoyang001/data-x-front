import { isArray } from "lodash-es";
import { removeHtmlTag } from "@/views/formgen/utils";
import { getCodeDesc } from "@/views/formgen/components/FormItem/ConfirmationCode/ConfirmationCode";
import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";
import { isObject } from "@vue/shared";

export function formatTableColumn(item) {
  // 如果是个json对象 格式化成json字符串
  if ("IMAGE_UPLOAD" === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: "150",
      slots: { default: "img_default" }
    };
  } else if ("UPLOAD" === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: "150",
      slots: { default: "file_default" }
    };
  } else if ("SIGN_PAD" === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: "150",
      slots: { default: "signpad_default" }
    };
  } else {
    return {
      field: item.value,
      title: item.label,
      minWidth: "150",
      slots: {
        default: ({ row }) => {
          return commonFormat(item.type, item.value, row[item.value], item);
        }
      }
    };
  }
}

let keyTypeMapping: {
  [key: string]: string;
} = {};

/**
 * 通用格式化方法 用于表单
 * @param type 类型
 * @param key 键
 * @param value 值
 * @param item 表单项
 */
export function commonFormat(type: string, key: string, value: any, item: any): string | null {
  // 不存在类型
  if (!type) {
    type = keyTypeMapping[key];
    if (!type) {
      // 正则移除js中的数字
      type = key.replace(/\d+/g, "").toUpperCase();
    }
  }
  if (value === null || value === undefined) {
    return "";
  } else if (isArray(value) && value.length == 0) {
    return "";
  } else if (isObject(value) && Object.keys(value).length === 0) {
    return "";
  }
  if (["SELECT", "RADIO", "CHECKBOX", "CASCADER", "IMAGE_SELECT"].includes(type)) {
    if (isArray(value)) {
      return value.join(",");
    } else {
      return value;
    }
  } else if ("PROVINCE_CITY" === type) {
    if (isArray(value)) {
      return value.join(",");
    } else {
      return value["cascadeValue"]?.join(" ") + " " + value["detailAddr"];
    }
  } else if ("MATRIX_INPUT" === type) {
    return formatMatrixInputData(value, item);
  } else if (["MATRIX_SELECT", "MATRIX_SCALE", "MATRIX_SLIDER"].includes(type)) {
    return formatMatrixSelectData(value, item);
  } else if (["TABLE_SELECT"].includes(type)) {
    return formatSelectTableData(value, item);
  } else if (["MATRIX_DROPDOWN"].includes(type)) {
    return formatMatrixDropdownData(value, item);
  } else if ("SUB_FORM" === type) {
    return formatSubFormData(value, item);
  } else if ("RESERVE_DAY" === type || "RESERVE_TIME_RANGE" === type) {
    return formatReserveDayData(value, item);
  } else if ("GOODS_SELECT" === type) {
    return formatGoodsData(value, item);
  } else if ("SORT" === type) {
    if (value) {
      let v = value.map(item => item.label).join(",");
      return v;
    }
  } else if (["DEPT_SELECT"].includes(type)) {
    if (value) {
      let v = value.map(item => item.name).join(",");
      return v;
    }
  } else if (["USER_SELECT"].includes(type)) {
    if (value) {
      let v = value.map(item => item.nickName).join(",");
      return v;
    }
  } else if (["CONFIRMATION_CODE"].includes(type)) {
    if (value) {
      return getCodeDesc(value);
    }
  } else if (["WX_USER"].includes(type)) {
    if (value && Object.keys(value).length) {
      return value["nickname"] || "";
    } else {
      return "";
    }
  } else if (["FACE_IDENTIFY"].includes(type)) {
    if (value) {
      return formatFaceIdentify(value);
    }
  } else {
    return value || "";
  }
}

/**
 * 人脸识别
 * @param value
 * @returns {string}
 */
export const formatFaceIdentify = value => {
  if (!value) {
    return "";
  }
  let result = value["result"] || {};
  let idcardConfirm = result["idcard_confirm"];
  if (idcardConfirm) {
    return idcardConfirm["name"] + " " + idcardConfirm["idcard_number"];
  }
  return "";
};

/**
 * 格式化表格单选
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatSelectTableData(value, item) {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let row = item.scheme.table.rows.find(row => row.id == key);
    if (row) {
      let rowText = "";
      let rowValue = value[key];
      Object.keys(rowValue).forEach(ckey => {
        rowText += `${rowValue[ckey]}，`;
      });
      text += ` ${row.label}：( ${rowText} )`;
    }
  });
  return text;
}

/**
 * 格式化预约时间
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatReserveDayData(value, item) {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let project = item.scheme.reserveProjectList.find(row => row.id == key);
    if (project) {
      text += `${project.name}：${value[key]} `;
    }
  });
  return text;
}

/**
 * 格式化商品购买
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatGoodsData(value, item) {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let project = item.scheme.goodsList.find(row => row.id == key);
    if (project) {
      text += `${project.goodsName}：${value[key]}个 `;
    }
  });
  return text;
}

/**
 * 格式化矩阵输入
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatMatrixInputData(value, item) {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let row = item.scheme.table.rows.find(row => row.id == key);
    if (row) {
      let rowText = "";
      let rowValue = value[key];
      Object.keys(rowValue).forEach(ckey => {
        let col = item.scheme.table.columns.find(col => col.id == ckey);
        if (col) {
          rowText += `${col.label}：${rowValue[ckey]}，`;
        }
      });
      text += ` ${row.label}：( ${rowText} )`;
    }
  });
  return text;
}

/**
 * 格式化矩阵选择
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatMatrixSelectData(value, item) {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let row = item.scheme.table.rows.find(row => row.id == key);
    if (row) {
      text += ` ${row.label}：( ${value[key]} )`;
    }
  });
  return text;
}

/**
 * 格式化矩阵选择
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatMatrixDropdownData(value, item) {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let row = item.scheme.table.rows.find(row => row.id == key);
    if (row) {
      let rowText = "";
      let rowValue = value[key];
      Object.keys(rowValue).forEach(ckey => {
        let col = item.scheme.table.columns.find(col => col.id == ckey);
        if (col) {
          rowText += `${col.label}：${rowValue[ckey]?.label}，`;
        }
      });
      text += ` ${row.label}：( ${rowText} )`;
    }
  });
  return text;
}

/**
 * 格式化自增表单
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatSubFormData(value: any, item: any) {
  if (!value) {
    return null;
  }
  // 维护标题id关系
  let keyLabelObj: any = {};
  let childList = item.scheme.childList;
  childList.forEach((c: any) => {
    keyLabelObj[c.vModel] = removeHtmlTag(c.config.label);
  });
  let subFormValue = value.map((subValue: any) => {
    let tempObj: any = {};
    Object.keys(subValue).forEach(sKey => {
      // 数字结尾的key不显示
      if (/^[a-zA-Z].*\d$/.test(sKey)) {
        if (isLabelTag(sKey)) {
          tempObj[keyLabelObj[sKey]] = subValue[sKey + "label"];
        } else {
          tempObj[keyLabelObj[sKey]] = subValue[sKey];
        }
      }
    });
    return tempObj;
  });
  return formatJsonData(subFormValue);
}

function formatJsonData(data: any[]) {
  return data
    .map((obj: any) => {
      return Object.keys(obj)
        .map(key => key + " : " + obj[key])
        .join(";");
    })
    .join(" | ");
}
