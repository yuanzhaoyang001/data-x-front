import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";

import * as formulaLib from "@formulajs/formulajs";

export function useFuncCalcHook() {
  /**
   * 执行公式
   */
  const evalFormula = (modelVal: any, formula: string, isSubForm: boolean) => {
    // 动态使用的方法，需要在这里声明 不要移除了！！！
    const {
      // 数学函数
      SUM,
      AVERAGE,
      ABS,
      COUNT,
      COUNTIF,
      CEILING,
      FLOOR,
      MAX,
      MIN,
      INT,
      LOG,
      MOD,
      RAND,
      POWER,
      PRODUCT,
      LARGE,
      ROUND,
      SMALL,
      SQRT,
      SUMPRODUCT,
      // 文字函数
      CONCATENATE,
      CHAR,
      EXACT,
      LEFT,
      LEN,
      LOWER,
      MID,
      REPLACE,
      REPT,
      RIGHT,
      SEARCH,
      TRIM,
      UPPER,
      VALUE,
      // 日期函数
      DATE,
      DATEDIF,
      DAY,
      DAYS,
      DAYS360,
      HOUR,
      ISOWEEKNUM,
      MINUTE,
      MONTH,
      NETWORKDAYS,
      NOW,
      SECOND,
      TIME,
      TODAY,
      WEEKNUM,
      WORKDAY,
      YEAR,
      //  逻辑函数
      AND,
      FALSE,
      IF,
      IFS,
      NOT,
      OR,
      TRUE,
      XOR
    } = formulaLib;
    // 不能删 删了formulaLib导入的没使用 打包被移除了
    console.log(SUM(1, 2));
    try {
      if (!formula) {
        return;
      }
      if (!modelVal) {
        return;
      }
      let flag = false;
      // 寻找表达式的变量
      let modifiedFormula = formula.replace(/#{([^}]+)}/g, (match, p1) => {
        const value = handleValue(p1, modelVal[p1], modelVal, isSubForm);
        if (value) {
          flag = true;
          return value;
        }
        return match; // 如果找不到对应的数据，则保持原样
      });

      // Object.keys(modelVal).forEach(key => {
      //   // 不要后边的} 兼容子表单
      //   if (formula.indexOf(`#{${key}`) !== -1) {
      //     flag = true;
      //     // 处理数据格式
      //     formula = formula.replaceAll(`#{${key}}`, handleValue(key, modelVal[key], modelVal));
      //   }
      // });
      if (!flag) return;
      console.log(modifiedFormula);
      return eval(modifiedFormula);
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  const handleValue = (key: string, val: any, modelVal: any, isSubForm: boolean) => {
    if (key.startsWith("number")) {
      return val;
    } else if (key.endsWith("score")) {
      return val;
    } else if (key.startsWith("sub_form")) {
      return handleSubFormVal(key, val, modelVal, isSubForm);
    } else if (isLabelTag(key)) {
      return `'${modelVal[`${key}label`]}'`;
    } else {
      return `'${val}'`;
    }
  };

  const handleSubFormVal = (key: string, val: any, modelVal: any, isSubForm: boolean) => {
    // 截取子表单具体值
    const keys = key.split(",");
    const valueKey = keys[0];
    const subValueKey = keys[1];
    if (isSubForm) {
      return modelVal[subValueKey];
    } else {
      // 找到子表单的值
      const subFormVal = modelVal[valueKey];
      let sumVal: any = null;
      // 累加子表单数组每项的值
      if (subFormVal && subFormVal.length > 0) {
        subFormVal.forEach((item: any) => {
          if (!sumVal) {
            sumVal = item[subValueKey];
          } else {
            sumVal += item[subValueKey];
          }
        });
      }
      return sumVal;
    }
  };

  return {
    evalFormula
  };
}
