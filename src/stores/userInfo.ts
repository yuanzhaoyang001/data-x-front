import { defineStore } from "pinia";
import { Session } from "@/utils/storage";
import { getInfo } from "@/api/login";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore("userInfo", {
  state: (): UserInfosState => ({
    userInfos: {
      userId: 0,
      userName: "",
      avatar: "",
      time: 0,
      roles: [],
      authBtnList: []
    }
  }),
  actions: {
    async setUserInfos() {
      // 存储用户信息到浏览器缓存
      if (Session.get("userInfo")) {
        this.userInfos = Session.get("userInfo");
      } else {
        const userInfos = <UserInfos>await this.getApiUserInfo();
        this.userInfos = userInfos;
        Session.set("userInfo", userInfos);
      }
    },
    /**
     * 更新头像
     */
    updateAvatar(avatar: string) {
      this.userInfos.avatar = avatar;
      Session.set("userInfo", this.userInfos);
    },
    // 模拟接口数据
    // https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
    async getApiUserInfo() {
      return new Promise(resolve => {
        getInfo().then(res => {
          const { permissions, roles, user } = res.data;
          // 用户信息模拟数据
          const userInfos = {
            userId: user.id,
            userName: user.nickName,
            avatar: user.avatar,
            time: new Date().getTime(),
            roles: roles,
            authBtnList: permissions
          };
          Session.set("userInfo", userInfos);
          resolve(userInfos);
        });
      });
    }
  }
});
