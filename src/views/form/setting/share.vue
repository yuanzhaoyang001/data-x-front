<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      {{ $t("form.setting.replySettingLabel") }}
      <span class="small-font-size ml20 text-secondary-color">{{ $t("form.setting.customFormDescription") }}</span>
    </p>
    <el-divider />
    <el-form
      ref="shareSettingForm"
      :model="shareSettingForm"
    >
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.customWxTitle") }}</p>
        <el-switch
          v-model="shareSettingForm.shareWxTitle"
          @change="saveSettingHandle"
        />
      </div>
      <el-form-item
        v-if="shareSettingForm.shareWxTitle"
        :rules="[{ required: true, message: $t('form.setting.enterTitle'), trigger: 'blur' }]"
        prop="shareWxTitleContent"
      >
        <el-input
          @change="saveSettingHandle"
          v-model="shareSettingForm.shareWxTitleContent"
          :placeholder="$t('form.setting.enterTitle')"
        />
      </el-form-item>
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.customWxDescription") }}</p>
        <el-switch
          v-model="shareSettingForm.shareWxDesc"
          @change="saveSettingHandle"
        />
      </div>
      <el-form-item
        v-if="shareSettingForm.shareWxDesc"
        :rules="[{ required: true, message: $t('form.setting.enterDescription'), trigger: 'blur' }]"
        prop="shareWxDescContent"
      >
        <el-input
          v-model="shareSettingForm.shareWxDescContent"
          @change="saveSettingHandle"
          :placeholder="$t('form.setting.enterDescription')"
        />
      </el-form-item>
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.customWxIcon") }}</p>
        <el-switch
          v-model="shareSettingForm.shareWxImg"
          @change="saveSettingHandle"
        />
      </div>
      <div v-if="shareSettingForm.shareWxImg">
        <el-upload
          ref="logoUpload"
          :action="getUploadUrl"
          :headers="getUploadHeader"
          :on-success="uploadShareImgHandle"
          :show-file-list="false"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
        >
          <div style="text-align: left">
            <el-image
              :src="shareSettingForm.shareWxImgUrl"
              class="share-img"
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <ele-Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </el-upload>
        <p
          class="desc-text m20 m20"
          style="text-align: center"
        >
          {{ $t("form.setting.uploadImagePrompt") }}
        </p>
      </div>
    </el-form>
    <div v-if="shareSettingForm.shareWxDesc || shareSettingForm.shareWxTitle || shareSettingForm.shareWxImg">
      <div class="share-preview">
        <div class="share-preview-msg">
          <p class="share-preview-msg-title">
            {{ shareSettingForm.shareWxTitleContent }}
          </p>
          <div class="share-preview-body">
            <p class="share-preview-msg-desc">
              {{ shareSettingForm.shareWxDescContent }}
            </p>
            <img
              v-if="shareSettingForm.shareWxImgUrl"
              :src="shareSettingForm.shareWxImgUrl"
              class="share-preview-img"
              alt=""
            />
          </div>
          <img
            :src="getUserInfo.avatar"
            class="share-user-avatar"
            alt=""
          />
        </div>
        <div class="user-avatar-place" />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";
import { getSettingRequest, saveSettingRequest } from "@/api/project/setting";
import { i18n } from "@/i18n";

export default {
  name: "ShareSetting",
  mixins: [mixin],
  data() {
    return {
      shareSettingForm: {
        shareWxImg: false,
        shareWxImgUrl: null,
        shareWxTitle: false,
        shareWxTitleContent: null,
        shareWxDesc: false,
        shareWxDescContent: null
      }
    };
  },
  mounted() {
    this.formKey = this.$route.query.key;
    this.queryUserProjectSetting();
  },
  unmounted() {},
  methods: {
    uploadShareImgHandle(response) {
      this.shareSettingForm.shareWxImgUrl = response.data;
      this.saveSettingHandle();
    },
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then(res => {
        if (res.data) {
          this.shareSettingForm = res.data;
        }
      });
    },
    saveSettingHandle() {
      this.$refs["shareSettingForm"].validate(valid => {
        // 图片检查
        if (this.shareSettingForm.shareWxImg && !this.shareSettingForm.shareWxImgUrl) {
          // this.msgError(i18n.global.t("form.setting.pelaseUpload"));
          return;
        }
        if (valid) {
          this.shareSettingForm.formKey = this.formKey;
          saveSettingRequest(this.shareSettingForm).then(() => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.queryUserProjectSetting();
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "settting";

.share-img {
  width: 123px;
  height: 117px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  border-radius: 8px;
}

.share-preview {
  width: 360px;
  height: 162px;
  margin: 0 auto;
  border-radius: 8px;
  background-color: var(--el-bg-color-page);
  border: 1px solid rgba(255, 255, 255, 100);
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-around;
}

.share-preview-msg {
  width: 240px;
  border-radius: 5px;
  background-color: white;
  color: rgba(16, 16, 16, 100);
  box-shadow: 0 0 3px 0 rgba(157, 158, 162, 100);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: center;
  position: relative;
}

.share-preview-msg::after {
  content: "";
  border: 8px solid transparent;
  border-left-color: #fff;
  position: absolute;
  right: -14px;
  top: 14px;
  width: 0;
}

.share-preview-msg-title {
  width: 100%;
  line-height: 22px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: left;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
}

.share-preview-body {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 5px;
}

.share-preview-msg-desc {
  flex: 1;
  color: rgba(144, 147, 153, 100);
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  min-height: 49px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-wrap: break-word;
}

.share-preview-img {
  width: 49px;
  height: 49px;
  margin-left: 10px;
}

.share-user-avatar {
  width: 49px;
  height: 49px;
  border-radius: 6px;
  position: absolute;
  right: -65px;
  top: 0;
}
</style>
