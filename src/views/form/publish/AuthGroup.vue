<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.public.dataViewManagement") }}</span>
        <span class="desc-text ml10">{{ $t("form.public.createDataView") }}</span>
      </div>
    </template>
    <url-operate
      :link-url="createDataLink"
      class="ml20 mt20"
      qr-code-mode="download"
    />
    <el-divider />
    <div class="publish-content">
      <el-button
        type="success"
        @click="crateAuthGroupHandle"
        icon="ele-Plus"
        plain
      >
        {{ $t("form.public.createDataViewBtn") }}
      </el-button>
      <el-divider />
      <div
        v-if="authGroupList.length !== 0"
        class="auth-group-list"
      >
        <div
          v-for="group in authGroupList"
          :key="`group${group.id}`"
          class="auth-group-item"
        >
          <el-row
            align="middle"
            justify="center"
            type="flex"
          >
            <el-col>
              <span class="item-id-text">ID: {{ group.id }}</span>
            </el-col>
            <el-col :span="18">
              {{ group.name }}
            </el-col>
            <el-col :span="6">
              <el-button
                link
                type="primary"
                @click="updateAuthGroupHandle(group.id)"
              >
                {{ $t("formI18n.all.edit") }}
              </el-button>
              <el-button
                link
                type="primary"
                @click="copyAuthGroupHandle(group.id)"
              >
                {{ $t("formI18n.all.copy") }}
              </el-button>
              <el-button
                class="text-danger"
                link
                type="primary"
                @click="deleteAuthGroupHandle(group.id)"
              >
                {{ $t("formI18n.all.delete") }}
              </el-button>
            </el-col>
          </el-row>
          <p class="desc-text mt10">
            {{ group.description }}
          </p>
          <div
            v-if="group.authObjs"
            class="mt10"
          >
            <span
              v-for="user in group.authObjs.userList"
              :key="`user${user.id}`"
              class="auth-obj-tag"
            >
              <el-tag>{{ user.userName }}</el-tag>
            </span>
            <span
              v-for="role in group.authObjs.roleList"
              :key="`role${role.id}`"
              class="auth-obj-tag"
            >
              <el-tag type="success">{{ role.roleName }}</el-tag>
            </span>
            <span
              v-for="dept in group.authObjs.deptList"
              :key="`role${dept.id}`"
              class="auth-obj-tag"
            >
              <el-tag type="info">{{ dept.label }}</el-tag>
            </span>
          </div>
          <el-button
            link
            type="primary"
            @click="authGroupToUserHandle(group)"
            class="mt10"
            icon="ele-Pointer"
          >
            {{ $t("form.public.assignPersonnel") }}
          </el-button>
        </div>
      </div>
    </div>
    <auth-group
      ref="authGroup"
      :form-key="formKey"
      :is-auth-group="true"
      @submit="val => submitAuthGroupHandle(val)"
    />
    <user-choose-table
      ref="userChooseTable"
      @submit="val => submitChooseHandle('user', val)"
    />
    <role-choose-table
      ref="roleChooseTable"
      @submit="val => submitChooseHandle('role', val)"
    />
    <dept-choose-tree
      ref="deptChooseTree"
      @submit="val => submitChooseHandle('dept', val)"
    />
    <el-dialog
      v-model="authDialogVisible"
      append-to-body
      :title="$t('form.public.assignPersonnel')"
      width="30%"
    >
      <el-form
        :model="authObjectForm"
        label-position="top"
        label-width="80px"
      >
        <el-form-item :label="$t('form.public.userPermission')">
          <el-row :gutter="20">
            <el-col :span="23">
              <el-select
                v-model="authObjectForm.userIdList"
                class="width-full"
                multiple
                :placeholder="$t('form.public.dataViewManagementsSelectUser')"
                @remove-tag="
                  event => {
                    handleRemoveUserTag(event, 'userList', 'id');
                  }
                "
                @click="openChooseHandle('userChooseTable', selectedObj.userList)"
              >
                <el-option
                  v-for="item in selectedObj.userList"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('form.public.dataViewManagementsRole')">
          <el-row :gutter="20">
            <el-col :span="23">
              <el-select
                v-model="authObjectForm.roleIdList"
                class="width-full"
                multiple
                :placeholder="$t('form.public.dataViewManagementsSelectRole')"
                @remove-tag="
                  event => {
                    handleRemoveUserTag(event, 'roleList', 'id');
                  }
                "
                @click="openChooseHandle('roleChooseTable', selectedObj.roleList)"
              >
                <el-option
                  v-for="item in selectedObj.roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('form.public.dataViewManagementsDepartment')">
          <el-row :gutter="20">
            <el-col :span="23">
              <el-select
                v-model="authObjectForm.deptIdList"
                class="width-full"
                multiple
                :placeholder="$t('form.public.dataViewManagementsDepartment')"
                @remove-tag="
                  event => {
                    handleRemoveUserTag(event, 'deptList', 'id');
                  }
                "
                @click="openChooseHandle('deptChooseTree', selectedObj.deptList)"
              >
                <el-option
                  v-for="item in selectedObj.deptList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="authDialogVisible = false">
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click="submitAuthHandle"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import AuthGroup from "../auth/group.vue";
import { createAuthGroup, delAuthGroup, getAuthGroup, listAuthGroup, saveAuthObjs, updateAuthGroup } from "@/api/project/publish";
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import RoleChooseTable from "@/views/system/role/chooseTable.vue";
import DeptChooseTree from "@/views/system/dept/chooseTree.vue";
import UrlOperate from "./UrlOperate.vue";
import { i18n } from "@/i18n";
import { MessageUtil } from "@/utils/messageUtil";

export default {
  name: "AuthGroupMange",
  components: {
    UrlOperate,
    DeptChooseTree,
    RoleChooseTable,
    UserChooseTable,
    AuthGroup
  },
  data() {
    return {
      createDataLink: "",
      formKey: "",
      authDialogVisible: false,
      authGroupList: [],
      // 选中对象 如用户角色 等
      selectedObj: {
        userList: [],
        roleList: [],
        deptList: []
      },
      // 授权表单对象
      authObjectForm: {
        formKey: "",
        authGroupId: null,
        enableRoleDataAuth: false,
        userIdList: [],
        roleIdList: [],
        deptIdList: []
      }
    };
  },
  created() {
    this.formKey = this.$route.query.key;
    let url = window.location.protocol + "//" + window.location.host;
    this.createDataLink = `${url}/d/${this.formKey}`;
    this.queryAuthGroupListHandle();
  },
  methods: {
    queryAuthGroupListHandle() {
      // 查询
      listAuthGroup(this.formKey).then(res => {
        this.authGroupList = res.data;
      });
    },
    updateAuthGroupHandle(id) {
      getAuthGroup(id).then(res => {
        this.$refs.authGroup.formAuthGroup = res.data;
        this.$refs.authGroup.fieldCheckedHandle();
        this.$refs.authGroup.dialogVisible = true;
        this.$refs.authGroup.dialogTitle = i18n.global.t("form.public.modifyRoles");
      });
    },
    copyAuthGroupHandle(id) {
      getAuthGroup(id).then(res => {
        this.$refs.authGroup.formAuthGroup = res.data;
        this.$refs.authGroup.formAuthGroup.id = null;
        this.$refs.authGroup.fieldCheckedHandle();
        this.$refs.authGroup.dialogVisible = true;
      });
    },
    // 提交授权组的授权对象
    submitAuthHandle() {
      saveAuthObjs(this.authObjectForm).then(() => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.queryAuthGroupListHandle();
        this.authDialogVisible = false;
      });
    },
    deleteAuthGroupHandle(id) {
      this.$confirm(i18n.global.t("form.public.deleteAuthGroupHandleText"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          delAuthGroup(id).then(res => {
            this.queryAuthGroupListHandle();
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
          });
        })
        .catch(() => {});
    },
    // 分配权限组到用户
    authGroupToUserHandle(group) {
      // 修改时显示以保存的值
      if (group.authObjs) {
        this.selectedObj.userList = group.authObjs.userList;
        this.selectedObj.roleList = group.authObjs.roleList;
        this.selectedObj.deptList = group.authObjs.deptList;
        // 把字符串数组转成int数组 不然select会无法选中
        let { userIdList, roleIdList, deptIdList, id } = group.authObjs.source;
        this.authObjectForm.userIdList = userIdList && userIdList.map(Number);
        this.authObjectForm.roleIdList = roleIdList && roleIdList.map(Number);
        this.authObjectForm.deptIdList = deptIdList && deptIdList.map(Number);
        this.authObjectForm.id = id;
      } else {
        this.selectedObj = {};
        this.authObjectForm = {};
      }
      this.authObjectForm.authGroupId = group.id;
      this.authObjectForm.formKey = this.formKey;
      this.authDialogVisible = true;
    },
    crateAuthGroupHandle() {
      this.$refs.authGroup.clearFormAuthGroup();
      this.$refs.authGroup.dialogVisible = true;
      this.$refs.authGroup.dialogTitle = i18n.global.t("form.public.addRoles");
    },
    handleRemoveUserTag(val, name, key) {
      this.selectedObj[name] = this.selectedObj[name].filter(item => item[key] !== val);
    },
    // 打开选择窗口
    openChooseHandle(name, val) {
      this.$refs[name].showDialog(val);
    },
    // 选中数据事件
    submitChooseHandle(name, val) {
      this.selectedObj[`${name}List`] = val;
      this.authObjectForm[`${name}IdList`] = val.map(item => item.id);
    },
    submitAuthGroupHandle(formAuthGroup) {
      if (formAuthGroup.enableRoleDataAuth === undefined) {
        formAuthGroup.enableRoleDataAuth = false;
      }
      if (formAuthGroup.id) {
        updateAuthGroup(formAuthGroup).then(() => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          this.queryAuthGroupListHandle();
        });
      } else {
        createAuthGroup(formAuthGroup).then(() => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          this.queryAuthGroupListHandle();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-group-item {
  margin: 5px;
  padding: 20px 15px 10px;
  background-color: var(--el-color-primary-light-10);
  border-radius: 8px;
}
.publish-content {
  padding: 20px;
}
.item-id-text {
  font-size: 10px;
  color: #9b9b9b;
}

.auth-obj-tag {
  margin: 2px;
}
</style>
