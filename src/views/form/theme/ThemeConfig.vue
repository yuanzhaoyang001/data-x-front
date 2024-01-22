<template>
  <el-collapse
    class="setting-collapse"
    v-model="activeNames"
    accordion
  >
    <el-collapse-item
      :title="$t('form.theme.headerSet')"
      name="1"
    >
      <div class="sub-title">{{ $t("form.theme.logo") }}</div>
      <el-radio-group
        v-model="userFormTheme.logoPosition"
        size="default"
      >
        <el-radio-button
          label="left"
          border
        >
          {{ $t("form.theme.left") }}
        </el-radio-button>
        <el-radio-button
          label="center"
          border
        >
          {{ $t("form.theme.center") }}
        </el-radio-button>
        <el-radio-button
          label="right"
          border
        >
          {{ $t("form.theme.right") }}
        </el-radio-button>
      </el-radio-group>
      <ImageUpload
        v-model:value="userFormTheme.logoImgUrl"
        :label="$t('form.theme.addLogo')"
      />
      <ImageUpload
        v-model:value="userFormTheme.headImgUrl"
        :label="$t('form.theme.addImg')"
      />
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.showTopUserInfo") }}</div>
        <el-switch
          v-model="userFormTheme.showTopUserInfo"
          size="small"
        />
      </div>
    </el-collapse-item>
    <el-collapse-item
      :title="$t('form.theme.contentSet')"
      name="3"
    >
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.showTitle") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.showFormTitle"
        />
      </div>
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.showDesc") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.showFormDescribe"
        />
      </div>
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.showId") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.showFormNumber"
        />
      </div>
      <color-select
        :label="$t('form.theme.themeColor')"
        v-model:value="userFormTheme.themeColor"
      />
    </el-collapse-item>
    <el-collapse-item
      :title="$t('form.theme.backgroundSet')"
      name="2"
    >
      <el-radio-group
        v-model="userFormTheme.backgroundType"
        @change="handleChangeBackgroundType"
      >
        <el-radio-button
          label="color"
          size="default"
        >
          {{ $t("form.theme.color") }}
        </el-radio-button>
        <el-radio-button
          label="img"
          size="default"
        >
          {{ $t("form.theme.img") }}
        </el-radio-button>
      </el-radio-group>
      <ImageUpload
        v-model:value="userFormTheme.backgroundImg"
        :label="$t('form.theme.backgroundImage')"
        v-if="userFormTheme.backgroundType === 'img'"
      />
      <div v-if="userFormTheme.backgroundType === 'color'">
        <color-select
          class="ml10"
          :label="$t('form.theme.backgroundColor')"
          v-model:value="userFormTheme.backgroundColor"
        />
      </div>
    </el-collapse-item>
    <el-collapse-item
      :title="$t('form.theme.fontSet')"
      name="4"
    >
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.titleSize") }}</div>
        <el-select
          size="default"
          v-model="userFormTheme.labelFontSize"
          style="width: 65%"
        >
          <el-option
            :label="`${fs}px`"
            :value="`${fs}px`"
            v-for="fs in getFontSizes()"
            :key="fs"
          />
        </el-select>
      </div>
      <color-select
        :label="$t('form.theme.titleColor')"
        v-model:value="userFormTheme.labelFontColor"
      />
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.answerSize") }}</div>
        <el-select
          size="default"
          v-model="userFormTheme.optionFontSize"
          style="width: 65%"
        >
          <el-option
            :label="`${fs}px`"
            :value="`${fs}px`"
            v-for="fs in getFontSizes()"
            :key="fs"
          />
        </el-select>
      </div>
      <color-select
        :label="$t('form.theme.answerColor')"
        v-model:value="userFormTheme.optionFontColor"
      />
    </el-collapse-item>
    <el-collapse-item
      :title="$t('form.theme.bottomSet')"
      name="5"
    >
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.showButton") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.showSubmitBtn"
        />
      </div>
      <div
        class="setting-row"
        v-if="userFormTheme.showSubmitBtn"
      >
        <div class="sub-title">{{ $t("form.theme.buttonText") }}</div>
        <el-input
          size="default"
          v-model="userFormTheme.submitBtnText"
          :placeholder="$t('form.theme.buttonText')"
          style="width: 60%"
        />
      </div>
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.bottomDesc") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.showFootDescription"
        />
      </div>
      <div
        class="setting-row"
        v-if="userFormTheme.showFootDescription"
      >
        <div class="sub-title">{{ $t("form.theme.bottomDescText") }}</div>
        <el-input
          size="default"
          v-model="userFormTheme.footDescription"
          :placeholder="$t('form.theme.bottomDescText')"
          style="width: 70%"
        />
      </div>
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.powerBy") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.showSupport"
        />
      </div>
    </el-collapse-item>
    <el-collapse-item
      :title="$t('form.theme.backgroundSet')"
      name="6"
    >
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.openWatermarks") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.watermark"
        />
      </div>
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.watermarksText") }}</div>
        <el-input
          size="default"
          v-model="userFormTheme.watermarkText"
          style="width: 60%"
        />
      </div>
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.showUserNow") }}</div>
        <el-switch
          size="small"
          v-model="userFormTheme.watermarkUserName"
        />
      </div>
    </el-collapse-item>
    <el-collapse-item
      :title="$t('form.theme.ohterSet')"
      name="7"
    >
      <div class="setting-row">
        <div class="sub-title">{{ $t("form.theme.importCss") }}</div>
        <el-input
          size="default"
          clearable
          v-model="userFormTheme.cssUrl"
          style="width: 60%"
        />
        <el-upload
          class="flex"
          :headers="uploadHeader"
          :action="uploadUrl"
          :show-file-list="false"
          :limit="1"
          :data="{ fileType: 'CSS' }"
          accept=".css"
          :on-success="handleCssUploadSuccess"
        >
          <el-button
            size="small"
            link
            type="primary"
          >
            {{ $t("common.upload") }}
          </el-button>
        </el-upload>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import ImageUpload from "@/views/form/theme/ImageUpload.vue";
import ColorSelect from "@/views/form/theme/ColorSelect.vue";
import { reactive, watch } from "vue";
import { watchDebounced } from "@vueuse/core";
import { baseUrl, getTokenHeader } from "@/utils/auth";

const activeNames = ["1"];

const props = defineProps({
  formThemeConfig: {
    type: Object,
    required: true
  }
});

const uploadHeader = getTokenHeader();

const uploadUrl = `${baseUrl}/user/file/upload`;

const handleCssUploadSuccess = (response: any) => {
  userFormTheme.cssUrl = response.data;
};

const emit = defineEmits(["refresh"]);

// 用户主题设置
const userFormTheme = reactive({
  themeId: "",
  backgroundType: "color",
  showFormTitle: true,
  showTopUserInfo: false,
  showFormDescribe: true,
  showFormNumber: false,
  showSupport: false,
  showFootDescription: false,
  footDescription: "",
  backgroundColor: "",
  backgroundImg: "",
  headImgUrl: "",
  logoImgUrl: "",
  logoPosition: "left",
  showSubmitBtn: true,
  submitBtnText: "提交",
  themeColor: "",
  labelFontSize: "",
  labelFontColor: "",
  optionFontSize: "",
  optionFontColor: "",
  watermark: false,
  watermarkText: "",
  watermarkUserName: false,
  cssUrl: ""
});

const handleChangeBackgroundType = () => {
  userFormTheme.backgroundImg = "";
  userFormTheme.backgroundColor = "";
};

const getFontSizes = () => {
  return [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];
};

// 监听userFormTheme
watchDebounced(
  () => userFormTheme,
  val => {
    emit("refresh", val);
  },
  { debounce: 500, maxWait: 1000, deep: true }
);

// 监听userFormTheme
watch(
  () => props.formThemeConfig,
  val => {
    console.log(val);
    Object.assign(userFormTheme, val);
  },
  {
    deep: true
  }
);
</script>

<style scoped lang="scss">
.setting-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  line-height: 45px;
  height: 45px;
}

.setting-collapse {
  border-top: none;

  :deep(.el-collapse-item__header) {
    border-bottom: none;
    padding-left: 20px;
    flex-direction: row-reverse;
    align-content: flex-end;
    justify-content: flex-end;
    height: 35px;
    line-height: 35px;
    color: var(--el-text-color-primary);
    font-size: 14px;
    font-weight: 500;
  }

  :deep(.el-collapse-item__arrow) {
    margin: 0 8px 0 0;
    font-weight: 500;
  }

  :deep(.el-collapse-item__content) {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
    padding-left: 25px;
    padding-right: 20px;

    .el-radio__input {
      display: none;
    }
  }

  :deep(.el-radio) {
    margin-right: 0;
  }
}
</style>
