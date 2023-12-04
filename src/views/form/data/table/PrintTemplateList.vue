<template>
  <div class="h100">
    <el-dropdown
      trigger="contextmenu"
      ref="dropdownRef"
    >
      <slot>
        <el-button
          text
          type="primary"
          @click="showClick()"
        >
          {{ $t("form.printTemplate.templatePrint") }}
        </el-button>
      </slot>
      <template #dropdown>
        <div class="p10">
          <el-empty
            style="width: 220px"
            v-if="!formPrintTemplateList || !formPrintTemplateList.length"
          />
          <el-dropdown-menu v-else>
            <el-dropdown-item
              v-for="item in formPrintTemplateList"
              :key="item.id"
              @click="handlePreview(item.unionKey as string)"
            >
              {{ item.printName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </template>
    </el-dropdown>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('common.preview')"
      fullscreen
    >
      <div class="mt10">
        <el-button
          type="primary"
          @click="handleDownload(1)"
          icon="ele-Document"
          size="default"
        >
          {{ $t("form.printTemplate.exportPdfText") }}
        </el-button>
        <el-button
          icon="ele-Document"
          size="default"
          type="primary"
          @click="handleDownload(2)"
        >
          {{ $t("form.printTemplate.exportExcelText") }}
        </el-button>
      </div>
      <iframe
        :src="previewUrl"
        border="none"
        class="detail-iframe mt10"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { DropdownInstance } from "element-plus";
import { downloadFormPrintTemplate, listFormPrintTemplate, ReportPrintEntity } from "@/api/project/printTemplate";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";
import { download } from "@/utils/tduck";
import { listFormPoster, PosterEntity } from "@/api/project/poster";

const route = useRoute();

const formPrintTemplateList = ref<ReportPrintEntity[]>([]);

const formPosterList = ref<PosterEntity[]>([]);

const dialogVisible = ref(false);

const dropdownRef = ref<DropdownInstance>();

const previewUrl = ref("");

onMounted(() => {
  listFormPrintTemplate(route.query.key as unknown as string).then(res => {
    formPrintTemplateList.value = res.data;
  });
  listFormPoster(route.query.key as unknown as string).then(res => {
    formPosterList.value = res.data;
  });
});

const props = defineProps({
  dataIds: {
    type: Array,
    default: () => []
  }
});

const currentTemplateKey = ref("");

const handlePreview = async (templateKey: string) => {
  if (!props.dataIds || !props.dataIds.length) {
    MessageUtil.error(i18n.global.t("form.formData.selectData"));
    return;
  }
  const res = await downloadFormPrintTemplate({
    selectedIds: props.dataIds as number[],
    downloadType: 1,
    templateKey: templateKey
  });
  let blobData = new Blob([res as any], { type: "application/pdf" });
  let pdfUrl = window.URL.createObjectURL(blobData);
  previewUrl.value = pdfUrl;
  dialogVisible.value = true;
  currentTemplateKey.value = templateKey;
};

const handleDownload = async (downloadType: number) => {
  if (!props.dataIds || !props.dataIds.length) {
    MessageUtil.error(i18n.global.t("form.formData.selectData"));
    return;
  }
  const res = await downloadFormPrintTemplate({
    selectedIds: props.dataIds as number[],
    downloadType: downloadType,
    templateKey: currentTemplateKey.value
  });
  if (downloadType === 1) {
    download(res, "template", ".pdf");
  } else {
    download(res, "template", ".xlsx");
  }
};

function showClick() {
  if (!dropdownRef.value) return;
  dropdownRef.value.handleOpen();
}

defineExpose({
  showClick
});
</script>
<style scoped lang="scss">
.el-dropdown {
  height: 100%;
}

.detail-iframe {
  border: 0;
  width: 100%;
  min-height: 95vh;
}
:deep(.el-dialog__body) {
  padding: 0 10px;
}
</style>
