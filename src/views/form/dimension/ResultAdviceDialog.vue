<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('form.dimension.resultDialogTitle')"
    width="50%"
  >
    <div>
      <span class="el-form-item__label">{{ $t("form.dimension.sumScoreTitle") }}</span>
      <span class="dimension-item__score ml20 text-danger">{{ currentSumScore }}</span>
    </div>
    <el-form v-model="form">
      <el-form-item
        :label="$t('form.dimension.scoreRangeLabel')"
        prop="name"
      >
        <el-row :gutter="10">
          <el-col :span="5">
            <el-input-number
              v-model="form.minScore"
              :max="currentSumScore"
              controls-position="right"
              :min="0"
              size="small"
            />
          </el-col>
        </el-row>
        <el-col :span="5">
          <el-select
            v-model="form.minCompare"
            size="small"
          >
            <el-option
              label="&lt;"
              :value="1"
            >
              &lt;
            </el-option>
            <el-option
              label="&lt;="
              :value="2"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <span class="ml5">{{ $t("form.dimension.score") }}</span>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="form.maxCompare"
            size="small"
          >
            <el-option
              label="&lt;"
              :value="1"
            >
              &lt;
            </el-option>
            <el-option
              label="&lt;="
              :value="2"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input-number
            v-model="form.maxScore"
            :max="currentSumScore"
            controls-position="right"
            :min="0"
            size="small"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        :label="$t('form.dimension.resultSuggestionIndex')"
        prop="advice"
      >
        <form-tinymce v-model:value="form.advice" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          size="default"
          @click="dialogVisible = false"
        >
          {{ $t("common.cancel") }}
        </el-button>
        <el-button
          size="default"
          type="primary"
          @click="handleSubmit"
        >
          {{ $t("common.enter") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ResultAdvice } from "@/views/form/dimension/types";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";

const dialogVisible = ref(false);
const form = ref<ResultAdvice>({
  advice: "",
  minScore: 0,
  maxScore: 0,
  minCompare: 1,
  maxCompare: 1
});

const currentSumScore = ref(0);

const handleShow = (item: any, score: number) => {
  dialogVisible.value = true;
  if (item) {
    form.value = item;
  } else {
    form.value = {
      advice: "",
      minScore: 0,
      maxScore: 0,
      minCompare: 1,
      maxCompare: 1
    };
  }
  currentSumScore.value = score;
};

defineExpose({
  handleShow
});

const emit = defineEmits(["submit"]);

const handleSubmit = () => {
  dialogVisible.value = false;
  emit("submit", form.value);
};
</script>
<style lang="scss" scoped></style>
