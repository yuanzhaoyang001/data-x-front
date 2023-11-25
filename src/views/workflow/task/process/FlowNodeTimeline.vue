<template>
  <div class="time-wrap">
    <el-timeline>
      <el-timeline-item
        v-for="(node, index) in nodeList"
        :key="index"
        size="large"
        :icon="getFlowIcon(node)"
        :type="getFlowColor(node)"
      >
        <div class="node-wrap">
          <div class="node-info">
            <p>{{ node.taskName }}</p>
            <p class="time">{{ node.createTime }}</p>
          </div>
          <div class="node-users">
            <div
              v-for="(user, index) in node.taskUsers"
              :key="index"
              class="node-user"
            >
              <div class="user-info">
                <t-avatar
                  :url="user.avatar"
                  :size="25"
                  :name="user.userName"
                />
                <p class="name">{{ user.userName }}</p>
              </div>
              <div class="handle-status-info">
                <span
                  :class="statusClass[user.handleType]"
                  class="status"
                >
                  {{ user.handleTypeDesc }}
                </span>
                <span
                  class="ml5"
                  v-if="user.handleType != 0"
                >
                  {{ user.handleTime }}
                </span>
              </div>
              <div
                class="comment"
                v-if="user.comment"
              >
                {{ user.comment }}
              </div>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import TAvatar from "@/components/TAvatar/index.vue";
import { ProcessTaskNode } from "@/views/workflow/task/process/types";
import { Check, Loading, Close, TopRight, User, Position, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

interface KeyValMap {
  [key: number]: any;
}

const props = defineProps<{
  nodeList: ProcessTaskNode[] | undefined;
}>();

const statusClass: KeyValMap = {
  0: "primary",
  1: "success",
  2: "danger",
  3: "warning",
  4: "info",
  5: "info",
  6: "danger",
  7: "primary",
  8: "primary"
};

const getFlowIcon = (node: ProcessTaskNode) => {
  const iconMap: KeyValMap = {
    0: Loading,
    1: Check,
    2: Close,
    3: TopRight,
    4: User,
    5: Position,
    6: Close,
    7: ArrowLeft,
    8: ArrowRight
  };
  // 几个人审批
  if (node.taskUsers.length == 1) {
    const taskUser = node.taskUsers[0];
    return iconMap[taskUser.handleType];
  }
};

const getFlowColor = (node: ProcessTaskNode) => {
  // 几个人审批
  if (!node.multiUser) {
    const taskUser = node.taskUsers[0];
    return statusClass[taskUser.handleType];
  } else {
    let showTaskUser = node.taskUsers[0];
    for (let taskUser of node.taskUsers) {
      if (taskUser.handleType == 0) {
        showTaskUser = taskUser;
        break;
      }
    }
    return statusClass[showTaskUser.handleType];
  }
};
</script>

<style scoped lang="scss">
.time-wrap {
  height: 100%;
  padding: 2px;
  overflow-y: auto;
}

.node-wrap {
  display: flex;
  user-select: none;

  .node-info {
    width: 40%;

    .time {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 10px;
    }
  }

  .node-users {
    width: 60%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    flex-wrap: wrap;

    .node-user {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-right: 8px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
    }

    .handle-status-info {
      font-size: 12px;
      color: var(--el-text-color-secondary);

      .status {
        font-size: 14px;
      }
    }

    .name {
      font-size: 13px;
      color: var(--el-text-color-secondary);
      line-height: 18px;
    }

    .handle-status {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 5px;
    }

    .comment {
      font-size: 12px;
      line-height: 18px;
      padding: 5px;
      color: var(--el-text-color-primary);
      margin-top: 5px;
      width: 90%;
      background-color: var(--el-bg-color-page);
      border-radius: 5px;
      word-wrap: break-word;
    }

    .success {
      color: var(--el-color-success);
    }

    .primary {
      color: var(--el-color-primary);
    }

    .danger {
      color: var(--el-color-danger);
    }

    .warning {
      color: var(--el-color-warning);
    }
  }
}
</style>
