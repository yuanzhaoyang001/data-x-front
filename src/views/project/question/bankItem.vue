<template>
  <div class="app-container">
    <el-form
      :inline="true"
      :model="queryParam"
      @submit.native.prevent
      label-width="68px"
    >
      <el-form-item
        :label="$t('project.bank.name')"
        prop="name"
      >
        <el-tag>{{ questionBankName }}</el-tag>
      </el-form-item>
      <el-form-item
        :label="$t('project.bank.questionName')"
        prop="name"
      >
        <el-input
          v-model="queryParam.label"
          clearable
          :placeholder="$t('formI18n.all.pleaseEnter')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
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
          v-hasPermi="['form:questionBankItem:add']"
          icon="ele-Plus"
          plain
          type="success"
          @click="toAddQuestionPage"
        >
          {{ $t("project.bank.addQuestion") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :disabled="!ids.length"
          v-hasPermi="['form:questionBankItem:delete']"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("formI18n.all.delete") }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="questionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="ID"
        prop="id"
      />
      <el-table-column
        align="center"
        :label="$t('project.bank.title')"
        prop="label"
      />
      <el-table-column
        align="center"
        :label="$t('project.bank.type')"
        prop="itemType"
      >
        <template #default="scope">
          <el-tag>{{ scope.row.typeLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('project.bank.createTime')"
        prop="createTime"
      />
      <el-table-column
        align="center"
        :label="$t('project.bank.updateTime')"
        prop="updateTime"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('formI18n.all.operate')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('formI18n.all.view')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:questionBankItem:query']"
              icon="ele-View"
              link
              @click="handleView(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('formI18n.all.edit')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:questionBankItem:update']"
              icon="ele-Edit"
              link
              type="primary"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('formI18n.all.delete')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:questionBankItem:delete']"
              icon="ele-Delete"
              link
              type="danger"
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:limit="queryParam.size"
      v-model:page="queryParam.current"
      :total="total"
      @pagination="getList"
    />
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      :title="$t('formI18n.all.view')"
      width="30%"
      destroy-on-close
    >
      <generate-form
        v-if="dialogVisible"
        ref="generateForm"
        :form-conf="formConf"
        :page-form-model="{}"
        style="margin-bottom: 40px"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  deleteQuestionBankItem,
  pageQuestionBankItem,
  PageQuestionBankItemParam,
  QuestionBankItem
} from "@/api/question/bankItem";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { useRoute, useRouter } from "vue-router";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { formConf } from "@/views/formgen/components/GenerateForm/config";
import { i18n } from "@/i18n";

const loading = ref<boolean>(true);
const questionList = ref<QuestionBankItem | null>(null);

const queryParam = reactive<PageQuestionBankItemParam>({
  size: 10,
  current: 1,
  label: "",
  bankId: null
});

const total = ref<number>(0);
const ids = ref<number[]>([]);

const getList = () => {
  loading.value = true;
  const res = pageQuestionBankItem(queryParam).then(res => {
    if (res.data) {
      total.value = res.data.total;
      queryParam.size = res.data.size;
      queryParam.current = res.data.current;
      questionList.value = res.data.records;
    }
  });
  loading.value = false;
};
const handleQuery = () => {
  queryParam.current = 1;
  getList();
};
const resetQuery = () => {
  queryParam.label = "";
  getList();
};

const handleSelectionChange = (selection: QuestionBankItem[]) => {
  ids.value = selection.map(item => item.id as number);
};

const handleDelete = (row: QuestionBankItem) => {
  const caIds = row.id || ids.value;
  MessageBoxUtil.confirm(
    i18n.global.t("project.bank.isDelete"),
    () => {
      deleteQuestionBankItem(caIds).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        getList();
      });
    },
    i18n.global.t("formI18n.all.success")
  );
};
const dialogVisible = ref<boolean>(false);

const router = useRouter();

const bankType = ref<number>();
const toAddQuestionPage = () => {
  router.push({
    path: "/question/bankItem/add",
    query: {
      id: queryParam.bankId,
      type: bankType.value
    }
  });
};
const handleUpdate = (row: QuestionBankItem) => {
  router.push({
    path: "/question/bankItem/add",
    query: {
      id: queryParam.bankId,
      itemId: row.id,
      type: bankType.value
    }
  });
};

const formConf = ref<any>({
  fields: [],
  formKey: "",
  disabled: true,
  span: 24,
  size: "small",
  labelPosition: "top",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  formBtns: false,
  resetBtn: false,
  theme: {
    backgroundImg: "",
    showFormTitle: true,
    showFormDescribe: true,
    showFormNumber: false,
    btnsColor: null
  }
});

const handleView = (row: QuestionBankItem) => {
  formConf.value.fields = [];
  formConf.value.fields.push(row.scheme);
  dialogVisible.value = true;
};

const route = useRoute();

const questionBankName = ref<string>("");
watch(
  () => route.query,
  () => {
    queryParam.bankId = route.query.bankId as number;
    bankType.value = route.query.type as number;
    questionBankName.value = decodeURIComponent(route.query.name as string);
    getList();
  },
  { deep: false, immediate: true }
);
</script>

<style lang="scss" scoped></style>
