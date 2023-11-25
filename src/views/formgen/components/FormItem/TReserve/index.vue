<template>
  <div class="reserve-box">
    <el-collapse
      v-model="activeName"
      accordion
    >
      <el-collapse-item
        v-for="pro in reserveProjectList"
        :key="pro.id"
        :title="pro.name"
        :name="pro.id"
      >
        <template #title>
          <div class="project-name">
            <el-icon>
              <ele-Calendar />
            </el-icon>
            {{ pro.name }}
          </div>
        </template>
        <el-calendar
          v-model="dateValues[pro.id]"
          @input="val => handleSelect(pro.id, val)"
          :class="`reserve-calendar${activeName}`"
        >
          <template #date-cell="{ data }">
            <div :class="[disabledDate(data.day) ? 'disable-date' : '']">
              <p
                :class="data.isSelected ? 'is-selected' : ''"
                class="date"
              >
                {{ data.day.split("-").slice(1).join("-") }}
              </p>
              <p class="text">
                {{ calcQuotaWeek(pro, data.day) }}
              </p>
            </div>
          </template>
        </el-calendar>
        <el-alert
          v-if="dateValues[pro.id]"
          :title="`已选：${formatDate(pro.id)}`"
          type="success"
          @close="handleCancelSelect(pro.id)"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import mixin from "../mixin";
import { getRequest } from "@/api/baseRequest";

let formatDate = date => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}-${month}-${day}`;
};

let parseDate = dateStr => {
  return new Date(dateStr.replace(/-/g, "/"));
};

export default {
  name: "TReserve",
  components: {},
  mixins: [mixin],
  props: {
    reserveProjectList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  emits: ["update:value"],
  data() {
    return {
      activeName: 1,
      dateValues: {},
      // 已经预约的数量
      dateReserveCount: {}
    };
  },
  computed: {},
  watch: {
    dateValues: {
      deep: true,
      handler(newValue) {
        newValue = Object.keys(newValue).reduce((pre, cur) => {
          if (newValue[cur]) {
            pre[cur] = formatDate(newValue[cur]);
          }
          return pre;
        }, {});
        this.$emit("update:value", newValue);
      }
    },
    activeName: {
      deep: true,
      handler() {
        this.changeDate(formatDate(new Date()));
      },
      immediate: true
    }
  },
  created() {
    let value = this.value || {};
    for (let key of Object.keys(value)) {
      this.dateValues[key] = new Date(value[key]);
    }
  },
  methods: {
    handleSelect(proId, val) {
      // val 是个date
      if (this.disabledDate(formatDate(val))) {
        this.$nextTick(() => {
          this.handleCancelSelect(proId);
        });
        return;
      }
      if (val < new Date()) {
        this.$nextTick(() => {
          this.handleCancelSelect(proId);
        });
      }
    },
    handleCancelSelect(id) {
      this.dateValues[id] = null;
    },
    changeDate(day) {
      //日期增加30天
      //日期增加30天  .replace(/-/g, '/') 解决IOS浏览器不支2012-10-22 这种格式
      let date = parseDate(day);
      let startDate = new Date();
      startDate.setDate(date.getDate() - 35);
      let endDate = new Date();
      endDate.setDate(date.getDate() + 35);
      getRequest("/form/ext/getReservationCount", {
        formKey: this.$route.params.key,
        formItemId: this.$attrs.dId,
        projectId: this.activeName,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
      }).then(res => {
        this.dateReserveCount = res.data;
      });
    },
    //计算剩余名额
    calcQuotaWeek(project, day) {
      let date = new Date(day);
      // 比较日期天是否大于当前日期
      // 格式化日期 YY-MM-DD 避免时分秒的影响
      if (date < new Date(formatDate(new Date()))) {
        return "";
      }
      if (project.quotaWeek[date.getDay()]) {
        // 获取是周几
        let count = this.dateReserveCount[day] || 0;
        return "余" + (project.quotaWeek[date.getDay()] - count);
      }
      return "充足";
    },
    formatDate(id) {
      let da = this.dateValues[id];
      if (!da) {
        return "";
      }
      return formatDate(da);
    },
    // 禁用没开放的日期
    disabledDate(day) {
      // 当前项目
      let project = this.reserveProjectList.find(item => item.id === this.activeName);
      if (!project) {
        return false;
      }
      let reserveDateRange = [];
      // 当前开放的日期范围
      if (project.reserveDateRangeType && project.reserveDateRangeType == 2) {
        reserveDateRange = project.reserveDateRange || [];
      }
      // 开放的周期
      let openWeekDays = project.openWeekDays;
      let date = new Date(day);
      if (
        reserveDateRange &&
        reserveDateRange.length == 2 &&
        (date < parseDate(reserveDateRange[0]) || date > parseDate(reserveDateRange[1]))
      ) {
        return true;
      }
      if (openWeekDays && openWeekDays.length > 0 && !openWeekDays.includes(date.getDay())) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.reserve-box .project-name {
  padding-left: 20px;
  font-weight: bold;
}

.reserve-box .text {
  font-size: 0.6rem;
  margin-top: 0;
  font-weight: normal;
  color: var(--form-theme-color);
}

.disable-date {
  color: #ccc;
  cursor: none;

  .text {
    color: #ccc;
  }
}

:deep(.reserve-box .el-calendar-day) {
  height: 60px !important;
  text-align: center !important;
}

:deep(.reserve-box .el-calendar-table .is-selected .el-calendar-day:hover) {
  background-color: var(--form-theme-color);
  color: #fff;
}

:deep(.reserve-box .el-calendar-table td.is-selected) {
  background-color: var(--form-theme-color);
  color: #fff;

  .text {
    color: #fff;
  }
}

@media screen and (max-width: 500px) {
  :deep(.reserve-box .el-calendar-day) {
    height: 50px !important;
    padding: 0 !important;
    text-align: center !important;
  }
}
</style>
