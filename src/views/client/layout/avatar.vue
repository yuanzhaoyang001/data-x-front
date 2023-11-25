<template>
  <div class="avatar-warp">
    <el-dropdown
      @command="onHandleCommandClick"
      :show-timeout="70"
      :hide-timeout="50"
    >
      <t-avatar
        :size="30"
        :url="userInfos.avatar"
        :name="userInfos.userName"
      ></t-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <div v-hasPermi="['system:mange:home']">
            <el-dropdown-item command="/mange/home">{{ $t("form.avatar.manage") }}</el-dropdown-item>
          </div>
          <el-dropdown-item command="/user/center">{{ $t("form.avatar.userCenter") }}</el-dropdown-item>
          <el-dropdown-item
            divided
            command="logOut"
          >
            {{ $t("form.avatar.logout") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts" name="HomeAvatar">
import { useUserInfo } from "@/stores/userInfo";
import { Session } from "@/utils/storage";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import TAvatar from "@/components/TAvatar/index.vue";

const { userInfos } = useUserInfo();
const router = useRouter();

// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
  if (path === "logOut") {
    ElMessageBox({
      closeOnClickModal: false,
      closeOnPressEscape: false,
      title: "退出登录",
      message: "确定要退出登录吗？",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      buttonSize: "default",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "退出中...";
          setTimeout(() => {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          }, 700);
        } else {
          done();
        }
      }
    })
      .then(async () => {
        // 清除缓存/token等
        Session.clear();
        // 使用 reload 时，不需要调用 resetRoute() 重置路由
        window.location.reload();
      })
      .catch(() => {});
  } else {
    router.push(path);
  }
};
</script>

<style scoped lang="scss">
.avatar-warp {
  display: flex;
}
</style>
