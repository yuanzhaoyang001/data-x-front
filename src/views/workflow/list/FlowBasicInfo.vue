<template>
  <div class="container-wrap">
    <el-form
      class="container-frame"
      ref="flowInfoFormRef"
      :model="flowInfoData"
      :rules="rules"
    >
      <el-form-item
        class="container-frame-top"
        :label="$t('workflow.flowList.name')"
        prop="name"
      >
        <el-input
          v-model="flowInfoData.name"
          :placeholder="$t('workflow.flowList.pleaseEnterName')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('workflow.flowList.classify')"
        prop="categoriesId"
        class="container-frame-bottom"
      >
        <el-select
          v-model="flowInfoData.categoriesId"
          :placeholder="$t('workflow.flowList.pleaseChoose')"
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { FlowExtensionInfo } from "@/api/workflow/flowExtension";
import { Category, getCategoriesList } from "@/api/workflow/categories";
import { i18n } from "@/i18n";

const flowInfoFormRef = ref<FormInstance>();

const options = ref<Category[]>();
const flowInfoData = reactive<FlowExtensionInfo>({
  color: "#4C4EDB",
  icon: "",
  categoriesId: [],
  name: ""
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: i18n.global.t("workflow.flowList.pleaseEnterName"), trigger: "blur" }],
  categoriesId: [{ required: true, message: i18n.global.t("workflow.flowList.pleaseChoose"), trigger: "blur" }]
});

onMounted(async () => {
  const res = await getCategoriesList();
  options.value = res.data;
});

const getFlowInfoData = async () => {
  const validateRes = await flowInfoFormRef.value?.validate();
  if (validateRes) {
    return flowInfoData;
  } else {
    return null;
  }
};

defineExpose({
  getFlowInfoData,
  flowInfoData
});
</script>

<style scoped lang="scss">
.container-wrap {
  width: 100%;
  height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container-frame {
  .container-frame-top {
    width: 380px;
  }
  .container-frame-bottom {
    width: 380px;
  }
}

.cancel-bnt {
  width: 60px;
  height: 29px;
  border-radius: 5px;
  background: #e8e8e8;
}

.affirm-bnt {
  width: 88px;
  height: 29px;
  border-radius: 5px;
  background: #4c4edb;
  color: #ffffff;
  font-size: 12px;
}
</style>
