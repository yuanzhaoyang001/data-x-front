<template>
  <div>
    <el-form
      ref="flowIconFormRef"
      :model="flowIconData"
    >
      <div
        class="exhibition-icon"
        :style="{ backgroundColor: getHoverColorAmount(flowIconData?.color || '', 60), color: flowIconData.color }"
      >
        <component
          :is="flowIconData.icon"
          v-if="flowIconData.icon"
        />
      </div>
      <div class="select-icon">
        <el-icon
          v-for="(item, index) in sheetsIconList"
          :key="index"
          @click="selectIcon(item)"
        >
          <component :is="item" />
        </el-icon>
      </div>
      <div class="hue-icon">
        <div class="hue-icon-wrap">
          <span>{{ $t("workflow.flowList.favorite") }}</span>
          <el-color-picker v-model="flowIconData.color" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { getHoverColorAmount } from "@/views/formgen/utils/theme";
import { onMounted, reactive, ref } from "vue";
import { FlowExtensionInfo } from "@/api/workflow/flowExtension";
import initIconfont from "@/utils/getStyleSheets";
import { MessageUtil } from "@/utils/messageUtil";
import { FormInstance } from "element-plus";
import { i18n } from "@/i18n";

const sheetsIconList = ref<any>(null);
const flowIconFormRef = ref<FormInstance>(null);
const flowIconData = reactive<FlowExtensionInfo>({
  color: "#4C4EDB",
  icon: "",
  categoriesId: [],
  name: ""
});
const selectIcon = (item: string) => {
  flowIconData.icon = item;
};
const initIconfontEle = async () => {
  const res = await initIconfont.ele();
  sheetsIconList.value = res;
};

const getFlowIcon = async () => {
  if (!flowIconData.icon) {
    MessageUtil.warning(i18n.global.t("workflow.flowList.pleaseChooseIcon"));
    return null;
  }
  if (!flowIconData.color) {
    MessageUtil.warning(i18n.global.t("workflow.flowList.pleaseChooseColor"));
    return null;
  }
  const validate = await flowIconFormRef.value.validate();
  if (validate) {
    return flowIconData;
  } else {
    return null;
  }
};
onMounted(async () => {
  await initIconfontEle();
});
defineExpose({
  getFlowIcon,
  flowIconData
});
</script>

<style scoped lang="scss">
.exhibition-icon {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin: 30px auto;
}
.select-icon {
  margin: 20px;
  height: 318px;
  border-radius: 10px;
  background: #f2f3f8;
  overflow: hidden;
  overflow-y: scroll;
  cursor: pointer;
  :deep(.el-icon) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
.hue-icon {
  width: 500px;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  .hue-icon-wrap {
    display: flex;
    align-items: center;
  }

  span {
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    color: #3d3d3d;
  }

  :deep(.el-color-picker--large) {
    height: 20px;
  }

  :deep(.el-color-picker__trigger) {
    width: 20px;
    height: 20px;
  }

  :deep(.el-color-picker__trigger) {
    border: none;
  }
}
</style>
