<template>
  <div class="view-wrap">
    <div class="view-card">
      <generate-form
        v-if="formConf.fields.length && formModel"
        ref="generateForm"
        :form-conf="formConf"
        :page-form-model="formModel"
        style="margin-bottom: 40px"
      />
    </div>
  </div>
</template>

<script>
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { getFormDataViewRequest } from "@/api/project/data";

export default {
  name: "ViewGenFormData",
  components: { GenerateForm },
  data() {
    return {
      formParseKey: new Date().getTime(),
      formConf: {
        fields: [],
        formKey: "",
        disabled: true,
        span: 24,
        size: "small",
        labelPosition: "top",
        labelWidth: 100,
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
      },
      formModel: {}
    };
  },
  created() {
    let dataId = this.$route.query.dataId;
    getFormDataViewRequest(dataId).then(res => {
      this.formModel = res.data.formData;
      this.formConf.fields = res.data.formFields.map(item => item.scheme);
    });
  }
};
</script>

<style lang="scss" scoped>
.generateForm {
  margin: 20px;
}

:deep(.el-form-item__label) {
  text-align: left !important;
}

.view-wrap {
  width: 100%;

  .view-card {
    width: 50%;
    //background-color: #ffffff;
    padding: 10px;
    //box-shadow:
    //  0 2px 4px rgba(0, 0, 0, 0.12),
    //  0 0 6px rgba(0, 0, 0, 0.04);
    margin: 0 auto;
  }
}

@media only screen and (max-width: 767px) {
  .view-card {
    width: 100% !important;
    padding: 0px;
  }
}
</style>
