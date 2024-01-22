<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="配置"
        name="config"
      >
        <el-form
          style="width: 50%"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            label="开启注册"
            :rules="[{ required: true }]"
          >
            <el-switch v-model="form.enableRegister" />
          </el-form-item>
          <el-form-item
            label="微信登录"
            :rules="[{ required: true }]"
          >
            <el-switch v-model="form.enableWxLogin" />
          </el-form-item>
          <el-form-item label="系统名称">
            <el-input v-model="form.systemName" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
            >
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { getByKey, saveConfig } from "@/api/uniapp";
import { MessageUtil } from "@/utils/messageUtil";

const form = ref({
  systemName: "",
  enableWxLogin: false,
  enableRegister: false
});

onMounted(() => {
  getByKey({
    configKey: "systemConfig"
  }).then(res => {
    form.value = res.data;
  });
});

const onSubmit = () => {
  console.log("submit!");
  saveConfig({
    configKey: "systemConfig",
    configValue: form.value
  }).then(res => {
    MessageUtil.success("保存成功");
  });
};

const activeName = ref("config");
</script>
<style scoped lang="scss">
.app-container {
  background-color: var(--el-bg-color);
}
</style>
