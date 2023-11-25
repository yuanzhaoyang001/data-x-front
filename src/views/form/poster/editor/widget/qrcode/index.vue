<template>
  <vueQr
    class="qrcode"
    :correctLevel="widgetConfig.level"
    :text="widgetConfig.url"
    :size="widgetConfig.width"
    :margin="widgetConfig.margin"
    :backgroundColor="widgetConfig.bgColor"
  />
</template>

<script setup lang="ts" name="QrcodeWidget">
import { PropType } from "vue";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

import { QrcodeWidget } from "./qrcodeWidget";

defineProps({
  widgetConfig: {
    type: Object as PropType<QrcodeWidget>,
    required: true
  }
});
</script>

<style scoped lang="scss">
.qrcode {
  user-select: none;
  height: 100%;
  width: 100%;
}
</style>
