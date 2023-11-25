<template>
  <div>
    <el-row>
      <el-col :span="13">
        <el-input
          disabled
          :model-value="linkUrl"
        />
      </el-col>
      <el-col :span="11">
        <el-button-group>
          <el-button
            v-copyText="linkUrl"
            type="primary"
            icon="ele-DocumentCopy"
          >
            {{ $t("form.public.copy") }}
          </el-button>
          <el-button
            icon="ele-Promotion"
            type="primary"
            @click="handleOpen"
          >
            {{ $t("form.public.openUrl") }}
          </el-button>
          <el-popover
            v-if="qrCodeMode === 'popover'"
            placement="right"
            trigger="click"
            width="100"
          >
            <vue-qr
              v-if="linkUrl"
              :callback="qrCodeGenSuccess"
              :size="130"
              :text="linkUrl"
            />
            <el-link
              :underline="false"
              class="text-center width-full"
              type="primary"
              @click="handleDownloadQrCode"
            >
              {{ $t("form.public.downloadCode") }}
            </el-link>
            <template #reference>
              <el-button type="primary">
                <two-dimensional-code
                  theme="outline"
                  size="21"
                  fill="#fff"
                />
              </el-button>
            </template>
          </el-popover>
        </el-button-group>
      </el-col>
      <div
        v-if="qrCodeMode === 'download'"
        class="qrcode-wrap"
      >
        <vue-qr
          v-if="linkUrl"
          :callback="qrCodeGenSuccess"
          :size="194"
          :text="linkUrl"
        />
        <el-link
          class="link"
          type="primary"
          @click="handleDownloadQrCode"
        >
          {{ $t("form.public.saveCode") }}
        </el-link>
      </div>
    </el-row>
  </div>
</template>

<script>
import VueQr from "vue-qr/src/packages/vue-qr.vue";
import { TwoDimensionalCode } from "@icon-park/vue-next";

export default {
  name: "UrlOperate",
  components: {
    VueQr,
    TwoDimensionalCode
  },
  props: {
    // 链接地址
    linkUrl: {
      type: String,
      default: ""
    },
    // 二维码显示模式  popover 或 download
    qrCodeMode: {
      type: String,
      default: "popover"
    }
  },
  data() {
    return {
      qrCodeFileUrl: null
    };
  },
  methods: {
    handleOpen() {
      window.open(this.linkUrl, "_blank");
    },
    handleDownloadQrCode() {
      this.downloadFile("qrcode.png", this.qrCodeFileUrl);
    },
    qrCodeGenSuccess(dataUrl) {
      this.qrCodeFileUrl = dataUrl;
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob(content); // new Blob([content]);
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      // aLink.dispatchEvent(evt);
      aLink.click();
    },
    // base64转blob
    base64ToBlob(code) {
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  color: #dcdfe6;
  margin-left: 28px;
}

.qrcode-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 28px;
  width: 100%;

  img {
    width: 130px;
  }
}
</style>
