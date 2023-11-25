import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { ref } from "vue";
import { useExamForm } from "@/views/formgen/components/GenerateForm/hooks/useExamHook";

// 比较数组是否相等（忽略顺序）
function areArraysEqualIgnoreOrder(arr1: any[], arr2: any[]) {
  console.log(arr1);
  console.log(arr2);

  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] != sortedArr2[i]) {
      return false;
    }
  }
  return true;
}

// 比较字符串是否包含（忽略空格和标点符号）
function compareAndCheckSubstring(o1: string, o2: string) {
  if (o1 !== null && o2 !== null) {
    // 移除空格和标点符号
    const regex = /[\s\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F\uFE10-\uFE1F\uFE30-\uFE4F\uFE50-\uFE6F\uFF00-\uFFEF]+/g;
    const o1Str = o1.toString().replace(regex, "");
    const o2Str = o2.toString().replace(regex, "");
    return o2Str.includes(o1Str);
  }
  return false;
}

// 比较字符串是否等于（忽略空格和标点符号）
function compareEqual(o1: string, o2: string) {
  if (o1 !== null && o2 !== null) {
    // 移除空格和标点符号
    const regex = /[\s\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F\uFE10-\uFE1F\uFE30-\uFE4F\uFE50-\uFE6F\uFF00-\uFFEF]+/g;
    const o1Str = o1.toString().replace(regex, "");
    const o2Str = o2.toString().replace(regex, "");
    return o2Str == o1Str;
  }
  return false;
}

export function useFormItemExam(item: BasicComponent) {
  const classList = ref<string[]>([]);

  // 是否是正确答案
  const isRightAnswer = (val: any) => {
    if (item.examConfig?.enableScore) {
      if (!item.examConfig.answer || !val) {
        return false;
      }
      // 类型
      const type = item.examConfig?.scoringType;
      switch (type) {
        //唯一答案和分值
        case 1:
          let newVal = val;
          // 判断val是否是单选
          if (!Array.isArray(val)) {
            newVal = [val];
          }
          return areArraysEqualIgnoreOrder(newVal, item.examConfig.answer);
        case 2:
          return compareAndCheckSubstring(val, item.examConfig.answer);
        case 3:
          return compareEqual(val, item.examConfig.answer);
        case 4:
          // 每个选项都有分值
          return true;
      }
    }
  };

  const { getExamSetting } = useExamForm();
  /**
   * 获取考试样式
   */
  const getExamClass = (selectValue: any, optionVal: any) => {
    // 如果不是练习模式也不是显示答案状态
    if (!getExamSetting.value || !getExamSetting.value.practiceMode || !item?.examConfig?.showAnswer) {
      return [];
    }
    if (!item.examConfig?.enableScore) {
      return [];
    }
    if (!selectValue) {
      return [];
    }
    switch (item.typeId) {
      case "CHECKBOX":
        return checkboxExamClass(selectValue, optionVal, item);
      case "RADIO":
        return radioExamClass(selectValue, optionVal);
      case "SELECT":
      case "TEXTAREA":
      case "INPUT":
      case "NUMBER":
        return commonExamClass(selectValue);
      default:
        return [];
    }
  };

  /**
   * 多选类型的考试样式逻辑获取
   */
  const checkboxExamClass = (selectValue: string[], optionVal: any, item: BasicComponent): string[] => {
    console.log(item);
    // 需要打开答案显示
    if (item.examConfig?.enableScore && !item.examConfig?.showAnswer) {
      return [];
    }
    let classList: string[] = [];
    if (selectValue && optionVal) {
      // 如果选中了全部正确答案
      if (isRightAnswer(selectValue)) {
        if (selectValue.includes(optionVal)) {
          classList.push("answer-correct");
        }
      } else {
        // 如果是没选中的正确答案
        const answer = item.examConfig?.answer as any;
        if (answer && answer.length > 0 && answer?.includes(optionVal)) {
          classList.push("answer-correct-flag");
        } else {
          if (selectValue.includes(optionVal)) {
            classList.push("answer-error");
          }
        }
      }
    }
    return classList;
  };

  /**
   * 单选类型的考试样式逻辑获取
   */
  const radioExamClass = (selectValue: any, optionVal: any): string[] => {
    let classList: string[] = [];
    if (selectValue && optionVal) {
      // 如果选中的是正确的答案
      if (isRightAnswer(optionVal)) {
        if (selectValue == optionVal) {
          classList.push("answer-correct");
        } else {
          classList.push("answer-correct-flag");
        }
      } else {
        if (selectValue === optionVal) {
          classList.push("answer-error");
        }
      }
    }
    return classList;
  };

  /**
   * 通用的考试样式逻辑获取
   */
  const commonExamClass = (selectValue: any): string[] => {
    let classList: string[] = [];
    if (isRightAnswer(selectValue)) {
      classList.push("answer-correct");
    } else {
      classList.push("answer-error");
    }
    return classList;
  };

  return {
    isRightAnswer,
    getExamClass,
    classList
  };
}
