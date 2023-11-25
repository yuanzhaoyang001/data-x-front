<template>
  <div
    class="login"
    :style="getWrapperStyle"
  >
    <!--  头部  -->
    <div class="login-logo">
      {{ themeConfig.globalTitle }}
    </div>

    <!--  内容  -->
    <div class="login-weaper">
      <div class="login-right">
        <div class="login-main">
          <div class="login-form-wepr">
            <div class="login-title">{{ $t("login.login.type") }} {{ themeConfig.globalTitle }}</div>
            <div
              class="login-register"
              v-if="openRegister"
              @click="$router.push('/register')"
            >
              <div>
                <span class="login-account">{{ $t("login.login.notRegText") }}？</span>
              </div>
              <div>
                <span class="login-promptly">{{ $t("login.login.registerNow") }}</span>
                <el-button
                  class="login-goto"
                  type="primary"
                  icon="ele-ArrowRightBold"
                  circle
                />
              </div>
            </div>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                auto-complete="off"
                :placeholder="$t('login.login.placeholderName')"
                prefix-icon="ele-User"
                size="small"
                style="font-size: 14px"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                show-password
                auto-complete="off"
                style="font-size: 14px"
                :placeholder="$t('login.login.placeholderPwd')"
                prefix-icon="ele-Lock"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-row
              :span="20"
              type="flex"
              align="middle"
              class="mb8 remember-pwd-wrap"
            >
              <el-col>
                <el-checkbox v-model="loginForm.rememberMe">
                  {{ $t("login.login.rememberPwdText") }}
                </el-checkbox>
              </el-col>
            </el-row>
            <el-form-item style="width: 100%">
              <el-button
                :loading="loading"
                class="login-submit"
                size="small"
                style="width: 100%"
                type="primary"
                @click.prevent="handleLogin"
              >
                <span v-if="!loading">{{ $t("login.login.loginBtnText") }}</span>
                <span v-else>{{ $t("login.login.loginInBtnText") }}</span>
              </el-button>
            </el-form-item>
            <!--            <div class="protocol">-->
            <!--              {{ $t("login.login.protocol") }}&nbsp;&nbsp;-->
            <!--              <el-link-->
            <!--                type="primary"-->
            <!--                :underline="false"-->
            <!--              >-->
            <!--                {{ $t("login.login.ServiceTerms") }}-->
            <!--              </el-link>-->
            <!--            </div>-->
          </el-form>
          <!--  其他登录-->

          <div class="other-login-wrap">
            <div>
              <el-divider>{{ $t("login.login.otherLogin") }}</el-divider>
            </div>
            <div class="other-login-way">
              <div
                v-if="
                  globalConfigInfo &&
                  globalConfigInfo.thirdPartyLoginTypeList &&
                  globalConfigInfo.thirdPartyLoginTypeList.includes('wechatOpen')
                "
                class="other-login-wechat"
              >
                <img
                  src="../../../assets/icons/wechatOpen.svg"
                  alt="微信登录"
                  class="cursor-pointer login-icon"
                  @click="handleToOtherLogin('wechatOpen')"
                />
                {{ $t("login.login.wechatLogin") }}
              </div>
              <div
                v-if="
                  globalConfigInfo &&
                  globalConfigInfo.thirdPartyLoginTypeList &&
                  globalConfigInfo.thirdPartyLoginTypeList.includes('wechatEnterprise')
                "
                class="other-login-firm"
              >
                <img
                  src="../../../assets/icons/wechatEnterprise.svg"
                  alt="企微 "
                  class="cursor-pointer login-icon"
                  @click="handleToOtherLogin('wechatEnterprise')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <div v-html="themeConfig.copyright" />
    </div>
  </div>
</template>
<script setup name="Login">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import Cookies from "js-cookie";
import { decrypt, encrypt } from "@/utils/jsencrypt";
import { Session } from "@/utils/storage";
import { getAuthorizeUrl } from "@/api/system/userauth";
import { getConfigValue, getSystemInfoConfig } from "@/api/system/config";
import { useThemeConfig } from "@/stores/themeConfig";
import { login } from "@/api/login";
import { initBackEndControlRoutes } from "@/router/backEnd";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false,
  uuid: ""
});
const loginRules = ref({
  username: [{ required: true, trigger: "blur", message: " " }],
  password: [{ required: true, trigger: "blur", message: " " }]
});
const loading = ref(false);
const redirect = ref("");
const openRegister = ref(false);
const globalConfigInfo = ref(null);
const loginFormRef = ref(null);

// 获取布局配置信息
const themeStore = useThemeConfig();

const { themeConfig } = storeToRefs(themeStore);

const router = useRouter();

const getWrapperStyle = computed(() => {
  if (globalConfigInfo.value && globalConfigInfo.value.backgroundImage) {
    return {
      backgroundImage: `url(${globalConfigInfo.value.backgroundImage})`
    };
  }
  return {};
});

watch(
  () => router.currentRoute.value.query,
  query => {
    redirect.value = query && query.redirect;
  },
  { immediate: true, deep: true }
);

const getCookie = async () => {
  const username = await Cookies.get("username");
  const password = await Cookies.get("password");
  const rememberMe = await Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.username : username,
    password: password === undefined ? loginForm.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
};
const getConfig = async () => {
  const res = await getConfigValue("sys.account.register");
  if (res.data && res.data === "Y") {
    openRegister.value = true;
  }

  // 系统配置
  await nextTick(async () => {
    globalConfigInfo.value = Session.get("globalConfigInfo");
    if (!globalConfigInfo.value) {
      const configRes = await getSystemInfoConfig();
      globalConfigInfo.value = JSON.parse(configRes.data);
      Session.set("globalConfigInfo", JSON.parse(configRes.data));
    }
  });
};

const handleToOtherLogin = async type => {
  const res = await getAuthorizeUrl(type);
  location.href = res.data;
};

const handleLogin = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      if (loginForm.rememberMe) {
        Cookies.set("username", loginForm.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.password), {
          expires: 30
        });
        Cookies.set("rememberMe", loginForm.rememberMe, {
          expires: 30
        });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      login(loginForm.username.trim(), encrypt(loginForm.password))
        .then(async res => {
          Session.set("token", res.data);
          await initBackEndControlRoutes();
          const query = JSON.parse(router.currentRoute.value.query.params || "{}");
          router
            .push({
              path: redirect.value || "/",
              query: query
            })
            .catch(() => {});
        })
        .catch(() => {
          loading.value = false;
        });
    }
  });
};
onMounted(() => {
  getCookie();
  getConfig();
});
</script>
<style lang="scss" scoped>
@media screen and (max-width: 500px) {
  .login-logo {
    display: none !important;
  }
  .el-login-footer {
    display: none !important;
  }
  .login-weaper {
    height: 100% !important;
    width: 100% !important;
    margin: 0;
    animation: none !important;
  }
  .login-left {
    display: none !important;
  }
  .login-right {
    border-radius: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    background-color: rgba(255, 255, 255, 1) !important;
  }
  .login-main {
    margin: 0 auto !important;
    width: 100% !important;
  }
}

.login {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-size: cover;

  .login-logo {
    margin-left: 32px;
    margin-top: 32px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .el-login-footer {
    width: 100%;
    color: #fff;
    font-size: 12px;
    opacity: 0.5;
    letter-spacing: 1px;
    margin-left: 32px;
    margin-bottom: 32px;
  }

  .login-weaper {
    height: 600px;
    width: 470px;
    box-sizing: border-box;
    z-index: 1;
    margin-left: auto;
    margin-right: 200px;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    //animation: slide-up 1s ease;

    .login-right {
      width: 100%;
      height: 100%;
      display: flex;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 20px;

      .login-main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: 0 55px;

        .login-form-wepr {
          display: flex;
          flex-direction: column;
        }

        .login-register {
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

        .login-account {
          opacity: 0.7;
          color: #243042;
          align-content: center;
        }

        .login-promptly {
          color: var(--el-color-primary);
          cursor: pointer;
          align-content: center;
        }

        .login-title {
          color: #333;
          font-size: 36px;
          letter-spacing: 0px;
          font-weight: bold;
        }

        .remember-pwd-wrap {
          :deep(.el-checkbox__inner) {
            border-color: #4f4f4f;
            opacity: 0.9;
          }
        }

        .login-form {
          margin: 10px 0;
          display: flex;
          flex-direction: column;

          .protocol {
            display: flex;
            justify-content: center;
            color: #233041b2;
            font-size: 14px;
          }

          .login-form-select {
            color: #1a1a1a;
          }

          i {
            color: #333;
          }

          .el-form-item {
            margin-bottom: 20px !important;

            .login-submit {
              border-radius: 10px;
              width: 100%;
              height: 45px;
              //opacity: 0.5;
              font-size: 14px;
              color: #fff;
              background-color: var(--el-color-primary);
              font-weight: 700;
            }
          }
        }
      }
    }
  }

  @keyframes slide-up {
    0% {
      opacity: 0;
      transform: translateY(100px); /* 初始位置，在Y轴上向下移动100px */
    }

    100% {
      opacity: 0;
      transform: translateY(0); /* 最终位置，回到原始位置 */
    }
  }

  .login-goto {
    width: 14px;
    height: 14px;
    margin-left: 2px;
    padding: 7px;
    font-size: 12px;
  }

  .other-login-wrap {
    display: flex;
    flex-direction: column;

    .other-login-way {
      display: flex;
    }

    .other-login-wechat {
      flex: 8;
      height: 48px;
      color: #243042;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow:
        rgba(0, 0, 0, 0.08) 0px 4px 6px 0px,
        rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .other-login-firm {
      flex: 2;
      height: 48px;
      margin-left: 5px;
      cursor: pointer;
      box-shadow:
        rgba(0, 0, 0, 0.08) 0 4px 6px 0px,
        rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-icon {
      margin: 2px;
    }
  }

  .select {
    border-color: #222;
  }

  @media screen and (max-width: 700px) {
    .login-weaper {
      height: 100% !important;
      width: 100% !important;
      opacity: 1;
    }
    .login-left {
      display: none !important;
    }
    .login-right {
      border-radius: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: rgba(255, 255, 255, 1) !important;
    }
    .login-main {
      margin: 0 auto !important;
      width: 70% !important;
      padding: 0 !important;
    }
  }

  :deep(.el-input) {
    height: 50px;
  }
}
</style>
