<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      :inline="true"
      :model="queryList"
      label-width="68px"
    >
      <el-form-item
        :label="$t('project.bank.name')"
        prop="name"
      >
        <el-input
          v-model="queryList.name"
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
          v-hasPermi="['form:questionBank:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("formI18n.all.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['form:questionBank:update']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("formI18n.all.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['form:questionBank:delete']"
          :disabled="multiple"
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
        :label="$t('project.bank.name')"
        prop="name"
      />
      <el-table-column
        align="center"
        :label="$t('project.bank.desc')"
        prop="description"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        :label="$t('project.bank.type')"
        prop="bankType"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.bankType == 1">{{ $t("project.bank.survey") }}</el-tag>
          <el-tag v-else>{{ $t("project.bank.exam") }}</el-tag>
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
            :content="$t('project.bank.questionSetting')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:questionBankItem:page']"
              icon="ele-Menu"
              link
              type="primary"
              @click="toQuestionItemPage(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('formI18n.all.modify')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:questionBank:update']"
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
              v-hasPermi="['form:questionBank:delete']"
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
      v-show="queryList.total > 0"
      v-model:limit="queryList.size"
      v-model:page="queryList.current"
      :total="queryList.total"
      @pagination="getList"
    />
    <!-- 弹出的对话框的内容 -->
    <el-dialog
      append-to-body
      v-model="dialogVisible"
      :title="dialogTitle"
      width="30%"
    >
      <el-form
        ref="formRef"
        :model="addForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          :label="$t('project.bank.name')"
          prop="name"
        >
          <el-input
            v-model="addForm.name"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('project.bank.desc')"
          prop="description"
        >
          <el-radio-group
            v-for="bank in bankTypeList"
            :key="bank.value"
            v-model="addForm.bankType"
          >
            <el-radio
              class="ml10"
              :label="bank.value"
            >
              {{ bank.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('project.bank.desc')"
          prop="description"
        >
          <el-input
            v-model="addForm.description"
            maxlength="200"
            show-word-limit
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="closeDialog">{{ $t("formI18n.all.cancel") }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import {
  addQuestionBank,
  deleteQuestionBank,
  getQuestionBank,
  pageQuestionBank,
  PageQuestionParam,
  Question,
  updateQuestionBank
} from "@/api/question/bank";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { i18n } from "@/i18n";

const showSearch = ref<boolean>(true);
const loading = ref<boolean>(true);
const questionList = ref<any>(null);
const dialogVisible = ref<boolean>(false);
const dialogTitle = ref("");
const queryList = reactive<PageQuestionParam>({
  total: 0,
  size: 10,
  current: 1,
  name: "",
  bankType: null
});
const addForm = ref<Question>({
  name: "",
  id: null,
  description: "",
  isPublic: true,
  bankType: 1
});

const bankTypeList = [
  {
    value: 1,
    label: i18n.global.t("project.bank.survey")
  },
  {
    value: 4,
    label: i18n.global.t("project.bank.exam")
  }
];

const ids = ref<number[]>([]);
const single = ref<boolean>(true);
const multiple = ref<boolean>(true);
const formRef = ref<FormInstance>();
const rules = reactive({
  name: [
    {
      required: true,
      message: i18n.global.t("project.bank.isNull"),
      trigger: "blur"
    },
    { min: 1, max: 100, message: i18n.global.t("project.bank.nameSize"), trigger: "blur" }
  ],
  description: [{ min: 1, max: 200, message: i18n.global.t("project.bank.nameSize"), trigger: "blur" }]
});
const getList = async () => {
  loading.value = true;
  const res = await pageQuestionBank(queryList);
  queryList.total = res.data.total;
  queryList.size = res.data.size;
  queryList.current = res.data.current;
  questionList.value = res.data.records;
  loading.value = false;
};

const handleSelectionChange = (selection: Question[]) => {
  ids.value = selection.map((item: Question) => item.id) as number[];
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};
const handleAdd = () => {
  addForm.value.name = "";
  addForm.value.description = "";
  addForm.value.id = null;
  addForm.value.isPublic = true;
  dialogVisible.value = true;
  dialogTitle.value = i18n.global.t("project.bank.add");
};

const handleUpdate = async (row: Question) => {
  const id = row.id || ids.value[0];
  const res = await getQuestionBank(id);
  addForm.value = res.data;
  dialogVisible.value = true;
  dialogTitle.value = i18n.global.t("project.bank.modifyBank");
};

const submitForm = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    if (addForm.value.id) {
      await updateQuestionBank(addForm.value);
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
    } else {
      await addQuestionBank(addForm.value);
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
    }
    dialogVisible.value = false;
    await getList();
  }
};

const handleDelete = (row: Question) => {
  const caIds = row.id || ids.value;
  MessageBoxUtil.confirm(
    i18n.global.t("project.bank.isDelete"),
    () => {
      deleteQuestionBank(caIds).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        getList();
      });
    },
    i18n.global.t("formI18n.all.waring")
  );
};
const router = useRouter();

const toQuestionItemPage = (item: Question) => {
  router.push({
    path: "/question/BankItem",
    query: {
      bankId: item.id,
      type: item.bankType,
      name: encodeURIComponent(item.name)
    }
  });
};

// 取消按钮
const closeDialog = () => {
  dialogVisible.value = false;
};
const handleQuery = () => {
  queryList.current = 1;
  getList();
};
//重置按钮操作
const resetQuery = () => {
  queryList.name = "";
  getList();
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped></style>
