<template>
  <div class="check-wrap">
    <el-card
      class="pwdinput-card text-center"
      v-if="setting?.passwordWriteStatus"
    >
      <template #header>
        <div class="clearfix">
          <span>请输入密码填写</span>
        </div>
      </template>
      <el-input
        v-model.trim="writePassword"
        placeholder="请输入密码填写"
      />
      <el-button
        class="width50 mt20"
        type="primary"
        @click="handleCheckWritePwd"
      >
        确定
      </el-button>
    </el-card>
    <el-card
      class="pwdinput-card text-center"
      v-if="setting?.enableWhiteList"
    >
      <template #header>
        <div class="clearfix">
          <span>{{ setting?.whiteListTips }}</span>
        </div>
      </template>
      <el-input v-model.trim="writePassword" />
      <el-button
        class="width50 mt20"
        type="primary"
        @click="handleCheckWhiteList"
      >
        确定
      </el-button>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { checkWritePwdRequest } from "@/api/project/setting";
import { checkAnswerWhitelist } from "@/api/project/answerWhiteList";
import { useUserForm } from "@/stores/userForm";

const props = defineProps<{
  formKey: string;
  setting: any;
}>();

const writePassword = ref<string>("");

const emit = defineEmits(["enter"]);

const handleCheckWritePwd = () => {
  checkWritePwdRequest({
    formKey: props.formKey,
    password: writePassword.value
  }).then(() => {
    emit("enter");
  });
};

const userFormStore = useUserForm();

const { setWhilteListVal } = userFormStore;

const handleCheckWhiteList = () => {
  checkAnswerWhitelist({
    formKey: props.formKey,
    type: props.setting?.whiteListType,
    value: writePassword.value
  }).then(() => {
    setWhilteListVal(writePassword.value);
    emit("enter");
  });
};
</script>

<style scoped lang="scss">
.check-wrap {
  height: 100vh;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  .el-card {
    width: 20% !important;
  }
}

@media screen and (max-width: 768px) {
  .check-wrap {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    .el-card {
      width: 90% !important;
    }
  }
}
</style>
