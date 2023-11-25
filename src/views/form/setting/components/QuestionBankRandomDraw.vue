<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    draggable
    :title="$t('form.setting.extractQuestionsDialogTitle')"
    width="80%"
  >
    <el-link
      :underline="false"
      icon="ele-CirclePlus"
      size="default"
      type="primary"
      style="margin-left: 45px"
      @click="handleAddDrawQuestionRule"
    >
      {{ $t("form.setting.addRuleButtonLabel") }}
    </el-link>
    <el-row
      v-for="(item, index) in drawQuestionRuleList"
      :key="index"
      align="middle"
      class="mt10"
      justify="center"
    >
      <el-col :span="3">{{ $t("form.setting.fromBankLabel") }}</el-col>
      <el-col :span="4">
        <el-select
          v-model="item.bankId"
          filterable
          size="default"
        >
          <el-option-group :label="$t('form.setting.personalBankGroupLabel')">
            <el-option
              v-for="item in personalQuestionBankList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
          <el-option-group :label="$t('form.setting.publicBankGroupLabel')">
            <el-option
              v-for="item in publicQuestionBankList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
      </el-col>
      <el-col :span="3">{{ $t("form.setting.selectItemTypeLabel") }}</el-col>
      <el-col :span="4">
        <el-select
          v-model="item.itemType"
          size="default"
        >
          <el-option
            v-for="item in allItemType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        {{ $t("form.setting.randomDrawLabel") }}
        <el-input-number
          v-model="item.drawNum"
          :min="1"
          size="default"
        />
        {{ $t("form.setting.drawNumLabel") }}
        <el-icon
          class="cursor-pointer ml15 mt5"
          color="#F56C6C"
          @click="handleDeleteDrawQuestionRule"
        >
          <ele-Remove />
        </el-icon>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="RandomDrawQuestion" setup>
import { onMounted, ref } from "vue";
import { listQuestionBank, Question } from "@/api/question/bank";
import { i18n } from "@/i18n";

const dialogFormVisible = ref(false);

interface DrawQuestionItemType {
  // 题库id
  bankId: number | null;
  //  题目类型
  itemType: string | null;
  // 抽取几道题目
  drawNum: number;
}

const drawQuestionRuleList = ref<DrawQuestionItemType[]>([
  {
    bankId: null,
    itemType: null,
    drawNum: 1
  }
]);

const handleAddDrawQuestionRule = () => {
  // 获取最后一条数据
  drawQuestionRuleList.value.push({
    bankId: null,
    itemType: null,
    drawNum: 1
  });
};

const handleDeleteDrawQuestionRule = (index: number) => {
  drawQuestionRuleList.value.splice(index, 1);
};

const allItemType = ref<any[]>([
  {
    value: "INPUT",
    label: i18n.global.t("formgen.config.INPUT")
  },
  {
    value: "NUMBER",
    label: i18n.global.t("formgen.config.NUMBER")
  },
  {
    value: "TEXTAREA",
    label: i18n.global.t("formgen.config.TEXTAREA")
  },
  {
    value: "RADIO",
    label: i18n.global.t("formgen.config.RADIO")
  },
  {
    value: "CHECKBOX",
    label: i18n.global.t("formgen.config.CHECKBOX")
  },
  {
    value: "SELECT",
    label: i18n.global.t("formgen.config.SELECT")
  }
]);

// 个人题库
const personalQuestionBankList = ref<Question[]>([]);
// 公开题库
const publicQuestionBankList = ref<Question[]>([]);

onMounted(async () => {
  listQuestionBank(null, false).then(res => {
    personalQuestionBankList.value = res.data;
  });
  listQuestionBank(null, true).then(res => {
    publicQuestionBankList.value = res.data;
  });
});

const emit = defineEmits(["change"]);

const submitForm = async () => {
  dialogFormVisible.value = false;
  emit(
    "change",
    drawQuestionRuleList.value.filter((item: DrawQuestionItemType) => item.bankId && item.itemType)
  );
};

const showDialog = async (ruleList: []) => {
  if (ruleList && ruleList.length) {
    drawQuestionRuleList.value = ruleList;
  }
  dialogFormVisible.value = true;
};

defineExpose({ showDialog });
</script>
<style scoped></style>
