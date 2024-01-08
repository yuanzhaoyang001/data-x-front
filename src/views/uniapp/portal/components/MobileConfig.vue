<template>
  <el-drawer
    v-model="drawer"
    title="配置"
    :direction="direction"
  >
    <banner-config v-if="comType == MobileComType.BANNER" />
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BannerConfig from "@/views/uniapp/portal/components/BannerConfig.vue";
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
