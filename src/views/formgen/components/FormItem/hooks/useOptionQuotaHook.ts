import { onMounted, ref, useAttrs } from "vue";
import { getRequest } from "@/api/baseRequest";
import { useRouter } from "vue-router";

export function useOptionQuota(props: any) {
  // 使用名额 key 为选项的value 值是为使用了的名额
  const usedQuotaMap = ref<any>({});

  const useAttr = useAttrs();

  onMounted(() => {
    if (useAttr.mode === "design") return;
    // 设置了名额的选项
    const arr = props.item.config.options.filter((e: any) => {
      return typeof e.quotaSetting === "number";
    });
    if (arr.length) {
      getOptionUsedQuota();
    }
  });

  const router = useRouter();

  const getOptionUsedQuota = () => {
    getRequest("/form/ext/getOptionUsedQuota", {
      formKey: router.currentRoute.value.params.key || router.currentRoute.value.query.key,
      formItemId: props.item.config.formId
    }).then(res => {
      usedQuotaMap.value = res.data;
    });
  };

  // 获取剩余名额
  const getSurplusQuota = (option: any) => {
    let usedQuota = usedQuotaMap.value[option.value] || 0;
    return option.quotaSetting > usedQuota ? option.quotaSetting - usedQuota : 0;
  };
  // 是否显示名额
  const isHideQuota = (option: any) => {
    return props.item.config.hideQuota && getSurplusQuota(option) <= 0;
  };
  // 显示名额
  const showQuota = (option: any) => {
    return !props.item.config.hideChoiceWhenQuotaEmpty && typeof option.quotaSetting === "number";
  };

  return {
    getOptionUsedQuota,
    getSurplusQuota,
    isHideQuota,
    showQuota
  };
}
