<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.certificateGen.title") }}</span>
        <span class="desc-text ml10">{{ $t("form.certificateGen.desc") }}</span>
      </div>
    </template>
    <div class="p10">
      <el-button
        class="mt15"
        size="default"
        type="primary"
        @click="handleAddPoster"
        v-re-click
      >
        <el-icon>
          <ele-Plus />
        </el-icon>
        {{ $t("form.certificateGen.addTemplate") }}
      </el-button>
      <el-scrollbar
        v-if="formPosterList && formPosterList.length"
        style="height: 75vh"
      >
        <div
          v-for="(item, index) in formPosterList"
          :key="index"
          class="print-template-item"
        >
          <div class="header">
            <div class="title">
              <el-icon>
                <ele-Postcard />
              </el-icon>
              {{ item.name }}
            </div>
            <div class="op-btn">
              <el-link
                :underline="false"
                class="mr10"
                type="success"
                @click="handleDesignPoster(item)"
              >
                {{ $t("form.certificateGen.designTemplate") }}
              </el-link>
              <el-link
                :underline="false"
                type="danger"
                @click="handleDeletePoster(item)"
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
        :description="$t('form.certificateGen.emptyTemplate')"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="FormPoster">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { i18n } from "@/i18n";
import { addFormPoster, delFormPoster, listFormPoster, PosterEntity } from "@/api/project/poster";
import { ElMessageBox } from "element-plus";
import { MessageUtil } from "@/utils/messageUtil";
import { PosterFileType } from "@/views/form/poster/editor/types/poster";

const formPosterList = ref<PosterEntity[]>([]);
const formPosterDialogVisible = ref(false);
const formPosterFormTitle = ref(i18n.global.t("form.certificateGen.addTemplate"));
const formKey = ref("");
const formPosterForm = ref<PosterEntity>({});

const queryFormPosterList = () => {
  listFormPoster(formKey.value).then(res => {
    formPosterList.value = res.data;
  });
};

const handleAddPoster = () => {
  formPosterFormTitle.value = i18n.global.t("form.certificateGen.addTemplate");
  formPosterDialogVisible.value = true;
  formPosterForm.value = {
    name: i18n.global.t("form.certificateGen.printDefaultName"),
    formKey: formKey.value,
    posterConfig: {
      posterBgColor: "#FFFFFF",
      posterBgImage: "",
      posterFileType: PosterFileType.PNG,
      width: 750,
      height: 1334
    }
  };
  addFormPoster(formPosterForm.value).then(res => {
    formPosterDialogVisible.value = false;
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    setTimeout(() => {
      handleDesignPoster(res.data as PosterEntity);
    }, 500);
  });
};

const router = useRouter();

const handleDesignPoster = (item: PosterEntity) => {
  router.push({
    path: "/form/poster/editor",
    query: {
      id: item.id,
      key: item.posterKey,
      formKey: item.formKey
    }
  });
};

const handleDeletePoster = (item: PosterEntity) => {
  ElMessageBox.confirm(i18n.global.t("form.certificateGen.deletePoster"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      delFormPoster(item.id as unknown as number).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        queryFormPosterList();
      });
    })
    .catch(() => {});
};

onMounted(() => {
  formKey.value = useRoute().query.key as string;
  queryFormPosterList();
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
