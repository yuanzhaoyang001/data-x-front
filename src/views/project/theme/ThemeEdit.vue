<template>
  <div class="mb20">
    <el-row style="height: 750px">
      <el-col
        :span="15"
        class="t-form-theme-wrap"
      >
        <generate-form
          v-if="showForm"
          ref="generateForm"
          :form-conf="formConf"
          :page-form-model="formModel"
          class="theme-prview-wrap"
        />
      </el-col>
      <el-col
        :span="6"
        :offset="3"
      >
        <el-scrollbar height="100%">
          <el-form
            ref="formRef"
            :model="themeForm"
            label-width="80px"
          >
            <el-form-item
              :label="$t('project.themeList.name')"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: '',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                v-model="themeForm.name"
                :placeholder="$t('project.themeList.name')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('project.themeList.style')"
              prop="style"
              :rules="[
                {
                  required: true,
                  message: '',
                  trigger: 'blur'
                }
              ]"
            >
              <el-select
                v-model="themeForm.style"
                :placeholder="$t('project.themeList.style')"
              >
                <el-option
                  v-for="c in themeCategoryList"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <ThemeConfig
            :form-theme-config="themeConfig"
            @refresh="handleRefresh"
            class="mt20"
          />
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name-="ThemeEdit">
import { onMounted, provide, reactive, ref, watch } from "vue";
import GenerateForm from "@/views/formgen/components/GenerateForm/index.vue";
import ThemeConfig from "@/views/form/theme/ThemeConfig.vue";
import themeFields from "@/views/project/theme/themeFields";
import { setThemeVars } from "@/views/formgen/utils/theme";
import type { FormInstance } from "element-plus";

const formConf = reactive({
  fields: themeFields,
  formKey: "",
  disabled: true,
  span: 24,
  size: "default",
  labelPosition: "top",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  formBtns: true,
  resetBtn: false
});

const themeForm = ref({
  name: "",
  style: ""
});
const formModel = ref({});

const showForm = ref(false);

const themeConfig = ref({});

provide("formThemeConfig", themeConfig);

onMounted(() => {
  showForm.value = true;
  localStorage.setItem("FORM-SUPPORT", "xxxx");
});

const props = defineProps({
  themeFormProp: {
    type: Object,
    default: () => ({})
  },
  themeCategoryList: {
    type: Array,
    default: () => []
  }
});

watch(
  () => props.themeFormProp,
  () => {
    themeForm.value = { name: props.themeFormProp?.name, style: props.themeFormProp?.style };
    console.log(props.themeFormProp);
    themeConfig.value = { ...props.themeFormProp.themeConfig };
  },
  { immediate: true }
);

const handleRefresh = (vars: any) => {
  themeConfig.value = vars;
  setThemeVars(vars);
};
const formRef = ref<FormInstance>();

const getThemeConfig = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    return { ...themeForm.value, themeConfig: themeConfig.value };
  } catch (err) {
    console.error("err", err);
  }
  return null;
};

defineExpose({
  getThemeConfig
});
</script>

<style scoped lang="scss">
.theme-prview-wrap {
  min-height: 740px;
  height: 740px;
}
</style>
