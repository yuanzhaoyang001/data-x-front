<template>
  <el-config-provider
    :size="getGlobalComponentSize"
    :locale="getGlobalI18n"
  >
    <router-view v-show="setLockScreen" />
    <LockScreen v-if="themeConfig.isLockScreen" />
    <Setings
      ref="setingsRef"
      v-show="setLockScreen"
    />
    <CloseFull v-if="!themeConfig.isLockScreen" />
    <Upgrade v-if="getVersion" />
  </el-config-provider>
</template>

<script setup lang="ts" name="app">
import { computed, defineAsyncComponent, nextTick, onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useTagsViewRoutes } from "@/stores/tagsViewRoutes";
import { useThemeConfig } from "@/stores/themeConfig";
import other from "@/utils/other";
import { Local, Session } from "@/utils/storage";
import mittBus from "@/utils/mitt";
import setIntroduction from "@/utils/setIconfont";
import { getSystemInfoConfig } from "@/api/system/config";

// 引入组件
const LockScreen = defineAsyncComponent(() => import("@/layout/lockScreen/index.vue"));
const Setings = defineAsyncComponent(() => import("@/layout/navBars/topBar/setings.vue"));
const CloseFull = defineAsyncComponent(() => import("@/layout/navBars/topBar/closeFull.vue"));
const Upgrade = defineAsyncComponent(() => import("@/layout/upgrade/index.vue"));

// 定义变量内容
const { messages, locale } = useI18n();
const setingsRef = ref();
const route = useRoute();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 设置锁屏时组件显示隐藏
const setLockScreen = computed(() => {
  // 防止锁屏后，刷新出现不相关界面
  // https://gitee.com/lyt-top/vue-next-admin/issues/I6AF8P
  return themeConfig.value.isLockScreen ? themeConfig.value.lockScreenTime > 1 : themeConfig.value.lockScreenTime >= 0;
});
// 获取版本号
const getVersion = computed(() => {
  let isVersion = false;
  if (route.path !== "/login") {
    // @ts-expect-error
    if ((Local.get("version") && Local.get("version") !== __NEXT_VERSION__) || !Local.get("version")) isVersion = true;
  }
  return isVersion;
});
// 获取全局组件大小
const getGlobalComponentSize = computed(() => {
  return other.globalComponentSize();
});
// 获取全局 i18n
const getGlobalI18n = computed(() => {
  return messages.value[locale.value];
});
// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => {
  // 设置批量第三方 icon 图标
  setIntroduction.cssCdn();
  // 设置批量第三方 js
  setIntroduction.jsCdn();
});
// 页面加载时
onMounted(() => {
  nextTick(async () => {
    // 监听布局配'置弹窗点击打开
    mittBus.on("openSetingsDrawer", () => {
      setingsRef.value.openDrawer();
    });
    // 获取缓存中的布局配置
    let tDuckThemeConfig = Local.get("themeConfig");
    if (tDuckThemeConfig) {
      const res = await getWebGlobalInfo(tDuckThemeConfig);
      storesThemeConfig.setThemeConfig({ themeConfig: res });
      document.documentElement.style.cssText = Local.get("themeConfigStyle");
    }
    // 获取缓存中的全屏配置
    if (Session.get("isTagsViewCurrenFull")) {
      stores.setCurrenFullscreen(Session.get("isTagsViewCurrenFull"));
    }
  });
});

const getWebGlobalInfo = async (themeConfigPrev: any) => {
  // 临时存储 避免重复请求
  let globalConfigInfo = Session.get("globalConfigInfo");
  if (!globalConfigInfo) {
    let res = await getSystemInfoConfig();
    globalConfigInfo = JSON.parse(res.data);
    Session.set("globalConfigInfo", globalConfigInfo);
  }
  let { name, logoImg } = globalConfigInfo;
  themeConfigPrev.globalTitle = name;
  themeConfigPrev.globalLogo = logoImg;
  themeConfigPrev.copyright = globalConfigInfo.copyright;
  themeConfigPrev.backgroundImage = globalConfigInfo.backgroundImage;
  return themeConfigPrev;
};

// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
  mittBus.off("openSetingsDrawer", () => {});
});
// 监听路由的变化，设置网站标题
watch(
  () => route.path,
  () => {
    try {
      other.useTitle();
    } catch (e) {}
  },
  {
    deep: true
  }
);
</script>
