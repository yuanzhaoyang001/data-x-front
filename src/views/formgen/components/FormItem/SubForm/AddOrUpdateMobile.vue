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
      v-if="formConf.fields.length"
      ref="generateForm"
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

<script>
export default {
  name: "AddOrUpdate",
  components: {},
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
      deep: true,

      handler: function (val, oldVal) {
        this.formConf.fields = val;
      },

      immediate: true
    }
  },
  beforeCreate() {
    this.$options.components.GenerateForm = require("../../GenerateForm/GenerateForm.vue").default;
  },
  methods: {
    handleUpdate() {
      this.$refs.generateForm.$refs[this.formConf.formRef].validate(valid => {
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
.form-content {
  margin: 20px;
}
</style>
