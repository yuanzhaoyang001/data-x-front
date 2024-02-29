<template>
  <div class="setting-wrap">
    <div class="left-wrap">
      <div class="title">{{ $t("form.dimension.dimensionList") }}</div>
      <div class="dimension-list">
        <draggable
          :list="dimensionConf.dimensionList"
          class="list-group"
          handle=".handle"
          item-key="name"
          tag="ul"
        >
          <template #item="{ element, index }">
            <li
              :class="element.id === currentDimension?.id ? 'list-group-item__active' : ''"
              class="list-group-item"
              @click="handleSetCurrentDimension(element)"
            >
              <el-icon class="handle">
                <drag
                  fill="#333"
                  size="30"
                  theme="outline"
                />
              </el-icon>
              <span class="text">{{ element.name }}</span>
            </li>
          </template>
        </draggable>
      </div>
    </div>
    <div class="right-wrap">
      <div class="title">{{ $t("form.dimension.questionName") }}</div>
      <div class="selected-items">
        <div class="sub-title">{{ $t("form.dimension.selectedQuestion") }}</div>
        <div class="form-item-list">
          <div
            v-for="item in getSelectedList"
            :key="item.formItemId"
            class="form-item"
            @click="handleRemoveDimensionFieldList(item.formItemId)"
          >
            <el-icon>
              <ele-CircleClose />
            </el-icon>
            {{ item.textLabel }}
          </div>
        </div>
      </div>
      <div class="todo-items">
        <div class="sub-title">{{ $t("form.dimension.pendingQuestion") }}</div>
        <div class="form-item-list">
          <div
            v-for="item in getTodoList"
            :key="item.formItemId"
            class="form-item"
            @click="handleAddDimensionFieldList(item.formItemId)"
          >
            <el-icon>
              <ele-CirclePlus />
            </el-icon>
            {{ item.textLabel }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import draggable from "vuedraggable";
import { computed, onMounted, ref } from "vue";
import { DimensionConfig, DimensionInfo } from "./types";
import { Drag } from "@icon-park/vue-next";
import { ProjectItem } from "@/api/project/form";

const props = defineProps<{
  dimensionConf: DimensionConfig;
  fields: ProjectItem[];
}>();

// 当前维度
const currentDimension = ref<DimensionInfo | null>(null);

onMounted(() => {
  if (props.dimensionConf.dimensionList && props.dimensionConf.dimensionList.length > 0) {
    currentDimension.value = props.dimensionConf.dimensionList[0];
  }
});

// 获取已选择题目的列表
const getSelectedList = computed(() => {
  return props.fields.filter((field: ProjectItem) => {
    return currentDimension.value?.fieldList?.includes(field.formItemId);
  });
});

// 获取未在任何维度中选择的题目列表
const getTodoList = computed(() => {
  const fieldList = props.dimensionConf.dimensionList.map(item => item.fieldList).flat();
  return props.fields.filter(field => {
    return !fieldList?.includes(field.formItemId);
  });
});

const handleAddDimensionFieldList = (fieldId: string) => {
  currentDimension.value?.fieldList.push(fieldId);
};

const handleRemoveDimensionFieldList = (fieldId: string) => {
  currentDimension.value?.fieldList.splice(currentDimension.value?.fieldList.findIndex(item => item === fieldId), 1);
};

const handleSetCurrentDimension = (ele: DimensionInfo) => {
  currentDimension.value = ele;
};
</script>

<style lang="scss" scoped>
.setting-wrap {
  padding: 20px;
  display: flex;
  height: 90%;

  .left-wrap {
    width: 30%;
    height: 75vh;
  }

  .right-wrap {
    margin-left: 20px;
    width: 70%;
    min-height: 70vh;
  }
}

.left-wrap {
  .dimension-list {
    margin-top: 10px;
    border: var(--el-border);
    height: 100%;
    padding: 20px;
    border-radius: 5px;
    overflow: auto;
  }

  .list-group-item {
    display: flex;
    align-items: center;
    border-radius: 5px;
    border: var(--el-border);
    padding: 10px;
    margin-bottom: 10px;

    .handle {
      cursor: move;
    }

    .text {
      margin-left: 10px;
    }

    &:hover {
      background-color: var(--el-color-primary-light-10);
      color: var(--el-color-primary);
    }

    &__active {
      background-color: var(--el-color-primary-light-10);
      color: var(--el-color-primary);
    }
  }
}

.right-wrap {
  .selected-items,
  .todo-items {
    margin-top: 10px;
    border: var(--el-border);
    height: 45%;
    padding: 10px 20px;
    border-radius: 5px;
    overflow: scroll;

    .sub-title {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-bottom: 8px;
    }

    .form-item {
      height: 26px;
      color: var(--el-text-color-primary);
      font-size: var(--el-font-size-base);
      line-height: 26px;
      display: flex;
      justify-items: center;
      align-content: center;
      align-items: center;
      white-space: nowrap;
      text-overflow: ellipsis;

      .el-icon {
        margin-right: 5px;
      }

      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
  }
}
</style>
