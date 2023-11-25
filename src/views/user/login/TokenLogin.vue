<template>
  <div></div>
</template>
<script lang="ts" name="TokenLogin" setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { tokenLogin } from "@/api/login";
import { Session } from "@/utils/storage";
import { initBackEndControlRoutes } from "@/router/backEnd";
import { ElLoading } from "element-plus";
import { i18n } from "@/i18n";
import { MessageUtil } from "@/utils/messageUtil";

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const text = i18n.global.t("login.login.loginInBtnText");
    const loading = ElLoading.service({
      lock: true,
      text: text,
      background: "rgba(0, 0, 0, 0.7)"
    });
    const token = route.query.thirdToken;
    const res = await tokenLogin(token);
    Session.set("token", res.data.token);
    await initBackEndControlRoutes();
    const query = JSON.parse((route.query.params as string) || "{}");
    loading.close();
    router
      .push({
        path: (route.query.redirect as string) || "/",
        query: query
      })
      .catch(() => {});
  } catch (e) {
    MessageUtil.error("登录失败");
  }
});
</script>

<style lang="scss" scoped></style>
