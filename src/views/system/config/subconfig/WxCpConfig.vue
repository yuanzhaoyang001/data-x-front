<template>
  <div>
    <el-form
      ref="wxCpEnvConfig"
      :model="form"
      label-width="150px"
    >
      <el-form-item
        label="企业Id"
        prop="corpId"
        :rules="[{ required: true, message: '请输入企业Id', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.corpId"
          placeholder="请输入企业Id"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="AgentId"
        prop="agentId"
        :rules="[{ required: true, message: '请输入agentId', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.agentId"
          placeholder="请输入agentId"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Secret"
        prop="secret"
        :rules="[{ required: true, message: '请输入Secret', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.secret"
          placeholder="请输入Secret"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
        >
          {{ $t("formI18n.all.save") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ConfigMixin from "./ConfigMixin";

export default {
  name: "WxCpConfig",
  mixins: [ConfigMixin],
  data() {
    return {};
  },
  async created() {
    this.activeName = "wxCpEnvConfig";
    await this.handleClick();
  },
  mounted() {}
};
</script>
<style scoped>
.el-input {
  width: 35%;
}
</style>
