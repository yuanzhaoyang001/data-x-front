<template>
  <el-container>
    <el-header height="50px">
      <el-page-header @back="goBack">
        <template #content>
          <div>
            <div
              class="name"
              v-if="!isEdit"
              @click="isEdit = true"
            >
              {{ formPrintTemplate.printName }}
            </div>
            <el-input
              v-else
              size="default"
              v-model="formPrintTemplate.printName"
              @change="handleSavePrintName"
            />
          </div>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button
              icon="ele-View"
              size="default"
              @click="handlePreview"
            >
              {{ $t("common.preview") }}
            </el-button>
            <el-button
              size="default"
              type="primary"
              class="ml12"
              icon="ele-Check"
              @click="handleSave"
            >
              {{ $t("common.save") }}
            </el-button>
          </div>
        </template>
      </el-page-header>
    </el-header>
    <el-container style="height: calc(100vh - 50px)">
      <el-aside width="200px">
        <el-tabs
          v-model="activeName"
          type="border-card"
        >
          <el-tab-pane
            :label="$t('form.printTemplate.printDirectionLabel')"
            name="first"
          >
            <el-scrollbar style="height: calc(100vh - 130px)">
              <div
                v-for="f in fields"
                :key="f.value"
                class="field-item"
              >
                <div @click="handleSetCellVal(f.value, PrintCellType.COLUMN)">
                  <el-icon>
                    <add-text
                      theme="outline"
                      size="24"
                    />
                  </el-icon>
                  {{ f.label }}
                </div>
                <el-dropdown placement="bottom-end">
                  <div class="el-dropdown-link">
                    <el-icon class="el-icon--right">
                      <ele-ArrowDown />
                    </el-icon>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleSetCellVal(f.value, PrintCellType.QRCODE)">二维码</el-dropdown-item>
                      <el-dropdown-item @click="handleSetCellVal(f.value, PrintCellType.BARCODE)">条形码</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main style="height: calc(100vh - 50px)">
        <LuckySheetWrap
          ref="luckySheetWrapRef"
          v-if="formPrintTemplate.id"
          :sheetData="formPrintTemplate.sheetDataJson ? JSON.parse(formPrintTemplate.sheetDataJson) : null"
        />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import LuckySheetWrap from "./LuckySheetWrap.vue";
import {
  getFormPrintTemplate,
  previewFormPrintTemplate,
  ReportPrintEntity,
  updateFormPrintTemplate
} from "@/api/project/printTemplate";
import { MessageUtil } from "@/utils/messageUtil";
import { listFormFieldsRequest } from "@/api/project/form";
import { AddText } from "@icon-park/vue-next";
import { i18n } from "@/i18n";
import { PrintCellType } from "@/views/form/publish/PrintTemplate/types";

const router = useRouter();
const route = useRoute();

const activeName = ref("first");

const goBack = () => {
  router.go(-1);
};

const formPrintTemplate = ref<ReportPrintEntity>({});
const fields = ref<any[]>([]);

onMounted(() => {
  getFormPrintTemplate(route.query.id as unknown as number).then(res => {
    formPrintTemplate.value = res.data;
  });
  listFormFieldsRequest(route.query.key as unknown as string).then(res => {
    fields.value = res.data;
  });
});

onUnmounted(() => {
  window.luckysheet.destroy();
});

const handleSavePrintName = () => {
  updateFormPrintTemplate({
    id: route.query.id,
    printName: formPrintTemplate.value.printName
  }).then(() => {
    isEdit.value = false;
    MessageUtil.success(i18n.global.t("common.saveSuccess"));
  });
};

const luckySheetWrapRef = ref<any>(null);

const isEdit = ref(false);

const handleSave = async () => {
  await updateFormPrintTemplate({
    id: route.query.id,
    sheetDataJson: JSON.stringify(luckySheetWrapRef.value?.getSheetData())
  });
  MessageUtil.success(i18n.global.t("common.saveSuccess"));
};

const handlePreview = async () => {
  await handleSave();
  const res = await previewFormPrintTemplate({
    id: route.query.id as unknown as number
  });
  let blobData = new Blob([res as any], { type: "application/pdf" });
  let pdfUrl = window.URL.createObjectURL(blobData);
  window.open(pdfUrl, "_blank");

  // window.open(window.origin + "/pdfjs/web/viewer.html?file=" + pdfUrl);
};

/**
 * 设置当前选中的单元格值
 * @param val 值
 * @param cellType 单元格类型
 */
const handleSetCellVal = (val: string, cellType?: PrintCellType) => {
  luckySheetWrapRef.value?.setSheetCurrentCellVal(val, cellType);
};
</script>
<style scoped lang="scss">
.el-header {
  border-bottom: var(--el-border);
  display: flex;
  align-items: center;

  .el-page-header {
    width: 100%;
  }

  .name {
    min-width: 120px;
  }

  .name:hover {
    border: var(--el-border-color) dashed 1px;
  }
}

.field-item {
  padding: 10px 5px;
  cursor: pointer;
  border-radius: 5px;
  user-select: none;
  // 超出长度省略号
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: var(--el-color-primary-light-10);
  }

  .el-dropdown,
  .el-dropdown-link {
    width: 10%;
  }

  .el-icon--right {
    float: right;
  }

  .el-icon {
    color: var(--el-color-primary);
  }
}
</style>
