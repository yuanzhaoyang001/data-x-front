<template>
  <el-dialog
    fullscreen
    v-model="dialogVisible"
    :show-close="false"
    style="background-color: var(--el-bg-color-page)"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header"></div>
    </template>
    <div class="form-wrap">
      <div class="form-inner-wrap">
        <h1 class="text-center">{{ $t("login.updateAccount.updateAccountTitle") }}</h1>
        <div class="mb10 mt10">{{ $t("login.updateAccount.updateAccountDesc") }}</div>
        <el-form
          label-position="top"
          label-width="100px"
          :model="formModel"
        >
          <el-form-item
            :label="$t('login.updateAccount.accountName')"
            prop="account"
            :rules="[
              {
                required: true,
                message: $t('login.updateAccount.accountNamePlaceholder'),
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="formModel.account"
              :placeholder="$t('login.updateAccount.accountNamePlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="$t('login.updateAccount.password')">
            <el-input
              v-model="formModel.password"
              show-password
              :placeholder="$t('login.updateAccount.passwordPlaceholder')"
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleNext">
              {{ $t("common.cancel") }}
            </el-button>
            <el-button
              type="primary"
              @click="handleUpdate"
            >
              {{ $t("common.enter") }}
              <el-icon>
                <ele-ArrowRight />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer"></span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { updateAccount } from "@/api/system/userauth";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";

const dialogVisible = ref(true);

const formModel = ref({
  account: "",
  password: ""
});

const showDialog = (user: any) => {
  dialogVisible.value = true;
  formModel.value.account = user.userName;
};

const handleUpdate = () => {
  updateAccount(formModel.value).then(res => {
    MessageUtil.success(i18n.global.t("common.saveSuccess"));
    handleNext();
  });
};

const emit = defineEmits(["next"]);

const handleNext = () => {
  emit("next");
  dialogVisible.value = false;
};

defineExpose({
  showDialog
});
</script>

<style scoped lang="scss">
.form-wrap {
  display: flex;
  height: 80vh;
  align-items: center;
  justify-content: center;
}

.form-inner-wrap {
  width: 320px;
}

.dialog-footer {
  position: fixed;
  bottom: 10px;
  right: 30px;
}
</style>
