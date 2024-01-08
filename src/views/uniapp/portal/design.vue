<template>
  <div class="design-wrap">
    <div class="mobile-view-wrap">
      <mobile-view @config="handleConfig" />
    </div>
    <mobile-config ref="mobileConfigRef" />
  </div>
</template>
<script setup lang="ts">
import MobileView from "./components/MobileView.vue";
import MobileConfig from "./components/MobileConfig.vue";
import { ref } from "vue";

const mobileConfigRef = ref<InstanceType<typeof MobileConfig>>();

const handleConfig = (type: string) => {
  mobileConfigRef.value?.handleOpen(type);
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
