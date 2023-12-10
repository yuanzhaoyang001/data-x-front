<template>
  <div>
    <el-form-item :label="$t('formgen.marqueeList.title')">
      <el-input v-model="activeData.title" />
    </el-form-item>
    <el-form-item :label="$t('formgen.marqueeList.maxHeight')">
      <el-input-number v-model="activeData.maxHeight" />
    </el-form-item>
    <el-form-item :label="$t('formgen.marqueeList.dataList')">
      <el-button
        type="primary"
        @click="openTinymceDialog"
      >
        <el-icon :size="18">
          <ele-Edit />
        </el-icon>
      </el-button>
    </el-form-item>
    <el-form-item :label="$t('formgen.marqueeList.vertical')">
      <el-switch v-model="activeData.vertical"></el-switch>
    </el-form-item>
    <tinymce-dialog
      ref="tinymceDialogRef"
      v-model:value="activeData.dataList"
    />
  </div>
</template>

<script lang="ts" name="ConfigItemMarqueeList" setup>
import type { marqueeListComponent } from "@/views/formgen/components/GenerateForm/marketingConfig";
import TinymceDialog from "@/views/formgen/components/tinymce/TinymceDialog.vue";
import { ref } from "vue";

const props = defineProps<{
  activeData: marqueeListComponent;
}>();

const tinymceDialogRef = ref(null);

const openTinymceDialog = () => {
  tinymceDialogRef.value.showDialog();
};
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
