<template>
  <div>
    <div class="container">
      <div>
        <el-input
          v-model="name"
          class="question-bank-input"
          :placeholder="$t('formI18n.all.search')"
          prefix-icon="ele-Search"
          size="default"
          @input="searchTopic"
        />
      </div>
      <div>
        <div class="title-top">
          <div>{{ $t("formgen.formQuestion.myQuestions") }}</div>
          <i @click="handleAdd">
            <el-icon><ele-Plus /></el-icon>
          </i>
        </div>
        <el-tree
          :data="personalQuestionTreeData"
          @node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span class="controls">
                <el-tooltip
                  :content="$t('formI18n.all.edit')"
                  placement="top"
                >
                  <el-button
                    v-if="node.level === 1"
                    icon="ele-Edit"
                    link
                    type="primary"
                    @click="handleUpdate(node)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  :content="$t('formI18n.all.delete')"
                  placement="top"
                >
                  <el-button
                    icon="ele-Delete"
                    link
                    type="danger"
                    @click="handleDelete(node)"
                  ></el-button>
                </el-tooltip>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
      <div>
        <div class="title-top">
          <div>{{ $t("formgen.formQuestion.commonQuestions") }}</div>
        </div>
        <el-tree
          :data="publicQuestionTreeData"
          @node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
      <!-- 弹出的对话框的内容 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="40%"
      >
        <el-form
          ref="formRef"
          :model="addForm"
          :rules="rules"
          label-width="90px"
        >
          <el-form-item
            :label="$t('formgen.formQuestion.name')"
            prop="name"
          >
            <el-input
              v-model="addForm.name"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('formgen.formQuestion.type')"
            prop="isPublic"
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
            :label="$t('formgen.formQuestion.desc')"
            œ
            prop="description"
          >
            <el-input
              v-model="addForm.description"
              maxlength="200"
              show-word-limit
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button
            type="primary"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="dialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";

import { MessageUtil } from "@/utils/messageUtil";
import {
  addQuestionBank,
  deleteQuestionBankById,
  getAllQuestionBankItemList,
  getQuestionBank,
  Question,
  QuestionBankDetails,
  updateQuestionBank
} from "@/api/question/bank";
import { delQuestionBankItemById, getQuestionBankItem, QuestionBankItem } from "@/api/question/bankItem";
import { i18n } from "@/i18n";

const personalQuestionTreeData = ref<TreeNode[]>([]);
const publicQuestionTreeData = ref<TreeNode[]>([]);
const dialogVisible = ref<boolean>(false);
const dialogTitle = ref<string>("");
const formRef = ref();
const name = ref();
const ids = ref<any>(null);
const addForm = ref<Question>({
  name: "",
  id: null,
  description: "",
  isPublic: false,
  bankType: 1
});

const bankTypeList = reactive([
  {
    value: 1,
    label: i18n.global.t("project.bank.survey")
  },
  {
    value: 4,
    label: i18n.global.t("project.bank.exam")
  }
]);
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

interface TreeNode {
  id: number;
  label: string;
  children: TreeNode[];
}

interface QuestionBankDetails {}

// 获取题库数据
const getList = async () => {
  const res = await getAllQuestionBankItemList({ name: name.value });
  // 将获取到的数据保存到personalQuestionBank和publicQuestionBank
  personalQuestionTreeData.value = res.data.personalQuestionBank?.map((item: QuestionBankDetails) => {
    return {
      id: item.questionBank?.id,
      label: item.questionBank?.name,
      children: item.questionBankItems
    };
  });

  publicQuestionTreeData.value = res.data.publicQuestionBank.map((item: QuestionBankDetails) => {
    return {
      id: item.questionBank?.id,
      label: item.questionBank?.name,
      children: item.questionBankItems
    };
  });
};

const searchTopic = async () => {
  await getList();
};
const handleAdd = async () => {
  dialogVisible.value = true;
  addForm.value.name = "";
  addForm.value.description = "";
  addForm.value.bankType = 1;
  dialogTitle.value = i18n.global.t("formgen.formQuestion.modifyMyBank");
};
const handleUpdate = async (node: any) => {
  ids.value = node.data.id;
  const res = await getQuestionBank(ids.value);
  addForm.value = res.data;
  dialogVisible.value = true;
  dialogTitle.value = i18n.global.t("formgen.formQuestion.addMyBank");
};

const submitForm = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    if (addForm.value.id) {
      await updateQuestionBank(addForm.value);
    } else {
      await addQuestionBank(addForm.value);
    }
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
  }
  addForm.value.name = "";
  addForm.value.description = "";
  dialogVisible.value = false;
  await getList();
};

const handleDelete = async (node: any) => {
  const id = node.data.id;
  if (node.level === 1) {
    await deleteQuestionBankById(id);
  } else {
    await delQuestionBankItemById(id);
  }
  await getList();
};

const emit = defineEmits(["add"]);

const handleNodeClick = async (data: QuestionBankItem) => {
  if (!data?.bankId) {
    return;
  }
  console.log(data);
  const item = await getQuestionBankItem(data.id as number);
  console.log(item.data.scheme);
  emit("add", item.data.scheme);
};

onMounted(() => {
  getList();
});
</script>
<style lang="scss" scoped>
.container {
  overflow-y: scroll;
  max-height: 750px;
}
.question-bank-input {
  width: 218px;
  margin: 10px auto;
}
.title-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  i {
    color: blue;
    margin-right: 5px;
    cursor: pointer;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node .controls {
  display: none;
}

.custom-tree-node:hover .controls {
  display: block;
}
</style>
