<template>
  <generate-form
    v-if="formConf.fields.length && formModel"
    ref="generateForm"
    class="generateForm"
    :form-conf="formConf"
    :page-form-model="formModel"
    style="margin-bottom: 40px"
  />
</template>

<script>
import { getBusinessProcessFormRequest } from "@/api/workflow/workflow";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";

export default {
  name: "ProcessForm",
  components: {
    GenerateForm
  },
  props: {
    taskId: {
      type: String,
      default: ""
    },
    instanceId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formModel: {},
      // 表单数据Id
      formDataId: "",
      formConf: {
        labelPosition: "top",
        fields: []
      }
    };
  },
  mounted() {
    let taskId = this.taskId || this.$route.query.taskId;
    let instanceId = this.instanceId || this.$route.query.procInsId;
    getBusinessProcessFormRequest(taskId, instanceId).then(res => {
      if (res.data) {
        let { fields, data } = res.data;
        this.formConf.fields = fields.map(item => item.scheme);
        this.formModel = data.originalData;
        this.formDataId = data.id;
      }
    });
  },
  methods: {
    getFormModel() {
      return this.$refs.generateForm.formModel;
    }
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
</style>
