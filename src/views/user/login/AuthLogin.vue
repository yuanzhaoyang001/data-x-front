<template>
  <div
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-spinner="el-icon-loading"
    element-loading-text="正在登录..."
  ></div>
</template>

<script>
import { authLogin, bindLogin } from "@/api/system/userauth";
import { getToken } from "@/utils/auth";
import { Local, Session } from "@/utils/storage";

export default {
  name: "AuthLogin",
  data() {
    return {
      type: "",
      loading: false
    };
  },
  created() {
    const { params, query } = this.$route;
    const { path } = params;
    this.type = path;
    // 获取url全部参数
    // 没登录清空下
    const token = getToken();
    if (!token) {
      this.handAuthLogin(query);
    } else {
      // 登录了就绑定
      this.handleBind(query);
    }
  },
  methods: {
    handleBind(query) {
      bindLogin(this.type, query)
        .then(res => {
          if (res.data) {
            this.loading = false;
            window.location.href = Local.get("bindAccountUrl");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handAuthLogin(query) {
      authLogin(this.type, query)
        .then(res => {
          if (res.data) {
            Session.set("token", res.data.token);
            this.$router.push({ path: "/" }).catch(() => {});
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
