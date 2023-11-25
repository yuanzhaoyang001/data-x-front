import { BasicComponent, ExamConfig, FormPublicSetting } from "@/views/formgen/components/GenerateForm/types/form";
import { computed, inject, PropType, ref, Ref, toValue, watch } from "vue";
import { useUserForm } from "@/stores/userForm";
import { storeToRefs } from "pinia";

export const formItemProps = {
  /**
   * @description 值 任意类型
   */
  value: {
    type: [Array, Object, String, Number, Boolean]
  },
  /**
   * @description 表单项配置
   */
  item: {
    type: Object as PropType<BasicComponent>
  },
  /**
   * 考试配置
   */
  examConfig: {
    type: Object as PropType<ExamConfig>
  }
};

export const formEmits: string[] = ["update:value"];

export function useFormItem(props: any, emits: any) {
  const changeValue = <any>ref(props.value);

  const disableStyle = computed(() => {
    return disabledProp.value ? "pointer-events: none;opacity: 0.6;" : "";
  });

  const getOptions = () => {
    return props.item.config.options;
  };

  watch(
    () => changeValue,
    (val: any) => {
      emits("update:value", toValue(val));
    },
    {
      deep: true
    }
  );

  watch(
    () => props.value,
    (val: any) => {
      changeValue.value = val;
    },
    {
      deep: true
    }
  );

  const config = computed(() => {
    return props.item.config;
  });

  // 获取表单的禁用状态
  const formDisabled = inject("formDisabled", false);

  const disabledProp = computed(() => {
    // 修复不受 elForm 控制禁用
    return (props.item && props.item.disabled) || formDisabled;
  });

  // 每页一题的
  const formSetting = inject<Ref<FormPublicSetting> | null>("formSetting", null);
  const userFormStore = useUserForm();
  const { currentPage } = storeToRefs(userFormStore);

  // 一页一题自动下一页
  const autoNextPage = (emits: any) => {
    const autoNext = formSetting?.value?.onePageOneQuestion?.autoNext || false;
    if (autoNext) {
      // 延迟一下 不然太快
      setTimeout(() => {
        emits("next", currentPage.value);
      }, 500);
    }
  };

  return { changeValue, disableStyle, getOptions, config, disabledProp, autoNextPage };
}
