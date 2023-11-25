<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    draggable
    title="添加到题库"
    width="600px"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="90px"
    >
      <el-form-item
        label="标题"
        prop="label"
      >
        <el-input
          v-model="ruleForm.label"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item
        label="题库"
        prop="bankId"
      >
        <el-select
          v-model="ruleForm.bankId"
          placeholder="请选择题库"
        >
          <el-option
            v-for="bank in questionBankList"
            :label="bank.name"
            :value="bank.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import type { FormInstance, FormRules } from "element-plus";
import { addToQuestionBank, QuestionBankItem } from "@/api/question/bankItem";
import { listQuestionBank, Question } from "@/api/question/bank";
import { useFormInfo } from "@/stores/formInfo";
import { removeHtmlTag } from "@/views/formgen/utils";
import { MessageUtil } from "@/utils/messageUtil";

const dialogFormVisible = ref(false);

const ruleForm = reactive<QuestionBankItem>({
  label: "",
  bankId: null,
  itemType: null
});

const rules = reactive<FormRules>({
  label: [{ required: true, message: "请输入标题", trigger: "blur" }],
  bankId: [
    {
      required: true,
      message: "请选择题库",
      trigger: "change"
    }
  ]
});
const ruleFormRef = ref<FormInstance>();

const { formType } = useFormInfo();

const questionBankList = ref<Question[]>();

onMounted(async () => {});

const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      await addToQuestionBank(ruleForm);
      MessageUtil.success("添加成功");
      dialogFormVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const showDialog = async (item: BasicComponent) => {
  const res = await listQuestionBank(formType == 4 ? formType : 1, false);
  questionBankList.value = res.data;
  dialogFormVisible.value = true;
  ruleForm.label = removeHtmlTag(item.config.label);
  ruleForm.itemType = item.typeId;
  ruleForm.scheme = item;
};

defineExpose({ showDialog });
</script>
<style scoped></style>
