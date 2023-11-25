<template>
  <el-tabs
    tab-position="top"
    style="height: 200px"
    class="demo-tabs"
  >
    <el-tab-pane :label="$t('system.home.forms')">
      <ul class="rank-list">
        <li
          v-for="(item, index) in submitList"
          :key="index"
          class="rank-item"
        >
          <div class="name">
            <span
              class="num"
              v-show="index < 4"
            >
              {{ index + 1 }}
            </span>
            {{ item.formName }}
          </div>
          <div class="count mr10">
            {{ item.count }}
          </div>
        </li>
      </ul>
      <el-empty v-if="!submitList.length" />
    </el-tab-pane>
    <el-tab-pane :label="$t('system.home.view')">
      <ul class="rank-list">
        <li
          v-for="(item, index) in viewList"
          :key="index"
          class="rank-item"
        >
          <div class="name">
            <span
              class="num"
              v-show="index < 4"
            >
              {{ index + 1 }}
            </span>
            {{ item.formName }}
          </div>
          <div class="count mr10">
            {{ item.count }}
          </div>
        </li>
      </ul>
      <el-empty v-if="!viewList.length" />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getTopSubmitFormInfoReq, getTopViewFormInfoReq, TopFormInfo } from "@/api/mannage/analysis";

const submitList = ref<TopFormInfo[]>([]);
const viewList = ref<TopFormInfo[]>([]);

onMounted(() => {
  getTopSubmitFormInfoReq().then(res => {
    submitList.value = res.data;
  });
  getTopViewFormInfoReq().then(res => {
    viewList.value = res.data;
  });
});
</script>
<style scoped lang="scss">
.rank-list {
  list-style: none;
  .rank-item {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    line-height: 30px;
    margin: 3px 5px;
    user-select: none;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-base);

    .name {
      display: flex;
      align-items: center;
      align-content: center;
    }

    .num {
      margin-right: 20px;
      background-color: var(--el-color-primary);
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 20px;
      text-align: center;
      display: inline-block;
      color: #ffffff;
      font-size: 14px;
    }

    .count {
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-base);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
li {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeIn 0.5s ease-in-out forwards;
}
</style>
