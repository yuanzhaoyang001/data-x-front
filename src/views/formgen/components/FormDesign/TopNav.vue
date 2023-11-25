<template>
  <div class="top-nav-wrap">
    <span
      v-for="ro in getNavRouter"
      :key="ro.route"
    >
      <el-button
        v-if="formInfoStore.hasFormButtonAuth(ro.type)"
        :class="currentPath === ro.route ? 'active' : ''"
        bg
        class="first-btn"
        text
        @click="onActiveRouter(ro.route)"
      >
        <i :class="ro.icon" />
        {{ ro.title }}
      </el-button>
    </span>

    <div class="fun-btn-wrap">
      <el-button
        text
        bg
        class="first-btn"
        @click="handleOpenImportItem"
      >
        <el-icon>
          <ele-Upload />
        </el-icon>
        {{ $t("formgen.topNav.importSubject") }}
      </el-button>
      <el-button
        text
        bg
        v-hasPermi="['form:template:save']"
        @click="saveProjectAsTemplateHandle"
      >
        <el-icon>
          <ele-Files />
        </el-icon>
        {{ $t("formgen.topNav.saveTemplate") }}
      </el-button>
    </div>
  </div>
  <template-create
    ref="templateCreateRef"
    :form-key="formKey"
  />
  <ImportFormItem
    ref="importItemsRef"
    :form-key="formKey"
    @success="emits('refresh')"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TemplateCreate from "@/views/project/template/create.vue";
import ImportFormItem from "./ImportFormItem.vue";
import { useFormInfo } from "@/stores/formInfo";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { i18n } from "@/i18n";

const navRouters: any[] = [
  {
    title: i18n.global.t("formgen.topNav.content"),
    icon: "iconfont icon-bianji",
    route: "/project/form/editor/index",
    type: "editor"
  },
  {
    title: i18n.global.t("formgen.topNav.logic"),
    icon: "iconfont icon-luoji",
    route: "/project/form/editor/logic",
    type: "logic"
  },
  {
    title: i18n.global.t("formgen.topNav.theme"),
    icon: "iconfont icon-zhuti",
    route: "/project/form/editor/theme",
    type: "theme"
  }
];

const workflowRouter = {
  title: i18n.global.t("formgen.topNav.workFlow"),
  icon: "iconfont icon-liucheng",
  route: "/project/form/editor/workflow",
  type: "workflow"
};

const dimensionRouter = {
  title: i18n.global.t("formgen.topNav.dimension"),
  icon: "iconfont icon-leidatu",
  route: "/project/form/editor/dimension",
  type: "dimension"
};

defineProps({
  formKey: {
    type: String,
    required: true
  }
});

const emits = defineEmits(["refresh"]);

const templateCreateRef = ref<any>(null);
const importItemsRef = ref<any>(null);

const saveProjectAsTemplateHandle = () => {
  templateCreateRef.value.handleOpen();
};
const handleOpenImportItem = () => {
  importItemsRef.value.showDialog();
};

const formInfoStore = useFormInfo();

const { formType } = storeToRefs(formInfoStore);

const getNavRouter = computed(() => {
  // 2.流程表单
  if (formType.value === 2) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    navRouters.push(workflowRouter);
    return navRouters;
  } else if (formType.value === 4) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    navRouters.push(dimensionRouter);
    return navRouters;
  }
  return navRouters;
});

const currentPath = ref("");

const router = useRouter();

// 监听路由变化
watch(
  () => router.currentRoute.value.path,
  () => {
    currentPath.value = router.currentRoute.value.path;
  },
  {
    immediate: true
  }
);

const onActiveRouter = (path: string) => {
  router.replace({ path: path, query: { key: router.currentRoute.value.query.key } });
};
</script>

<style scoped lang="scss">
.top-nav-wrap {
  height: 40px;
  line-height: 40px;
  border-bottom: var(--el-border);

  .first-btn {
    margin-left: 10px;
  }

  .first-btn.active {
    font-weight: bold;
  }

  .el-button {
    height: 30px !important;
    color: var(--el-text-color-primary);
  }

  .el-button.is-link {
    color: var(--el-text-color-primary);
  }

  .active {
    color: var(--el-color-primary);
  }

  .fun-btn-wrap {
    display: inline;
    float: right;
    margin-right: 2vw;
  }
}
</style>
