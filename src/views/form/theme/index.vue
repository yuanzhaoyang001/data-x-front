<template>
  <div class="theme-container">
    <div
      class="left-container"
      :class="showLeftScrollbar ? 'show' : ''"
    >
      <el-scrollbar class="left-scrollbar-container">
        <p class="theme-title mb15 ml5">{{ $t("form.theme.themeTitle") }}</p>
        <el-row :gutter="5">
          <el-col
            v-for="item in styleList"
            :key="item.key"
            :span="4"
            :xl="4"
            :lg="4"
            :md="8"
            :sm="8"
            :xs="10"
          >
            <span
              :class="{ 'style-btn-active': activeStyle === item.key }"
              class="style-btn"
              @click="activeStyleHandle(item)"
            >
              {{ item.label }}
            </span>
          </el-col>
        </el-row>
        <el-row
          :gutter="5"
          v-if="themeList && themeList.length"
        >
          <el-col
            v-for="t in themeList"
            :key="t.id"
            :span="12"
            class="theme-img-view"
            @click="activeThemeHandle(t)"
          >
            <p
              :class="{ 'head-list-view-select': activeTheme?.id === t.id }"
              style="height: 85px"
            >
              <el-image
                :class="{ 'head-list-img-active': activeTheme?.id === t.id }"
                :src="t.themeConfig?.headImgUrl"
                class="head-list-img"
                fit="cover"
              ></el-image>
            </p>
          </el-col>
        </el-row>
        <el-empty
          v-else
          :description="$t('form.theme.noData')"
        />
      </el-scrollbar>
    </div>
    <div
      class="fold-btn"
      v-if="showLeftScrollbar"
      @click="closeLeft(0)"
    >
      <span class="svg-icon">
        <img :src="FoldLeft" />
      </span>
    </div>
    <div
      v-else
      class="fold-btn"
      @click="closeLeft(1)"
    >
      <span class="svg-icon">
        <img :src="FoldRight" />
      </span>
    </div>
    <pre-view
      :key="projectFormKey"
      :form-key="formKey"
      class="pt20"
      ref="preViewRef"
      v-if="!isFormCover"
    />
    <form-cover-preview
      class="preview-container preview-cover-wrap"
      :config="themeConfig"
      v-else
    />
    <div
      class="fold-btn"
      v-if="showRightScrollbar"
      @click="closeRight(0)"
    >
      <span class="svg-icon">
        <img :src="FoldLeft1" />
      </span>
    </div>
    <div
      v-else
      class="fold-btn"
      @click="closeRight(1)"
    >
      <span class="svg-icon">
        <img :src="FoldRight1" />
      </span>
    </div>
    <div
      class="right-container"
      :class="showRightScrollbar ? 'show' : 'hide'"
    >
      <p class="right-title">{{ $t("form.theme.themeTitle") }}</p>
      <theme-config
        :form-theme-config="currentThemeConfig"
        v-if="formKey"
        @refresh="handleRefreshForm"
        @cover="handleFormCover"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="Theme">
import PreView from "../preview/index.vue";
import ThemeConfig from "./ThemeConfig.vue";
import { getUserThemeRequest, listThemeRequest, saveUserThemeRequest } from "@/api/project/form";
import { listCategory } from "@/api/project/theme";
import { setThemeVars } from "@/views/formgen/utils/theme";
import { onMounted, provide, ref } from "vue";
import { useRouter } from "vue-router";
import FoldLeft from "@/assets/images/form/fold-left.svg";
import FoldLeft1 from "@/assets/images/form/fold-left1.svg";
import FoldRight from "@/assets/images/form/fold-right.svg";
import FoldRight1 from "@/assets/images/form/fold-right1.svg";
import { ElMessageBox } from "element-plus";
import { i18n } from "@/i18n";
import { SHOW_HEADER_USER_INFO_KEY } from "@/views/formgen/components/GenerateForm/types/constants";
import { FormThemeType } from "@/views/formgen/components/GenerateForm/types/form";
import FormCoverPreview from "@/views/form/theme/FormCoverPreview.vue";

const showLeftScrollbar = ref(1);
const showRightScrollbar = ref(1);
const projectFormKey = ref(+new Date());
const formKey = ref("");
const styleList = ref<any[]>([]);
const activeColor = ref("");
const activeStyle = ref("");
const activeTheme = ref<any>(null);
const themeList = ref<any[]>([]);
const currentThemeConfig = ref({});

const preViewRef = ref<any>(null);

const router = useRouter();

onMounted(() => {
  formKey.value = router.currentRoute.value.query.key as string;
  queryFormThemeStyle();
  queryFormTheme();
  projectFormKey.value = +new Date();

  // Get user theme settings
  getUserThemeRequest(formKey.value).then(res => {
    if (res.data && res.data.themeConfig) {
      currentThemeConfig.value = res.data.themeConfig;
    }
  });
});

const closeLeft = (operate: number) => {
  showLeftScrollbar.value = operate;
};

const closeRight = (operate: number) => {
  showRightScrollbar.value = operate;
};

const activeStyleHandle = (item: any) => {
  activeStyle.value = item.key;
  queryFormTheme();
};

const themeConfig = ref<FormThemeType | null>(null);

const handleRefreshForm = (vars: any) => {
  saveUserThemeRequest({
    formKey: formKey.value,
    themeConfig: vars
  }).then(() => {
    setThemeVars(vars);
    themeConfig.value = vars;
    // Assuming that setThemeVars and handleChangeTheme are defined elsewhere
    preViewRef!.value!.handleChangeTheme(vars);
  });
};

const isFormCover = ref<boolean>(false);

provide("formThemeConfig", themeConfig);

const handleFormCover = (checked: boolean, vars: any) => {
  isFormCover.value = checked;
  themeConfig.value = vars;
};

const queryFormThemeStyle = () => {
  listCategory({}).then(response => {
    if (response.data) {
      styleList.value = [{ key: null, label: i18n.global.t("form.theme.all") }].concat(
        response.data.map((item: any) => {
          return { key: item.id, label: item.name };
        })
      );
    }
  });
};

const activeThemeHandle = (item: any) => {
  if (item) {
    ElMessageBox.confirm(i18n.global.t("form.theme.confirmText"), i18n.global.t("form.theme.warning"), {
      confirmButtonText: i18n.global.t("formI18n.all.confirm"),
      cancelButtonText: i18n.global.t("formI18n.all.cancel")
    }).then(() => {
      activeTheme.value = item;
      handleRefreshForm(item.themeConfig);
      currentThemeConfig.value = item.themeConfig;
    });
  }
};

const queryFormTheme = () => {
  listThemeRequest({
    color: activeColor.value,
    style: activeStyle.value
  }).then(res => {
    themeList.value = res.data;
  });
};

provide(SHOW_HEADER_USER_INFO_KEY, true);
</script>

<style scoped>
.theme-container {
  width: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: center;
  user-select: none;
}

.left-container {
  line-height: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  height: calc(100vh - 60px);
  width: 0;
}

.left-container.show {
  flex: 1;
}

.left-scrollbar-container {
  height: 100%;
  margin: 15px;
}

.style-btn {
  line-height: 24px;
  border-radius: 4px;
  padding: 0 2px;
  color: var(--el-text-color-regular);
  background-color: var(--el-bg-color-page);
  font-size: 12px;
  height: 24px;
  text-align: center;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

:deep(.preview-container) {
  flex: 4;
  height: 100% !important;
  background-color: transparent;
}

.theme-title {
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 500;
  text-align: left;
}

.style-btn-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.head-list-img {
  border-radius: 8px !important;
  border: 2px solid transparent;
  height: 100%;
  width: 100%;
}

.head-list-img:hover {
  cursor: pointer;
  border: 2px solid rgba(11, 141, 213, 100);
}

.head-list-img-active {
  border: 2px solid rgba(11, 141, 213, 100);
}

.theme-img-view .head-list-view-select ::after {
  content: "";
  background: url("~@/assets/images/mobile_theme_active.png");
  background-size: 18px;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 4px;
  right: 4px;
}

.right-container {
  line-height: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  height: calc(100vh - 60px);
  width: 0;
  transition: all 1s cubic-bezier(0.4, 0, 0.25, 1);
}

.right-container.show {
  flex: 1.2;
}

.right-container.hide {
  display: none;
}

.right-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  line-height: 22px;
  height: 54px;
  text-align: left;
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.sub-title {
  line-height: 30px;
  font-size: 12px;
  text-align: left;
  color: var(--el-text-color-primary);
}

.fold-btn {
  margin-top: 0px;
  cursor: pointer;
}

.preview-cover-wrap {
  z-index: 100 !important;
}
</style>
