<template>
  <div>
    <el-form>
      <el-form-item label="表单key">
        <el-input v-model="formKey" />
      </el-form-item>
      <el-button @click="syncDataIndex">提交</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      formKey: ""
    };
  },
  methods: {
    syncDataIndex() {
      this.$api.get("/ops/syncFormData", { params: { formKey: this.formKey } }).then(res => {
        this.msgSuccess("同步成功");
      });
    }
  }
};
</script>
