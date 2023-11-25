<template>
  <div class="header-wrap">
    <el-page-header @back="goBack">
      <template #content>
        <div class="flex-justify-between">
          <span class="title"></span>
          <div class="icon-toolbar">
            <el-tooltip
              :content="$t('form.formPoster.undo')"
              :show-after="500"
              :enterable="false"
            >
              <el-icon
                @click="undo"
                class="m2"
              >
                <undo-icon theme="outline" />
              </el-icon>
            </el-tooltip>
            <el-tooltip
              :content="$t('form.formPoster.redo')"
              :show-after="500"
              :enterable="false"
            >
              <el-icon
                @click="redo"
                class="m2"
              >
                <redo-icon theme="outline" />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
      </template>
      <template #extra>
        <div class="extra-btn-warp">
          <el-button
            type="primary"
            size="default"
            icon="ele-Promotion"
            @click="handlePreviewPoster"
          >
            {{ $t("form.formPoster.preview") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            icon="ele-Select"
            @click="handleSavePoster"
          >
            {{ $t("form.formPoster.save") }}
          </el-button>
        </div>
      </template>
    </el-page-header>
    <el-image-viewer
      @close="imgViewerVisible = false"
      :url-list="imageList"
      v-if="imgViewerVisible"
    />
  </div>
</template>

<script setup lang="ts" name="PosterHeader">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePosterStore } from "@/stores/formPoster";
import { MessageUtil } from "@/utils/messageUtil";
import useOperationHistory from "../main/useOperationHistory";
import { Redo as RedoIcon, Undo as UndoIcon } from "@icon-park/vue-next";
import { previewFormPoster, updateFormPoster } from "@/api/project/poster";
import { i18n } from "@/i18n";

const store = usePosterStore();

const imageList = ref([]);
const imgViewerVisible = ref(false);

const { undo, redo } = useOperationHistory();

let router = useRouter();

const goBack = () => {
  router.go(-1);
};
/**
 * 保存
 */
const handleSavePoster = () => {
  const poster: any = { ...store.posterConfig };
  poster.posterConfig = store.posterConfig;
  poster.posterWidgetList = store.posterWidgetList;
  updateFormPoster(poster).then((res: any) => {
    if (res.data) {
      MessageUtil.success(i18n.global.t("common.saveSuccess"));
    }
  });
};
/**
 * 保存海报
 */
const handlePreviewPoster = () => {
  const poster: any = { ...store.posterConfig };
  poster.posterConfig = store.posterConfig;
  poster.posterWidgetList = store.posterWidgetList;
  previewFormPoster(poster).then((res: any) => {
    imageList.value = [res.data];
    imgViewerVisible.value = true;
  });
};
</script>

<style scoped lang="scss">
.header-wrap {
  height: 100%;
  .title {
    height: 60px;
    line-height: 60px;
    font-weight: 800;
    font-size: 20px;
  }

  .flex-justify-between {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  :deep(.el-page-header__left) {
    padding-left: 25px;
  }

  .icon-toolbar {
    display: flex;
    margin-left: 250px;

    .el-icon {
      margin-right: 20px;
      font-size: 18px;
      color: var(--el-text-color-primary);
      &:hover {
        cursor: pointer;
        color: var(--el-color-primary);
      }
    }
    .fa:last-child {
      transform: rotate(180deg);
    }
  }
  .extra-btn-warp {
    margin-right: 30px;
  }
}
</style>
