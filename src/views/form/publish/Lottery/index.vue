<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.lottery.title") }}</span>
        <span class="desc-text ml10">{{ $t("form.lottery.desc") }}</span>
      </div>
    </template>
    <div class="p10">
      <el-tabs
        v-model="activeName"
        type="card"
      >
        <el-tab-pane
          :label="$t('form.lottery.tab1Name')"
          name="sendNotify"
        >
          <lottery-config />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('form.lottery.tab2Name')"
          name="winningRecord"
        >
          <winning-record v-if="activeName === 'winningRecord'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import LotteryConfig from "./LotteryConfig.vue";
import WinningRecord from "./WinningRecord.vue";

const activeName = ref("sendNotify");
</script>

<style lang="scss" scoped>
.msg-content {
  width: 100%;
  height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  padding: 10px;
  background-color: var(--el-bg-color-page);
  border: var(--el-border);
  border-radius: 4px;
}
</style>
