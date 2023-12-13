<template>
  <Verify
    ref="verify"
    :captcha-type="'blockPuzzle'"
    :img-size="{ width: '330px', height: '155px' }"
    :mode="'pop'"
    @cancel="cancelHandle"
    @success="verifySuccessHandle"
  />
</template>

<script>
import Verify from "./Verify.vue";

export default {
  name: "Verification",
  components: {
    Verify
  },
  props: {
    verifySuccess: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    }
  },
  mounted() {
    this.$refs["verify"].show();
  },
  methods: {
    verifySuccessHandle(params) {
      let slideCode = params.captchaVerification;
      this.verifySuccess(slideCode);
    },
    cancelHandle() {
      this.onCancel();
    }
  }
};
</script>

<style scoped></style>
