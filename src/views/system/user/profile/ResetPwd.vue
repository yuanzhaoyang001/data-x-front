<template>
  <el-form
    ref="form"
    :model="user"
    :rules="rules"
    label-width="150px"
  >
    <el-form-item
      :label="$t('system.changePassword.oldPassword')"
      prop="oldPassword"
    >
      <el-input
        v-model="user.oldPassword"
        :placeholder="$t('system.changePassword.oldPasswordRequired')"
        type="password"
      />
    </el-form-item>
    <el-form-item
      :label="$t('system.changePassword.newPassword')"
      prop="newPassword"
    >
      <el-input
        v-model="user.newPassword"
        :placeholder="$t('system.changePassword.newPasswordRequired')"
        type="password"
      />
    </el-form-item>
    <el-form-item
      :label="$t('system.changePassword.confirmPassword')"
      prop="confirmPassword"
    >
      <el-input
        v-model="user.confirmPassword"
        :placeholder="$t('system.changePassword.confirmPasswordRequired')"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        size="default"
        type="primary"
        @click="submit"
      >
        {{ $t("system.changePassword.save") }}
      </el-button>
      <el-button
        size="default"
        type="danger"
        @click="close"
      >
        {{ $t("system.changePassword.close") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import { encrypt } from "@/utils/jsencrypt";
import { closeCurrentTag } from "@/utils/other";
import { i18n } from "@/i18n";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error(i18n.global.t("system.changePassword.confirmPasswordMatch")));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          {
            required: true,
            message: i18n.global.t("system.changePassword.oldPasswordRequired"),
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, message: i18n.global.t("system.changePassword.newPasswordRequired"), trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: i18n.global.t("system.changePassword.newPasswordLength"),
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { required: true, message: i18n.global.t("system.changePassword.confirmPasswordRequired"), trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(encrypt(this.user.oldPassword), encrypt(this.user.newPassword)).then(response => {
            this.msgSuccess(i18n.global.t("system.changePassword.updateSuccess"));
          });
        }
      });
    },
    close() {
      closeCurrentTag(this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
