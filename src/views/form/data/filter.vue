<template>
  <div class="mt5">
    <span>{{ $t("form.dataFilter.filterData") }}</span>
    <el-select
      class="ml5 mr5"
      style="width: 21%"
      size="small"
      v-model="filterParams.rel"
    >
      <el-option
        v-for="item in relList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <span>
      {{ $t("form.dataFilter.conditionData") }}
    </span>
    <div>
      <el-link
        :underline="false"
        style="margin-top: 10px"
        type="primary"
        @click="addConditionHandle"
      >
        <el-icon>
          <ele-Plus />
        </el-icon>
        {{ $t("form.dataFilter.addCondition") }}
      </el-link>
    </div>
    <div v-if="filterParams.conditionList.length">
      <el-row
        v-for="(item, index) in filterParams.conditionList"
        :key="index"
        :gutter="10"
        align="middle"
        class="mt5"
        justify="center"
        type="flex"
      >
        <el-col :span="7">
          <el-select
            size="default"
            v-model="item.formItemId"
            filterable
            :placeholder="$t('form.dataFilter.selectPlaceholder')"
            @change="
              val => {
                handleConditionChange(val, item);
              }
            "
          >
            <el-option
              v-for="field in fields"
              :key="field.value"
              :label="field.label"
              :value="field.value"
            />
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-select
            size="default"
            v-model="item.method"
            :placeholder="$t('form.dataFilter.conditionPlaceholder')"
          >
            <el-option
              v-for="c in getConditionRuleList(item)"
              :key="c.value"
              :label="c.label"
              :value="c.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <FormOptionSelect
            v-if="
              ['SELECT', 'CHECKBOX', 'RADIO'].includes(getFiledType(item.formItemId)) &&
              ['INCLUDE', 'NOT_INCLUDE', 'EQ', 'NE'].includes(item.method)
            "
            size="default"
            v-model="item.value"
            :multiple="['INCLUDE', 'NOT_INCLUDE'].includes(item.method)"
            allow-create
            clearable
            default-first-option
            filterable
            :item="item"
            :placeholder="$t('form.dataFilter.selectOption')"
          ></FormOptionSelect>
          <el-select
            size="default"
            v-else-if="['DATE'].includes(getFiledType(item.formItemId)) && item.method === 'TIME_RANGE'"
            v-model="item.value"
            filterable
            collapse-tags
            :placeholder="$t('form.dataFilter.rangePlaceholder')"
          >
            <el-option
              v-for="tr in timeRanges"
              :key="tr.value"
              :label="tr.label"
              :value="tr.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="['DATE'].includes(getFiledType(item.formItemId))"
            v-model="item.value"
            :disabled="['IS_NULL', 'NOT_NULL'].includes(item.method)"
            :format="getObjValue(getFieldScheme(item.formItemId), 'format', defaultDateTimeFormat)"
            :type="getObjValue(getFieldScheme(item.formItemId), 'type', 'datetime')"
            :value-format="getObjValue(getFieldScheme(item.formItemId), 'value-format', defaultDateTimeFormat)"
            :placeholder="$t('form.dataFilter.datePlaceholder')"
          />
          <el-select
            v-else-if="['USER'].includes(getFiledType(item.formItemId))"
            v-model="item.value"
            filterable
            collapse-tags
            size="small"
            multiple
            :placeholder="$t('form.dataFilter.userPlaceholder')"
          >
            <el-option
              v-for="user in userList"
              :key="user.userName"
              :label="user.nickName"
              :value="user.userName"
            />
          </el-select>
          <el-input
            size="default"
            v-else
            v-model="item.value"
            :disabled="['IS_NULL', 'NOT_NULL'].includes(item.method)"
            :placeholder="$t('form.dataFilter.enterCondition')"
          />
        </el-col>
        <el-col :span="2">
          <el-icon @click="removeConditionHandle(index)">
            <ele-Delete />
          </el-icon>
        </el-col>
      </el-row>
    </div>
    <!--    <el-empty v-else description="暂无条件" />-->
  </div>
</template>

<script>
import { getEmployeeListRequest } from "@/api/system/organization";
import _ from "lodash-es";
import FormOptionSelect from "@/views/components/FormOptionSelect/index.vue";
import { i18n } from "@/i18n";

export default {
  name: "DataFilter",
  props: {
    fields: {
      type: Array,
      default: null
    },
    formDataFilter: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    FormOptionSelect
  },
  emits: ["filter"],
  data() {
    return {
      relList: [
        {
          label: i18n.global.t("form.dataFilter.allData"),
          value: "AND"
        },
        {
          label: i18n.global.t("form.dataFilter.arbitrary"),
          value: "OR"
        }
      ],
      // 每个组件类型包含的筛选方法
      typeIncludeMethods: {
        INPUT: ["EQ", "NE", "GT", "LT", "GE", "LE", "INCLUDE", "NOT_INCLUDE", "IS_NULL", "NOT_NULL"],
        TEXTAREA: ["EQ", "NE", "GT", "LT", "GE", "LE", "INCLUDE", "NOT_INCLUDE", "IS_NULL", "NOT_NULL"],
        NUMBER: ["EQ", "NE", "GT", "LT", "GE", "LE", "IS_NULL", "NOT_NULL"],
        SELECT: ["EQ", "NE", "INCLUDE", "NOT_INCLUDE", "IS_NULL", "NOT_NULL"],
        RADIO: ["EQ", "NE", "INCLUDE", "NOT_INCLUDE", "IS_NULL", "NOT_NULL"],
        CHECKBOX: ["EQ", "NE", "INCLUDE", "NOT_INCLUDE", "IS_NULL", "NOT_NULL"],
        DATE: ["EQ", "NE", "GT", "LT", "GE", "LE", "IS_NULL", "NOT_NULL", "TIME_RANGE"],
        PROVINCE_CITY: ["INCLUDE", "NOT_INCLUDE", "IS_NULL", "NOT_NULL"],
        USER: ["INCLUDE", "IS_NULL", "NOT_NULL"]
      },
      // 全部类型
      conditionRuleOptions: [
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.EQ"),
          value: "EQ"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.NE"),
          value: "NE"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.GT"),
          value: "GT"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.LT"),
          value: "LT"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.GE"),
          value: "GE"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.LE"),
          value: "LE"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.INCLUDE"),
          value: "INCLUDE"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.NOT_INCLUDE"),
          value: "NOT_INCLUDE"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.IS_NULL"),
          value: "IS_NULL"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.NOT_NULL"),
          value: "NOT_NULL"
        },
        {
          label: i18n.global.t("form.dataFilter.conditionRuleOptions.TIME_RANGE"),
          value: "TIME_RANGE"
        }
      ],
      timeRanges: [
        {
          label: i18n.global.t("form.dataFilter.today"),
          value: "TODAY"
        },
        {
          label: i18n.global.t("form.dataFilter.yesterday"),
          value: "YESTERDAY"
        },
        {
          label: i18n.global.t("form.dataFilter.thisWeek"),
          value: "WEEK"
        },
        {
          label: i18n.global.t("form.dataFilter.lastWeek"),
          value: "LAST_WEEK"
        },
        {
          label: i18n.global.t("form.dataFilter.thisMonth"),
          value: "MONTH"
        },
        {
          label: i18n.global.t("form.dataFilter.lastMonth"),
          value: "LAST_MONTH"
        },
        {
          label: i18n.global.t("form.dataFilter.thisQuarter"),
          value: "QUARTER"
        },
        {
          label: i18n.global.t("form.dataFilter.lastQuarter"),
          value: "LAST_QUARTER"
        },
        {
          label: i18n.global.t("form.dataFilter.thisYear"),
          value: "YEAR"
        },
        {
          label: i18n.global.t("form.dataFilter.lastYear"),
          value: "LAST_YEAR"
        }
      ],
      filterParams: {
        rel: "AND",
        conditionList: []
      },
      // 可选择用户列表
      userList: [],
      defaultDateTimeFormat: "YYYY-MM-DD HH:mm:ss"
    };
  },
  watch: {
    formDataFilter: {
      deep: true,

      handler: function (val) {
        if (val) {
          this.filterParams = val;
        }
      },

      immediate: true
    },
    filterParams: {
      deep: true,
      handler: function (val) {
        this.$emit("filter", val);
      },
      immediate: true
    }
  },
  mounted() {
    getEmployeeListRequest().then(res => {
      this.userList = [{ userName: "0", nickName: i18n.global.t("form.dataFilter.thisUser") }].concat(res.data);
    });
  },
  methods: {
    getFiledType(id) {
      if ("createBy" === id) {
        return "USER";
      } else if (["createTime", "updateTime"].includes(id)) {
        return "DATE";
      }
      return id.replace("label", "").replace(/\d+./g, "").replace("-", "").toUpperCase();
    },
    getFieldScheme(id) {
      return this.fields.find(item => item.value === id)?.scheme;
    },
    /**
     * 从obj获取值 如果是undefined返回defaultValue
     * @param obj
     * @param key
     * @param defaultValue
     */
    getObjValue(obj, key, defaultValue) {
      return _.get(obj, key, defaultValue);
    },
    handleConditionChange(value, item) {
      let field = this.fields.find(field => field.value === value);
      item["field"] = field;
      // 获取默认值
      if (field && field.scheme && field.scheme.config && field.scheme.config.defaultValue) {
        item["defaultValueType"] = Array.isArray(field.scheme.config.defaultValue) ? "ARRAY" : "STRING";
      } else {
        item["defaultValueType"] = "USER" == field.type ? "ARRAY" : "STRING";
      }
    },
    getConditionRuleList(item) {
      if (!item && !item.formItemId) {
        return [];
      }
      let field = this.fields.find(field => field.value === item.formItemId);
      let type = field && field.type;
      let typeIncludeMethod = this.typeIncludeMethods[type];
      if (!type || !typeIncludeMethod) {
        typeIncludeMethod = ["IS_NULL", "NOT_NULL"];
      }
      return this.conditionRuleOptions.filter(item => typeIncludeMethod.includes(item.value));
    },
    removeConditionHandle(index) {
      this.filterParams.conditionList.splice(index, 1);
    },
    addConditionHandle() {
      if (!this.filterParams.conditionList) {
        this.filterParams.conditionList = [];
      }
      this.filterParams.conditionList.push({
        formItemId: "",
        method: "",
        value: ""
      });
    }
  }
};
</script>
