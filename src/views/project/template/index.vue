<template>
  <div class="create-container">
    <div>
      <div class="create-header-container">
        <div class="filter-container">
          <el-input
            class="filter-container-box"
            v-model="queryParams.name"
            :placeholder="$t('project.myTemplate.enterTemplate')"
            @keyup.enter="queryTemplatePage"
          />
          <el-button
            class="search-template-btn ml20"
            type="primary"
            @click="queryTemplatePage"
          >
            <i>
              <el-icon size="16px">
                <ele-Search />
              </el-icon>
            </i>
            {{ $t("formI18n.all.search") }}
          </el-button>
        </div>
        <el-menu
          class="filter-container-title"
          :default-active="queryParams.type"
          mode="horizontal"
          style="background-color: transparent"
          @select="
            index => {
              queryParams.type = index;
              queryTemplatePage();
            }
          "
        >
          <el-menu-item index="">全部</el-menu-item>
          <el-menu-item
            v-for="(item, index) in templateTypeList"
            :key="index"
            :index="item.id.toString()"
          >
            {{ item.name }}
          </el-menu-item>
        </el-menu>
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
            <div class="project-template-genre">{{ getTempTypeName(template.categoryId) }}</div>
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
                size="small"
                @click="toProjectTemplate(template.formKey)"
              ></el-button>
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
<script setup name="CreateProject">
import { onMounted, reactive, ref } from "vue";
import {
  deleteFormTemplateRequest,
  getFormTemplatePageRequest,
  getFormTemplateTypeListRequest,
  useTemplateCreateFormRequest
} from "@/api/project/template";
import { createFormRequest } from "@/api/project/form";
import router from "@/router";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";

const queryParams = ref({ current: 1, size: 10, name: "", type: "" });
const total = ref(0);
const templateTypeList = ref([]);
const templateList = ref([]);
let projectListLoading = reactive(null);
const getTempTypeName = id => {
  if (templateTypeList.value.find(item => item.id === id)) {
    return templateTypeList.value.find(item => item.id === id).name;
  }
  return "默认";
};
const queryTemplateType = () => {
  getFormTemplateTypeListRequest().then(res => {
    templateTypeList.value = res.data;
    queryTemplatePage();
  });
};
const toProjectTemplate = key => {
  router.push({
    path: "/project/template/preview",
    query: { key: key }
  });
};
const handleDelete = item => {
  MessageBoxUtil.confirm(`此操作将永久删除 ${item.name}，是否继续？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteFormTemplateRequest({ formKey: item.formKey }).then(res => {
      MessageUtil.success("删除成功");
      queryTemplatePage();
    });
  });
};
const queryTemplatePage = () => {
  getFormTemplatePageRequest(queryParams.value).then(res => {
    const { records, size } = res.data;
    templateList.value = records;
    total.value = res.data.total;
    queryParams.value.size = size;
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
const createBlankTemplate = () => {
  createFormRequest({ description: "表单模板", name: "表单模板" }).then(res => {
    router.push({ path: "/project/form", query: { key: res.data } });
  });
};

onMounted(() => {
  queryTemplateType();
});
</script>

<style lang="scss" scoped>
.create-container {
  max-width: 1200px;
  margin: 0 auto;

  .el-pagination {
    margin-top: 20px;
  }

  .filter-container-title {
    width: 50%;
  }
}

.create-header-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}

.filter-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px !important;

  .filter-container-box {
    width: 270px;
    height: 38px;
    border-radius: 8px;
    opacity: 1;

    background: rgba(196, 196, 196, 0);

    box-sizing: border-box;
  }
}

.project-grid-view {
  display: flex;
  max-width: 1200px;
  flex-direction: row;
  flex-wrap: wrap;
}

.tag-title {
  font-size: 20px;
  border-bottom: 3px solid rgba(68, 68, 68, 100);
  line-height: 25px;
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

  .project-template-genre {
    position: absolute;
    left: 10px;
    top: 6px;
    width: 65px;
    height: 21px;
    border-radius: 5px;
    background: #eef3fe;
    z-index: 1;
    font-size: 12px;
    color: #3d3d3d;
  }

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
    border-radius: 10px;
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
    flex-direction: column;
    visibility: hidden;
    border: none;

    .btn-wrap-use {
      width: 88px;
      height: 29px;
      background: #4c4edb;
      border-radius: 5px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      color: #ffffff;
      padding-left: 20px;
    }

    .btn-wrap-icon {
      margin-left: 10px;
      line-height: 5px;
    }

    .btn-wrap-preview {
      width: 38px;
      height: 29px;
      background: #e8e8e8;
      border-radius: 5px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      color: #79808b;
      padding-left: 18px;
    }
  }
}

.project-template-view:hover {
  .btn-wrap {
    visibility: visible;
    cursor: pointer;
  }
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
