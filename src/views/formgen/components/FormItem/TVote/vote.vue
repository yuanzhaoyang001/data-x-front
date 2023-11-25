<template>
  <div class="vote-box">
    <el-row
      type="flex"
      justify="center"
      align="middle"
    >
      <el-col :span="18">
        <el-progress
          :percentage="percentage"
          :show-text="type === 'line'"
        ></el-progress>
      </el-col>
      <el-col :span="6">{{ quantity }}票</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "FormVoteItem",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    totalVote: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: "line"
    },
    voteList: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:value"],
  computed: {
    quantity() {
      let index = this.voteList.findIndex(item => this.value == item.value);
      return this.voteList[index] ? this.voteList[index].quantity : 0;
    },
    percentage() {
      if (this.quantity === 0) {
        return 0;
      }
      // 计算百分比 = 投票数 / 总票数
      return Math.floor((this.quantity / this.totalVote) * 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.vote-box {
  font-size: 14px;
  line-height: 25px;
  color: var(--form-theme-color);
  width: 96%;

  :deep(.el-progress__text) {
    color: var(--form-theme-color) !important;
  }
}
</style>
