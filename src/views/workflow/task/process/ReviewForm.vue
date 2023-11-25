<template>
  <div>
    <div v-if="!showResult">
      <review-button
        :simple-review="true"
        :task-info="taskForm"
        :get-form-model="getFormModel"
        :get-form-data-id="getFormDataId"
        @change="showResult = true"
      />
      <generate-form
        v-if="formConf.fields.length && formModel"
        ref="generateForm"
        class="generateForm"
        :form-conf="formConf"
        :page-form-model="formModel"
        style="margin-bottom: 40px"
      />
    </div>
    <el-result
      icon="success"
      title="操作成功"
      sub-title="点击左上角箭头返回"
      v-else
    ></el-result>
  </div>
</template>

<script>
import { getBusinessProcessFormRequest } from "@/api/workflow/workflow";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import ReviewButton from "@/views/workflow/task/process/ReviewButton.vue";

export default {
  name: "ProcessForm",
  components: {
    GenerateForm,
    ReviewButton
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
      taskForm: {
        instanceId: "", // 流程实例编号
        taskId: "" // 流程任务编号
      },
      formDataId: "",
      formConf: {
        fields: []
      },
      showResult: false
    };
  },
  created() {
    this.taskForm.taskId = this.$route.query && this.$route.query.taskId;
    this.taskForm.instanceId = this.$route.query && this.$route.query.instanceId;
  },
  mounted() {
    let taskId = this.taskId || this.$route.query.taskId;
    let instanceId = this.instanceId || this.$route.query.instanceId;
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
    getFormDataId() {
      return this.formDataId;
    },
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

.review-btn-warp {
  padding: 10px;
}
</style>
