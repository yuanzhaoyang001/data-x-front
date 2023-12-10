<template>
  <div>
    <div v-if="!updateSuccess">
      <div class="header">
        <p>{{ projectFormKey === "1" ? "我填写的内容" : "修改中" }}</p>
        <el-button
          type="primary"
          link
          @click="handleEditForm"
          icon="ele-Edit"
          v-if="projectFormKey === '1' && showUpdateBtn"
        >
          修改
        </el-button>
      </div>
      <el-scrollbar style="height: calc(100vh - 20px)">
        <biz-project-form
          v-if="formConfig.formKey"
          :key="projectFormKey"
          ref="bizProjectFormRef"
          :form-config="formConfig"
          :form-data="formData"
          @submit="handleSubmitFormData"
        />
      </el-scrollbar>
    </div>
    <div
      v-if="updateSuccess"
      class="h100 flex-center"
    >
      <el-result
        icon="success"
        title="修改成功"
      ></el-result>
    </div>
  </div>
</template>

<script setup lang="ts" nmae="AnswerResult">
import { useRoute } from "vue-router";
import { onMounted, provide, ref } from "vue";
import { getFormDataRequest, updateFormDataByDataIdRequest, UserFormData } from "@/api/project/data";
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import { ResultData } from "@/api/types";
import { getPublicSettingsRequest } from "@/api/project/setting";

const route = useRoute();
const formConfig = ref({
  formKey: "",
  disabled: true
});

provide("formDisabled", formConf.disabled);

const showUpdateBtn = ref(false);

const projectFormKey = ref<string>("1");

const formData = ref<any>({});
onMounted(() => {
  getFormDataRequest(route.query.id as unknown as number).then((res: ResultData<UserFormData>) => {
    formData.value = res.data.originalData;
    formConfig.value.formKey = res.data.formKey;
    // 查询设置 是否允许修改
    getPublicSettingsRequest(formConfig.value.formKey).then((res: any) => {
      showUpdateBtn.value = res.data.updateSubmitContentBtn;
    });
  });
});

const handleEditForm = () => {
  formConfig.value.disabled = false;
  projectFormKey.value = new Date().getTime() + "";
};

const updateSuccess = ref(false);

const handleSubmitFormData = (data: any) => {
  let submitFormData = {
    originalData: data.formModel,
    dataId: route.query.id
  };
  updateFormDataByDataIdRequest(submitFormData).then(() => {
    updateSuccess.value = true;
  });
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
  box-shadow: var(--el-box-shadow);
  line-height: 40px;
  height: 40px;

  .el-button {
    margin-left: 20px;
  }

  .p {
    font-size: 16px;
  }
}
</style>
