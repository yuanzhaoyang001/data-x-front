<template>
  <div class="widget-list-wrapper">
    <div class="desc-text mt6 ml10">
      {{ $t("form.formPoster.createComponentToCanvas") }}
    </div>
    <div
      class="widget-item"
      v-for="w in widgetList"
      :key="w.label"
      @click="handleAddWidget(w.type)"
    >
      <icon-park
        size="20px"
        class="icon"
        :type="w.icon"
      />
      <p class="label">{{ w.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="WidgetList">
import { cloneDeep } from "lodash-es";
import { PosterWidget, PosterWidgetType } from "../types/poster";
import { textWidgetConfig } from "../widget/text/textWidget";
import { imageWidgetConfig } from "../widget/image/imageWidget";
import { qrcodeWidgetConfig } from "../widget/qrcode/qrcodeWidget";
import { generateId } from "@/utils";
import { MessageUtil } from "@/utils/messageUtil";
import { usePosterStore } from "@/stores/formPoster";
import { IconPark } from "@icon-park/vue-next/es/all";
import { i18n } from "@/i18n";

const widgetList = [
  {
    icon: "add-text",
    label: i18n.global.t("form.formPoster.text"),
    type: PosterWidgetType.TEXT
  },
  {
    icon: "pic",
    label: i18n.global.t("form.formPoster.image"),
    type: PosterWidgetType.IMAGE
  },
  {
    icon: "two-dimensional-code-one",
    label: i18n.global.t("form.formPoster.qrcode"),
    type: PosterWidgetType.QRCODE
  }
];

const posterStore = usePosterStore();
const handleAddWidget = (type: PosterWidgetType) => {
  console.log(type);
  let widgetItem: PosterWidget | null = null;
  switch (type) {
    case PosterWidgetType.TEXT:
      widgetItem = textWidgetConfig;
      break;
    case PosterWidgetType.IMAGE:
      widgetItem = imageWidgetConfig;
      break;
    case PosterWidgetType.QRCODE:
      widgetItem = qrcodeWidgetConfig;
      break;
  }
  if (widgetItem) {
    widgetItem.id = generateId();
    posterStore.addPosterWidget(cloneDeep(widgetItem));
  } else {
    MessageUtil.warning(i18n.global.t("form.formPoster.unknownWidgetType"));
    return;
  }
};
</script>

<style scoped lang="scss">
.widget-list-wrapper {
  .widget-item {
    height: 55px;
    line-height: 55px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    margin: 5px;
    cursor: pointer;
    user-select: none;
    padding-left: 10px;
    display: flex;
    align-items: center;

    .icon {
      margin: 0 10px;
      font-size: 20px;
      display: inline-flex;
    }

    .label {
      color: var(--el-text-color-primary);
      font-size: var(--el-font-size-base);
      display: inline;
    }

    &:hover {
      background-color: var(--el-fill-color);
    }
  }
}
</style>
