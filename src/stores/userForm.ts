import { defineStore } from "pinia";
import { BasicComponent, FieldIdIndexType } from "@/views/formgen/components/GenerateForm/types/form";

interface UserFormState {
  // 当前标记的题目列表
  markedQuestionList: string[];
  // 逻辑没成立的被隐藏的题目列表
  hiddenFormItemIds: string[];
  // 当前表单的所有字段
  allFields: BasicComponent[];
  // 当前表单的所有字段的id和index的映射
  fieldIdIndex: FieldIdIndexType;
  // 分页的话记录当前页
  currentPage: number;
  // 扩展信息
  extractInfo: {
    // 题库抽题题目id列表
    randomQuestionIds: string | null;
    // 白名单信息
    whilteListVal: string | null;
  };
}

/**
 * 用户表单
 * @methods
 */
export const useUserForm = defineStore("userForm", {
  state: (): UserFormState => ({
    markedQuestionList: [],
    hiddenFormItemIds: [],
    allFields: [],
    fieldIdIndex: {},
    currentPage: 1,
    extractInfo: {
      randomQuestionIds: null,
      whilteListVal: ""
    }
  }),
  actions: {
    setRandomQuestionIds(randomQuestionIds: string) {
      this.extractInfo.randomQuestionIds = randomQuestionIds;
    },
    // 设置白名单信息
    setWhilteListVal(whilteListVal: string) {
      this.extractInfo.whilteListVal = whilteListVal;
    },
    // 标记或者取消标记题目
    toggleMarkedQuestion(questionId: string) {
      const index = this.markedQuestionList.indexOf(questionId);
      if (index > -1) {
        this.markedQuestionList.splice(index, 1);
      } else {
        this.markedQuestionList.push(questionId);
      }
    },
    // 设置隐藏字段列表
    setHiddenFormItemIds(hiddenFormItemIds: string[]) {
      this.hiddenFormItemIds = hiddenFormItemIds;
    },
    // 增加逻辑没成立的被隐藏的题目
    addHiddenFormItemIds(questionId: string) {
      this.hiddenFormItemIds.push(questionId);
    },
    // 设置所有字段
    setAllFields(allFields: BasicComponent[]) {
      this.allFields = allFields;
      for (let i = 0; i < allFields.length; i++) {
        this.fieldIdIndex[allFields[i].vModel] = i;
      }
    },
    // 设置当前分页数
    setCurrentPage(currentPage: number) {
      this.currentPage = currentPage;
    }
  }
});
