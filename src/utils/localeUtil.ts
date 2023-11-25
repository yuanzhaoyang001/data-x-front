import { computed } from "vue";
import { changeLocale, i18n } from "@/i18n";
import { useStorage } from "@vueuse/core";

/**
 * 多语言工具
 */
export function useTLocale() {
  const acceptLanguage = useStorage("t-language", "zh-CN");

  const setLanguage = async (language: string) => {
    switch (language) {
      case "zh-CN":
        acceptLanguage.value = "zh-CN";
        break;
      case "en":
        acceptLanguage.value = "en-US";
        break;
      default:
        acceptLanguage.value = "zh-CN";
    }
    await changeLocale(language);
  };

  const t = (key: string): string => {
    // @ts-ignore
    return computed(() => i18n.global.t(key));
  };

  return {
    t,
    setLanguage,
    acceptLanguage
  };
}
