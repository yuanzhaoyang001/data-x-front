<template>
  <div>
    <el-divider>{{ $t("formI18n.all.option") }}</el-divider>
    <div>
      <draggable
        :animation="340"
        v-model="activeData.reserveProjectList"
        group="selectItem"
        handle=".option-drag"
        item-key="id"
      >
        <template #item="{ element, index }">
          <div class="select-item">
            <div class="select-line-icon option-drag">
              <el-icon>
                <ele-Operation />
              </el-icon>
            </div>
            <el-input
              v-model="element.name"
              :placeholder="$t('formgen.reserveTimeRange.name')"
              size="small"
            />
            <div
              class="select-line-icon"
              @click="handleSettingGoods(element, index)"
            >
              <el-icon>
                <ele-Tools />
              </el-icon>
            </div>
            <div
              class="close-btn select-line-icon"
              @click="activeData.reserveProjectList.splice(index, 1)"
            >
              <el-icon>
                <ele-Remove />
              </el-icon>
            </div>
          </div>
        </template>
      </draggable>
      <div style="margin-left: 20px; margin-bottom: 10px">
        <el-button
          icon="ele-CirclePlus"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="addProjectItem"
        >
          {{ $t("formgen.reserveTimeRange.add") }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('formgen.reserveTimeRange.info')"
      v-model="dialogVisible"
    >
      <el-form
        :model="selectProject"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]"
          :label="$t('formgen.reserveTimeRange.name')"
          prop="name"
        >
          <el-input v-model="selectProject.name" />
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请选择预约时间范围', trigger: 'blur' }]"
          :label="$t('formgen.reserveTimeRange.range')"
          prop="reserveDateRangeType"
        >
          <el-radio-group v-model="selectProject.reserveDateRangeType">
            <el-radio :label="1">{{ $t("formgen.reserveTimeRange.longTime") }}</el-radio>
            <el-radio :label="2">{{ $t("formgen.reserveTimeRange.limitTime") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="selectProject.reserveDateRangeType === 2"
          :label="$t('formgen.reserveTimeRange.range')"
          prop="reserveDateRange"
        >
          <el-date-picker
            v-model="selectProject.reserveDateRange"
            :end-placeholder="$t('formgen.reserveTimeRange.endTime')"
            format="YYYY 年 MM 月 DD 日"
            range-separator=" - "
            :start-placeholder="$t('formgen.reserveTimeRange.startTime')"
            type="daterange"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('formgen.reserveTimeRange.cycle')"
          prop="openWeekDays"
        >
          <el-checkbox-group v-model="selectProject.openWeekDays">
            <el-checkbox
              v-for="item in weekDayList"
              :key="item.id"
              :label="item.id"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form
        :model="selectProject"
        label-position="top"
      >
        <el-form-item
          :label="$t('formgen.reserveTimeRange.number')"
          prop="name"
        >
          <p class="text-danger">{{ $t("formgen.reserveTimeRange.numberText") }}</p>
          <table class="el-table el-table--border">
            <tbody>
              <tr>
                <th>{{ $t("formgen.reserveTimeRange.monday") }}</th>
                <th>{{ $t("formgen.reserveTimeRange.number") }}</th>
              </tr>
              <tr
                v-for="(value, name) in selectProject.quotaWeek"
                :key="name"
              >
                <td class="el-table__cell is-center">
                  {{ getWeekDayCn(name) }}
                </td>
                <td class="el-table__cell is-center">
                  <el-input
                    v-model="selectProject.quotaWeek[name]"
                    onkeyup="value=(isNaN(parseInt(value)) ? '' :  parseInt(value))"
                    style="width: 60%"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            type="primary"
            size="default"
            @click="handleSaveGoodsSetting"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import mixin from "./mixin";
import { i18n } from "@/i18n";

const quotaWeek = {
  // 周日到周六
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null
};

export default {
  name: "ConfigItemReserveDay",
  components: {
    draggable
  },
  mixins: [mixin],
  props: ["activeData"],
  data() {
    return {
      dialogVisible: false,
      selectProjectIndex: 0,
      selectProject: {},
      weekDayList: [
        {
          id: 1,
          name: i18n.global.t("formgen.reserveTimeRange.monday")
        },
        {
          id: 2,
          name: i18n.global.t("formgen.reserveTimeRange.tuesday")
        },
        {
          id: 3,
          name: i18n.global.t("formgen.reserveTimeRange.wednesday")
        },
        {
          id: 4,
          name: i18n.global.t("formgen.reserveTimeRange.thursday")
        },
        {
          id: 5,
          name: i18n.global.t("formgen.reserveTimeRange.friday")
        },
        {
          id: 6,
          name: i18n.global.t("formgen.reserveTimeRange.saturday")
        },
        {
          id: 0,
          name: i18n.global.t("formgen.reserveTimeRange.sunday2")
        }
      ]
    };
  },
  methods: {
    getWeekDayCn(day) {
      console.log(day);
      return this.weekDayList.find(item => item.id == day).name;
    },
    addProjectItem() {
      this.activeData.reserveProjectList.push({
        id: new Date().getTime(),
        name: "项目",
        quotaWeek: quotaWeek,
        reserveDateRangeType: 1,
        reserveDateRange: [],
        openWeekDays: [0, 1, 2, 3, 4, 5, 6]
      });
    },
    handleSettingGoods(project, index) {
      this.selectProjectIndex = index;
      this.dialogVisible = true;
      let pro = JSON.parse(JSON.stringify(project));
      // 不设置得值会被删除 所以需要重新赋值
      Object.keys(quotaWeek).forEach((value, key) => {
        if (pro.quotaWeek[key] === undefined) {
          pro.quotaWeek[key] = null;
        }
      });
      // 不设置checkbox 会报错 兼容历史数据
      pro.openWeekDays = pro.openWeekDays === undefined ? [0, 1, 2, 3, 4, 5, 6] : pro.openWeekDays;
      this.selectProject = pro;
    },
    handleSaveGoodsSetting() {
      this.activeData.reserveProjectList[this.selectProjectIndex] = this.selectProject;
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
