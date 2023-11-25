import { cloneDeep, isArray, isObject, keys, uniqBy } from "lodash-es";
import { removeHtmlTag } from "@/views/formgen/utils";
import { Ref, toValue } from "vue";
import { useFuncCalcHook } from "@/views/formgen/components/FormItem/TFunCalc/useFuncCalc";

// 触发规则 什么时候触发表单校验
interface RuleTriggerType {
  [key: string]: string;
}

const ruleTrigger: RuleTriggerType = {
  INPUT: "blur",
  RADIO: "blur",
  INPUT_MAP: "blur",
  SELECT: "blur",
  CHECKBOX: "blur",
  CASCADER: "blur",
  PROVINCE_CITY: "change",
  DATE: "blur",
  MATRIX_SELECT: "change",
  MATRIX_SCALE: "change",
  MATRIX_INPUT: "change",
  MATRIX_SLIDER: "change",
  PHONE_VERIFICATION: "change",
  RESERVE_TIME_RANGE: "change",
  RESERVE_DAY: "change",
  VALIDATE_CODE: "none",
  GOODS_SELECT: "none"
};

// 验证身份证格式
/**
 * 验证身份证号码
 * @param { String } code 身份证号码
 */
function identityIDCard(code: any): boolean {
  // 身份证号前两位代表区域
  const city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  const idCardReg = /^[1-9]\d{5}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i; // 身份证格式正则表达式
  let errorMessage = ""; // 错误提示信息
  let isPass = true; // 身份证验证是否通过（true通过、false未通过）

  // 如果身份证不满足格式正则表达式
  if (!code) {
    isPass = false;
  } else if (!code.match(idCardReg)) {
    isPass = false;
    // @ts-ignore
  } else if (!city[code.substr(0, 2)]) {
    // 区域数组中不包含需验证的身份证前两位
    isPass = false;
  } else if (code.length === 18) {
    // 18位身份证需要验证最后一位校验位
    code = code.split("");
    // ∑(ai×Wi)(mod 11)
    // 加权因子
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验位
    const parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    for (let i = 0; i < 17; i++) {
      ai = parseInt(code[i]);
      wi = factor[i];
      sum += ai * wi; // 开始计算并相加
    }
    const last = parity[sum % 11]; // 求余
    if (last.toString() !== code[17]) {
      isPass = false;
    }
  }
  return isPass;
}

// 处理RADIO CHECKBOX 其他输入必填校验
const validateOtherInput = (rule: any, value: any, callback: Function, formModel: any, cur: any) => {
  // 是否设置了必填
  if (false === cur.config.otherRequired) {
    callback();
  }
  // 单选
  if (cur.typeId === "RADIO") {
    if (!formModel[`${rule.field}label`]) {
      callback(new Error("请输入其他内容"));
    } else {
      callback();
    }
    // 多选
  } else {
    let flag = false;
    if (value && Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (!formModel[rule.field + "label"][i]) {
          flag = true;
        }
      }
    }
    if (flag) {
      callback(new Error("请输入其他内容"));
    } else {
      callback();
    }
  }
};

// 校验矩阵输入
const validateMatrixInput = (rule: any, value: any, callback: Function) => {
  let isValidate = true;
  if (value) {
    // 值为嵌套对象
    if (!isArray(value) && isObject(value)) {
      keys(value).forEach((key1: string) => {
        // 是不是对象{a:{b:2,c:3}}
        let value1 = value[key1];
        // 矩阵填空 不是数字并且是对象
        if (!isArray(value1) && isObject(value1)) {
          keys(value1).forEach((key2: string) => {
            let value2 = value1[key2];
            if (!value2) {
              isValidate = false;
              return;
            }
          });
        }
      });
    }
    if (!isValidate) {
      callback(new Error("请输入全部矩阵组件的值"));
    } else {
      callback();
    }
  }
};
/**
 * 矩阵选择校验
 */
const validateMatrixSelect = (rule: any, value: any, callback: Function, item: any) => {
  if (item.table.rows.length !== keys(value).length) {
    callback(new Error("请选择全部矩阵组件的值"));
  } else {
    callback();
  }
};
/**
 * 矩阵量表校验
 */
const validateMatrixScale = (rule: any, value: any, callback: Function, item: any) => {
  if (item.table.rows.length > keys(value).length) {
    callback(new Error("请选择全部矩阵组件的值"));
  } else {
    item.table.rows.forEach((row: any) => {
      if (!value[row.id]) {
        callback(new Error("请选择全部矩阵组件的值"));
        return;
      }
    });
    callback();
  }
};

// 矩阵滑块
const validateMatrixSlider = (rule: any, value: any, callback: Function, item: any) => {
  if (item.table.rows.length > keys(value).length) {
    callback(new Error("请选择全部矩阵组件的值"));
  } else {
    item.table.rows.forEach((row: any) => {
      if (value[row.id] === undefined || value[row.id] == null) {
        callback(new Error("请选择全部矩阵组件的值"));
      }
    });
    callback();
  }
};

// 矩阵下拉
const validateMatrixDropdown = (rule: any, value: any, callback: Function, item: any) => {
  // 转换下值 为了防止value是引用类型
  value = JSON.parse(JSON.stringify(value));
  if (value) {
    if (item.table.rows.length > keys(value).length) {
      callback(new Error("请选择全部矩阵组件的值"));
    }
    let flag = true;
    keys(value).forEach((key: string) => {
      let rowValue = value[key];
      if (item.table.columns.length > keys(rowValue).length) {
        flag = false;
        callback(new Error("请选择全部矩阵组件的值"));
      }
    });
    if (flag) {
      callback();
    } else {
      callback(new Error("请选择全部矩阵组件的值"));
    }
  } else {
    callback(new Error("请输入全部矩阵组件的值"));
  }
};

const validateGoodsSelect = (rule: any, value: any, callback: Function, item: any) => {
  if (value && Object.keys(value).length !== 0) {
    // value 是一个对象 key为选择商品的Id value为选择的数量 {'goodId001':2}
    let total = 0;
    for (let key of Object.keys(value)) {
      total += value[key];
    }
    if (!total) {
      callback(new Error("最少选择一件商品"));
    }
  }
  callback();
};

export function useFormValidateRule() {
  /**
   * 构建校验规则
   * @param cur
   * @param rules 规则引用对象
   * @param formModel ref对象
   */
  const buildRule = (cur: any, rules: Ref<any>, formModel: any) => {
    // 构建了规则不在走
    if (rules.value[cur.vModel]) {
      return;
    }
    const config = cloneDeep(cur.config);
    // 单选 多选 其它输入框校验
    try {
      handleOtherInput(cur, config, formModel);
    } catch (e) {}
    // 输入框校验
    handleInputValidate(cur, config);
    if (config.required) {
      // 矩阵系列组件 必填特殊处理 需要校验每项都有值
      handleSpecialRequired(cur, config);
      const required = {
        required: config.required,
        message: cur.placeholder
      };
      const label = removeHtmlTag(config.label);
      if (Array.isArray(config.defaultValue)) {
        //@ts-ignore
        required.type = "array";
        required.message = `请至少选择一个${label}`;
      }
      required.message === undefined && (required.message = `${label}不能为空`);
      if (config.regList != undefined) {
        config.regList.push(required);
      }
    }
    //自定义正则
    if (Array.isArray(config.regList)) {
      const regList = uniqBy(config.regList, JSON.stringify);
      rules.value[cur.vModel] = regList.map((item: any) => {
        item.pattern && (item.pattern = eval(item.pattern));
        item.trigger = ruleTrigger && ruleTrigger[cur.typeId];
        return item;
      });
    }
    // 自定义公式
    if (Array.isArray(config.formulaValidate)) {
      const formulaList = uniqBy(config.formulaValidate, JSON.stringify);
      const formulaRuleList = formulaList.map((item: any) => {
        item.validator = (rule: any, value: any, callback: Function) =>
          handleCustomFormula(formModel, item.formula, item.message, callback);
        item.trigger = ruleTrigger && ruleTrigger[cur.typeId];
        return item;
      });
      if (rules.value[cur.vModel] != undefined) {
        rules.value[cur.vModel].push(...formulaRuleList);
      }
    }
  };

  const { evalFormula } = useFuncCalcHook();

  const handleCustomFormula = (formModel: any, formula: string, errMsg: string, callback: Function) => {
    const modelVal = toValue(formModel);
    if (!formula) {
      callback();
      return;
    }
    if (!modelVal) {
      callback();
      return;
    }
    const result = evalFormula(modelVal, formula);

    if (!result) {
      callback(new Error(errMsg));
    } else {
      callback();
    }
  };

  const handleSpecialRequired = (cur: any, config: any) => {
    let validator = null;
    switch (cur.typeId) {
      case "MATRIX_INPUT":
        validator = validateMatrixInput;
        break;
      case "MATRIX_SELECT":
        validator = (rule: any, value: any, callback: Function) => validateMatrixSelect(rule, value, callback, cur);
        break;
      case "TABLE_SELECT":
        validator = (rule: any, value: any, callback: Function) => validateMatrixDropdown(rule, value, callback, cur);
        break;
      case "MATRIX_SCALE":
        validator = (rule: any, value: any, callback: Function) => validateMatrixScale(rule, value, callback, cur);
        break;
      case "MATRIX_SLIDER":
        validator = (rule: any, value: any, callback: Function) => validateMatrixSlider(rule, value, callback, cur);
        break;
      case "MATRIX_DROPDOWN":
        validator = (rule: any, value: any, callback: Function) => validateMatrixDropdown(rule, value, callback, cur);
        break;
      case "RATE":
        validator = (rule: any, value: any, callback: Function) => {
          if (!value || value === 0) {
            callback(new Error(cur.placeholder));
          } else {
            callback();
          }
        };
        break;
      case "CHECKBOX":
        validator = (rule: any, value: any, callback: Function) => {
          if (cur.min && value.length < cur.min) {
            return callback(new Error(`最少选择${cur.min}项`));
          }
          if (cur.max && value.length > cur.max) {
            return callback(new Error(`最多选择${cur.max}项`));
          }
          callback();
        };
        break;
      case "RESERVE_TIME_RANGE":
      case "RESERVE_DAY":
        validator = (rule: any, value: any, callback: Function) => {
          console.log({ ...value });
          if (!value || !Object.keys({ ...value }).length) {
            return callback(new Error(`请选择`));
          }
          callback();
        };
        break;
      case "PROVINCE_CITY":
        validator = (rule: any, value: any, callback: Function) => {
          if (Array.isArray(value) && value.length < 2) {
            return callback(new Error(`${cur.placeholder}`));
          }
          callback();
        };
        break;
      case "GOODS_SELECT":
        validator = (rule: any, value: any, callback: Function) => validateGoodsSelect(rule, value, callback, cur);
        break;
      default:
    }
    if (validator) {
      config.regList.push({ validator });
    }
  };

  const handleOtherInput = (cur: any, config: any, formModel: any) => {
    if (["RADIO", "CHECKBOX"].includes(cur.typeId)) {
      let flag = cur.config.options?.findIndex((o: any) => o.type === "input") > -1 && config.required;
      const required = {
        validator: (rule: any, value: any, callback: Function) => {
          validateOtherInput(rule, value, callback, formModel.value, cur);
        },
        message: cur.placeholder
      };
      if (flag) {
        config.regList.push(required);
      }
    }
  };

  const handleInputValidate = (cur: any, config: any) => {
    if (["INPUT"].includes(cur.typeId) && cur.config.dataType) {
      const rule = cur.config.dataType;
      if (rule.type === "phone") {
        config.regList.push({
          type: null,
          pattern: /^1[3456789]\d{9}$/,
          message: rule.message
        });
      } else if (rule.type === "identity") {
        config.regList.push({
          validator: (rule: any, value: any, callback: Function) => {
            if (value && !identityIDCard(value)) {
              callback(new Error("请输入正确身份证"));
            }
            callback();
          },
          message: rule.message
        });
      } else if (rule.type) {
        config.regList.push(rule);
      }
    }
  };
  return { handleInputValidate, handleOtherInput, handleSpecialRequired, buildRule };
}
