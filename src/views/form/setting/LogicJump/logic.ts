export function returnLogic(commitJumpLogicList: any[], data: any) {
  // 成立的跳转
  let tempJumpItem = null;
  for (const jumpItem of commitJumpLogicList) {
    let flag = false;
    for (const logicItem of jumpItem.logicList) {
      let relation = logicItem.relation || "AND";
      // 填写值
      let writeVal = data[logicItem.formItemId];
      // 目标值
      let targetVal = logicItem.optionValue;
      if (logicItem.type === "DATE" && logicItem.expression) {
        writeVal = new Date(data[logicItem.formItemId]).valueOf();
        targetVal = new Date(logicItem.optionValue).valueOf();
      }
      try {
        switch (logicItem.expression) {
          case "eq":
            flag = writeVal === targetVal;
            break;
          case "ne":
            flag = writeVal !== targetVal;
            break;
          case "ct":
            flag = writeVal.indexOf(targetVal) !== -1;
            break;
          case "nc":
            flag = writeVal.indexOf(targetVal) === -1;
            break;
          case "gt":
            flag = writeVal > targetVal;
            break;
          case "lt":
            flag = writeVal < targetVal;
            break;
          case "ge":
            flag = writeVal >= targetVal;
            break;
          case "le":
            flag = writeVal <= targetVal;
            break;
          case "null":
            flag = writeVal === undefined || writeVal === null || writeVal === "";
            break;
          case "notnull":
            flag = writeVal !== undefined && writeVal !== null && writeVal !== "";
        }
      } catch (e) {
        flag = false;
      }

      // 如果是AND 第一个 true 第二个还要 如果第一个false 就不用执行 a=1&b=2&&c=3
      // 如果是OR  第一个true 就不用执行 如果是false 继续执行 a=1||b=2||c=3
      if (relation === "AND") {
        // 说明不等于
        if (!flag) {
          break;
        }
      } else if (relation === "OR") {
        if (flag) {
          break;
        }
      }
    }
    // 如果内存循环成立
    if (flag) {
      tempJumpItem = jumpItem;
      break;
    }
  }
  // 是跳转还是显示文字
  return tempJumpItem ? tempJumpItem.promptJump : {};
}
