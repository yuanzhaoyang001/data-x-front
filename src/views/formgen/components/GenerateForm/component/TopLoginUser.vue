<template>
  <div
    v-if="token && showHeaderUserInfo"
    class="top-login-user"
  >
    <div class="inner-wrap">
      <div class="user-infos">
        <span>{{ $t("formgen.topLoginUser.tip1") }}</span>
        <t-avatar
          :size="16"
          :src="userInfos?.avatar"
          class="ml4 mr4"
        />
        {{ userInfos?.userName }}
        {{ $t("formgen.topLoginUser.tip2") }}
      </div>
      <div
        class="logout pointer"
        @click="logoutList"
      >
        {{ $t("form.avatar.logout") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getToken } from "@/utils/auth";
import { Session } from "@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { inject } from "vue";
import { SHOW_HEADER_USER_INFO_KEY } from "@/views/formgen/components/GenerateForm/types/constants";

const token = getToken();

const userInfos = Session.get("userInfo");

const router = useRouter();
const route = useRoute();

const logoutList = () => {
  Session.clear();
  router.push(`/login?redirect=${route.path}&params=${JSON.stringify(route.query ? route.query : route.params)}`);
};

const showHeaderUserInfo = inject<boolean>(SHOW_HEADER_USER_INFO_KEY, false); // 类型：string | undefined
</script>

<style lang="scss" scoped>
.top-login-user {
  background-color: var(--el-color-primary-light-9);
  font-size: var(--el-font-size-base);
  height: 28px;
  line-height: 28px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
}

.inner-wrap {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 800px;
  margin: 0 auto;
}

.user-infos {
  display: flex;
  align-items: center;
}

.logout {
  cursor: pointer;
}
</style>
