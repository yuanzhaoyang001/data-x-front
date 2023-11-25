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
        :label="$t('workflow.flowList.name')"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          :placeholder="$t('formI18n.all.pleaseEnter')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-dropdown trigger="click">
        <el-form-item
          :label="$t('workflow.flowList.categoriesName')"
          prop="categoriesId"
          class="container-frame-bottom"
        >
          <el-select
            v-model="queryParams.categoriesId"
            class="m-2"
            :placeholder="$t('workflow.flowList.pleaseChoose')"
            size="large"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-dropdown>
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
          v-hasPermi="['flow:extensionInfo:add']"
          type="primary"
          plain
          icon="ele-Plus"
          @click.stop="openDialog()"
        >
          {{ $t("workflow.flowList.newFlow") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['flow:extensionInfo:update']"
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click.stop="openDialog(ids[0])"
        >
          {{ $t("workflow.flowList.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['flow:extensionInfo:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click.stop="handleDelete"
        >
          {{ $t("workflow.flowList.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>
    <FlowDialog
      ref="flowDialogRef"
      @design="handleDesignFlow"
      @refresh="handleQuery"
    />
    <el-table
      v-loading="loading"
      :data="flowList"
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
        :label="$t('workflow.flowList.categoriesName')"
        align="center"
        prop="name"
      />
      <el-table-column
        :label="$t('workflow.flowList.categoriesName')"
        align="center"
        prop="cateName"
      ></el-table-column>
      <el-table-column
        :label="$t('workflow.flowList.icon')"
        align="center"
        prop="icon"
      >
        <template #default="scope">
          <el-icon style="font-size: 20px">
            <component
              :is="scope.row.icon"
              :color="scope.row.color"
            ></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('workflow.flowList.createTime')"
        align="center"
        prop="createTime"
      />
      <el-table-column
        :label="$t('workflow.flowList.operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('workflow.flowList.modify')"
            placement="top"
          >
            <el-button
              v-hasPermi="['flow:extensionInfo:update']"
              link
              type="primary"
              icon="ele-Setting"
              @click="openDialog(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('workflow.flowList.designFlow')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleDesignFlow(scope.row.formKey)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('workflow.flowList.delete')"
            placement="top"
          >
            <el-button
              v-hasPermi="['flow:extensionInfo:delete']"
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

<script setup lang="ts" name="FlowManage">
import { onMounted, reactive, ref } from "vue";
import {
  ExtensionPageRes,
  FlowExtensionInfo,
  getFormExtensionInfoPageRequest,
  PageExtensionParam,
  postExtensionInfoDelete
} from "@/api/workflow/flowExtension";
import { Category, getCategoriesList } from "@/api/workflow/categories";
import { useRouter } from "vue-router";
import FlowDialog from "@/views/workflow/list/FlowDialog.vue";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { ResultData } from "@/api/types";
import { useFormInfo } from "@/stores/formInfo";

const loading = ref<boolean>(false);

const showSearch = ref<boolean>(true);

const flowList = ref<FlowExtensionInfo[]>([]);

const total = ref<number>(0);

const flowDialogRef = ref<InstanceType<typeof FlowDialog> | any>(null);

const queryParams: PageExtensionParam = reactive({
  current: 1,
  size: 10,
  name: "",
  categoriesId: []
});

const openDialog = (id?: number) => {
  flowDialogRef.value.openDialog(id);
};

const options = ref<Category[]>([]);
const ids = ref<number[]>([]);
const single = ref<boolean>(true);
const multiple = ref<boolean>(true);
onMounted(async () => {
  const res = await getCategoriesList();
  options.value = res.data;
  await getList();
});
const handleQuery = () => {
  queryParams.current = 1;
  getList();
};
const resetQuery = () => {
  queryParams.name = "";
  queryParams.categoriesId = [];
  handleQuery();
};
/** 查询单主题分类列表 */
const getList = async () => {
  loading.value = true;
  await getFormExtensionInfoPageRequest(queryParams).then((response: ResultData<ExtensionPageRes>) => {
    loading.value = false;
    if (response.data.records) {
      flowList.value = response.data.records.map((item: FlowExtensionInfo) => {
        item.cateName = options.value?.find((option: Category) => item.categoriesId === option.id)?.name;
        return item;
      });
    }
    total.value = response.data.total;
  });
};

const handleSelectionChange = (selection: FlowExtensionInfo[]) => {
  ids.value = selection.map((item: FlowExtensionInfo) => item.id) as number[];
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};

/** 删除按钮操作 */
const handleDelete = (row: FlowExtensionInfo) => {
  const caIds = row.id || ids.value;
  MessageBoxUtil.confirm(
    '是否确认删除流程编号为"' + caIds + '"的数据项？',
    () => {
      postExtensionInfoDelete(caIds).then(() => {
        MessageUtil.success("删除成功");
        getList();
      });
    },
    "删除提示"
  );
};

const router = useRouter();
const formStore = useFormInfo();

/**
 * 设计流程
 * @param key
 */
const handleDesignFlow = (key: string) => {
  formStore.setBackRoute(router.currentRoute.value.path);
  router.push({
    path: "/project/form/editor/index",
    query: { key: key }
  });
};
</script>

<style scoped lang="scss"></style>
