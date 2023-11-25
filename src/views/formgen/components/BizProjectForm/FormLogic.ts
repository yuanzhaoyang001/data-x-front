// 表单逻辑
import { evalExpression, getExpression } from "../../utils/expression";
import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";
import _ from "lodash-es";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";

// 逻辑触发规则保存 key为条件字段ID value为触发规则表达式 监听key的字段值发生变化时 进行逻辑判断 成立则吧对应的字段显示
let logicTriggerRules: any = {};

// 默认要满足条件才显示的字段
let hiddenFormItemIds = new Map();

/**
 * 解析表单逻辑
 * @param data
 */
export function parserFormLogic(data: { formLogic: { scheme: any[] } }) {
  logicTriggerRules = {};
  hiddenFormItemIds = new Map();
  let logicItemList = data.formLogic ? data.formLogic.scheme : [];
  logicItemList.forEach((item: any) => {
    logicShowTriggerHandle(item);
  });
  return { logicTriggerRules, hiddenFormItemIds };
}

/**
 * 处理逻辑显示数据
 */
function logicShowTriggerHandle(logicItem: any) {
  if (!logicItem) {
    return;
  }
  // 建立触发关系 该字段值发生变化时 哪些问题需要进行逻辑判断 确定是否显示
  logicItem.triggerList?.forEach((trigger: any) => {
    if (!trigger.type || trigger.type === "show") {
      hiddenFormItemIds.set(trigger.formItemId, trigger);
    }
    logicItem.conditionList.forEach((item: any) => {
      if (Object.keys(item).length === 0) {
        return;
      }
      let rules = logicTriggerRules[item.formItemId];
      if (!rules) {
        rules = [];
      }
      let condition = logicItem.conditionList[1];
      rules.push({
        type: trigger.type, // 触发类型
        // 被触发显示的字段的ID
        triggerFormItemId: trigger.formItemId, //  显示逻辑表达式
        // 第二个条件
        logicExpression: getExpression(logicItem.conditionList, condition ? condition.relation : "AND")
      });
      logicTriggerRules[item.formItemId] = rules;
    });
  });
}

/**
 * 获取满足条件的表单数据
 * logicTriggerRules 对象 {}
 * {
 *   "radio1677384789963": [
 *     {
 *         "triggerFormItemId": "goods_select1677384984064", // 触发显示的字段ID
 *         "logicExpression": "radio1677384789963 eq 1  " // 逻辑表达式
 *     },
 *     {
 *         "triggerFormItemId": "goods_select1677384986954",
 *         "logicExpression": "radio1677384789963 eq 2  "
 *     }
 * ]
 * }
 */
export function getFormLogicData(formData: any, logicTriggerRules: any) {
  //记录满足需要删除的字段 统一删除 避免逻辑设置1把它删除了 逻辑设置2又把它加回来
  let deleteList: any[] = [];
  // 触发显示的字段ID
  let triggerFormItemIds: any[] = [];
  Object.keys(logicTriggerRules).forEach(key => {
    const rules = logicTriggerRules[key];
    if (rules && Array.isArray(rules)) {
      for (let rule of rules) {
        const flag = evalExpression(formData, rule.logicExpression);
        if (!flag) {
          deleteList.push(rule.triggerFormItemId);
        } else {
          triggerFormItemIds.push(rule.triggerFormItemId);
        }
      }
    }
  });
  // 找到deleteList中不在triggerFormItemIds中的字段
  const difference = _.difference(deleteList, triggerFormItemIds);
  // 删除满足条件的字段
  difference.forEach((id: string) => {
    delete formData[id];
    if (isLabelTag(id)) {
      delete formData[id + "label"];
    }
  });
  return formData;
}

/**
 * logicTriggerRules 格式
 * {
 *     "radio1700191251602": [
 *         {
 *             "type": "show",
 *             "triggerFormItemId": "input1700191258509",
 *             "logicExpression": "radio1700191251602 eq 1  "
 *         },
 *         {
 *             "type": "jump",
 *             "triggerFormItemId": "input1700191264248",
 *             "logicExpression": "radio1700191251602 eq 2  "
 *         },
 *         {
 *             "type": "finish",
 *             "triggerFormItemId": null,
 *             "logicExpression": "radio1700191251602 eq 3  "
 *         }
 *     ]
 * }
 * 获取需要隐藏的字段Id列表
 * 根据数据进行逻辑判断
 * @param formData 表单数据
 * @param logicData 逻辑触发规则
 * @param allFields 全部字段
 */
export function getHiddenFormItemIds(formData: any, logicData: { scheme: any[] }, allFields: BasicComponent[]) {
  if (!logicData) {
    return;
  }
  const { logicTriggerRules, hiddenFormItemIds } = parserFormLogic({
    formLogic: logicData
  });
  let allHiddenFormItemIds: string[] = [...hiddenFormItemIds.keys()];
  Object.keys(logicTriggerRules).forEach(key => {
    const rules = logicTriggerRules[key];
    if (rules && Array.isArray(rules)) {
      for (let rule of rules) {
        const flag = evalExpression(formData, rule.logicExpression);
        if (rule.type === "show") {
          if (flag) {
            allHiddenFormItemIds.splice(allHiddenFormItemIds.indexOf(rule.triggerFormItemId), 1);
          } else {
            allHiddenFormItemIds.push(rule.triggerFormItemId);
          }
        } else if (rule.type === "jump") {
          if (flag) {
            // 跳转到指定字段
            // 找到当前这个字段
            const index = allFields.findIndex(item => item.vModel === key);
            const targetIndex = allFields.findIndex(item => item.vModel === rule.triggerFormItemId);
            if (index !== -1) {
              // 把从这个下标之后的字段全部添加到 allHiddenFormItemIds
              for (let i = index + 1; i < targetIndex; i++) {
                allHiddenFormItemIds.push(allFields[i].vModel);
              }
              break;
            }
          }
        } else if (rule.type === "finish") {
          if (flag) {
            // 找到当前这个字段
            const index = allFields.findIndex(item => item.vModel === key);
            if (index !== -1) {
              // 把从这个下标之后的字段全部添加到 allHiddenFormItemIds
              for (let i = index + 1; i < allFields.length; i++) {
                allHiddenFormItemIds.push(allFields[i].vModel);
              }
              break;
            }
          }
        }
      }
    }
  });
  return allHiddenFormItemIds;
}
