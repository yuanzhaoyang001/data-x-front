<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item
        :label="$t('workflow.cateories.name')"
        prop="name"
      >
        <el-input
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
          {{ $t("formI18n.all.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("formI18n.all.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['flow:categories:add']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleAdd"
        >
          {{ $t("formI18n.all.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['flow:categories:update']"
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click="handleUpdate"
        >
          {{ $t("formI18n.all.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['flow:categories:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("formI18n.all.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      @selection-change="handleSelectionChange"
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
        :label="$t('workflow.cateories.name')"
        align="center"
        prop="name"
      />
      <el-table-column
        :label="$t('workflow.cateories.sort')"
        align="center"
        prop="sort"
      />
      <el-table-column
        :label="$t('workflow.cateories.createTime')"
        align="center"
        prop="createTime"
      />
      <el-table-column
        :label="$t('formI18n.all.operate')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('formI18n.all.modify')"
            placement="top"
          >
            <el-button
              v-hasPermi="['flow:categories:update']"
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('formI18n.all.delete')"
            placement="top"
          >
            <el-button
              v-hasPermi="['flow:categories:delete']"
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
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改项目模板分类对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          :label="$t('workflow.cateories.name')"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('formI18n.all.pleaseEnter')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('workflow.cateories.sort')"
          prop="sort"
        >
          <el-input-number
            min="0"
            v-model="form.sort"
            :placeholder="$t('workflow.cateories.pleaseSort')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="FlowCategories" lang="ts">
import {
  addCategory,
  Category,
  CategoryPageRes,
  delCategory,
  getCategory,
  pageCategories,
  PageCategoriesParam,
  updateCategory
} from "@/api/workflow/categories";
import { onMounted, reactive, ref } from "vue";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import type { FormInstance, FormRules } from "element-plus";
import { ResultData } from "@/api/types";
import { i18n } from "@/i18n";

const loading = ref(true);
const queryParams: PageCategoriesParam = reactive({
  current: 1,
  size: 10,
  name: ""
});

const categoryList = ref<Category[]>([]);
const total = ref<number>(0);
const open = ref<boolean>(false);
const form = ref<Category>({
  id: 0,
  name: "",
  sort: 0
});

const formRef = ref<FormInstance>();
const ids = ref<number[]>([]);
const single = ref<boolean>(true);
const multiple = ref<boolean>(true);
const title = ref<string>("");
const exportLoading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: i18n.global.t("workflow.cateories.notNull"),
      trigger: "blur"
    }
  ]
});
onMounted(() => {
  getList();
});

const getList = () => {
  loading.value = true;
  pageCategories(queryParams).then((response: ResultData<CategoryPageRes>) => {
    categoryList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
};

const cancel = () => {
  open.value = false;
  reset();
};
const reset = () => {
  form.value = {
    id: 0,
    name: "",
    sort: 0
  };
};
const handleQuery = () => {
  queryParams.current = 1;
  getList();
};

const resetQuery = () => {
  queryParams.name = "";
  handleQuery();
};
const handleSelectionChange = (selection: Category[]) => {
  ids.value = selection.map((item: Category) => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = i18n.global.t("workflow.cateories.add");
};
const handleUpdate = (row: Category) => {
  reset();
  const id = row.id || ids.value[0];
  getCategory(id).then((response: ResultData<Category>) => {
    form.value = response.data;
    open.value = true;
    title.value = i18n.global.t("workflow.cateories.modify");
  });
};

const submitForm = () => {
  formRef.value?.validate(valid => {
    if (valid) {
      if (form.value.id) {
        updateCategory(form.value).then((response: ResultData) => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          open.value = false;
          getList();
        });
      } else {
        addCategory(form.value).then((response: ResultData) => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          open.value = false;
          getList();
        });
      }
    }
  });
};
const handleDelete = (row: Category) => {
  const caIds: number | number[] = row.id || ids.value;
  MessageBoxUtil.confirm(
    i18n.global.t("workflow.cateories.isDelete"),
    () => {
      delCategory(caIds).then((response: ResultData) => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        getList();
      });
    },
    i18n.global.t("formI18n.all.waring")
  );
};
</script>
