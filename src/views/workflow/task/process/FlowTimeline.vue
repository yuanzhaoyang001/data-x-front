<template>
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in flowRecordList"
        :key="index"
        :icon="item.finishTime ? 'el-icon-check' : 'el-icon-check'"
        :color="item.finishTime ? '#2bc418' : '#b3bdbb'"
      >
        <p style="font-weight: 700">
          {{ item.taskName }}
        </p>
        <el-card :body-style="{ padding: '10px' }">
          <label
            v-if="item.assigneeName"
            class="task-text"
          >
            实际办理：
            {{ item.assigneeName }}
            <el-tag
              v-if="item.deptName"
              type="info"
            >
              {{ item.deptName }}
            </el-tag>
          </label>
          <label
            v-if="item.candidate"
            class="task-text"
          >
            候选办理： {{ item.candidate }}
          </label>
          <label style="font-weight: normal">接收时间：</label>
          <label class="value">{{ item.createTime }}</label>
          <label
            v-if="item.finishTime"
            class="task-text"
          >
            办结时间：
          </label>
          <label class="value">{{ item.finishTime }}</label>
          <label
            v-if="item.duration"
            class="task-text"
          >
            耗时：
          </label>
          <label class="value">{{ item.duration }}</label>

          <p v-if="item.comment">
            <el-tag type="success">
              {{ item.comment.comment }}
            </el-tag>
          </p>
          <el-divider v-if="item.subTaskList.length" />
          <!--          子任务-->
          <el-row>
            <el-col :span="120" />
          </el-row>
          <div
            v-for="sub in item.subTaskList"
            :key="sub.taskId"
            class="mt10"
          >
            <label class="sub-task-text">
              办理人：
              <span class="value">{{ sub.assigneeName }}</span>
            </label>
            <el-tag
              v-if="sub.description"
              class="mr20"
            >
              {{ sub.description }}
            </el-tag>
            <label class="sub-task-text">
              接收时间：
              <span class="value">{{ sub.startTime }}</span>
            </label>
            <label class="sub-task-text">
              办理时间：
              <span class="value">{{ sub.endTime }}</span>
            </label>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: "FlowTimeline",
  props: {
    flowRecordList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.task-text {
  font-weight: normal;
  margin-right: 30px;
}

.sub-task-text {
  font-weight: normal;
  margin-right: 20px;
  font-size: 15px;
  height: 25px;
  line-height: 25px;
}

.value {
  color: #8a909c;
  font-weight: normal;
}
</style>
