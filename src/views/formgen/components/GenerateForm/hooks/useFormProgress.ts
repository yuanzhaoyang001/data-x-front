import { useUserForm } from "@/stores/userForm";
import { watchDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, Ref, ref } from "vue";
import { isCustomField } from "@/views/formgen/components/GenerateForm/FormItemLabel";

export function useFormProgress(pageFormModel: Ref<any>) {
  // 表单进度
  const formStore = useUserForm();
  const { allFields } = storeToRefs(formStore);
  // 当前填写进度
  const currentProgress = ref(0);

  const totalFields = computed(() => {
    return allFields.value.filter(item => !item.displayType && item.typeId !== "PAGINATION").length;
  });

  // 监听表单数据
  watchDebounced(
    () => pageFormModel.value,
    val => {
      // 获取当前有值的数量和总数量做对比
      const count = Object.keys(val)
        .filter(key => isCustomField(key) && isNotEmpty(val[key]))
        .map(key => key);
      console.log(count);
      // 计算比例
      console.log(totalFields);
      currentProgress.value = Math.floor((count.length / totalFields.value) * 100);
    },
    { debounce: 800, maxWait: 800, deep: true }
  );

  const isNotEmpty = (value: any) => {
    return (
      value && !(Array.isArray(value) && value.length === 0) && !(typeof value === "object" && Object.keys(value).length === 0)
    );
  };

  return { currentProgress };
}
