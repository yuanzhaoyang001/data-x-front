import { i18n } from "@/i18n";

export const defaultProcessData = {
  process: {
    processId: "process-id",
    name: "自动生成"
  },
  processNode: {
    id: "start",
    nodeType: "userTask",
    nodeName: i18n.global.t("workflow.flowDesign.originator"),
    type: 0, // 0 发起人 1审批 2抄送 3条件 4条件分支 10 并行任务
    nextNode: null,
    branchNodes: []
  }
};
