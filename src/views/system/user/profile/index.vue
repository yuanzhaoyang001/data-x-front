<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col
        :span="6"
        :xs="24"
      >
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>{{ $t("system.userCenter.personalInfo") }}</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <userAvatar
                :user="user"
                @uploadSuccess="handleUploadSuccess"
              />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <i class="iconfont icon-gerenzhongxin" />
                {{ $t("system.userCenter.userName") }}
                <div class="pull-right">
                  {{ user.userName }}
                </div>
              </li>
              <li class="list-group-item">
                <i class="iconfont icon-gerenzhongxin" />
                {{ $t("system.userCenter.phoneNumber") }}
                <div class="pull-right">
                  {{ user.phonenumber }}
                </div>
              </li>
              <li class="list-group-item">
                <i class="iconfont icon-shouye" />
                {{ $t("system.userCenter.userEmail") }}
                <div class="pull-right">
                  {{ user.email }}
                </div>
              </li>
              <li class="list-group-item">
                <i class="iconfont icon-bumenguanli" />
                {{ $t("system.userCenter.dept") }}
                <div
                  v-if="user.dept"
                  class="pull-right"
                >
                  {{ user.dept.deptName }} / {{ postGroup }}
                </div>
              </li>
              <li class="list-group-item">
                <i class="iconfont icon-jiaoseguanli" />
                {{ $t("system.userCenter.role") }}
                <div class="pull-right">
                  {{ roleGroup }}
                </div>
              </li>
              <li class="list-group-item">
                <i class="iconfont icon-gerenzhongxin" />
                {{ $t("system.userCenter.createDate") }}
                <div class="pull-right">
                  {{ user.createTime }}
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col
        :span="18"
        :xs="24"
      >
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>{{ $t("system.userCenter.basicInfo") }}</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane
              :label="$t('system.userCenter.basicInfo')"
              name="userinfo"
            >
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane
              :label="$t('system.userCenter.bindAccount')"
              name="bindAccount"
            >
              <bind-account :user="user" />
            </el-tab-pane>
            <el-tab-pane
              :label="$t('system.userCenter.resetPassword')"
              name="resetPwd"
            >
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserAvatar from "./UserAvatar.vue";
import UserInfo from "./UserInfo.vue";
import ResetPwd from "./ResetPwd.vue";
import BindAccount from "./BindAccount.vue";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { BindAccount, UserAvatar, UserInfo, ResetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    // url中获取参数
    const { active } = this.$route.query;
    if (active) {
      this.activeTab = active;
    }
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data.user;
        this.roleGroup = response.data.roleGroup;
        this.postGroup = response.data.postGroup;
      });
    },
    handleUploadSuccess(url) {
      this.user.avatar = url;
    }
  }
};
</script>
<style scoped>
.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
}
</style>
