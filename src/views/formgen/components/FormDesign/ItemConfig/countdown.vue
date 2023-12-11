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
    <el-form-item :label="$t('formgen.countdown.bgColor')">
      <el-color-picker v-model="activeData.bgColor" />
    </el-form-item>
    <el-form-item :label="$t('formgen.countdown.textColor')">
      <el-color-picker v-model="activeData.textColor" />
    </el-form-item>
    <el-form-item :label="$t('formgen.countdown.icon')">
      <el-input
        v-model="activeData.icon"
        :placeholder="$t('formgen.input.pleaseChoose')"
      >
        <template #append>
          <el-button
            icon="ele-Pointer"
            @click="openIconsDialog()"
          >
            {{ $t("formgen.input.choose") }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <icons-dialog
      v-model:visible="iconsVisible"
      :current="activeData.icon"
      @select="(val: any) => (activeData.icon = val)"
    />
  </div>
</template>

<script lang="ts" name="ConfigItemCountDown" setup>
import IconsDialog from "@/views/formgen/components/FormDesign/IconsDialog.vue";
import { ref } from "vue";

const props = defineProps({
  activeData: {
    type: Object,
    default: () => ({})
  }
});

const iconsVisible = ref(false);
const openIconsDialog = () => {
  iconsVisible.value = true;
};
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
