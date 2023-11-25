import { defineStore } from "pinia";

interface ConditionsConfig {
  conditionNodes: Array<object>;
}

// 工作流配置
interface FormWorkflowState {
  promoterDrawer: boolean;
  // 审批人抽屉开关
  approverDrawer: boolean;
  // 审批人配置
  approverConfig: object;
  // 抄送人抽屉开关
  copyerDrawer: boolean;
  // 抄送人配置
  copyerConfig: object;
  // 条件抽屉开关
  conditionDrawer: boolean;
  // 条件配置
  conditionsConfig: ConditionsConfig;
}

/**
 * 表单流程
 * @methods
 */
export const useFormWorkflow = defineStore("formWorkflow", {
  state: (): FormWorkflowState => ({
    promoterDrawer: false,
    approverDrawer: false,
    approverConfig: {},
    copyerDrawer: false,
    copyerConfig: {},
    conditionDrawer: false,
    conditionsConfig: {
      conditionNodes: []
    }
  }),
  actions: {
    async updatePromoter() {
      this.promoterDrawer = !this.promoterDrawer;
    },
    async updateApprover() {
      this.approverDrawer = !this.approverDrawer;
    },
    async updateCopyer() {
      this.copyerDrawer = !this.copyerDrawer;
    },
    async updateCondition() {
      this.conditionDrawer = !this.conditionDrawer;
    },
    async updateApproverConfig(config: object) {
      this.approverConfig = config;
    },
    async updateCopyerConfig(config: object) {
      this.copyerConfig = config;
    },
    async updateConditionsConfig(config: ConditionsConfig) {
      this.conditionsConfig = config;
    },
    async updateConditionsConfigConditionNodes(config: Array<object>) {
      this.conditionsConfig.conditionNodes = config;
    }
  }
});
