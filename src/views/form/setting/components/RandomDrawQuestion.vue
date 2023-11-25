<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    draggable
    :title="$t('form.setting.extractQuestionsDialogTitle')"
    width="65%"
  >
    <div
      class="text-danger"
      style="margin-left: 45px"
    >
      {{ $t("form.setting.randomQuestionText") }}
    </div>
    <el-link
      :underline="false"
      icon="ele-CirclePlus"
      size="mini"
      style="margin-left: 45px; margin-top: 10px"
      type="primary"
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
      <el-col
        :span="3"
        style="text-align: right"
      >
        {{ $t("form.setting.formQuestions") }}
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="item.startItemId"
          size="default"
        >
          <el-option
            v-for="(projectItem, index) in allProjectItemList"
            :key="projectItem.id"
            :label="`${index + 1} . ${projectItem.textLabel}`"
            :value="projectItem.formItemId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col
        :span="2"
        style="text-align: right"
      >
        {{ $t("form.setting.toQuestion") }}
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="item.endItemId"
          size="default"
        >
          <el-option
            v-for="(projectItem, index) in allProjectItemList"
            :key="projectItem.id"
            :label="`${index + 1} . ${projectItem.textLabel}`"
            :value="projectItem.formItemId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col
        :span="9"
        style="margin-left: 15px"
      >
        {{ $t("form.setting.randomDrawLabel") }}
        <el-input-number
          v-model="item.drawNum"
          :min="1"
          size="default"
        />
        {{ $t("form.setting.drawNumLabel") }}
        <el-icon
          class="cursor-pointer mr15"
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
import { MessageUtil } from "@/utils/messageUtil";
import { listProjectItemRequest } from "@/api/project/form";
import { useRoute } from "vue-router";
import { i18n } from "@/i18n";

const dialogFormVisible = ref(false);

interface DrawQuestionItemType {
  // 开始题目Id
  startItemId: string | null;
  //  结束题目位置
  endItemId: string | null;
  // 抽取几道题目
  drawNum: number;
}

const drawQuestionRuleList = ref<DrawQuestionItemType[]>([
  {
    startItemId: null,
    endItemId: null,
    drawNum: 1
  }
]);

const handleAddDrawQuestionRule = () => {
  // 获取最后一条数据
  const last = drawQuestionRuleList.value[drawQuestionRuleList.value.length - 1];
  if (allProjectItemList.value.findIndex(item => item.formItemId === last.endItemId) == allProjectItemList.value.length - 1) {
    MessageUtil.error(i18n.global.t("form.setting.lastQuestionTips"));
    return;
  }
  drawQuestionRuleList.value.push({
    startItemId: null,
    endItemId: null,
    drawNum: 1
  });
};

const handleDeleteDrawQuestionRule = (index: number) => {
  drawQuestionRuleList.value.splice(index, 1);
};

const route = useRoute();

const allProjectItemList = ref<any[]>([]);

onMounted(async () => {
  listProjectItemRequest({ key: route.query.key }).then(res => {
    allProjectItemList.value = res.data.filter((item: any) => {
      return item.type !== "PAGINATION";
    });
  });
});

const emit = defineEmits(["change"]);

const submitForm = async () => {
  const ruleList = drawQuestionRuleList.value.filter((item: DrawQuestionItemType) => item.startItemId && item.endItemId);
  // 校验规则
  if (ruleList.length) {
    let prevItem = null;
    for (let i = 0; i < ruleList.length; i++) {
      const rule = ruleList[i];
      const startIndex = allProjectItemList.value.findIndex(item => item.formItemId === rule.startItemId);
      const endIndex = allProjectItemList.value.findIndex(item => item.formItemId === rule.endItemId);
      if (endIndex < startIndex) {
        MessageUtil.error(i18n.global.t("form.setting.endTips"));
        return;
      }
      const prevStartIndex = allProjectItemList.value.findIndex(item => item.formItemId === prevItem?.startItemId);
      const prevEndIndex = allProjectItemList.value.findIndex(item => item.formItemId === prevItem?.endItemId);
      // 不允许交叉
      if (isNumberInRange(startIndex, prevStartIndex, prevEndIndex) || isNumberInRange(endIndex, prevStartIndex, prevEndIndex)) {
        MessageUtil.error(i18n.global.t("form.setting.rangeTips"));
        return;
      }
      if (startIndex < prevEndIndex) {
        MessageUtil.error(i18n.global.t("form.setting.sequentialRules"));
        return;
      }
      prevItem = rule;
    }
  }

  dialogFormVisible.value = false;
  emit("change", ruleList);
};

function isNumberInRange(number, min, max) {
  if (number >= min && number <= max) {
    return true;
  } else {
    return false;
  }
}

const showDialog = async (ruleList: []) => {
  if (ruleList && ruleList.length) {
    drawQuestionRuleList.value = ruleList;
  }
  dialogFormVisible.value = true;
};

defineExpose({ showDialog });
</script>
<style scoped></style>
