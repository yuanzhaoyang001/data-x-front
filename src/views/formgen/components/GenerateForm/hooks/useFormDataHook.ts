import { getFormData, getFormSaveData } from "@/views/formgen/utils/db";
import { nextTick, Ref, ref } from "vue";
import { FormModelType } from "@/views/formgen/components/GenerateForm/types/form";
import { generateId } from "@/utils";

export function useFormData(formConf: Ref<any>) {
  const confirmTitle = ref<string>("");
  const showConfirm = ref<boolean>(false);
  const restoreType = ref<number | null>(null);
  const pageContentRef = ref<any>(null);

  /**
   * 恢复保存未提交的数据
   */
  const restoreNotSaveData = (): void => {
    const formModel = getFormData(formConf.value.formKey);
    if (formConf.value.setting && formConf.value.setting.saveNotSubmitStatus && formModel) {
      confirmTitle.value = "恢复未提交的数据？";
      showConfirm.value = true;
      restoreType.value = 1;
    }
  };

  /**
   * 使用上次提交的数据
   */
  const restoreLastSubmitData = (): void => {
    const formModel = getFormSaveData(formConf.value.formKey);
    if (formConf.value.setting && formConf.value.setting.saveSubmitStatus && formModel) {
      confirmTitle.value = "使用上次提交的数据？";
      showConfirm.value = true;
      restoreType.value = 2;
    }
  };

  /**
   * 恢复数据
   */
  const restoreData = (formModel: any, parseKey: any): void => {
    let tempFormModel: FormModelType = {};
    switch (restoreType.value) {
      case 1:
        tempFormModel = getFormData(formConf.value.formKey);
        break;
      case 2:
        tempFormModel = getFormSaveData(formConf.value.formKey);
        break;
    }
    if (restoreType.value) {
      formModel.value = tempFormModel || {};
      parseKey.value = generateId();
      showConfirm.value = false;
    }
  };

  /**
   *  缓存值填充逻辑显示
   * @param pageFormModel
   */
  const updateLogicShow = (pageFormModel: any): void => {
    nextTick(() => {
      for (const key of Object.keys(pageFormModel)) {
        if (pageFormModel[key]) {
          pageContentRef.value?.handleLogicChange(pageFormModel[key], key, {});
        }
      }
    });
  };

  return {
    confirmTitle,
    showConfirm,
    restoreType,
    pageContentRef,
    restoreNotSaveData,
    restoreLastSubmitData,
    restoreData,
    updateLogicShow
  };
}
