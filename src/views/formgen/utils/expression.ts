import _ from "lodash-es";

/**
 * 自定义表达式
 */
const expressionOperator: any = {
  eq(v1: any, v2: any) {
    if (!v1) {
      return false;
    }
    // 当type=CHECK_BOX时此处应为包含关系 == 不管类型是否一致
    return Array.isArray(v1) ? v1.includes(+v2) : v1 == +v2;
  },
  ne(v1: any, v2: any) {
    // if (!Number(v1)) {
    //   return false
    // }
    return Array.isArray(v1) ? !v1.includes(+v2) : v1 != +v2;
  },
  gt(v1: any, v2: any) {
    // 是否是数字
    if (!Number(v1) || !Number(v2)) {
      return false;
    }
    return v1 > v2;
  },
  ge(v1: any, v2: any) {
    // 是否是数字
    if (!Number(v1) || !Number(v2)) {
      return false;
    }
    return v1 >= v2;
  },
  lt(v1: any, v2: any) {
    // 是否是数字
    if (!Number(v1) || !Number(v2)) {
      return false;
    }
    return v1 < v2;
  },
  le(v1: any, v2: any) {
    // 是否是数字
    if (!Number(v1) || !Number(v2)) {
      return false;
    }
    return v1 <= v2;
  },
  like(v1: any, v2: any) {
    if (!v1) {
      return false;
    }
    return v1.indexOf(v2) > -1;
  },
  notLike(v1: any, v2: any) {
    if (!v1) {
      return false;
    }
    return v1.indexOf(v2) == -1;
  },
  isNull(v1: any) {
    let flag = v1 === null || v1 === undefined;
    if (flag) {
      return true;
    }
    // 判断是不是数组
    flag = Array.isArray(v1) ? v1.length === 0 : false;
    if (flag) {
      return true;
    }
    // 是不是对象
    flag = _.isObject(v1) ? _.isEmpty(v1) : false;
    // 是不是 string
    flag = _.isString(v1) ? v1.length === 0 : false;
    return flag;
  },
  notNull(v1: any) {
    return !expressionOperator.isNull(v1);
  }
};

/**
 * 逻辑连接符
 *  符号前面留空格 避免拼接时错误
 * @type {{'1': string, '2': string}}
 */
const LogicConnector: any = {
  AND: " and ",
  OR: " or "
};

/**
 * 获取表达式
 *  @conditionList 条件列表
 *  @connector 连接符 ||或者 &&
 */
export function getExpression(conditionList: any[], connector: string) {
  const exList = conditionList
    .filter(item => Object.keys(item).length !== 0)
    .map(item => `${item.formItemId} ${item.expression} ${item.optionValue}  `);
  return _.join(exList, LogicConnector[connector]);
}

/**
 * 执行表达式是否成立
 */
export function evalExpression(context: any, expression: string) {
  const exArray = expression.split(/and|or/);
  // 获取是& 还是|
  const and = expression.indexOf("and") > -1;
  let flag = false;
  // console.log(exArray)
  for (let i = 0; i < exArray.length; i++) {
    const itemExpArr = exArray[i].trim().split(" ");
    // console.log(itemExpArr)
    // 截取字段名
    const varName = itemExpArr[0];
    // 条件 等于 不等于
    const sp = itemExpArr[1].trim();
    if (!sp || sp === "null") {
      continue;
    }
    // 值
    const value = itemExpArr[2];
    // 比较是否成立
    // console.log(varName)
    const fieldValue = _.get(context, varName);
    // console.log(fieldValue)
    flag = expressionOperator[sp](fieldValue, value);
    // console.log(flag)
    // & 一个不成立直接调出循环 返回失败
    if (and && !flag) {
      break;
      // | 一个成立直接调出循环 返回成功
    } else if (!and && flag) {
      break;
    }
  }
  return flag;
}
