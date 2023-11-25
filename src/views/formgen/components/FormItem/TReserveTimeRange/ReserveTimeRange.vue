<template>
  <div class="t-reserve-time">
    <div
      class="no-select"
      v-if="days.length"
    >
      <!--      <div>-->
      <!--        选中日期：{{ currentDate ? currentDate.format('YYYY年MM月DD日') : '' }}-->
      <!--      </div>-->
      <div class="flex flex-center flex-row">
        <el-icon class="cursor-pointer medium-font-size">
          <ele-Back />
        </el-icon>
        <div class="title">
          {{ startDate.format("YYYY年MM月DD日") }} -
          {{ endDate.format("YYYY年MM月DD日") }}
        </div>
        <el-icon class="cursor-pointer medium-font-size">
          <ele-Right />
        </el-icon>
      </div>
      <div>
        <dl class="flex flex-jc-center t-c">
          <dd
            v-for="item in days"
            class="flex-1"
            :key="item.day"
            @click="onClick(item.dayjs)"
            :class="[isDaySame(item.dayjs) ? 'active' : '', isDisabled(item.dayjs) ? '' : 'disabled']"
          >
            <p>{{ item.week }}</p>
            <p>{{ item.day }}</p>
          </dd>
        </dl>
        <div
          v-if="timeRangeList.length"
          class="time-range-list"
        >
          <el-row type="flex">
            <el-col
              class="time-range-item"
              :class="[currentTimeRange === tr.text ? 'active' : '', timeIsDisabled(tr.text) ? 'disabled' : '']"
              :span="3"
              :xs="5"
              :sm="4"
              :md="3"
              :lg="3"
              v-for="(tr, index) in timeRangeList"
              :key="tr.text"
              @click="onClickTimeRange(tr)"
            >
              <div>{{ tr.text }}</div>
              <div class="status">{{ tr.status }}</div>
            </el-col>
          </el-row>
        </div>
        <el-empty
          v-else
          :description="$t('formgen.reserveTimeRange.noPeriodOfTime')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import { i18n } from "@/i18n";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const weeks = [
  i18n.global.t("formgen.reserveTimeRange.sunday2"),
  i18n.global.t("formgen.reserveTimeRange.monday"),
  i18n.global.t("formgen.reserveTimeRange.tuesday"),
  i18n.global.t("formgen.reserveTimeRange.wednesday"),
  i18n.global.t("formgen.reserveTimeRange.thursday"),
  i18n.global.t("formgen.reserveTimeRange.friday"),
  i18n.global.t("formgen.reserveTimeRange.saturday")
];

export default {
  name: "ReserveTimeRange",
  props: {
    value: [Date, String, Number],
    // 日期范围
    dateRange: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 可以选择的天
    chosenDayOfWeek: {
      type: Array,
      default: () => {
        return [];
      }
    },
    timeRangeList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  emits: ["changeDate", "update:value"],
  data() {
    return {
      currentTimeRange: "", // 当前选中的时段
      currentDate: "", // 当前选中日期
      startDate: "",
      endDate: "",
      minDate: "",
      maxDate: "",
      days: []
    };
  },
  watch: {
    currentDate(val) {
      this.$emit("changeDate", dayjs(val).format("YYYY-MM-DD "));
    }
  },
  created: function () {
    // 默认值
    if (this.value) {
      let arr = this.value.split(" ");
      this.currentDate = dayjs(arr[0]);
      this.currentTimeRange = arr[1];
      this.getDayArr(this.currentDate);
    } else {
      this.getDayArr(dayjs());
    }
    if (this.dateRange) {
      this.minDate = dayjs(this.dateRange[0]);
      this.maxDate = dayjs(this.dateRange[1]);
    }
  },
  methods: {
    onClick(d) {
      if (!this.isDisabled(d)) {
        return;
      }
      this.currentTimeRange = "";
      this.currentDate = d;
    },
    isDaySame(d) {
      return d.isSame(this.currentDate, "d");
    },
    onPrev() {
      let s = this.startDate.add(-7, "d");
      this.getDayArr(s);
    },
    onNext() {
      let s = this.endDate.add(1, "d");
      this.getDayArr(s);
    },
    onClickTimeRange(tr) {
      if (this.timeIsDisabled(tr.text)) {
        return;
      }
      this.currentTimeRange = tr.text;
      this.$emit("update:value", dayjs(this.currentDate).format("YYYY-MM-DD ") + this.currentTimeRange);
    },
    getDayArr(s) {
      let e = s.add(6, "d");
      this.startDate = s;
      this.endDate = e;
      this.getDays(s);
    },
    isShowPrev() {
      if (this.minDate) {
        let d = this.days[0].dayjs;
        return !d.isSameOrBefore(this.minDate, "D");
      }
      return true;
    },
    isNextPrev() {
      if (this.maxDate) {
        return this.days[6].dayjs.isBefore(this.maxDate, "D");
      }
      return true;
    },
    isDisabled(d) {
      if (this.chosenDayOfWeek && this.chosenDayOfWeek.length) {
        return this.chosenDayOfWeek.includes(d.day());
      }
      if (this.minDate && this.maxDate) {
        return d.isSameOrBefore(this.maxDate, "D") && d.isSameOrAfter(this.minDate, "D");
      }
      return true;
    },
    timeIsDisabled(t) {
      // 截取-后面的时间 判断是否超过了现在的时间
      let nowTime = new Date();
      let time = new Date(dayjs(this.currentDate).format("YYYY/MM/DD ") + t.split("-")[1] + ":00");
      return time < nowTime;
    },
    getDays(day) {
      let s = dayjs(day);
      let num = 7;
      let arr = [];
      let cur = "";
      for (let i = 0; i < num; i++) {
        let c = s.add(i, "day");
        if (!cur && this.isDisabled(c)) {
          cur = c;
        }
        let obj = {
          day: c.format("MM.DD"),
          week: weeks[c.get("day")],
          dayjs: c
        };
        arr.push(obj);
      }
      if (!this.currentDate) {
        this.currentDate = cur;
      }
      this.days = arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.t-reserve-time {
  .flex {
    display: flex;
  }

  .flex-row {
    flex-direction: row;
  }

  .flex-row > * {
    display: block;
  }

  .flex-row-rev {
    flex-direction: row-reverse;
  }

  .flex-column {
    flex-wrap: wrap;
    flex-direction: column;
  }

  .flex-column-rev {
    flex-direction: column-reverse;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .flex-jc-center {
    justify-content: center;
  }

  .flex-jc-start {
    justify-content: flex-start;
  }

  .flex-jc-end {
    justify-content: flex-end;
  }

  .flex-jc-between {
    justify-content: space-between;
  }

  .flex-jc-around {
    justify-content: space-around;
  }

  .flex-ai-center {
    align-items: center;
  }

  .flex-ai-start {
    align-items: flex-start;
  }

  .flex-ai-end {
    align-items: flex-end;
  }

  .flex-ai-baseline {
    align-items: baseline;
  }

  .flex-ac-center {
    align-content: center;
  }

  .flex-ac-start {
    align-content: flex-start;
  }

  .flex-ac-end {
    align-content: flex-end;
  }

  .flex-ac-between {
    align-content: space-between;
  }

  .flex-ac-around {
    align-content: space-around;
  }

  .flex-center {
    justify-content: center;
    align-items: center;
  }

  .flex-1 {
    flex: 1;
    overflow: hidden;
  }

  .title {
    font-size: 14px;
    font-weight: bold;
    margin: 0 40px;
  }

  * {
    margin: 0;
    padding: 0;
  }

  .t-c {
    text-align: center;
    cursor: pointer;
  }

  dl {
    border-bottom: 1px solid #e6ebed;
    margin-top: 10px;
  }

  dd {
    padding-bottom: 5px;
    margin-bottom: -1px;
  }

  .active {
    color: var(--el-color-primary);
    border-bottom: 2px solid var(--el-color-primary);
  }

  .disabled {
    color: #999;
    cursor: none;
  }

  .no-select {
    user-select: none;
  }

  .time-range-list .el-row {
    flex-wrap: wrap;
  }

  .time-range-list .time-range-item {
    background-color: rgba(46, 200, 178, 0.03);
    border: 1px solid rgba(46, 200, 178, 0.4);
    height: 70px;
    text-align: center;
    vertical-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .status {
    color: var(--el-color-primary);
  }

  .time-range-list .time-range-item:hover {
    border-color: var(--el-color-primary);
  }

  .time-range-list .time-range-item.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary);
    color: #ffffff;

    .status {
      color: #ffffff;
    }
  }
}
</style>
