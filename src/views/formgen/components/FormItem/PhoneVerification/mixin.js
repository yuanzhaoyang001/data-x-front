import { getRequest, postRequest } from "@/api/baseRequest";
import { i18n } from "@/i18n";

export default {
  props: {
    value: null
  },
  data() {
    return {
      phoneValidateCodeBtnText: i18n.global.t("formgen.phoneVerification.smsCode"),
      phoneValidateCodeBtn: false,
      open: false,
      inputValue: null,
      codeIsTrue: false,
      phoneValidateForm: {
        phoneNumber: "",
        code: ""
      }
    };
  },
  methods: {
    validateCodeHandle() {
      const { code } = this.phoneValidateForm;
      if (code) {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 调接口 验证成功
            postRequest("/form/common/phone/code/check", this.phoneValidateForm).then(({ data }) => {
              this.open = false;
              this.$emit("update:value", data);
              this.codeIsTrue = true;
            });
          } else {
            valid = false;
          }
          return valid;
        });
      }
    },
    handleReSend() {
      this.phoneValidateForm.phoneNumber = "";
      this.phoneValidateForm.code = "";
      this.$emit("update:value", this.phoneValidateForm.phoneNumber);
      this.codeIsTrue = false;
    },
    sendValidateMsgHandle() {
      //手机号正则
      let mPattern = /^(?:0|86|\+86)?1[3456789]\d{9}$/;
      if (mPattern.test(this.phoneValidateForm.phoneNumber)) {
        this.phoneValidateForm.code = "";
        this.$refs.form.validateField("phoneNumber", err => {
          if (err) {
            this.open = true;
            this.phoneValidateCodeBtn = true;
            getRequest(`/form/common/phone/code?phoneNumber=${this.phoneValidateForm.phoneNumber}`).then(() => {
              //this.msgSuccess('验证码发送成功，5分钟内有效')
              let count = 60;
              const timer = setInterval(() => {
                count--;
                this.phoneValidateCodeBtnText = `${count}s`;
                if (count === 0) {
                  this.phoneValidateCodeBtnText = i18n.global.t("formgen.phoneVerification.smsCode");
                  this.phoneValidateCodeBtn = false;
                  clearInterval(timer);
                }
              }, 1000);
            });
          } else {
            console.log(err);
          }
        });
      }
    }
  },
  emits: ["update:value"]
};
