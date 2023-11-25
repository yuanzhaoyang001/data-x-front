<template>
  <div class="project-setting-view">
    <div class="project-setting-title">
      {{ $t("form.setting.notificationSettingLabel") }}
      <span class="small-font-size ml20 text-secondary-color">{{ $t("form.setting.notifySettingSubtitle") }}</span>
    </div>
    <el-divider />
    <el-form
      ref="notifySettingForm"
      :model="notifySettingForm"
      :rules="settingRules"
    >
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.newDataEmailNotification") }}</p>
        <el-switch
          v-model="notifySettingForm.emailNotify"
          @change="saveSettingHandle"
        />
      </div>
      <el-form-item
        v-if="notifySettingForm.emailNotify"
        style="padding-bottom: 10px"
        prop="newWriteNotifyEmail"
      >
        <el-row :gutter="20">
          <el-col :span="14">
            <el-input
              @change="saveSettingHandle"
              v-model="notifySettingForm.newWriteNotifyEmail"
              :placeholder="$t('form.setting.newDataEmailInputPlaceholder')"
            />
          </el-col>
          <el-col :span="2">
            <el-button @click="$refs.userChooseTable.showDialog([])">{{ $t("form.setting.chooseSystemUsers") }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.newDataWeChatNotification") }}</p>
        <el-switch
          v-model="notifySettingForm.wxNotify"
          @change="saveSettingHandle"
        />
      </div>
      <p
        class="project-setting-sub-label sub-label-text"
        v-if="notifySettingForm.wxNotify"
      >
        {{ $t("form.setting.followOfficialAccount") }}
        <el-link
          type="primary"
          @click="openSubNotifyWxDialogHandle"
        >
          {{ $t("form.setting.clickToFollow") }}
        </el-link>
      </p>
      <el-row
        v-if="notifySettingForm.newWriteNotifyWx"
        align="middle"
        type="flex"
      >
        <el-col
          :offset="3"
          :span="5"
        >
          <p class="project-setting-sub-label">{{ $t("form.setting.notificationRecipients") }}</p>
        </el-col>
        <el-col :span="12">
          <span
            v-for="(user, i) in subNotifyWxUserList"
            :key="i"
            class="sub-user-view"
          >
            <el-icon
              class="sub-user-delete"
              @click="deleteSubNotifyUserHandle"
            >
              <ele-Close />
            </el-icon>
            <el-avatar :src="user.headImgUrl" />
            <span>{{ user.nickname }}</span>
          </span>
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogSubNotifyVisible"
        :title="$t('form.setting.subscribeWeChatQRCodeTitle')"
        width="400px"
      >
        <el-image
          :src="subNotifyWxQrCode"
          fit="fill"
          style="width: 150px; height: 150px"
        />
      </el-dialog>
    </el-form>
    <!--    用户选择-->
    <user-choose-table
      ref="userChooseTable"
      @submit="handleSelectUser"
    />
  </div>
</template>

<script>
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import mixin from "./mixin";
import {
  deleteWxNotifyUserRequest,
  getSettingRequest,
  getWxNotifyQrcodeRequest,
  getWxNotifyUserRequest,
  saveSettingRequest
} from "@/api/project/setting";
import { i18n } from "@/i18n";

export default {
  name: "NotifySetting",
  components: {
    UserChooseTable
  },
  mixins: [mixin],
  data() {
    return {
      settingRules: {
        newWriteNotifyEmail: [
          {
            trigger: "blur",
            pattern: /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/,
            message: i18n.global.t("form.setting.enterEmail")
          },
          { required: true, message: i18n.global.t("form.setting.enterEmail"), trigger: "blur" }
        ]
      },
      notifySettingForm: {
        emailNotify: false,
        newWriteNotifyEmail: null,
        wxNotify: false,
        newWriteNotifyWx: null
      },
      dialogSubNotifyVisible: false,
      subNotifyWxQrCode: "",
      subNotifyWxUserList: [],
      subNotifyUserTimer: null
    };
  },
  mounted() {
    this.queryUserProjectSetting();
    this.getSubNotifyWxQrCode();
  },
  unmounted() {
    clearInterval(this.subNotifyUserTimer);
  },
  methods: {
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then(res => {
        if (res.data) {
          this.notifySettingForm = res.data;
          if (this.notifySettingForm.wxNotify) {
            this.querySubNotifyWxUser(this.notifySettingForm.newWriteNotifyWx);
          }
        }
      });
    },
    openSubNotifyWxDialogHandle() {
      this.dialogSubNotifyVisible = true;
      this.subNotifyUserTimer = setInterval(() => {
        this.querySubNotifyWxUser();
      }, 5 * 1000);
    },
    querySubNotifyWxUser(openIdStr) {
      getWxNotifyUserRequest({
        key: this.formKey,
        openIdStr: openIdStr
      }).then(res => {
        this.subNotifyWxUserList = res.data;
        if (this.subNotifyWxUserList) {
          let changeNewWriteNotifyWx = this.subNotifyWxUserList.map(item => item.openId).join(";");
          if (!openIdStr && changeNewWriteNotifyWx != this.notifySettingForm.newWriteNotifyWx) {
            this.notifySettingForm.newWriteNotifyWx = changeNewWriteNotifyWx;
            this.saveSettingHandle();
            this.dialogSubNotifyVisible = false;
          }
        }
      });
    },
    getSubNotifyWxQrCode() {
      getWxNotifyQrcodeRequest({ key: this.formKey }).then(res => {
        this.subNotifyWxQrCode = res.data;
      });
    },
    deleteSubNotifyUserHandle(i) {
      if (this.subNotifyWxUserList) {
        let openId = this.subNotifyWxUserList[i].openId;
        let key = this.formKey;
        deleteWxNotifyUserRequest(key, openId).then(res => {
          this.subNotifyWxUserList.splice(i);
          this.notifySettingForm.newWriteNotifyWx = this.subNotifyWxUserList.map(item => item.openId).join(";");
        });
      }
      this.saveSettingHandle();
    },
    saveSettingHandle() {
      this.$refs["notifySettingForm"].validate(valid => {
        if (valid) {
          this.notifySettingForm.formKey = this.formKey;
          saveSettingRequest(this.notifySettingForm).then(() => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.queryUserProjectSetting();
          });
        } else {
          return false;
        }
      });
    },
    //选择用户邮箱
    handleSelectUser(list) {
      if (list && list.length) {
        let emails = list
          .filter(user => {
            return user.email ? true : false;
          })
          .map(user => user.email)
          .join(";");
        this.notifySettingForm.newWriteNotifyEmail = this.notifySettingForm.newWriteNotifyEmail + emails;
        this.saveSettingHandle();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "settting";

.sub-label-text {
  text-align: left;
}

.sub-user-view {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 60px;
  cursor: pointer;

  &:hover .sub-user-delete {
    display: block;
  }

  .sub-user-delete {
    position: absolute;
    right: -6px;
    background-color: red;
    color: white;
    border-radius: 50px;
    padding: 2px;
    font-size: 12px;
    height: 16px;
    width: 16px;
    font-weight: 500;
    line-height: 18px;
    display: none;
  }
}
</style>
