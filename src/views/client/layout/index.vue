<template>
  <el-container>
    <el-header>
      <el-row
        align="middle"
        class="header-row"
      >
        <el-col :span="4">
          <div class="logo-wrap">
            <menu-unfold-one
              v-if="isMobile()"
              class="mr5"
              fill="#333"
              size="28"
              theme="outline"
              @click="drawer = true"
            />
            <div class="logo-img">
              <img
                :src="themeConfig.globalLogo"
                alt="Logo"
              />
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          :offset="isMobile() ? 0 : 1"
          :xs="15"
          v-if="!isMobile()"
        >
          <el-menu
            v-if="!isMobile()"
            mode="horizontal"
            class="top-menu"
            :ellipsis="false"
            popper-effect="light"
            :default-active="topNavBarActive"
            @select="handleTopNabBarSelect"
          >
            <el-menu-item
              :index="nav.path"
              v-for="nav in topNavBar"
              :key="nav.value"
            >
              {{ $t(`${nav.meta.title}`) }}
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col
          :lg="9"
          :md="2"
          :sm="2"
          :span="9"
          :xs="2"
        ></el-col>
        <el-col
          :span="4"
          :xs="5"
          :md="1"
          :sm="1"
          class="header-row-war"
        >
          <el-tag
            class="mr10 cursor-pointer"
            @click="$router.push({ path: '/mange/home' })"
            v-hasPermi="['system:mange:home']"
            effect="dark"
            round
            size="default"
          >
            {{ $t(`form.avatar.manage`) }}
          </el-tag>
          <div
            @click="toMessage"
            class="mr8 cursor-pointer"
          >
            <el-icon class="header-row-inform">
              <ele-Bell />
            </el-icon>
          </div>
          <el-dropdown
            :hide-timeout="50"
            :show-timeout="70"
            class="mr20"
            trigger="click"
            @command="onLanguageChange"
          >
            <div class="layout-navbars-breadcrumb-user-icon">
              <i
                :class="state.disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"
                :title="$t('layout.user.title1')"
                class="iconfont"
                style="font-size: 20px"
              ></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :disabled="state.disabledI18n === 'zh-cn'"
                  command="zh-cn"
                >
                  简体中文
                </el-dropdown-item>
                <el-dropdown-item
                  :disabled="state.disabledI18n === 'en'"
                  command="en"
                >
                  English
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <user-avatar />
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <left-menu
          :current-left-nav-bar-list="currentLeftNavBarList"
          :left-nav-bar-active="leftNavBarActive"
          :top-nav-bar-active="topNavBarActive"
          @select="handleLeftNabBarSelect"
        />
      </el-aside>
      <el-main>
        <router-view />
        <iframe
          v-if="iframeUrl"
          :src="iframeUrl"
          frameborder="0"
          height="100%"
          width="100%"
        />
      </el-main>
    </el-container>
    <el-drawer
      v-model="drawer"
      direction="ltr"
      size="80%"
    >
      <el-menu
        v-for="nav in topNavBar"
        :key="nav.path"
        default-active="2"
        router
        @select="drawer = false"
      >
        <el-sub-menu index="1">
          <template #title>
            <i
              :class="nav.meta.icon"
              class="mr5"
            />
            <span>{{ $t(`${nav.meta.title}`) }}</span>
          </template>
          <el-menu-item
            v-for="child in nav.children"
            :key="child.path"
            :index="child.path"
          >
            <i
              :class="child.meta.icon"
              class="mr5"
            />
            <span>{{ $t(`${child.meta.title}`) }}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts" name="HomeLayout">
import UserAvatar from "./avatar.vue";
import { useThemeConfig } from "@/stores/themeConfig";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRequestOldRoutes } from "@/stores/requestOldRoutes";
import { Local } from "@/utils/storage";
import other, { isMobile } from "@/utils/other";
import LeftMenu from "./LeftMenu.vue";
import { MenuUnfoldOne } from "@icon-park/vue-next";
import { useI18n } from "vue-i18n";
import { useTLocale } from "@/utils/localeUtil";

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const router = useRouter();
const route = useRoute();

const stores = useRequestOldRoutes();

const { requestOldRoutes } = storeToRefs(stores);

const toMessage = () => {
  router.push("/client/message");
};

// 路由过滤递归函数
const filterRoutesFun = (arr: any) => {
  return arr.filter((item: any) => !item.meta?.isHide && item.meta?.location === "2");
};

const topNavBar = filterRoutesFun(requestOldRoutes.value);
const topNavBarActive = ref<string>("");

const leftNavBarActive = ref(route.path);

// 外链菜单
const iframeUrl = ref("");

onMounted(() => {
  restoreMenu();
  initI18nOrSize("globalI18n", "disabledI18n");
});

onUnmounted(() => {
  iframeUrl.value = "";
});

const drawer = ref(false);

/**
 * 恢复菜单
 */
const restoreMenu = () => {
  leftNavBarActive.value = router.currentRoute.value.path || "/form/my";
  // 查找当前路由的父级路由
  const parNav = topNavBar.filter((item: any) => item.children.some((child: any) => child.path === leftNavBarActive.value));
  if (parNav && parNav.length) {
    topNavBarActive.value = parNav[0].path;
    toMenuRouter();
  } else {
    // 默认
    if (leftNavBarActive.value === "/form/my") {
      topNavBarActive.value = "/project";
      toMenuRouter();
    } else {
      topNavBarActive.value = Local.get("topNavBarActive");
      if (!topNavBarActive.value) return;
      // 找到这个菜单
      const parNav = topNavBar.filter((item: any) => item.path === topNavBarActive.value);
      if (parNav && parNav.length) {
        currentLeftNavBarList.value = parNav[0].children;
        leftNavBarActive.value = currentLeftNavBarList.value[0]?.path as string;
      }
    }
  }
};

const tLocale = useTLocale();

const state = reactive({
  isScreenfull: false,
  disabledI18n: tLocale.acceptLanguage,
  disabledSize: "large"
});

const currentLeftNavBarList = ref<
  {
    path: string;
    meta: {
      title: string;
      icon: string;
      isIframe: boolean;
      isLink: string;
    };
  }[]
>([]);

const { locale, t } = useI18n();

// 语言切换
const onLanguageChange = (lang: string) => {
  Local.remove("themeConfig");
  themeConfig.value.globalI18n = lang;
  Local.set("themeConfig", themeConfig.value);
  locale.value = lang;
  initI18nOrSize("globalI18n", "disabledI18n");
  other.useTitle();
  useTLocale().setLanguage(lang);
};

// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
  (<any>state)[attr] = Local.get("themeConfig")[value];
};

const toMenuRouter = () => {
  if (!topNavBarActive.value) return;
  // 找到这个菜单 生成子菜单
  const parNav = topNavBar.filter((item: any) => item.path === topNavBarActive.value);
  if (parNav && parNav.length) {
    currentLeftNavBarList.value = parNav[0].children;
    if (!leftNavBarActive.value || currentLeftNavBarList.value.every((item: any) => item.path !== leftNavBarActive.value)) {
      handleLeftNabBarSelect(currentLeftNavBarList.value[0]);
    }
    router.push(leftNavBarActive.value);
  }
};

const handleTopNabBarSelect = (index: string) => {
  topNavBarActive.value = index;
  Local.set("topNavBarActive", topNavBarActive.value);
  toMenuRouter();
};

const handleLeftNabBarSelect = (nav: any) => {
  console.log(nav.meta.isLink);
  iframeUrl.value = "";
  if (nav.meta.isIframe) {
    iframeUrl.value = nav.meta.isLink;
  }
  leftNavBarActive.value = nav.path;
};
</script>

<style scoped lang="scss">
.header-row-war {
  display: flex;
  align-items: center;

  .header-row-inform {
    font-size: 20px;
    color: #898989;
    margin-right: 10px;
  }
}

.el-container {
  --el-menu-bg-color: transparent;
  background-color: transparent;
  height: 100%;
  width: 100%;

  .el-aside {
    height: 100%;
    box-shadow: var(--el-box-shadow);
    background-color: var(--el-bg-color);
    --el-menu-item-height: 40px;
    --el-menu-hover-bg-color: transparent;

    .el-menu-item {
      margin-top: 4px;
    }

    .item-content {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;
      padding-left: 35px;
      color: var(--el-text-color-primary);
      width: 100%;
      border-radius: var(--el-border-radius-base);

      i {
        padding-right: 5px;
      }
    }

    .item-content:hover {
      background-color: #f2f3f8;
      color: var(--el-color-primary);
    }

    .active {
      font-weight: bold;
      background-color: #f2f3f8;
      color: var(--el-color-primary);
    }
  }

  .el-header {
    border-bottom: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);

    .header-row {
      height: 60px;
    }

    .logo-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .logo-img {
      padding-left: 50px;
      width: 100px;
      height: 50px;
      display: flex;
      align-items: center;

      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }

    .top-menu {
      margin-left: -80px;
      border-bottom: none;
      height: 100%;
    }

    .top-menu .el-menu-item {
      margin-left: 3px;
      border-bottom: none;
      height: 25px;
      border-radius: 5px;
    }

    .top-menu .el-menu-item.is-active {
      font-weight: bold;
      border-bottom: none;
      background-color: rgba(94, 96, 211, 0.94);
      color: white !important;
    }
  }

  .create-form {
    color: #ffffff;
    width: 80%;
    height: 39px;
    margin-left: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    background: rgba(94, 96, 211, 0.94);
  }

  .create-form:hover {
    background-color: #4c4edb;
  }
}

.logout {
  position: absolute;
  top: 95%;
  margin-left: 65px;
  cursor: pointer;
  display: flex;

  .i-icon:hover {
    transform: scale(1.1);
  }
}

.logout:hover {
  color: #4c4edb;
}

@media (max-width: 768px) {
  .el-aside {
    display: none !important;
  }
  .logo-img {
    padding-left: 2px !important;
  }
  .top-menu {
    margin-left: 0px !important;
  }
}
</style>
