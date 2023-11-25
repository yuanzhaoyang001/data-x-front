<template>
  <div class="phone-number-container">
    <el-form
      ref="form"
      label-position="top"
      :model="phoneValidateForm"
      label-width="80px"
    >
      <el-form-item prop="phoneNumber">
        <el-row :gutter="10">
          <el-col
            :xs="16"
            :sm="16"
            :md="16"
            :lg="10"
            :xl="10"
          >
            <el-input
              v-model="phoneValidateForm.phoneNumber"
              size="default"
              :required="open"
              maxlength="11"
              clearable
              :suffix-icon="codeIsTrue ? 'el-icon-check' : ''"
              :placeholder="$t('formgen.phoneVerification.placeholder')"
              @click="openDialogHandle"
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
              :disabled="phoneValidateCodeBtn"
              @click="sendValidateMsgHandle"
            >
              {{ phoneValidateCodeBtnText }}
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
              @blur="codeCheck"
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
            <!--            <el-button @click="open = false">取 消</el-button>-->
            <el-button
              type=""
              :disabled="codeBool"
              @click="validateCodeHandle"
            >
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
import { Popup } from "vant";
import "vant/lib/popup/style";
import mixin from "./mixin";

export default {
  name: "MobilePhoneVerification",
  components: {
    [Popup.name]: Popup
  },
  mixins: [mixin],
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.code {
  margin-top: 10px;
}
</style>
