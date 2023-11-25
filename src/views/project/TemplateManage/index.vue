<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="118px"
    >
      <el-form-item
        :label="$t('project.templatePage.templateName')"
        prop="name"
      >
        <el-input
          style="width: 250px"
          v-model="queryParams.name"
          :placeholder="$t('formI18n.all.pleaseEnter')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="ele-Search"
          @click="handleQuery"
        >
          {{ $t("project.templatePage.search") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['form:template:create']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="$refs.createFormRef.showForm()"
        >
          {{ $t("project.templatePage.create") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>
    <CreateForm
      :folder-id="0"
      ref="createFormRef"
    />
    <el-table
      v-loading="loading"
      :data="templateList"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="ID"
        align="center"
        prop="id"
      />
      <el-table-column
        :label="$t('project.templatePage.templateName')"
        align="center"
        prop="name"
      />
      <el-table-column
        :label="$t('project.templatePage.description')"
        align="center"
        prop="description"
      />
      <el-table-column
        :label="$t('project.templatePage.type')"
        align="center"
        prop="categoryName"
      />
      <el-table-column
        :label="$t('project.templatePage.visibleRange')"
        align="center"
        prop="nickName"
      >
        <template #default="scope">
          <span v-if="!scope.row.userId || scope.row.userId == 0">公开</span>
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('project.templatePage.image')"
        align="center"
        prop="nickName"
      >
        <template #default="scope">
          <el-image
            :src="scope.row.coverImg"
            style="height: 30px"
            :preview-src-list="[scope.row.coverImg]"
            :preview-teleported="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('project.templatePage.operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('project.templatePage.preview')"
            placement="top"
          >
            <el-button
              link
              icon="ele-View"
              @click="toProjectTemplate(scope.row.formKey)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('project.templatePage.delete')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:template:delete']"
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>

<script setup lang="ts" name="TemplateManage">
import { onMounted, reactive, ref } from "vue";
import { deleteFormTemplateRequest, getMangeFormTemplatePageRequest } from "@/api/project/template";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import CreateForm from "@/views/project/my/CreateForm.vue";
import { i18n } from "@/i18n";

const loading = ref(false);

const showSearch = ref(true);

const templateList = ref([]);

const total = ref(0);

const queryParams = reactive({
  current: 1,
  size: 10,
  name: ""
});

onMounted(() => {
  getList();
});

/** 查询单主题分类列表 */
const getList = () => {
  loading.value = true;
  getMangeFormTemplatePageRequest(queryParams).then(response => {
    loading.value = false;
    templateList.value = response.data.records;
    total.value = response.data.total;
  });
};

const handleQuery = () => {
  queryParams.current = 1;
  getList();
};

/** 删除按钮操作 */
const handleDelete = row => {
  const id = row.id;
  ElMessageBox.confirm(i18n.global.t("project.templatePage.isDelete") + row.name, i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      deleteFormTemplateRequest(id).then(res => {
        getList();
        ElMessage({
          type: "success",
          message: i18n.global.t("formI18n.all.success")
        });
      });
    })
    .catch(() => {});
};

const router = useRouter();

const toProjectTemplate = (key: any) => {
  router.push({
    path: "/project/template/preview",
    query: { key: key }
  });
};
</script>

<style scoped lang="scss"></style>
