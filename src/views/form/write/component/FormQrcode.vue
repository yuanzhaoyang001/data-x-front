<template>
  <div class="qrcode-box">
    <vue-qr
      v-if="codeUrl"
      :text="codeUrl"
      style="height: 100px; width: 100px"
    />
    <div class="qrcode-desc">手机扫码查看</div>
  </div>
</template>

<script setup name="FormQrcode">
import { defineAsyncComponent, ref } from "vue";

const codeUrl = ref(location.href);

const VueQr = defineAsyncComponent(() => import("vue-qr/src/packages/vue-qr.vue"));
</script>

<style lang="scss" scoped>
.qrcode-box {
  position: absolute;
  left: 50%;
  top: 50px;
  margin-left: 450px;
  background: #fff;
  padding: 5px;
  z-index: 11;
  border-radius: 10px;
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);

  .qrcode-desc {
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}

@media screen and (max-width: 1024px) {
  .qrcode-box {
    display: none;
  }
}
</style>
