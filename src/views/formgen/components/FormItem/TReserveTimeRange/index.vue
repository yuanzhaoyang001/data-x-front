<template>
  <div class="reserve-box">
    <el-collapse
      v-model="activeName"
      :style="disableStyle"
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
            <el-icon class="header-icon">
              <ele-Calendar />
            </el-icon>
            {{ pro.name }}
          </div>
        </template>
        <reserve-time-range
          v-model:value="dateValues[pro.id]"
          :chosen-day-of-week="pro.openWeekDays"
          :date-range="pro.reserveDateRangeType === 2 ? pro.reserveDateRange : []"
          :time-range-list="getFormatTimeRangeList(pro)"
          @changeDate="
            date => {
              changeDate(date, pro.id);
            }
          "
        />
        <el-alert
          v-if="dateValues[pro.id]"
          :title="$t('formgen.reserveTimeRange.selected')`：${formatDate(pro.id)}`"
          type="success"
          @close="handleCancelSelect(pro.id)"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import mixin from "../mixin";
import ReserveTimeRange from "./ReserveTimeRange.vue";
import { getRequest } from "@/api/baseRequest";
import { i18n } from "@/i18n";

export default {
  name: "TReserveTimeRange",
  components: {
    ReserveTimeRange
  },
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
      dateValues: this.value || {},
      // 嵌套记录的时间段选择  结构为 {projectId: {'10:00-20:00', 1}}
      projectDateRangeCount: {}
    };
  },
  computed: {},
  watch: {
    dateValues: {
      deep: true,
      handler(newValue, oldValue) {
        this.$emit("update:value", newValue);
      }
    },
    activeName(val) {}
  },
  methods: {
    handleCancelSelect(id) {
      this.dateValues[id] = null;
    },
    getFormatTimeRangeList(pro) {
      return pro.timeRangeList.map(item => {
        // 查询使用过的数量
        let count = 0;
        if (this.projectDateRangeCount[pro.id] && this.projectDateRangeCount[pro.id][item.timeRange.join("-")]) {
          count = this.projectDateRangeCount[pro.id][item.timeRange.join("-")];
        }
        let remain = null;
        if (item.value) {
          if (count) {
            remain = item.value - count;
          } else {
            remain = item.value;
          }
        }
        return {
          text: item.timeRange.join("-"),
          status: remain !== null ? `${remain}` : i18n.global.t("formgen.reserveTimeRange.full")
        };
      });
    },
    changeDate(date, projectId) {
      getRequest("/form/ext/getReservationTimeRangeCount", {
        formKey: this.$route.params.key,
        formItemId: this.$attrs.dId,
        projectId: projectId,
        date: date
      }).then(res => {
        this.projectDateRangeCount[projectId] = res.data;
      });
    },
    formatDate(id) {
      return this.dateValues[id];
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
    padding: 0px !important;
    text-align: center !important;
  }
}
</style>
