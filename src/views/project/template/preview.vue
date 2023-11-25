<template>
  <div
    v-loading="createProjectLoading"
    class="template-preview-container"
  >
    <div class="header">
      <el-page-header
        :content="$t('project.myTemplate.templateDetail')"
        @back="$router.back(-1)"
      />
    </div>
    <div class="template-preview-content t-form-theme-wrap">
      <biz-project-form
        v-if="formConfig.formKey"
        :form-config="formConfig"
        @submit="submitForm"
        class="mb20"
      />
      <div class="use-btn">
        <el-button
          type="primary"
          @click="createProjectByTemplate"
        >
          {{ $t("project.myTemplate.useTemplate") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import { useTemplateCreateFormRequest } from "@/api/project/template";

export default {
  name: "TemplatePreview",
  components: {
    BizProjectForm
  },
  props: {},
  data() {
    return {
      createProjectLoading: false,
      formConfig: {
        formKey: "",
        preview: false,
        formKind: 2,
        showBtns: true
      }
    };
  },
  mounted() {
    this.formConfig.formKey = this.$route.query.key;
  },
  methods: {
    createProjectByTemplate() {
      this.createProjectLoading = true;
      useTemplateCreateFormRequest({ formKey: this.formConfig.formKey })
        .then(res => {
          this.createProjectLoading = false;
          if (res.data) {
            this.$router.push({
              path: "/project/form/editor/index",
              query: { key: res.data, active: 1 }
            });
          }
        })
        .catch(() => {
          this.createProjectLoading = false;
        });
    },
    submitForm() {}
  }
};
</script>

<style lang="scss" scoped>
.template-preview-container {
  width: 100%;
  height: 100%;
}

.header {
  padding: 20px;
}

.template-scrollbar {
  height: 100%;
}

.template-preview-content {
  position: relative;
  background-color: var(--el-bg-color-page);
  height: 100%;

  .use-btn {
    position: absolute;
    top: 50px;
    right: 180px;
  }
}

:deep(.project-form) {
  overflow-y: scroll;
  height: 90%;
}

:deep(.project-form-wrapper) {
  overflow: hidden;
  height: 100%;
}
</style>
