import type { App } from "vue";
import type { I18nOptions } from "vue-i18n";
import { createI18n } from "vue-i18n";
import { useThemeConfig } from "@/stores/themeConfig";
import zhcnLocale from "element-plus/es/locale/lang/zh-cn";

export let i18n: ReturnType<typeof createI18n>;

export const changeLocale = async (locale: string) => {
  const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as any;
  if (!langModule) return;
  const { message } = langModule;
  const globalI18n = i18n.global;
  globalI18n.setLocaleMessage(locale, message);
};

async function createI18nOptions(): Promise<I18nOptions> {
  // 读取 pinia 默认语言
  const store = useThemeConfig();
  const locale = store.getThemeLocal();
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default?.message ?? {};

  console.log(message);

  return {
    legacy: false,
    locale,
    fallbackLocale: zhcnLocale.name,
    messages: {
      [locale]: message
    },
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true
  };
}

// setup i18n instance with glob
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options);
  app.use(i18n);
}
