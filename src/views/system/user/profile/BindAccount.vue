<template>
  <div>
    <h3>{{ $t("system.bindAccount.title") }}</h3>
    <div
      class="bind-login-wrap"
      v-if="defaultBindList && defaultBindList.length"
    >
      <div
        v-for="ac in defaultBindList"
        :key="ac.type"
        class="bind-item"
      >
        <img
          v-if="ac.type === 1"
          :alt="ac.name"
          class="cursor-pointer login-icon"
          src="~@/assets/icons/wechatOpen.svg"
        />
        <img
          v-if="ac.type === 2"
          :alt="ac.name"
          class="cursor-pointer login-icon"
          src="~@/assets/icons/wechatEnterprise.svg"
        />
        <p v-show="getUserName(ac.type)">
          {{ getUserName(ac.type) }}
          <span class="bind-success">{{ $t("system.bindAccount.alreadyBound") }}</span>
        </p>
        <el-link
          v-if="!getUserName(ac.type)"
          type="primary"
          @click="handleBindAccount(ac.icon)"
        >
          {{ $t("system.bindAccount.goToBind") }}
        </el-link>
        <el-popconfirm
          v-else
          :title="$t('system.bindAccount.confirmUnbind')"
          @confirm="handleUnBindAccount(getBindInfo(ac.type))"
        >
          <template #reference>
            <el-link
              class="mt10"
              type="danger"
              underline="false"
            >
              {{ $t("system.bindAccount.unbind") }}
            </el-link>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <el-empty
      v-else
      :description="$t('system.bindAccount.notSupported')"
    ></el-empty>
  </div>
</template>

<script>
import { getAuthorizeUrl, getBindAccountList, unBindAccount } from "@/api/system/userauth";
import { Local } from "@/utils/storage";
import { getSystemInfoConfig } from "@/api/system/config";
import { i18n } from "@/i18n";

export default {
  name: "BindAccount",
  data() {
    return {
      type: "",
      loading: false,
      defaultBindList: [
        {
          type: 1,
          name: i18n.global.t("system.bindAccount.wechatOpen"),
          icon: "wechatOpen"
        },
        {
          type: 2,
          name: i18n.global.t("system.bindAccount.wechatEnterprise"),
          icon: "wechatEnterprise"
        }
      ],
      bindAccountList: []
    };
  },
  created() {
    getSystemInfoConfig().then(res => {
      if (res.data) {
        const supportList = JSON.parse(res.data).thirdPartyLoginTypeList || [];
        this.defaultBindList = this.defaultBindList.filter(item => supportList.includes(item.icon));
      }
      this.handQueryBindAccountList();
    });
  },
  methods: {
    handleBindAccount(type) {
      // 记住当前地址 用于绑定成功后跳转
      Local.set("bindAccountUrl", location.href + "?active=bindAccount");
      getAuthorizeUrl(type).then(res => {
        location.href = res.data;
      });
    },
    handQueryBindAccountList() {
      getBindAccountList().then(res => {
        this.bindAccountList = res.data;
      });
    },
    getBindInfo(type) {
      let arr = this.bindAccountList.filter(item => item.type === type);
      return arr && arr[0];
    },
    getUserName(type) {
      return this.getBindInfo(type)?.userName;
    },
    handleUnBindAccount(data) {
      unBindAccount(data).then(res => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.handQueryBindAccountList();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bind-login-wrap {
  display: flex;
  margin-top: 20px;
  .login-icon {
    width: 50px;
    height: 50px;
    margin: 10px;
  }

  .bind-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;

    .bind-success {
      color: #67c23a;
    }
  }
}
</style>
