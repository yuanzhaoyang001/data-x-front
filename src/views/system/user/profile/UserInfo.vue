<template>
  <el-form
    ref="form"
    :model="user"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item
      :label="$t('system.userProfile.nickName')"
      prop="nickName"
    >
      <el-input
        v-model="user.nickName"
        maxlength="30"
      />
    </el-form-item>
    <el-form-item
      :label="$t('system.userProfile.phoneNumber')"
      prop="phonenumber"
    >
      <el-input
        v-model="user.phonenumber"
        maxlength="11"
      />
    </el-form-item>
    <el-form-item
      :label="$t('system.userProfile.email')"
      prop="email"
    >
      <el-input
        v-model="user.email"
        maxlength="50"
      />
    </el-form-item>
    <el-form-item :label="$t('system.userProfile.gender')">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">{{ $t("system.userProfile.male") }}</el-radio>
        <el-radio label="1">{{ $t("system.userProfile.female") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        size="default"
        type="primary"
        @click="submit"
      >
        {{ $t("system.userProfile.save") }}
      </el-button>
      <el-button
        size="default"
        type="danger"
        @click="close"
      >
        {{ $t("system.userProfile.close") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";
import { closeCurrentTag } from "@/utils/other";
import { i18n } from "@/i18n";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [{ required: true, message: i18n.global.t("system.userProfile.nickNameRequired"), trigger: "blur" }],
        email: [
          { required: true, message: i18n.global.t("system.userProfile.emailRequired"), trigger: "blur" },
          {
            type: "email",
            message: i18n.global.t("system.userProfile.validEmail"),
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: i18n.global.t("system.userProfile.phoneNumberRequired"), trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: i18n.global.t("system.userProfile.validPhoneNumber"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.msgSuccess(i18n.global.t("system.userProfile.updateSuccess"));
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
