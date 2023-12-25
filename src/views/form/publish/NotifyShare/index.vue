<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.notifyShare.title") }}</span>
        <span class="desc-text ml10">{{ $t("form.notifyShare.desc") }}</span>
      </div>
    </template>
    <div class="p10">
      <el-tabs
        type="card"
        v-model="activeName"
      >
        <el-tab-pane
          :label="$t('form.notifyShare.sendNotify')"
          name="sendNotify"
        >
          <send-notify-form
            @send-success="handleSendSuccess"
            v-if="sendStatus === 0"
          />
          <el-result
            v-else
            icon="success"
            :title="$t('form.notifyShare.sendSuccess')"
            :sub-title="$t('form.notifyShare.sendSuccessTip')"
          >
            <template #extra>
              <el-button
                type="primary"
                @click="sendStatus = 0"
              >
                {{ $t("form.notifyShare.continueSendMsg") }}
              </el-button>
            </template>
          </el-result>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('form.notifyShare.sendMsgHistory')"
          name="sendMsgHistory"
        >
          <send-detail-page v-if="activeName == 'sendMsgHistory'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import SendNotifyForm from "./SendNotifyForm.vue";
import SendDetailPage from "./SendDetailPage.vue";
import { ref } from "vue";

const handleSendSuccess = () => {
  sendStatus.value = 1;
};

const sendStatus = ref(0);

const activeName = ref("sendNotify");
</script>

<style scoped lang="scss">
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
