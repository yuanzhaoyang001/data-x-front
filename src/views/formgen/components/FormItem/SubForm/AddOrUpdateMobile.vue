<template>
  <el-drawer
    class="drawer"
    size="100%"
    :title="title"
    direction="btt"
    v-model="dialogFormVisible"
  >
    <generate-form
      class="form-content"
      v-if="dialogFormVisible && formConf.fields.length"
      ref="generateFormRef"
      :form-conf="formConf"
      :page-form-model="formModel"
      :is-sub-form="true"
    />
    <div style="text-align: center">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="handleUpdate"
      >
        确 定
      </el-button>
    </div>
  </el-drawer>
</template>

<script setup name="AddOrUpdate">
import { defineAsyncComponent, reactive, ref, watch } from "vue";

const GenerateForm = defineAsyncComponent(() => import("../../GenerateForm/GenerateForm.vue"));

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  }
});

const formParseKey = ref(new Date().getTime());
const dialogFormVisible = ref(false);
const formModel = ref({});
const title = ref("新增");
const formConf = reactive({
  fields: [],
  formKey: "",
  disabled: false,
  span: 24,
  size: "small",
  labelPosition: "top",
  labelWidth: 100,
  formRef: "elSubForm",
  formRules: "rules",
  gutter: 15,
  formBtns: false,
  resetBtn: false,
  theme: {
    backgroundImg: "",
    showFormTitle: true,
    showFormDescribe: true,
    showFormNumber: false,
    btnsColor: null
  }
});

watch(
  () => props.fields,
  val => {
    formConf.fields = val;
  },
  { deep: true, immediate: true }
);

const emit = defineEmits(["submit"]);

const generateFormRef = ref(null);

const handleUpdate = () => {
  generateFormRef.value.validateForm().then(valid => {
    if (valid) {
      dialogFormVisible.value = false;
      emit("submit", generateFormRef.value.formModel);
      return true;
    }
    return false;
  });
};

const showDialog = data => {
  if (data) {
    formModel.value = data;
    title.value = "修改";
  } else {
    formModel.value = {};
    title.value = "新增";
  }
  dialogFormVisible.value = true;
  formParseKey.value += new Date().getTime();
};

defineExpose({
  showDialog,
  handleUpdate
});
</script>

<style scoped>
.form-content {
  margin: 20px;
}
</style>
