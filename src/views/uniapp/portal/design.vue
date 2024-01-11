<template>
  <div class="design-wrap">
    <div class="mobile-view-wrap">
      <mobile-view @config="handleConfig" />
    </div>
    <mobile-config ref="mobileConfigRef" />
    <van-floating-bubble
      icon="success"
      @click="handleSavePortal"
    />
  </div>
</template>
<script setup lang="ts">
import MobileView from "./components/MobileView.vue";
import MobileConfig from "./components/MobileConfig.vue";
import { onMounted, ref } from "vue";
import { FloatingBubble } from "vant";
import "vant/lib/floating-bubble/style";
import { useRoute } from "vue-router";
import { watchDebounced } from "@vueuse/core";
import { getPortal, updatePortal } from "@/api/uniapp/portal";
import { portalConfigStore } from "@/views/uniapp/portal/config";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";

const mobileConfigRef = ref<InstanceType<typeof MobileConfig>>();

const handleConfig = (type: string) => {
  mobileConfigRef.value?.handleOpen(type);
};

const route = useRoute();

const { portalConfig } = portalConfigStore;

onMounted(() => {
  getPortal(route.params.id as number).then(res => {
    if (res.data.configValue) {
      portalConfig.value = res.data.configValue;
    } else {
      portalConfig.value = { bannerList: [], navList: [], tabBarList: [] };
    }
  });
});

watchDebounced(
  () => portalConfig.value,
  () => {
    handleSave();
  },
  { debounce: 500, maxWait: 1000, immediate: false, deep: true }
);

const handleSave = async () => {
  console.log(route.params);
  const data = {
    id: route.params.id,
    configValue: portalConfig.value
  };
  await updatePortal(data);
};

const handleSavePortal = async () => {
  await handleSave();
  MessageUtil.success(i18n.global.t("common.saveSuccess"));
};
</script>

<style scoped lang="scss">
.design-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}

.mobile-view-wrap {
  width: 372px;
  height: 744px;
  background: url("@/assets/images/appearset_bgc_big.png");
  background-size: 372px 744px;
  z-index: 1000;
  position: relative;
}
</style>
