<template>
  <div class="share-setting-view">
    <p class="project-setting-title">
      {{ $t("form.setting.teamworkSettingLabel") }}

      <span class="small-font-size ml20 text-secondary-color">
        {{ $t("form.setting.customizePermissions") }}
      </span>
    </p>
    <el-divider />
    <el-tabs
      v-model="tabActive"
      type="card"
      class="t-tabs"
    >
      <el-tab-pane
        :label="$t('form.setting.customizeUserTitle')"
        name="user"
      >
        <div class="mt10 ml10 mb10">
          <el-button
            size="default"
            type="primary"
            @click="handleOpenDialog"
          >
            {{ $t("form.setting.addCollaborator") }}
          </el-button>
        </div>
        <el-table
          :data="tableData"
          class="m10"
        >
          <el-table-column
            :label="$t('form.setting.collaborator')"
            prop="collaborator"
          />
          <el-table-column
            :label="$t('form.setting.type')"
            prop="typeDesc"
          />
          <el-table-column
            :label="$t('form.setting.collaboratorGroupName')"
            prop="authGroupId"
          >
            <template #default="scope">{{ authGroupList.find(item => item.id === scope.row.authGroupId)?.name }}</template>
          </el-table-column>
          <el-table-column
            :label="$t('form.setting.operation')"
            align="center"
            class-name="small-padding fixed-width operation-btn-group"
          >
            <template #default="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button
                    icon="ele-ArrowDown"
                    link
                    type="primary"
                  >
                    {{ $t("form.setting.authLabel") }}
                  </el-button>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="auth in authGroupList"
                      :key="auth.id"
                      @click="handleSwitchAuthGroup(scope.row, auth.id as number)"
                    >
                      {{ auth?.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button
                icon="ele-Delete"
                link
                type="primary"
                @click="handleDelete(scope.row)"
              >
                {{ $t("formI18n.all.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.authLabel')"
        name="auth"
      >
        <div class="mt10 ml10 mb10">
          <el-button
            size="default"
            type="primary"
            @click="createAuthGroupHandle"
          >
            {{ $t("form.setting.addCollaboratorAuth") }}
          </el-button>
        </div>
        <el-table
          :data="authGroupList"
          class="m10"
        >
          <el-table-column
            :label="$t('form.setting.collaboratorGroupName')"
            prop="name"
          />
          <el-table-column
            :label="$t('common.createTime')"
            prop="createTime"
          />
          <el-table-column
            :label="$t('form.setting.operation')"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-button
                icon="ele-Edit"
                link
                type="primary"
                @click="handleUpdateAuthGroup(scope.row)"
              >
                {{ $t("common.edit") }}
              </el-button>
              <el-button
                icon="ele-Delete"
                link
                type="primary"
                @click="handleDeleteAuthGroup(scope.row)"
              >
                {{ $t("formI18n.all.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <user-choose-table
      ref="userChooseTableRef"
      @submit="(val: any) => submitChooseHandle('user', val)"
    />

    <el-dialog
      v-model="authDialogVisible"
      append-to-body
      :title="$t('form.setting.addCollaborator')"
      width="40%"
    >
      <el-form
        :model="authObjectForm"
        label-position="top"
        label-width="80px"
        size="default"
      >
        <el-form-item :label="$t('form.setting.user')">
          <el-row>
            <el-col>
              <el-select
                style="width: 600px"
                v-model="authObjectForm.userIdList"
                multiple
                :placeholder="$t('form.setting.selectUser')"
                @click="openChooseHandle(userChooseTableRef, selectedObj.userList)"
                @remove-tag="
                  (event: any) => {
                    handleRemoveUserTag(event, 'userList', 'id');
                  }
                "
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
        <el-form-item :label="$t('form.setting.authLabel')">
          <el-select
            v-model="authObjectForm.authGroupId"
            :placeholder="$t('form.setting.selectAuthGroup')"
            style="width: 600px"
          >
            <el-option
              v-for="item in authGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="default"
            @click="authDialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            @click="handleSubmit"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <auth-group
      ref="authGroupRef"
      :form-key="formKey"
      @submit="handleSaveAuthGroup"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, Ref } from "vue";
import {
  addShareCollaboratorRequest,
  deleteCollaboratorRequest,
  getShareCollaboratorRequest,
  updateCollaboratorRequest
} from "@/api/project/setting";
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import { i18n } from "@/i18n";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { useRoute } from "vue-router";
import AuthGroup from "@/views/form/auth/group.vue";
import { createAuthGroup, delAuthGroup, listSimpleAuthGroup, updateAuthGroup } from "@/api/project/publish";

const tabActive = ref("user");
const tableData = ref([]);
const authDialogVisible = ref(false);

// 授权表单对象
const authObjectForm = reactive<any>({
  formKey: "",

  authGroupId: "",
  userIdList: [],
  roleIdList: [],
  deptIdList: []
});

// 选中对象 如用户角色 等
const selectedObj = reactive<any>({
  userList: [],
  roleList: [],
  deptList: []
});

const getCollaboratorList = () => {
  getShareCollaboratorRequest(formKey as string).then(res => {
    tableData.value = res.data;
  });
};

const authGroupRef = ref<any>(null);

const createAuthGroupHandle = () => {
  authGroupRef.value.clearFormAuthGroup();
  authGroupRef.value.dialogVisible = true;
};

const handleRemoveUserTag = (val: any, name: string, key: string) => {
  selectedObj[name] = selectedObj[name].filter((item: any) => item[key] !== val);
};

const handleOpenDialog = () => {
  authDialogVisible.value = true;
};

const userChooseTableRef = ref<InstanceType<typeof UserChooseTable> | null>();

// 打开选择窗口
const openChooseHandle = (chooseRef: Ref<any>, val: any) => {
  userChooseTableRef.value?.showDialog(val);
};

// 选中数据事件
const submitChooseHandle = (name: string, val: any) => {
  selectedObj[`${name}List`] = val;
  authObjectForm[`${name}IdList`] = val.map((item: any) => item.id);
};

const handleDelete = (row: any) => {
  MessageBoxUtil.confirm(i18n.global.t("form.setting.isCancelCollaborator"), async () => {
    await deleteCollaboratorRequest(row);
    getCollaboratorList();
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
  });
};

const route = useRoute();

const formKey = route.query.key;

const handleSubmit = () => {
  authObjectForm.formKey = formKey;
  addShareCollaboratorRequest(authObjectForm).then(() => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    getCollaboratorList();
    authDialogVisible.value = false;
  });
};

const authGroupList = ref<any[]>([]);

// 获取权限组
const getAuthGroupList = async () => {
  const res = await listSimpleAuthGroup(formKey as unknown as string, 2);
  authGroupList.value = res?.data || [];
};

const handleSwitchAuthGroup = (collabor: any, authGroupId: number) => {
  MessageBoxUtil.confirm(i18n.global.t("form.setting.switchAuthGroupConfirm"), async () => {
    collabor.authGroupId = authGroupId;
    await updateCollaboratorRequest(collabor);
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
  });
};

const handleUpdateAuthGroup = async (formAuthGroup: any) => {
  authGroupRef.value.formAuthGroup = formAuthGroup;
  authGroupRef.value.fieldCheckedHandle();
  authGroupRef.value.dialogVisible = true;
  authGroupRef.value.dialogTitle = i18n.global.t("form.public.modifyRoles");
};

const handleDeleteAuthGroup = (formAuthGroup: any) => {
  MessageBoxUtil.confirm(i18n.global.t("common.deleteConfirm"), async () => {
    await delAuthGroup(formAuthGroup.id);
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    await getAuthGroupList();
  });
};

const handleSaveAuthGroup = async (formAuthGroup: any) => {
  if (formAuthGroup.id) {
    await updateAuthGroup({
      id: formAuthGroup.id,
      type: 2,
      formKey: formKey as string,
      ...formAuthGroup
    });
  } else {
    await createAuthGroup({
      type: 2,
      formKey: formKey as string,
      ...formAuthGroup
    });
  }
  MessageUtil.success(i18n.global.t("formI18n.all.success"));
  await getAuthGroupList();
};

onMounted(() => {
  getCollaboratorList();
  getAuthGroupList();
});
</script>

<style lang="scss" scoped>
.share-setting-view {
  height: 100%;
  line-height: 20px;
  border-radius: 7px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  padding: 10px;
  margin-left: 20px;

  .project-setting-title {
    color: var(--el-text-color-primary);
    font-size: 16px;
    text-align: left;
    font-weight: 500;
    margin-left: 20px;
    line-height: 40px;
  }

  .t-tabs {
    :deep(.el-tabs__item) {
      padding: 0 20px !important;
    }
  }
}
</style>
