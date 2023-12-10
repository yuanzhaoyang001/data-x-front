<template>
  <div>
    <el-form-item :label="$t('formgen.countdown.timeRange')">
      <el-date-picker
        v-model="activeData.startTime"
        :placeholder="$t('formgen.countdown.startTimePlaceholder')"
        format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
      <el-date-picker
        v-model="activeData.endTime"
        :placeholder="$t('formgen.countdown.endTimePlaceholder')"
        class="mt10"
        format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.countdown.notStart')">
      <el-input v-model="activeData.notStartText" />
    </el-form-item>
    <el-form-item :label="$t('formgen.countdown.started')">
      <el-input v-model="activeData.startedText" />
    </el-form-item>
    <el-form-item :label="$t('formgen.countdown.end')">
      <el-input v-model="activeData.endText" />
    </el-form-item>
  </div>
</template>

<script lang="ts" name="ConfigItemCountDown" setup>
import type { countDownComponent } from "@/views/formgen/components/GenerateForm/marketingConfig";

const props = defineProps<{
  activeData: countDownComponent;
}>();
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
