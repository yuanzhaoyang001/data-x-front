<template>
  <div class="countdown-wrap">
    <div class="container">
      <el-icon size="30">
        <ele-Timer />
      </el-icon>
      <div>
        <p class="text-center">{{ text }}</p>
        <el-countdown
          :value="date"
          format="DD 天 HH 时 mm 分 ss 秒"
        ></el-countdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="TCountDown" setup>
import { defineProps, onMounted, watch, ref } from "vue";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const props = defineProps({
  startTime: {
    type: String,
    default: ""
  },
  endTime: {
    type: String,
    default: ""
  },
  notStartText: {
    type: String,
    default: ""
  },
  startedText: {
    type: String,
    default: ""
  },
  endText: {
    type: String,
    default: ""
  }
});

const text = ref("");
const date = ref();

watch(
  () => [props.startTime, props.endTime],
  val => {
    // 判断当期时间是否1已经开始
    const now = dayjs();
    const startTime = dayjs(val[0], "YYYY-MM-DD HH:mm:ss");
    if (now.isSameOrBefore(startTime)) {
      text.value = props.notStartText;
      date.value = startTime;
    } else {
      const endTime = dayjs(val[1], "YYYY-MM-DD HH:mm:ss");
      if (now.isSameOrAfter(endTime)) {
        text.value = props.endText;
        date.value = endTime;
      } else {
        text.value = props.startedText;
        date.value = endTime;
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.countdown-wrap {
  height: 100%;
}

.container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--form-theme-color, #4c4edb);
  height: 70px;
  border-radius: 5px;
  color: #ffffff;
}

:deep(.el-statistic__number) {
  color: #ffffff;
  font-size: 20px;
}
</style>
