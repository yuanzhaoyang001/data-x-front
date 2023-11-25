<template>
  <biz-project-form
    v-if="formConfig.formKey"
    :form-config="formConfig"
    @submit="submitForm"
    class="t-form-theme-wrap"
  />
</template>

<script>
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";

export default {
  components: {
    BizProjectForm
  },
  data() {
    return {
      formConfig: {
        formKey: "",
        preview: true,
        showBtns: true
      }
    };
  },
  created() {
    this.formConfig.formKey = this.$route.query.key;
  },
  methods: {
    submitForm() {
      this.msgError("预览模式下无法提交数据");
    }
  }
};
</script>
