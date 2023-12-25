<template>
  <div>
    <el-table
      v-loading="loading"
      :data="sendDetailList"
      @selection-change="handleSelectionChange"
      max-height="60vh"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('form.notifyShare.msgContent')"
        show-overflow-tooltip
        prop="msgContent"
      />
      <el-table-column
        align="center"
        :label="$t('form.notifyShare.msgTypeDesc')"
        prop="status"
      >
        <template #default="scope">
          {{ scope.row.msgTypeDesc }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('form.notifyShare.sendCount')"
        prop="sendCount"
      />
      <el-table-column
        align="center"
        :label="$t('form.notifyShare.sendTime')"
        prop="createTime"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('form.notifyShare.operate')"
      >
        <template #default="scope">
          <el-button
            icon="ele-View"
            link
            type="primary"
            @click="handleShowDetail(scope.row)"
          >
            {{ $t("form.notifyShare.viewDetail") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getList"
    />
    <el-dialog
      v-model="dialogVisible"
      :title="$t('form.notifyShare.viewDetail')"
      width="60%"
    >
      <el-table
        v-loading="msgLoading"
        :data="msgList"
        @selection-change="handleSelectionChange"
        max-height="60vh"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          :label="$t('form.notifyShare.receiver')"
          show-overflow-tooltip
          prop="receiver"
        />
        <el-table-column
          align="center"
          :label="$t('form.notifyShare.sendResult')"
          prop="result"
        />
        <el-table-column
          align="center"
          :label="$t('form.notifyShare.sendStatus')"
          prop="sendStatus"
        >
          <template #default="scope">
            <el-tag
              type="success"
              v-if="scope.row.sendStatus == 1"
            >
              {{ $t("form.notifyShare.sendSuccess") }}
            </el-tag>
            <el-tag
              type="danger"
              v-else
            >
              {{ $t("form.notifyShare.sendSuccess") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('form.notifyShare.fillStatus')"
          prop="sendStatus"
        >
          <template #default="scope">
            <el-tag
              type="success"
              v-if="scope.row.extStatus == 1"
            >
              {{ $t("form.notifyShare.filled") }}
            </el-tag>
            <el-tag
              type="danger"
              v-else
            >
              {{ $t("form.notifyShare.notFilled") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('form.notifyShare.sendTime')"
          prop="createTime"
        />
      </el-table>
      <pagination
        v-show="msgTotal > 0"
        v-model:limit="msgQueryParams.size"
        v-model:page="msgQueryParams.current"
        :total="msgTotal"
        @pagination="getMsgList"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("common.close") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="SendDetailPage">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { listMessageSendDetails, listSendDetailsMsgList, MessageSendDetail, PushMessage } from "@/api/system/message";

const sendDetailList = ref<MessageSendDetail[]>([]);
const total = ref(0);
const loading = ref(true);

const route = useRoute();

const queryParams = reactive({
  current: 1,
  size: 10,
  sourceType: "NOTIFY_SHARE",
  sourceId: route.query.key as string
});

const getList = async () => {
  loading.value = true;
  const res = await listMessageSendDetails(queryParams);
  sendDetailList.value = res.data.records;
  total.value = res.data.total;
  loading.value = false;
};

const dialogVisible = ref(false);

onMounted(() => {
  getList();
});

const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);

const handleSelectionChange = (selection: MessageSendDetail[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};

const msgList = ref<PushMessage[]>([]);
const msgTotal = ref(0);
const msgLoading = ref(true);

const msgQueryParams = reactive({
  current: 1,
  size: 10,
  receiver: ""
});

const getMsgList = async (sendId: number) => {
  msgLoading.value = true;
  const res = await listSendDetailsMsgList(sendId, msgQueryParams);
  msgList.value = res.data.records;
  msgTotal.value = res.data.total;
  msgLoading.value = false;
};

const handleShowDetail = (row: MessageSendDetail) => {
  dialogVisible.value = true;
  getMsgList(row.id);
};
</script>
