<template>
  <el-dialog
    class="dialog"
    :title="title"
    v-model="dialogFormVisible"
    append-to-body
  >
    <generate-form
      v-if="formConf.fields.length"
      ref="generateForm"
      :form-conf="formConf"
      :page-form-model="formModel"
      :is-sub-form="true"
      :key="formParseKey"
    />
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button
      type="primary"
      @click="handleUpdate"
    >
      确 定
    </el-button>
  </el-dialog>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "AddOrUpdate",
  components: {
    GenerateForm: defineAsyncComponent(() => import("../../GenerateForm/GenerateForm.vue"))
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    }
  },
  emits: ["submit"],
  data() {
    return {
      formParseKey: new Date().getTime(),
      dialogFormVisible: false,
      formModel: {},
      title: "新增",
      formConf: {
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
      }
    };
  },
  watch: {
    fields: {
      handler: function (val, oldVal) {
        this.formConf.fields = val;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleUpdate() {
      this.$refs.generateForm.$refs["genFormRef"].validate(valid => {
        if (valid) {
          // this.msgSuccess('保存成功')
          this.dialogFormVisible = false;
          this.$emit("submit", this.$refs.generateForm.formModel);
          return true;
        }
        return false;
      });
    },
    showDialog(data) {
      if (data) {
        this.formModel = data;
        this.title = "修改";
      } else {
        this.formModel = {};
        this.title = "新增";
      }
      this.dialogFormVisible = true;
      this.formParseKey += new Date().getTime();
    }
  }
};
</script>

<style scoped>
@media screen and (max-width: 500px) {
  .dialog.body {
    width: 100%;
  }
}
</style>
