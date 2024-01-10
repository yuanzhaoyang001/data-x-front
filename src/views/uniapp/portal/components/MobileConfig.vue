<template>
  <el-drawer
    v-model="drawer"
    title="配置"
    :direction="direction"
  >
    <banner-config v-if="comType == MobileComType.BANNER" />
    <nav-config v-if="comType === MobileComType.NAV" />
    <tab-bar-config v-if="comType === MobileComType.TABBAR" />
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BannerConfig from "@/views/uniapp/portal/components/BannerConfig.vue";
import NavConfig from "@/views/uniapp/portal/components/NavConfig.vue";
import TabBarConfig from "@/views/uniapp/portal/components/TabBarConfig.vue";

import { MobileComType } from "@/views/uniapp/portal/types/types";

const drawer = ref(false);
const direction = ref<any>("rtl");

const comType = ref<string>("");

const handleOpen = (type: string) => {
  drawer.value = true;
  comType.value = type;
};

defineExpose({
  handleOpen
});
</script>

<style scoped lang="scss"></style>
