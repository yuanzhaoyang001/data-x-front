<template>
  <div>
    <el-form-item
      v-if="activeData['start-placeholder'] !== undefined"
      :label="$t('formgen.datePicker.start')"
    >
      <el-input
        v-model="activeData['start-placeholder']"
        :placeholder="$t('formgen.datePicker.pleaseEnter')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData['end-placeholder'] !== undefined"
      :label="$t('formgen.datePicker.end')"
    >
      <el-input
        v-model="activeData['end-placeholder']"
        :placeholder="$t('formgen.datePicker.pleaseEnter')"
      />
    </el-form-item>
    <el-tooltip
      effect="dark"
      :content="$t('formgen.datePicker.content')"
      placement="top"
    >
      <el-form-item>
        <template #label>
          <span>
            {{ $t("formgen.datePicker.defaultTime") }}
            <el-icon><ele-QuestionFilled /></el-icon>
          </span>
        </template>
        <el-switch v-model="activeData.config['defaultNowTime']" />
      </el-form-item>
    </el-tooltip>
    <el-form-item
      v-if="activeData.type !== undefined"
      :label="$t('formgen.datePicker.timeType')"
    >
      <el-select
        v-model="activeData.type"
        :style="{ width: '100%' }"
        :placeholder="$t('formgen.datePicker.timeType')"
        @change="dateTypeChange"
      >
        <el-option
          v-for="(item, index) in dateTypeOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="activeData.format !== undefined"
      :placeholder="$t('formgen.datePicker.timeFormat')"
    >
      <el-input
        v-model="activeData.format"
        :placeholder="$t('formgen.datePicker.timeFormat')"
        @input="setTimeValue($event)"
      />
    </el-form-item>
  </div>
</template>

<script>
import { i18n } from "@/i18n";

const dateTimeFormat = {
  date: "YYYY-MM-DD",
  month: "YYYY-MM",
  year: "YYYY",
  datetime: "YYYY-MM-DD HH:mm:ss",
  daterange: "YYYY-MM-DD",
  monthrange: "YYYY-MM",
  datetimerange: "YYYY-MM-DD HH:mm:ss"
};
export default {
  name: "ConfigItemDate",
  props: ["activeData"],
  data() {
    return {
      dateTypeOptions: [
        {
          label: i18n.global.t("formgen.datePicker.day"),
          value: "date"
        },
        {
          label: i18n.global.t("formgen.datePicker.month"),
          value: "month"
        },
        {
          label: i18n.global.t("formgen.datePicker.year"),
          value: "year"
        },
        {
          label: i18n.global.t("formgen.datePicker.dateTIme"),
          value: "datetime"
        }
      ]
    };
  },
  methods: {
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val);
    },
    setTimeValue(val, type) {
      const valueFormat = type === "week" ? dateTimeFormat.date : val;
      this.activeData.config["defaultValue"] = null;
      this.activeData["value-format"] = valueFormat;
      this.activeData["format"] = val;
    }
  }
};
</script>
