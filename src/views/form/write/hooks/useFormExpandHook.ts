import { getQueryString } from "@/views/formgen/utils";
import { ref } from "vue";

export function useFormExpand() {
  const extValue = ref<string>();

  /**
   * 获取扩展值
   */
  const getExtValue = () => {
    extValue.value = decodeURI(getQueryString("ext"));
    return extValue.value;
  };

  return {
    getExtValue
  };
}
