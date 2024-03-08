<template>
  <div class="handle-container">
    <div class="box-card">
      <div class="header">
        <div class="title">
          {{ processDetailInfo?.startUser.userName }}{{ $t("workflow.flowDetail.initiateText")
          }}{{ processDetailInfo?.processName }}
        </div>
        <el-row class="mt10">
          <el-col
            :span="4"
            :offset="1"
          >
            <div class="s-title">{{ $t("workflow.flowDetail.statusNow") }}</div>
            <div>
              <el-tag
                :type="statusMap[processDetailInfo?.status || 0]"
                size="default"
              >
                {{ processDetailInfo?.statusDesc }}
              </el-tag>
            </div>
          </el-col>
          <el-col
            :span="4"
            :offset="2"
          >
            <div class="s-title">{{ $t("workflow.flowDetail.taskUser") }}</div>
            <div class="start-user-wrap mt0">
              <t-avatar
                :src="processDetailInfo?.startUser.avatar"
                :size="20"
                :name="processDetailInfo?.startUser.userName"
              />
              <span class="ml5">{{ processDetailInfo?.startUser.userName }}</span>
            </div>
          </el-col>
          <el-col
            :span="4"
            :offset="2"
          >
            <div class="s-title">{{ $t("workflow.flowDetail.taskUserDept") }}</div>
            <div class="mt0">{{ processDetailInfo?.startUser.deptName || $t("workflow.flowDetail.unknown") }}</div>
          </el-col>
          <el-col :span="2">
            <flow-seal
              :size="100"
              v-if="processDetailInfo?.status != undefined"
              :color-type="flowStatus.get(processDetailInfo?.status || 0) || SealColorType.DEFAULT"
              :name="processDetailInfo?.statusDesc || $t('workflow.flowDetail.inReview')"
              class="flow-seal"
            />
          </el-col>
        </el-row>
      </div>
      <el-row
        :gutter="50"
        class="content"
        :style="{ height: `${wHeight - 150}px` }"
      >
        <el-col :span="14">
          <el-scrollbar :height="`${wHeight - 190}px`">
            <form-info
              ref="formInfoRef"
              :task-id="taskForm.taskId"
              :instance-id="taskForm.instanceId"
            />
          </el-scrollbar>
        </el-col>
        <el-col
          :span="9"
          :offset="1"
        >
          <el-scrollbar :height="`${wHeight - 190}px`">
            <flow-node-timeline
              :node-list="processDetailInfo?.processTaskNodes"
              class="mt20 ml5"
            />
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
    <div class="btn-wrap">
      <ButtonControl
        :get-form-data-id="getFormDataId"
        :get-form-model="getFormModel"
        :task-info="taskForm"
        v-if="operated == true && taskForm.taskId"
      />
      <el-button
        style="float: right"
        icon="ele-Back"
        type="primary"
        @click="goBack"
        v-else
      >
        {{ $t("formI18n.all.goBack") }}
      </el-button>
    </div>
  </div>
</template>

<script setup name="ProcessHandle" lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ButtonControl from "./ReviewButton.vue";
import FormInfo from "./form.vue";
import { flowDetail } from "@/api/workflow/todo";
import FlowNodeTimeline from "@/views/workflow/task/process/FlowNodeTimeline.vue";
import FlowSeal from "@/views/workflow/task/process/FlowSeal.vue";
import TAvatar from "@/components/TAvatar/index.vue";
import { ProcessDetail, SealColorType } from "@/views/workflow/task/process/types";
import { useWindowSize } from "@vueuse/core";

const router = useRouter();

const processDetailInfo: Ref<null | ProcessDetail> = ref(null);
const taskForm = ref({
  instanceId: "",
  deployId: "",
  taskId: "",
  procDefId: ""
});
const operated = ref(false);

const formInfoRef = ref(null);

const getFormDataId = () => {
  if (!formInfoRef.value) {
    return null;
  }
  return formInfoRef.value?.formDataId;
};

const getFormModel = () => {
  if (!formInfoRef.value) {
    return null;
  }
  return formInfoRef.value?.getFormModel();
};

// 状态map
const statusMap: {
  [key: number]: string;
} = {
  1: "",
  2: "success",
  3: "danger",
  4: "warning"
};

const flowStatus = new Map<number, SealColorType>([
  [1, SealColorType.DEFAULT],
  [2, SealColorType.SUCCESS],
  [3, SealColorType.FAIL],
  [4, SealColorType.WARNING]
]);

const getProcessDetailInfo = (procInsId: string) => {
  flowDetail({ procInsId }).then((res: any) => {
    processDetailInfo.value = res.data;
  });
};

onMounted(() => {
  taskForm.value.deployId = router.currentRoute.value.query?.deployId as string;
  taskForm.value.taskId = router.currentRoute.value.query?.taskId as string;
  taskForm.value.instanceId = router.currentRoute.value.query?.procInsId as string;
  taskForm.value.procDefId = router.currentRoute.value.query?.procDefId as string;
  operated.value = router.currentRoute.value.query?.operated == "true";
  getProcessDetailInfo(taskForm.value.instanceId);
});

const { height: wHeight } = useWindowSize();

const goBack = () => {
  router.go(-1);
};
</script>
<style lang="scss" scoped>
.handle-container {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.header {
  height: 100px;
  padding: 5px 10px;
  border-bottom: var(--el-border);
  position: relative;

  .flow-seal {
    position: absolute;
    right: 20%;
    top: -35px;
    opacity: 0.4;
  }

  .title {
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
    line-height: 25px;
    margin-left: 20px;
  }

  .s-title {
    font-size: 14px;
    line-height: 20px;
    color: var(--el-text-color-secondary);
  }

  .start-user-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.btn-wrap {
  position: absolute;
  bottom: 6%;
  left: 2%;
  z-index: 9999;
}

.box-card {
  width: 100%;
  height: 95%;
  border-radius: 15px;
  background-color: var(--el-bg-color);
}

.content {
  height: calc(100% - 150px);
}
</style>
