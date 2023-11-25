<template>
  <div class="outline-wrap">
    <div class="btn-wrap">
      <el-button
        v-if="!sortStatus"
        bg
        class="mt10"
        icon="ele-Rank"
        text
        @click="handleStartSort"
      >
        {{ $t("formgen.formOutline.change") }}
      </el-button>
      <el-button
        v-else
        bg
        class="mt10"
        icon="ele-Check"
        text
        type="primary"
        @click="handleSaveSortItemList"
      >
        {{ $t("formgen.formOutline.confirm") }}
      </el-button>
    </div>
    <div
      v-if="formItemList && formItemList.length"
      class="outline-content"
    >
      <el-scrollbar height="800px">
        <draggable
          :list="tempFormItemList"
          class="list-group"
          handle=".handle"
          item-key="formId"
          tag="div"
        >
          <template #item="{ element, index }">
            <div class="fa item ml5 mr10">
              <i
                v-if="sortStatus"
                class="el-icon handle"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m186.496 544 41.408 41.344a32 32 0 1 1-45.248 45.312l-96-96a32 32 0 0 1 0-45.312l96-96a32 32 0 1 1 45.248 45.312L186.496 480h290.816V186.432l-41.472 41.472a32 32 0 1 1-45.248-45.184l96-96.128a32 32 0 0 1 45.312 0l96 96.064a32 32 0 0 1-45.248 45.184l-41.344-41.28V480H832l-41.344-41.344a32 32 0 0 1 45.248-45.312l96 96a32 32 0 0 1 0 45.312l-96 96a32 32 0 0 1-45.248-45.312L832 544H541.312v293.44l41.344-41.28a32 32 0 1 1 45.248 45.248l-96 96a32 32 0 0 1-45.312 0l-96-96a32 32 0 1 1 45.312-45.248l41.408 41.408V544H186.496z"
                    fill="currentColor"
                  ></path>
                </svg>
              </i>
              {{ index + 1 }}.
              {{ removeHtmlTag(element.config.label) }}
            </div>
          </template>
        </draggable>
      </el-scrollbar>
    </div>
    <el-empty v-else />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { deepClone } from "@/utils/other";
import { removeHtmlTag } from "../../utils";

const props = defineProps({
  formItemList: {
    type: Array,
    default: () => []
  },
  formKey: {
    type: String,
    default: ""
  }
});

const sortStatus = ref(false);

const tempFormItemList = ref([]);

watch(
  () => props.formItemList,
  () => {
    tempFormItemList.value = deepClone(props.formItemList);
  },
  {
    immediate: true,
    deep: true
  }
);

const handleStartSort = () => {
  sortStatus.value = true;
};

const emit = defineEmits(["refreshFormList"]);
/**
 *  保存排序后的表单项
 */
const handleSaveSortItemList = () => {
  sortStatus.value = false;
  emit(
    "refreshFormList",
    tempFormItemList.value.map(item => item.vModel)
  );
};
</script>
<style lang="scss" scoped>
.outline-wrap {
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  user-select: none;

  .outline-content {
    margin-top: 15px;
  }

  .btn-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 10px;
    border-bottom: var(--el-border);
  }

  .item {
    margin-bottom: 5px;
    padding: 0 4px;
    box-sizing: border-box;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    color: var(--el-text-color-regular);
    transition: all 0.3s;
    display: flex;
    align-items: center;

    .i-icon {
      vertical-align: middle;
      display: flex;
      margin-right: 12px;
    }

    &:hover {
      background-color: var(--el-bg-color-page);
      cursor: pointer;
    }
  }
}
</style>
