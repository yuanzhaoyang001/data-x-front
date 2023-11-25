<template>
  <div
    class="register"
    :style="getWrapStyle"
  >
    <!--  头部  -->
    <div class="register-logo">{{ themeConfig.globalTitle }}</div>
    <!--  内容  -->
    <div class="register-weaper">
      <div class="register-right">
        <div class="register-main">
          <div class="register-form-envelop">
            <div class="register-title">{{ $t("register.register.type") }}{{ themeConfig.globalTitle }}</div>
            <div class="register-login-envelop">
              <div>
                <span class="register-account">{{ $t("register.register.account") }}？</span>
              </div>
              <div @click="$router.push('/login')">
                <span class="register-promptly">{{ $t("register.register.loginNow") }}</span>
                <el-button
                  class="register-goto"
                  type="primary"
                  icon="ele-ArrowRightBold"
                  circle
                />
              </div>
            </div>
          </div>
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="register-form"
          >
            <el-form-item prop="userName">
              <el-input
                v-model="registerForm.userName"
                auto-complete="off"
                :placeholder="$t('register.register.inputAccount')"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                auto-complete="off"
                show-password
                :placeholder="$t('register.register.inputPwd')"
                @keyup.enter="handleRegister"
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                auto-complete="off"
                show-password
                :placeholder="$t('register.register.conformPwd')"
                @keyup.enter="handleRegister"
              />
            </el-form-item>
            <el-form-item prop="nickName">
              <el-input
                v-model="registerForm.nickName"
                link
                type="primary"
                auto-complete="off"
                :placeholder="$t('register.register.inputNickname')"
              />
            </el-form-item>
            <!--            <el-form-item prop="email" label="邮箱">
															<el-input v-model="registerForm.email" link type="primary" auto-complete="off" placeholder="请输入邮箱" />
														</el-form-item>
														<el-form-item prop="email" label="手机号">
															<el-input v-model="registerForm.phonenumber" link type="primary" auto-complete="off" placeholder="请输入手机号码" />
														</el-form-item>
														<el-form-item prop="sex" label="性别">
															<dict-select v-model="registerForm.sex" :dict-key="'sys_user_sex'" />
														</el-form-item>-->
            <el-form-item style="width: 100%">
              <el-button
                class="register-button"
                :loading="loading"
                size="small"
                type="primary"
                style="width: 100%"
                @click.prevent="handleRegister"
              >
                <span v-if="!loading">{{ $t("register.register.handleRegister") }}</span>
                <span v-else>{{ $t("register.register.registerIng") }}</span>
              </el-button>
            </el-form-item>
            <!--            <div class="protocol">-->
            <!--              <el-checkbox-->
            <!--                v-model="checked"-->
            <!--                size="large"-->
            <!--                class="protocol-frame"-->
            <!--              />-->
            <!--              <span>{{ $t("register.register.agreement") }}</span>-->
            <!--              <el-link-->
            <!--                type="primary"-->
            <!--                :underline="false"-->
            <!--              >-->
            <!--                {{ $t("register.register.term") }}-->
            <!--              </el-link>-->
            <!--            </div>-->
          </el-form>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-register-footer">
      <div v-html="themeConfig.copyright" />
    </div>
  </div>
</template>

<script setup>
import { register } from "@/api/login";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeConfig } from "@/stores/themeConfig";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";

const checked = ref(false);
const loading = ref(false);

const registerFormRef = ref(null);

const registerForm = reactive({
  userName: "",
  nickName: "",
  password: "",
  confirmPassword: "",
  email: "",
  phonenumber: "",
  sex: "0"
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.password !== value) {
    callback(new Error(i18n.global.t("login.login.pwdRepeatCheck")));
  } else {
    callback();
  }
};

const registerRules = reactive({
  userName: [
    { required: true, trigger: "blur", message: "" },
    {
      min: 2,
      max: 20,
      message: computed(() => i18n.global.t("login.login.nameCheck")),
      trigger: "blur"
    }
  ],
  password: [
    { required: true, trigger: "blur", message: "" },
    {
      min: 5,
      max: 20,
      message: computed(() => i18n.global.t("login.login.pwdCheck")),
      trigger: "blur"
    }
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: "" },
    { required: true, validator: equalToPassword, trigger: "blur" }
  ],
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"]
    }
  ],
  phonenumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
});

const router = useRouter();

// 获取布局配置信息
const { themeConfig } = useThemeConfig();

const getWrapStyle = computed(() => {
  // 配置了才使用配置的，否则使用css中默认的背景图
  const backgroundImage = themeConfig.backgroundImage;
  if (backgroundImage) {
    return {
      backgroundImage: `url(${themeConfig.backgroundImage})`
    };
  }
  return {};
});

const handleRegister = () => {
  registerFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      register(registerForm)
        .then(res => {
          MessageUtil.success("注册成功");
          router.push("/login");
        })
        .catch(() => {
          loading.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.register {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-size: cover;

  .register-logo {
    margin-left: 32px;
    margin-top: 32px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  .el-register-footer {
    width: 100%;
    color: #fff;
    font-size: 12px;
    opacity: 0.5;
    letter-spacing: 1px;
    margin-left: 32px;
    margin-bottom: 32px;
  }

  .register-button {
    width: 100%;
    height: 45px;
    border-radius: 10px;
    //opacity: 0.5;
    font-size: 14px;
    color: #fff;
    background-color: var(--el-color-primary);
    font-weight: 700;
  }

  .register-weaper {
    height: 600px;
    width: 470px;
    box-sizing: border-box;
    z-index: 1;
    margin-left: auto;
    margin-right: 200px;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    //animation: slide-up 1s ease;
    .register-right {
      width: 100%;
      height: 100%;
      display: flex;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 20px;

      .register-main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: 0 55px;
        .register-form-envelop {
          display: flex;
          flex-direction: column;
        }
        .register-login-envelop {
          display: flex;
          align-items: center;
          height: 20px;
          line-height: 20px;
          margin-top: 20px;
          span {
            font-size: 14px;
            line-height: 14px;
          }
        }
        .register-account {
          opacity: 0.7;
          color: #243042;
          align-content: center;
        }
        .register-promptly {
          color: var(--el-color-primary);
          cursor: pointer;
          align-content: center;
        }
        .register-goto {
          width: 14px;
          height: 14px;
          margin-left: 2px;
          padding: 7px;
          font-size: 12px;
        }

        .register-title {
          color: #333;
          font-size: 40px;
          letter-spacing: 0px;
          font-weight: bold;
        }

        .register-form {
          display: flex;
          flex-direction: column;

          .el-form-item {
            margin-bottom: 20px !important;
          }
        }
      }
    }
  }
}
.protocol {
  display: flex;
  align-items: center;
  color: #233041b2;
  font-size: 14px;
  span {
    text-align: center;
    line-height: 14px;
    height: 14px;
    margin-right: 5px;
  }
  :deep(.el-checkbox__inner) {
    border-color: rgba(35, 48, 65, 0.6980392157);
    opacity: 0.9;
  }
  .protocol-frame {
    text-align: center;
    padding-right: 6px;
  }
  :deep(.el-link__inner) {
    text-align: center;
    line-height: 14px;
    height: 14px;
  }
}
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(100px); /* 初始位置，在Y轴上向下移动100px */
  }

  100% {
    opacity: 1;
    transform: translateY(0); /* 最终位置，回到原始位置 */
  }
}
@media screen and (max-width: 700px) {
  .register-logo {
    display: none !important;
  }
  .register-weaper {
    height: 100% !important;
    width: 100% !important;
    margin: 0;
    animation: none !important;
  }
  .register-right {
    border-radius: 0 !important;
  }
  .el-register-footer {
    display: none !important;
  }

  .register-main {
    margin: 0 auto !important;
    width: 100% !important;
  }
}
:deep(.el-input) {
  height: 50px;
}
</style>
