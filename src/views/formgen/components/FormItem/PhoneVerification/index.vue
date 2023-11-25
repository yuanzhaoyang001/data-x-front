<template>
  <div class="phone-number-container">
    <!--    :rules="rules"-->
    <el-form
      ref="form"
      label-position="top"
      :model="phoneValidateForm"
      label-width="80px"
    >
      <el-form-item prop="phoneNumber">
        <el-row
          :gutter="10"
          class="w100"
        >
          <el-col
            :xs="16"
            :sm="16"
            :md="16"
            :lg="10"
            :xl="10"
          >
            <el-input
              v-model="phoneValidateForm.phoneNumber"
              maxlength="11"
              clearable
              :suffix-icon="codeIsTrue ? 'el-icon-check' : ''"
              :disabled="codeIsTrue"
              :placeholder="$t('formgen.phoneVerification.placeholder')"
            ></el-input>
          </el-col>
          <el-col
            :xs="6"
            :sm="6"
            :md="6"
            :lg="8"
            :xl="8"
          >
            <el-button
              v-if="!codeIsTrue"
              :disabled="phoneValidateCodeBtn"
              @click="sendValidateMsgHandle"
            >
              <el-icon>
                <ele-Position />
              </el-icon>
              {{ phoneValidateCodeBtnText }}
            </el-button>
            <el-button
              v-else
              @click="handleReSend"
            >
              <el-icon>
                <ele-RefreshRight />
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="open"
        prop="code"
        class="code"
      >
        <el-row :gutter="10">
          <el-col
            :xs="16"
            :sm="16"
            :md="16"
            :lg="10"
            :xl="10"
          >
            <el-input
              v-model="phoneValidateForm.code"
              clearable
              prefix-icon="ele-Message"
            />
          </el-col>
          <el-col
            :xs="6"
            :sm="6"
            :md="6"
            :lg="8"
            :xl="8"
          >
            <el-button
              :disabled="!phoneValidateForm.code"
              type="primary"
              @click="validateCodeHandle"
            >
              <el-icon class="icon">
                <ele-Check />
              </el-icon>
              {{ $t("formI18n.all.confirm") }}
            </el-button>
          </el-col>
        </el-row>
        <span></span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  name: "PhoneVerification",
  components: {},
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.code {
  margin-top: 10px;
}

.phone-number-container {
  width: 100%;

  .el-form {
    width: 100%;
  }

  .input {
    width: 100%;
  }
}

.phone-number-container :deep(.el-form-item__label) {
  float: left;
}

@media screen and (max-width: 500px) {
  .phone-number-container :deep(.el-form-item__label) {
    float: none !important;
  }
  :deep(.el-form-item .el-form-item__content) {
    margin-left: 0 !important;
  }
  .input {
    width: 100% !important;
  }
}

.icon {
  animation: shake 5s infinite;
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(-10deg);
  }
  20% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(-10deg);
  }
  40% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(10deg);
  }
  70% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(10deg);
  }
  90% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
