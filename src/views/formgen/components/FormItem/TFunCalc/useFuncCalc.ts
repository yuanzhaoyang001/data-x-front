import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";

import * as formulaLib from "@formulajs/formulajs";

export function useFuncCalcHook() {
  /**
   * 执行公式
   */
  const evalFormula = (modelVal: any, formula: string) => {
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
    console.log(SUM(1, 2));
    try {
      if (!formula) {
        return;
      }
      if (!modelVal) {
        return;
      }
      let flag = false;
      Object.keys(modelVal).forEach(key => {
        if (formula.indexOf(`#{${key}}`) !== -1) {
          flag = true;
          // 处理数据格式
          formula = formula.replaceAll(`#{${key}}`, handleValue(key, modelVal[key], modelVal));
        }
      });
      if (!flag) return;
      console.log(formula);
      let evalVal = eval(formula);
      return evalVal;
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  const handleValue = (key: string, val: any, modelVal: any) => {
    if (key.startsWith("number")) {
      return val;
    } else if (key.endsWith("score")) {
      return val;
    } else if (isLabelTag(key)) {
      return `'${modelVal[`${key}label`]}'`;
    } else {
      return `'${val}'`;
    }
  };

  return {
    evalFormula
  };
}
