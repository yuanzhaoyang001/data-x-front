<template>
  <div class="preview-container">
    <el-tabs
      v-if="formConfig.formKey"
      type="card"
      class="preview-tabs"
      v-model="activeName"
    >
      <el-tab-pane name="pc">
        <template #label>
          <span>
            <el-icon>
              <ele-Monitor />
            </el-icon>
            {{ $t("form.theme.pc") }}
          </span>
        </template>
        <el-scrollbar
          style="height: 85vh; overflow-x: hidden !important"
          :class="activeName === 'pc' ? 't-form-theme-wrap' : ''"
        >
          <biz-project-form
            v-if="formConfig.formKey"
            :form-config="formConfig"
            ref="bizProjectFormRef"
          />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane name="mobile">
        <template #label>
          <span>
            <el-icon><ele-Iphone /></el-icon>
            {{ $t("form.theme.mobile") }}
          </span>
        </template>
        <div class="preview-layer">
          <div
            class="preview-phone"
            :class="activeName === 'mobile' ? 't-form-theme-wrap' : ''"
          >
            <div class="phone-content">
              <biz-project-form
                v-if="formConfig.formKey"
                :form-config="formConfig"
                ref="mobileBizProjectFormRef"
              />
            </div>
          </div>
        </div>
        <div
          v-if="mobilePreviewUrl && previewQrcode"
          class="qrcode-view"
        >
          <p style="font-weight: bold; font-size: 16px">手机扫码预览</p>
          <p class="tips-text">* 预览仅查看效果，无法提交数据</p>
          <p>
            <vue-qr
              v-if="mobilePreviewUrl && previewQrcode"
              :size="134"
              style="border-radius: 10px"
              :text="mobilePreviewUrl"
            />
          </p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import VueQr from "vue-qr/src/packages/vue-qr.vue";

export default {
  name: "PreView",
  components: {
    BizProjectForm,
    VueQr
  },
  props: {
    previewQrcode: null
  },
  data() {
    return {
      activeName: "pc",
      formKey: null,
      mobilePreviewUrl: "",
      formConfig: {
        formKey: "",
        showBtns: true
      }
    };
  },
  mounted() {
    this.formKey = this.$route.query.key;
    let url = window.location.protocol + "//" + window.location.host;
    this.mobilePreviewUrl = `${url}/project/form/view?key=${this.formKey}`;
    this.formConfig["formKey"] = this.formKey;
  },
  methods: {
    /**
     * 更新主题
     */
    handleChangeTheme(theme) {
      this.$refs.bizProjectFormRef.formConf.theme = theme;
      this.$refs.mobileBizProjectFormRef.formConf.theme = theme;
    }
  }
};
</script>

<style lang="scss" scoped>
.tips-text {
  margin-top: 10px;
  margin-bottom: 10px;
}

.preview-container {
  margin: 0;
  height: 100vh;
  overflow: hidden !important;
}

:deep(.preview-tabs) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;

  .el-tabs__content {
    height: 100% !important;
  }

  .el-tab-pane {
    height: 100% !important;
  }
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border: none;
  border-radius: 6px;
  background-color: white;
}

:deep(.el-tabs__header) {
  width: 220px;
  margin: 0 auto;
  border: none;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  background-color: transparent;
  border: none;
}

.project-form {
  margin: 40px auto 0;
}

// 手机预览
div.preview-layer {
  width: 400px;
  height: 100%;
  margin: 10px auto;
  right: 0;
  text-align: center;
}

.a {
  position: absolute;
}

div.preview-layer .preview-phone {
  width: 372px;
  height: 744px;
  background: url("@/assets/images/appearset_bgc_big.png");
  background-size: 372px 744px;
  z-index: 1000;
  position: relative;

  :deep(.project-form-wrapper) {
    width: 90%;
    margin: 0 auto;
    padding-top: 0;
    height: 80%;
  }

  .phone-content {
    position: absolute;
    top: 80px;
    left: 10px;
    width: 352px;
    height: 670px;

    :deep(.submit-btn-form-item button) {
      width: 80%;
    }
  }
}

.qrcode-view {
  position: absolute;
  top: 20px;
  right: 260px;

  p {
    text-align: center;
    font-size: 12px;
    color: #303133;
  }
}

.preview-html {
  width: 345px !important;
  height: 568px !important;
  margin: 74px 0 0 0;
  border-radius: 5px;
  outline: none;
  background-color: #fff;
  border-width: 2px;
  border-style: inset;
  border-color: initial;
  border-image: initial;
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
  border-left-width: 0;
}

:deep(.top-login-user) {
  position: sticky;
  top: 5px;
  width: 90%;
  margin: 0 auto;
}
</style>
