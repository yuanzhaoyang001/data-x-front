<template>
  <div class="create-container">
    <div>
      <div class="create-header-container">
        <div class="filter-container">
          <el-input
            v-model="queryParams.name"
            style="width: 50%"
            :placeholder="$t('project.myTemplate.enterTemplate')"
            @keyup.enter="queryTemplatePage"
          />
          <el-button
            class="search-template-btn ml20"
            icon="ele-Search"
            type="primary"
            @click="queryTemplatePage"
          >
            {{ $t("formI18n.all.search") }}
          </el-button>
        </div>
      </div>
      <div
        class="project-grid-container mt20"
        v-if="templateList && templateList.length"
      >
        <div class="project-grid-view">
          <div
            v-for="template in templateList"
            :key="template.id"
            class="project-template-view"
          >
            <el-image
              :src="template.coverImg"
              class="preview-img"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon size="50">
                    <ele-Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="content-wrap">
              <p class="project-template-title">
                {{ template.name }}
              </p>
            </div>
            <div class="btn-wrap">
              <el-button
                class="btn-wrap-use"
                size="small"
                type="primary"
                @click="createProjectByTemplate(template.formKey)"
              >
                {{ $t("formI18n.all.use") }}
                <i class="btn-wrap-icon">
                  <el-icon size="10px">
                    <ele-Right />
                  </el-icon>
                </i>
              </el-button>
              <el-button
                class="btn-wrap-preview"
                icon="ele-View"
                @click="toProjectTemplate(template.formKey)"
              ></el-button>
              <el-button
                class="btn-wrap-delete"
                icon="ele-Delete"
                @click="handleDelete(template)"
              />
            </div>
          </div>
        </div>
      </div>
      <el-empty
        v-else
        :description="$t('project.myTemplate.noTemplate')"
      />
    </div>

    <div class="text-center">
      <el-pagination
        v-if="total > 10"
        v-model:current-page="queryParams.current"
        v-model:page-size="queryParams.size"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="queryTemplatePage"
      />
    </div>
  </div>
</template>
<script setup name="MyProjectTemplate">
import { onBeforeMount, reactive, ref } from "vue";
import { deleteFormTemplateRequest, getFormTemplatePageRequest, useTemplateCreateFormRequest } from "@/api/project/template";
import router from "@/router";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";

const queryParams = ref({
  current: 1,
  size: 12,
  name: "",
  type: "",
  myTemplate: true
});
const total = ref(0);
const templateList = ref([]);
let projectListLoading = reactive(null);
const toProjectTemplate = key => {
  router.push({
    path: "/project/template/preview",
    query: { key: key }
  });
};
const handleDelete = item => {
  MessageBoxUtil.confirm(
    i18n.global.t("project.myTemplate.tips"),
    () => {
      deleteFormTemplateRequest({ formKey: item.formKey }).then(res => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        queryTemplatePage();
      });
    },
    i18n.global.t("formI18n.all.waring")
  );
};
const queryTemplatePage = () => {
  getFormTemplatePageRequest(queryParams.value).then(res => {
    const { records, size } = res.data;
    templateList.value = records;
    total.value = res.data.total;
    queryParams.value = size;
    projectListLoading = false;
  });
};

const createProjectByTemplate = formKey => {
  useTemplateCreateFormRequest({ formKey: formKey })
    .then(res => {
      if (res.data) {
        router.push({
          path: "/project/form/editor/index",
          query: { key: res.data, active: 1 }
        });
      }
    })
    .catch(() => {});
};
onBeforeMount(() => {
  queryTemplatePage();
});
</script>

<style lang="scss" scoped>
.create-container {
  max-width: 1200px;
  margin: 0 auto;

  .el-pagination {
    margin-top: 20px;
  }
}

.create-header-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.filter-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px !important;
  width: 60%;
}

.project-grid-view {
  display: flex;
  max-width: 1200px;
  flex-direction: row;
  flex-wrap: wrap;
}

.project-template-view {
  width: 188px;
  line-height: 20px;
  border-radius: 10px;
  text-align: center;
  margin: 10px;
  position: relative;
  cursor: pointer;
  margin-right: 35px;

  .image-slot {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f0f0f0;
  }

  .preview-img {
    width: 100%;
    height: 230px;
    border-radius: 6px;
  }

  .content-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .project-template-title {
    color: var(--el-text-color-primary);
    font-size: 14px;
    margin: 0 3px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .btn-wrap {
    position: absolute;
    top: 70%;
    width: 100%;
    height: 29px;
    z-index: 10000;
    display: flex;
    justify-content: space-evenly;
    visibility: hidden;
    border: none;

    .btn-wrap-use {
      margin: 0;
      padding-left: 20px;
      width: 84px;
      height: 29px;
      color: #ffffff;
      border-radius: 5px;
      background: #4c4edb;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);

      :deep(.el-icon) {
        margin: 0;
      }

      .btn-wrap-icon {
        margin-left: 10px;
        line-height: 5px;
      }
    }

    .btn-wrap-preview {
      margin: 0;
      width: 38px;
      height: 29px;
      color: #79808b;
      border-radius: 5px;
      background: #e8e8e8;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);

      :deep(.el-icon) {
        margin: 0;
      }
    }

    .btn-wrap-delete {
      margin: 0;
      padding: 0;
      width: 32px;
      height: 29px;
      border-radius: 5px;
      background: #e8e8e8;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);

      :deep(.el-icon) {
        margin: 0;
        color: #f56c6c;
      }
    }
  }
}

.project-template-view:hover {
  .btn-wrap {
    visibility: visible;
    cursor: pointer;
  }
}
</style>
