<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.printTemplate.title") }}</span>
        <span class="desc-text ml10">{{ $t("form.printTemplate.desc") }}</span>
      </div>
    </template>
    <div class="p10">
      <el-button
        class="mt15"
        size="default"
        type="primary"
        @click="handleAddPrintTemplate"
        v-re-click
      >
        <el-icon>
          <ele-Plus />
        </el-icon>
        {{ $t("form.printTemplate.addTemplate") }}
      </el-button>
      <el-scrollbar
        v-if="formPrintTemplateList && formPrintTemplateList.length"
        style="height: 75vh"
      >
        <div
          v-for="(item, index) in formPrintTemplateList"
          :key="index"
          class="print-template-item"
        >
          <div class="header">
            <div class="title">
              <el-icon>
                <excel
                  theme="outline"
                  size="24"
                  fill="#333"
                />
              </el-icon>
              {{ item.printName }}
            </div>
            <div class="op-btn">
              <el-link
                :underline="false"
                class="mr10"
                type="success"
                @click="handleDesignPrintTemplate(item)"
              >
                {{ $t("form.printTemplate.designTemplate") }}
              </el-link>
              <el-link
                :underline="false"
                type="danger"
                @click="handleDeletePrintTemplate(item)"
              >
                {{ $t("formI18n.all.delete") }}
              </el-link>
            </div>
          </div>

          <div class="desc-text">{{ $t("formI18n.all.createTime") }}：{{ item.createTime }}</div>
        </div>
      </el-scrollbar>
      <el-empty
        v-else
        :description="$t('form.printTemplate.emptyTemplate')"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="PrintTemplate">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { i18n } from "@/i18n";
import {
  addFormPrintTemplate,
  delFormPrintTemplate,
  listFormPrintTemplate,
  ReportPrintEntity
} from "@/api/project/printTemplate";
import { ElMessageBox } from "element-plus";
import { MessageUtil } from "@/utils/messageUtil";
import { Excel } from "@icon-park/vue-next";

const formPrintTemplateList = ref<ReportPrintEntity[]>([]);
const formPrintTemplateDialogVisible = ref(false);
const formPrintTemplateFormTitle = ref(i18n.global.t("form.printTemplate.addTemplate"));
const formKey = ref("");
const formPrintTemplateForm = ref<ReportPrintEntity>({});

const queryFormPrintTemplateList = () => {
  listFormPrintTemplate(formKey.value).then(res => {
    formPrintTemplateList.value = res.data;
  });
};

const handleAddPrintTemplate = () => {
  formPrintTemplateFormTitle.value = i18n.global.t("form.printTemplate.addTemplate");
  formPrintTemplateDialogVisible.value = true;
  formPrintTemplateForm.value = {
    printName: i18n.global.t("form.printTemplate.printDefaultName"),
    formKey: formKey.value,
    printJson: {
      paperType: "A4",
      topMargin: 5,
      bottomMargin: 5,
      leftMargin: 5,
      rightMargin: 5
    }
  };
  addFormPrintTemplate(formPrintTemplateForm.value).then(res => {
    formPrintTemplateDialogVisible.value = false;
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    setTimeout(() => {
      handleDesignPrintTemplate(res.data as ReportPrintEntity);
    }, 500);
  });
};

const router = useRouter();

const handleDesignPrintTemplate = (item: ReportPrintEntity) => {
  router.push({
    path: "/form/print/design",
    query: {
      id: item.id,
      key: item.formKey
    }
  });
};

const handleDeletePrintTemplate = (item: ReportPrintEntity) => {
  ElMessageBox.confirm(i18n.global.t("form.printTemplate.deletePrintTemplate"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      delFormPrintTemplate(item.id as unknown as number).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        queryFormPrintTemplateList();
      });
    })
    .catch(() => {});
};

onMounted(() => {
  formKey.value = useRoute().query.key as string;
  queryFormPrintTemplateList();
});
</script>

<style lang="scss" scoped>
.print-template-item {
  border: 1px solid #eee;
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: var(--el-color-primary-light-10);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    line-height: 20px;
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 10px;
    }
  }

  .desc-text {
    color: #999;
    line-height: 20px;
  }
}
</style>
