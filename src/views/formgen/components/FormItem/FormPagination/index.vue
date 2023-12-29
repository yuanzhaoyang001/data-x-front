<template>
  <div class="page-container form-pagination-item">
    <div>
      <el-button
        v-if="prev && currPageNum !== 1"
        icon="ele-ArrowLeft"
        size="default"
        type="primary"
        :color="formThemeConfig?.themeColor"
        @click="prevClick"
      >
        {{ $t("formgen.formPagination.prevPageLabel") }}
      </el-button>
      <el-button
        v-if="currPageNum !== totalPageNum"
        size="default"
        type="primary"
        :color="formThemeConfig?.themeColor"
        @click="nextClick"
        :disabled="!allowNext"
      >
        {{ $t("formgen.formPagination.nextPageLabel") }}
        <el-icon class="el-icon--right">
          <el-icon>
            <ele-ArrowRight />
          </el-icon>
        </el-icon>
      </el-button>
    </div>
    <div style="text-align: center">
      <span
        v-if="currPage"
        class="desc-text"
      >
        {{ $t("formgen.formPagination.currentPagePrefix") }}{{ currPageNum }}{{ $t("formgen.formPagination.totalPagesSuffix") }}，
      </span>
      <span
        v-if="totalPage"
        class="desc-text"
      >
        {{ $t("formgen.formPagination.totalPagesPrefix") }}{{ totalPageNum }}{{ $t("formgen.formPagination.totalPagesSuffix") }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup name="FormPagination">
import { defineEmits, defineProps, inject, onMounted, onUnmounted, ref, Ref } from "vue";
import { FormPublicSetting } from "@/views/formgen/components/GenerateForm/types/form";
import { useUserForm } from "@/stores/userForm";

const props = defineProps({
  // 上一页按钮
  prev: {
    type: Boolean,
    default: true
  },
  // 显示当前页
  currPage: {
    type: Boolean,
    default: true
  },
  currPageNum: {
    type: Number,
    default: 1
  },
  // 显示总页数
  totalPage: {
    type: Boolean,
    default: true
  },
  totalPageNum: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(["prev", "next"]);

function prevClick() {
  emit("prev", props.currPageNum);
}

function nextClick() {
  emit("next", props.currPageNum);
}

// 每页一题的
const formSetting = inject<Ref<FormPublicSetting>>("formSetting");
// 允许下一页
const allowNext = ref<boolean>(true);

const intervalId = ref<any>(null);

const formThemeConfig = inject("formThemeConfig", { themeColor: "" });

let time = 0;

const startInterval = () => {
  intervalId.value = setInterval(() => {
    // 最短时间
    if (formSetting?.value?.onePageOneQuestion?.enableShortestStay) {
      if (formSetting?.value?.onePageOneQuestion?.shortestStayTime <= time) {
        allowNext.value = true;
      }
    }
    // 最长时间
    if (formSetting?.value.onePageOneQuestion?.enableLongestStay) {
      if (formSetting?.value?.onePageOneQuestion?.longestStayTime <= time) {
        emit("next", props.currPageNum);
      }
    }
    time++;
  }, 1000);
};

// Function to stop and clear the interval
const stopInterval = () => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

onMounted(() => {
  if (formSetting?.value && formSetting.value.onePageOneQuestion?.enableOnePageOneQuestion) {
    // 最短时间
    if (formSetting.value.onePageOneQuestion?.enableShortestStay) {
      allowNext.value = false;
    }
    if (formSetting?.value.onePageOneQuestion?.enableShortestStay || formSetting?.value.onePageOneQuestion?.enableLongestStay) {
      startInterval();
    }
  }
});

const userFormStore = useUserForm();
onUnmounted(() => {
  // Stop and clear the interval when the component is unmounted (destroyed)
  stopInterval();
  userFormStore.setCurrentPage((props.currPageNum + 1) as number);
});
</script>
<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
