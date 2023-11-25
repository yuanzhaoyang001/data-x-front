import { computed, inject, ref, watch } from "vue";
import { ExamSetting } from "@/api/project/setting";
import { MessageUtil } from "@/utils/messageUtil";

/**
 * 考试表单
 * @param submitFormFun 提交表单方法
 */
export function useExamForm(submitFormFun?: Function) {
  // 设置
  const formSetting = inject<any>("formSetting", {});

  /**
   * 考试设置
   */
  const getExamSetting = computed<ExamSetting>(() => {
    if (formSetting && formSetting.value) {
      return formSetting.value?.examSettings;
    }
    return {};
  });

  const showAnswerCard = computed<boolean>(() => {
    if (formSetting.value) {
      return getExamSetting.value?.showAnswerCard;
    }
    return false;
  });

  /**
   * 禁止复制
   */
  const handleDisableCopy = () => {
    if (!getExamSetting.value.disableCopyQuestion) {
      return;
    }
    // 给body加上样式
    document.body.style.userSelect = "none";
    document.addEventListener("copy", function (e) {
      e.preventDefault();
    });
  };

  const switchCount = ref<number>(0);
  // 检测用户切屏次数
  const handleSwitchCount = () => {
    if (!getExamSetting.value.enableSwitchCount) {
      return;
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" || document.hidden) {
        switchCount.value++;
      }
    });
  };

  watch(switchCount, val => {
    if (val >= getExamSetting.value.maxSwitchCount) {
      MessageUtil.warning("切屏次数过多，系统将自动提交试卷！");
      submitFormFun?.();
    }
  });

  // 计时
  const timeSecond = ref<number>(0);

  // 最短考试时间
  const handleMinExamTime = (): boolean => {
    if (!getExamSetting.value?.enableMinTime) {
      return true;
    }
    const minTime = getExamSetting.value.minTime;
    if (minTime) {
      if (timeSecond.value <= minTime * 60) {
        MessageUtil.warning("开考后" + minTime + "分钟内不允许提交试卷！");
        return false;
      }
    }
    return true;
  };

  // 最长考试时间
  const handleMaxExamTime = () => {
    if (!getExamSetting.value.enableMaxTime) {
      return;
    }
    const maxTime = getExamSetting.value.maxTime;
    if (maxTime) {
      if (timeSecond.value >= maxTime * 60) {
        MessageUtil.warning("考试时间已到，系统将自动提交试卷！");
        submitFormFun?.();
      }
    }
  };

  // 检测考试配置
  const handleExamSetting = () => {
    if (!getExamSetting.value) {
      return;
    }
    setInterval(() => {
      timeSecond.value++;
    }, 1000);
    handleDisableCopy();
    handleSwitchCount();
    handleMaxExamTime();
  };

  // 考试是否允许提交
  const handleExamCanSubmit = (): boolean => {
    return handleMinExamTime();
  };

  return {
    showAnswerCard,
    getExamSetting,
    handleExamSetting,
    handleExamCanSubmit
  };
}
