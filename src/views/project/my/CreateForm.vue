<template>
  <el-dialog
    class="container-form"
    v-model="createFormVisible"
    width="40%"
  >
    <div class="container-form-title">{{ $t("form.createForm.title") }}</div>
    <div class="container-form-wrap">
      <div
        class="container-form-sort"
        @click="handleCreateForm(1)"
      >
        <div class="container-form-img">
          <img src="@/assets/images/form/ordinary.png" />
        </div>
        <h4>{{ $t("form.createForm.normalForm") }}</h4>
        <span>{{ $t("form.createForm.normalFormText") }}</span>
      </div>

      <div
        class="container-form-sort"
        @click="handleCreateForm(4)"
      >
        <div class="container-form-img"><img src="@/assets/images/form/exam.png" /></div>
        <h4>{{ $t("form.createForm.examForm") }}</h4>
        <span>{{ $t("form.createForm.examFormText") }}</span>
      </div>
      <div
        class="container-form-sort"
        @click="handleCreateForm(5)"
      >
        <div class="container-form-img"><img src="@/assets/images/form/markting.png" /></div>
        <h4>{{ $t("form.createForm.marketingForm") }}</h4>
        <span>{{ $t("form.createForm.marketingFormText") }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="createForm">
import { ref } from "vue";
import { createFormRequest } from "@/api/project/form";
import { useRouter } from "vue-router";
import { useFormInfo } from "@/stores/formInfo";

const createFormVisible = ref<boolean>(false);
const formStore = useFormInfo();
const router = useRouter();

const defaultFormData: FormDataType = {
  description:
    "<p style='text-align: center;' data-mce-style='text-align: center;'>感谢您能抽出几分钟时间来参加本次表单填写，现在我们就马上开始吧！</p>",
  folderId: 0
};
interface FormDataType {
  description: string;
  name?: string;
  type?: number;
  folderId: number;
}

const props = defineProps({
  folderId: {
    type: Number,
    default: 0
  }
});

const createFormHandle = async (formData: FormDataType) => {
  createFormVisible.value = true;
  const res = await createFormRequest(formData);
  formStore.setBackRoute(router.currentRoute.value.path);
  await router.push({
    path: `/project/form/editor/index`,
    query: { key: res.data.formKey, active: "editor/index", type: formData.type }
  });
  createFormVisible.value = false;
};

const handleCreateForm = async (type: number) => {
  let typeName = "";
  switch (type) {
    case 1:
      typeName = "问卷";
      break;
    case 2:
      typeName = "流程";
      break;
    case 4:
      typeName = "考试";
      break;
    default:
      typeName = "问卷";
      break;
  }
  const examFormData: FormDataType = {
    ...defaultFormData,
    name: "未命名" + typeName,
    type: type,
    folderId: props.folderId
  };
  await createFormHandle(examFormData);
};

const showForm = () => {
  createFormVisible.value = true;
};

defineExpose({
  showForm
});
</script>

<style lang="scss">
.container-form {
  height: 470px;
  .el-dialog__header {
    border: none !important;
  }
  .container-form-title {
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: #3d3d3d;
  }
  .container-form-wrap {
    margin-top: 85px;
    display: flex;
    justify-content: space-evenly;
  }
  .container-form-sort:hover {
    box-sizing: border-box;
    border: 2px solid #4c4edb;
    box-shadow: 0 4px 10px 0px rgba(0, 0, 0, 0.3);
  }
  .container-form-sort {
    width: 189px;
    height: 240px;
    border-radius: 10px;
    background: #f2f3f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
    border: 2px solid transparent;
    margin: 0 5px;
    text-align: center;

    .container-form-img {
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 61.68%;
        height: 68.53%;
        object-fit: contain;
      }
    }
    h4 {
      font-weight: 500;
      color: #3d3d3d;
      line-height: 30px;
    }
    span {
      width: 152px;
      padding: 0 6px;
      font-size: 10px;
      font-weight: normal;
      color: #79808b;
    }
  }
}
</style>
