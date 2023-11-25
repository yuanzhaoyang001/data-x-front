import { get, remove } from "lodash-es";
import type { Ref } from "vue";
import { toValue } from "vue";
import { storeToRefs } from "pinia";
import { useUserForm } from "@/stores/userForm";
import { evalExpression } from "@/views/formgen/utils/expression";
import { useFormValidateRule } from "./useFormValidateRule";
import { FormConfigType, FormModelType } from "../types/form";
import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";

/**
 * 字段逻辑上下文 避免上一个逻辑显示的字段被下一个逻辑隐藏 上一个隐藏的被下一个显示 逻辑混乱
 * @type {{}}
 * {
 *   "组件id":{
 *      "show":[id列表],
 *      "hidden":[id列表]
 *   }
 * }
 */

interface FieldLogicContext {
  [fieldId: string]: {
    show: string[];
    hidden: string[];
  };
}

interface FieldIdIndex {
  [fieldId: string]: number;
}

const fieldLogicContext: FieldLogicContext = {};

/**
 *  表单逻辑
 * @param formConfCopy 表单配置Ref
 * @param formModel 表单数据Ref
 * @param formRules 表单校验规则 reactive
 * @param buildRule 构建校验规则方法
 */
export function useFormLogic(
  formConfCopy: Ref<FormConfigType>,
  formModel: Ref<FormModelType>,
  formRules: Ref<any>,
  buildRule: Function
) {
  const userFormStore = useUserForm();

  const { hiddenFormItemIds, allFields, fieldIdIndex } = storeToRefs(userFormStore);

  /**
   * 据变更时 处理逻辑显示相关数据
   * @param value 变更后的值
   * @param field 字段的Id
   * @param item 字段的配置
   */
  const logicShowHandle = (value: any, field: string, item: any): void => {
    const { logicShowRules } = formConfCopy.value;
    if (!logicShowRules) {
      return;
    }
    const rules = get(logicShowRules, field);
    if (rules && Array.isArray(rules)) {
      for (const r of rules) {
        if (!fieldLogicContext[field]) {
          fieldLogicContext[field] = { show: [], hidden: [] };
        }
        const flag = evalExpression(formModel.value, r.logicExpression);
        if (r.type === "show") {
          logicShowTriggerHandle(value, field, r, flag);
        } else if (r.type === "jump") {
          logicJumpHandle(value, field, r, flag);
          if (flag) {
            break;
          }
        } else if (r.type === "finish") {
          logicFinishHandle(value, field, r, flag);
          if (flag) {
            break;
          }
        } else {
          logicShowTriggerHandle(value, field, r, flag);
        }
      }
    }
    fieldLogicContext[field] = { show: [], hidden: [] };
  };

  /**
   * 逻辑跳转的操作
   * @param field 字段的Id
   * @param r 规则
   * @param flag 是否显示
   */
  const logicJumpHandle = (val: any, field: string, r: any, flag: boolean) => {
    // 找到当前问题的下标 以及需要跳转的问题的下标
    let currentFieldIndex = fieldIdIndex.value[field];
    // 目标字段的下标
    let targetFieldIndex = fieldIdIndex.value[r.triggerFormItemId];
    // 把中间的问题全部找出来记录下来
    let middleFields: any[] = [];
    if (currentFieldIndex < targetFieldIndex) {
      middleFields = allFields.value.slice(currentFieldIndex + 1, targetFieldIndex);
    }
    if (flag) {
      // 目标那个问题没被隐藏吧 如果目标问题也被隐藏了 那么要把他移除隐藏
      if (hiddenFormItemIds.value.includes(r.triggerFormItemId)) {
        remove(hiddenFormItemIds.value, (n: any) => n === r.triggerFormItemId);
      }
      // 是否有 分页 不能把分页也隐藏了
      remove(middleFields, (n: any) => n.vModel && n.vModel.indexOf("pagination") > -1);
      hiddenField(field, middleFields, r);
    } else {
      // 恢复隐藏的问题
      recoverHiddenField(field, middleFields, r);
    }
  };

  /**
   * 直接结束的操作
   * @param field 字段的Id
   * @param r 规则
   * @param flag 是否显示
   */
  const logicFinishHandle = (val: any, field: string, r: any, flag: boolean) => {
    // 找到当前问题的下标 以及需要跳转的问题的下标
    let currentFieldIndex = fieldIdIndex.value[field];
    // 把中间的问题全部找出来记录下来
    let middleFields = allFields.value.slice(currentFieldIndex + 1, allFields.value.length);
    if (flag) {
      hiddenField(field, middleFields, r);
      formConfCopy.value.formBtns = true;
    } else {
      recoverHiddenField(field, middleFields, r);
    }
  };

  /**
   * 把字段隐藏
   */
  const hiddenField = (field: any, middleFields: any[], r: any) => {
    let idList = middleFields.map(f => f.vModel);
    hiddenFormItemIds.value.push(...idList);
    // 移除中间的组件校验等
    idList.forEach(v => {
      let triggerFormItem = allFields.value[fieldIdIndex.value[v]];
      if (triggerFormItem) {
        removeRule(triggerFormItem);
      }
      formModel.value[v] = toValue(triggerFormItem.config.defaultValue);
    });
  };

  /**
   * 恢复隐藏的问题
   * @param field 字段的Id
   * @param middleFields 待处理字段
   * @param r 规则
   */
  const recoverHiddenField = (field: any, middleFields: any[], r: any) => {
    // 需要操作的字段id
    const tempIdList = middleFields.map((f: any) => f.vModel);
    // 找出不在隐藏上下文的字段
    const idList = tempIdList.filter(v => !fieldLogicContext[field]["hidden"] || !fieldLogicContext[field]["hidden"].includes(v));
    // 移除隐藏列表
    remove(hiddenFormItemIds.value, (n: any) => idList.includes(n));
    // 把移除的组件重新加入到表单中 并且重新渲染
    idList.forEach(v => {
      // 拿到组件
      let triggerFormItem = allFields.value[fieldIdIndex.value[v]];
      // 重新渲染组件 不然必填红点不显示
      if (triggerFormItem) {
        buildRule(triggerFormItem, formRules, formModel);
        // 设置默认值 如果有值的话使用值 没有的话默认值填充
        formModel.value[v] = toValue(formModel.value[v] || triggerFormItem.config.defaultValue);
        // 重新渲染组件 不然必填红点不显示 不在index里面判断 分页的某些情况下不在隐藏列表 plus不需要了
        // let index = formConfCopy.value.fields.findIndex(item => item.vModel === v);
        // if (index > -1) {
        // 	// formConfCopy.value.fields[index].key = new Date().getTime() + "";
        // }
      }
    });
  };

  /**
   * 逻辑显示的操作
   * @param field 字段的Id
   * @param r 规则
   * @param flag 是否显示
   */
  const logicShowTriggerHandle = (value: any, field: any, r: any, flag: boolean) => {
    if (flag) {
      // 显示加上值必填等校验
      let triggerFormItem = allFields.value[fieldIdIndex.value[r.triggerFormItemId]];
      // 从隐藏列表中移除
      let index = hiddenFormItemIds.value.indexOf(r.triggerFormItemId);
      if (index > -1) {
        hiddenFormItemIds.value.splice(index, 1);
        // 重新渲染组件 不然必填红点不显示 不在index里面判断 分页的某些情况下不在隐藏列表
        if (triggerFormItem) {
          // 设置默认值 如果有值的话使用值 没有的话默认值填充
          formModel.value[r.triggerFormItemId] = toValue(
            formModel.value[r.triggerFormItemId] || triggerFormItem.config.defaultValue
          );
          buildRule(triggerFormItem, formRules, formModel);
          // let index = formConfCopy.value.fields.findIndex(item => item.vModel === r.triggerFormItemId);
          // if (index > -1) {
          // 	formConfCopy.value.fields[index].key = new Date().getTime() + "";
          // }
        }
      }
      // 需要记录操作 避免从显示到现实的情况 显示到显示hiddenFormItemIds index 会=-1
      recordHandle(field, value, null, [r.triggerFormItemId]);
    } else {
      let index = hiddenFormItemIds.value.indexOf(r.triggerFormItemId);
      // 存在隐藏列表并且没有没有在上个逻辑触发显示
      let isNoShow = !fieldLogicContext[field]["show"] || !fieldLogicContext[field]["show"].includes(r.triggerFormItemId);
      if (index !== undefined && index < 0 && isNoShow) {
        // 移除表单的必填校验
        let triggerFormItem = allFields.value[fieldIdIndex.value[r.triggerFormItemId]];
        if (triggerFormItem) {
          removeRule(triggerFormItem);
        }
        // 填充默认值
        formModel.value[r.triggerFormItemId] = toValue(triggerFormItem.config.defaultValue);
        if (isLabelTag(r.triggerFormItemId)) {
          formModel.value[r.triggerFormItemId + "label"] = null;
        }
        hiddenFormItemIds.value.push(r.triggerFormItemId);
      }
      // 记录
      recordHandle(field, value, [r.triggerFormItemId]);
    }
  };

  /**
   * 逻辑隐藏的操作记录
   * @param field 字段的Id
   * @param value 字段的值
   * @param hiddenList 需要隐藏的字段列表
   * @param showIdList 需要显示的字段列表
   */
  const recordHandle = (field: any, value: any, hiddenList: any, showIdList?: any[]) => {
    let fieldLogic = fieldLogicContext[field];
    if (fieldLogic) {
      if (hiddenList) {
        fieldLogicContext[field]["hidden"] = [...fieldLogic["hidden"], ...hiddenList];
      }
      if (showIdList) {
        fieldLogicContext[field]["show"] = [...fieldLogic["show"], ...showIdList];
      }
    }
  };

  // 移除表单校验规则
  const removeRule = (cur: any) => {
    delete formRules.value[cur.vModel];
  };

  return {
    logicShowHandle
  };
}
