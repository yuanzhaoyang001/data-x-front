<template>
  <div>
    <el-radio-group
      v-if="!item?.multiple"
      @change="handleChange"
      v-model="changeValue"
    >
      <div
        v-for="option in getOptions()"
        :key="option.value"
        class="img-radio-item"
      >
        <vote
          :value="option.value"
          :type="'img'"
          :vote-list="voteList"
          :total-vote="totalVote"
          v-if="item?.config.showVoteResult"
        ></vote>
        <el-image
          :preview-src-list="[option.image]"
          :src="option.image"
          class="image"
          fit="scale-down"
        >
          <template #error>
            <div class="image-slot">
              <el-icon>
                <ele-Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="checkbox-slot">
          <el-radio :label="option.value">
            <div>
              {{ option.label }}
            </div>
          </el-radio>
        </div>
      </div>
    </el-radio-group>
    <el-checkbox-group
      v-else
      @change="handleChange"
      v-model="changeValue"
      class="img-select-checkbox-group"
    >
      <div
        v-for="option in getOptions()"
        :key="option.value"
        class="img-radio-item"
      >
        <vote
          :value="option.value"
          :type="'img'"
          :vote-list="voteList"
          :total-vote="totalVote"
          v-if="item.config.showVoteResult"
        ></vote>
        <el-image
          :preview-src-list="[option.image]"
          :src="option.image"
          class="image"
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <el-icon>
                <ele-Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="checkbox-slot">
          <el-checkbox :label="option.value">
            <div>
              {{ option.label }}
            </div>
          </el-checkbox>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script setup name="TImageSelect" lang="ts">
import Vote from "../TVote/vote.vue";
import { onMounted, ref, watch } from "vue";
import { useFormItemExam } from "../hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "../hooks/useFormItemHook";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { useVoteHook } from "@/views/formgen/components/FormItem/TVote/useVoteHook";

const props = defineProps({
  ...formItemProps,
  models: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits([...formEmits, "changeLabel"]);

const examHook = useFormItemExam(<BasicComponent>props.item);
const formItemHook = useFormItem(props, emits);
const { changeValue, getOptions } = formItemHook;
const voteHook = useVoteHook(props);
const { handleVote, handleArrayVote, voteList, totalVote } = voteHook;

watch(
  () => changeValue,
  (val: any) => {
    if (!changeValue.value) {
      return;
    }
    let labelValue = null;
    if (Array.isArray(val)) {
      const arr = getOptions()
        .filter((item: any) => changeValue.value.includes(item.value))
        .map((item: any) => item.label);
    } else {
      console.log(props.item);
      labelValue = getOptions().find((item: any) => changeValue.value == item.value)?.label;
    }
    emits("changeLabel", labelValue);
  },
  {
    deep: true
  }
);

const handleChange = (val: any) => {
  if (Array.isArray(val)) {
    handleArrayVote(changeValue.value);
  } else {
    handleVote(changeValue.value);
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-radio-button__inner, .el-radio-group, .el-checkbox-group) {
  display: flex !important;
  flex-wrap: wrap;
  width: 100%;
}

.img-radio-item {
  border-radius: 10px;
  display: flex;
  flex-direction: column !important;
  align-content: center !important;
  align-items: center !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  margin: 3px !important;
  background-color: #fff;

  .image {
    width: 120px;
    height: 120px;
    margin: 5px;
  }
}

.checkbox-slot {
  width: 120px;
  margin: 0 5px;

  :deep(.el-checkbox, .el-radio) {
    width: 120px;
    display: flex;
    align-items: center;
    white-space: break-spaces;
    word-break: break-all;
    padding: 10px 0;

    .el-checkbox__input,
    .el-radio__input {
      width: 20px;
    }

    .el-checkbox__label,
    .el-radio__label {
      flex: 1;
      overflow: hidden;
      padding-right: 10px;
    }
  }
}

.img-select-checkbox-group {
  display: flex;

  .el-checkbox {
    padding: 0 9px;
  }
}

:deep(.image-slot) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

@media (max-width: 750px) {
  .img-radio-item {
    width: calc(50% - 6px);

    .image {
      width: 100%;
      height: 150px;
      margin: 0;
      padding: 5px;
    }
  }
  .checkbox-slot {
    width: 100%;

    .el-checkbox,
    .el-radio {
      width: 100%;
    }
  }
}
</style>
