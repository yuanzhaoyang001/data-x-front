<template>
  <div class="form-index-container">
    <div class="header-container">
      <el-row
        align="middle"
        class="header-row"
      >
        <el-col :span="6">
          <div class="form-home-wrap">
            <el-tooltip
              effect="light"
              :content="$t('form.form.home')"
              placement="bottom"
            >
              <el-icon
                @click="goBack"
                size="20"
                class="ml10 cursor-pointer"
              >
                <ele-HomeFilled />
              </el-icon>
            </el-tooltip>
            <span class="form-text-name ml10">{{ currentFormName }}</span>
            <span
              class="last-save-time"
              v-if="lastSaveTimeStr"
            >
              <span v-if="!isSaving">
                <el-icon><ele-CircleCheck /></el-icon>
                {{ $t("form.form.saveTime") }} {{ lastSaveTimeStr }}
              </span>
              <span v-else>
                <el-icon class="is-loading">
                  <ele-Loading />
                </el-icon>
                {{ $t("form.form.saving") }}
              </span>
            </span>
          </div>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="11">
          <div class="btn-wrap">
            <div
              v-for="(menu, index) in menuItemList"
              :key="menu.route"
            >
              <div
                v-if="hasFormButtonAuth(menu.type)"
                class="btn-item-wrap"
              >
                <el-link
                  :class="menu.route === defaultActiveMenu ? 'active' : ''"
                  :underline="false"
                  @click="menuSelectHandle(menu.route)"
                >
                  <i
                    :class="menu.icon"
                    class="iconfont"
                  />
                  {{ menu.title }}
                </el-link>
                <el-icon
                  v-if="index != menuItemList.length - 1"
                  class="ml10"
                  size="13"
                >
                  <ele-ArrowRight />
                </el-icon>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="quickFormPublic"
            v-if="notPublish"
          >
            <i class="iconfont icon-fabu" />
            {{ $t("form.form.publish") }}
          </el-button>
          <el-button
            icon="ele-FolderAdd"
            type="success"
            @click="saveProjectAsTemplateHandle"
            v-else
          >
            {{ $t("form.form.saveAsTemplate") }}
          </el-button>
          <el-button
            text
            bg
            icon="ele-View"
            @click="openPreviewHandle"
          >
            {{ $t("form.form.view") }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <template-create
      ref="templateCreateRef"
      :form-key="formKey"
    />
    <router-view />

    <el-dialog
      v-if="previewDialogVisible"
      v-model="previewDialogVisible"
      class="preview-dialog"
      destroy-on-close
      fullscreen
    >
      <pre-view
        :key="previewKey"
        :preview-qrcode="true"
      />
    </el-dialog>
  </div>
</template>
<script>
import { useFormInfo } from "@/stores/formInfo";

const formInfoStore = useFormInfo();

export default {
  async beforeRouteEnter(to, from, next) {
    console.log(to);
    await formInfoStore.loadFormInfo(to.query.key, to.query.authGroupId);
    next();
  }
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import PreView from "@/views/form/preview/index.vue";
import TemplateCreate from "@/views/project/template/create.vue";
import { publishFormRequest } from "@/api/project/publish";
import { getConnUrl, initWebSocket } from "@/utils/webscoket";
import { useUserInfo } from "@/stores/userInfo";
import { useFormInfo } from "@/stores/formInfo";
import mittBus from "@/utils/mitt";
import { NextLoading } from "@/utils/loading";
import { i18n } from "@/i18n";
import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { MessageUtil } from "@/utils/messageUtil";
import { storeToRefs } from "pinia";

const previewKey = ref(+new Date().getTime());
const previewDialogVisible = ref(false);
const defaultActiveMenu = ref("editor");
const formKey = ref(null);
const folderId = ref(0);
const notPublish = ref(true);
const isMobile = ref(false);
const router = useRouter();
const route = useRoute();

const formInfoStore = useFormInfo();

const { hasFormButtonAuth } = formInfoStore;

const { backRoute, currentFormName, lastSaveTimeStr, isSaving } = storeToRefs(formInfoStore);

const { userInfos } = useUserInfo();

const menuItemList = [
  {
    title: i18n.global.t("form.form.edit"),
    icon: "icon-bianji",
    route: "/project/form/editor/index",
    type: "editor"
  },
  {
    title: i18n.global.t("formgen.topNav.setting"),
    icon: "iconfont icon-xitongshezhi",
    route: "/project/form/setting",
    type: "setting"
  },
  {
    title: i18n.global.t("form.form.publish"),
    icon: "icon-fabu",
    route: "/project/form/publish",
    type: "publish"
  },
  {
    title: i18n.global.t("form.form.data"),
    icon: "icon-shujuwajue",
    route: "/project/form/data",
    type: "data"
  },
  {
    title: i18n.global.t("form.form.board"),
    icon: "icon-board",
    route: "/project/form/statistics",
    type: "board"
  }
];

onMounted(async () => {
  formKey.value = route.query.key;
  defaultActiveMenu.value = route.query.path;
  folderId.value = route.query.folderId;
  // 是否有访问当前页面的权限
  // 根据path 从里面menuItemList过滤
  if (route.path) {
    const menuItem = menuItemList.find(item => item.route === route.path);
    if (menuItem) {
      if (!hasFormButtonAuth(menuItem.type)) {
        await router.replace({
          path: "/project/form/401",
          query: { key: formKey.value, ...route.query }
        });
      }
    }
  }
  NextLoading.done(600);
  isMobile.value = document.body.clientWidth < 1110;
  // 初始化ws连接
  // 拼接ws地址
  initWebSocket(getConnUrl(userInfos.userId));
  // 监听ws消息
  mittBus.on("sysMsgNotice", res => {
    try {
      const { title, msgContent } = res;
      ElNotification({
        position: "top-right",
        title: title,
        offset: 50,
        dangerouslyUseHTMLString: true,
        message: msgContent
      });
    } catch (e) {
      console.log(e);
    }
  });
});

window.onresize = () => {
  isMobile.value = document.body.clientWidth < 1110;
};

onBeforeUnmount(() => {
  window.onresize = null;
});

const quickFormPublic = () => {
  notPublish.value = false;
  publishFormRequest({ formKey: formKey.value }).then(() => {
    defaultActiveMenu.value = "/project/form/publish";
    router.replace({
      path: "/project/form/publish",
      query: { key: formKey.value }
    });
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
  });
};

const menuSelectHandle = index => {
  if (index == "/project/form/publish") {
    notPublish.value = false;
  } else {
    notPublish.value = true;
  }
  if (defaultActiveMenu.value != index) {
    defaultActiveMenu.value = index;
    router.replace({ path: index, query: { key: formKey.value, ...route.query } });
  }
};

const openPreviewHandle = () => {
  previewKey.value = +new Date();
  previewDialogVisible.value = true;
};

const templateCreateRef = ref(null);

const saveProjectAsTemplateHandle = () => {
  templateCreateRef.value.handleOpen();
};

const goBack = () => {
  router.push({ path: backRoute.value });
};

defineExpose({
  menuItemList
});
</script>

<style lang="scss" scoped>
.form-index-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.header-container {
  width: 100%;
  height: 45px;
  border-bottom: 1px solid #70707038;
  background: #fff;

  .header-row {
    height: 100%;
  }

  .form-home-wrap {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 20px;
  }

  .el-button {
    height: 30px !important;
  }

  .form-text-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 224px;
    color: #333;
    display: inline-block;
    vertical-align: middle;
    line-height: 45px;
    position: relative;
    cursor: default;
  }

  .last-save-time {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #999;
    margin-left: 10px;

    .el-icon {
      margin-right: 5px;
    }
  }
}

.btn-wrap {
  display: flex;
  align-items: center;
  --el-link-text-color: var(--el-text-color-primary);
  user-select: none;

  .btn-item-wrap {
    margin: 0 10px;
    display: flex;
    align-items: center;

    .el-link {
      color: var(--el-text-color-primary);
    }

    .active {
      color: var(--el-link-hover-text-color);
    }

    .el-link:hover {
      color: var(--el-link-hover-text-color);
    }

    i {
      margin-right: 5px;
      font-size: 16px;
    }
  }
}

.form-main-container {
  width: 100vw;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: row;
  background-color: var(--el-bg-color-page);
}

:deep(.preview-container) {
  background-color: var(--el-bg-color-page);
}

:deep(.preview-dialog.is-fullscreen) {
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

:deep(.preview-dialog .el-dialog__body) {
  height: 100% !important;
  max-height: 100% !important;
  overflow: hidden !important;
  padding: 10px !important;
}

@media screen and (max-width: 767px) {
  .el-menu-item,
  .el-submenu__title {
    height: 50px !important;
    line-height: 50px !important;
    color: var(--color-blacks) !important;
    transition: none !important;
  }
  .header-row {
    height: 100%;
  }
}
</style>
