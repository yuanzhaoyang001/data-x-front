<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="80%"
      append-to-body
    >
      <div v-if="dialogVisible">
        <div class="selected-users">
          <el-tag
            v-for="obj in rbacList"
            :key="`${obj.rbacType}${obj.rbacId}`"
            closable
            size="small"
            class="ml5 mb5"
            :type="getTagType(obj.rbacType)"
            @close="handleRbacClose(obj)"
          >
            {{ obj.rbacName }}
          </el-tag>
        </div>
        <el-row class="mt10">
          <el-col :span="10">
            <el-input
              :placeholder="$t('system.rbacFunctionality.namePlaceholder')"
              size="default"
              clearable
              v-model="filterName"
            >
              <template #append>
                <el-button
                  size="default"
                  @click="handleQueryName"
                  icon="ele-Search"
                />
              </template>
            </el-input>
          </el-col>
          <el-button
            class="ml10"
            size="default"
            icon="ele-Delete"
            plain
            type="primary"
            @click="handleCleanAll"
          >
            {{ $t("system.rbacFunctionality.cleanAll") }}
          </el-button>
        </el-row>
        <div class="todo-selected-wrap">
          <el-tabs
            v-model="activeName"
            class="demo-tabs"
          >
            <el-tab-pane
              :label="$t('system.rbacFunctionality.user')"
              name="USER"
            >
              <user-select
                @select="handleUserSelect"
                :value="rbacList"
                v-if="rbacList"
                ref="userSelectRef"
              />
            </el-tab-pane>
            <el-tab-pane
              :label="$t('system.rbacFunctionality.role')"
              name="ROLE"
            >
              <role-select
                :value="rbacList"
                v-if="rbacList"
                @select="handleRoleSelect"
                ref="roleSelectRef"
              />
            </el-tab-pane>
            <el-tab-pane
              :label="$t('system.rbacFunctionality.dept')"
              name="DEPT"
            >
              <dept-select
                v-if="rbacList"
                :value="rbacList"
                @select="handleDeptSelect"
                ref="deptSelectRef"
              />
            </el-tab-pane>
            <el-tab-pane
              :label="$t('system.rbacFunctionality.post')"
              name="POST"
            >
              <post-select
                v-if="rbacList"
                :value="rbacList"
                @select="handlePostSelect"
                ref="postSelectRef"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button
            type="primary"
            v-re-click
            @click="handleSubmit"
          >
            {{ $t("common.enter") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import UserSelect from "./UserSelect.vue";
import RoleSelect from "./RoleSelect.vue";
import DeptSelect from "./DeptSelect.vue";
import PostSelect from "./PostSelect.vue";

import { UserEntity } from "@/api/system/user";
import {
  DEPT_TYPE,
  listRbacFunctionality,
  POST_TYPE,
  RbacInfo,
  ROLE_TYPE,
  SaveParam,
  saveRbacFunctionality,
  USER_TYPE
} from "@/api/system/rbacFunctionality";
import { remove } from "lodash-es";
import { SysRoleEntity } from "@/api/system/role";
import type Node from "element-plus/es/components/tree/src/model/node";
import { SysPostEntity } from "@/api/system/post";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";

const dialogVisible = ref(false);

const filterName = ref("");

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ""
  },
  funcType: {
    type: String,
    required: false,
    default: ""
  },
  funcId: {
    type: [String, Number],
    required: false,
    default: ""
  }
});

onMounted(async () => {});

const getTagType = (type: string): any => {
  switch (type) {
    case USER_TYPE:
      return "";
    case ROLE_TYPE:
      return "success";
    case DEPT_TYPE:
      return "warning";
    case POST_TYPE:
      return "danger";
  }
  return "";
};

const activeName = ref("USER");

const handleOpen = async id => {
  const res = await listRbacFunctionality({ funcId: id || props.funcId, funcType: props.funcType });
  rbacList.value = res.data || [];
  dialogVisible.value = true;
};

const handleCleanAll = () => {
  rbacList.value = [];
  userSelectRef.value!.handleCancelAll();
  roleSelectRef.value!.handleCancelAll();
  deptSelectRef.value!.handleCancelAll();
  postSelectRef.value!.handleCancelAll();
};

const handleSubmit = () => {
  if (!rbacList.value) {
    MessageUtil.error(i18n.gobal.t("system.rbacFunctionality.notDataTip"));
    return;
  }
  saveRbacFunctionality(<SaveParam>{
    funcType: props.funcType,
    funcId: props.funcId,
    rbacList: rbacList.value
  }).then(() => {
    dialogVisible.value = false;
    MessageUtil.success(i18n.global.t("common.saveSuccess"));
  });
};

const rbacList = ref<RbacInfo[] | undefined>(undefined);

const handleUserSelect = (users: UserEntity[]) => {
  const userIds = users.map(item => item.id);
  const objList: RbacInfo[] = users.map(item => {
    return {
      rbacId: item.id,
      rbacName: item.nickName,
      rbacType: USER_TYPE
    };
  });
  handleRbacSelect(userIds, objList, USER_TYPE);
};

const handleRoleSelect = (roles: SysRoleEntity[]) => {
  const roleIds = roles.map(item => item.id);
  const objList: RbacInfo[] = roles.map(item => {
    return {
      rbacId: item.id,
      rbacName: item.roleName,
      rbacType: ROLE_TYPE
    };
  });
  handleRbacSelect(roleIds, objList, ROLE_TYPE);
};

const handleDeptSelect = (deptList: Node[]) => {
  const deptIds = deptList.map(item => item.id);
  const objList: RbacInfo[] = deptList.map(item => {
    return {
      rbacId: item.id,
      rbacName: item.label,
      rbacType: DEPT_TYPE
    };
  });
  handleRbacSelect(deptIds, objList, DEPT_TYPE);
};

const handlePostSelect = (postList: SysPostEntity[]) => {
  const postIds = postList.map(item => item.id);
  const objList: RbacInfo[] = postList.map(item => {
    return {
      rbacId: item.id,
      rbacName: item.postName,
      rbacType: POST_TYPE
    };
  });
  handleRbacSelect(postIds, objList, POST_TYPE);
};

const handleRbacSelect = (userIds: number[], objList: RbacInfo[], type: string) => {
  const rbacListIds = rbacList.value!.filter(item => item.rbacType === type).map(item => item.rbacId);
  const diff = rbacListIds.filter(item => !userIds.includes(item));
  // 删除掉
  remove(rbacList.value, item => diff.includes(item.rbacId));
  // 添加
  objList.forEach(item => {
    const rbacInfo = rbacList.value!.find(item2 => item2.rbacType == item.rbacType && item2.rbacId === item.rbacId);
    if (!rbacInfo) {
      rbacList.value!.push({
        rbacId: item.rbacId,
        rbacName: item.rbacName || "",
        rbacType: type
      });
    }
  });
};

const userSelectRef = ref<InstanceType<typeof UserSelect>>();
const roleSelectRef = ref<InstanceType<typeof RoleSelect>>();
const deptSelectRef = ref<InstanceType<typeof DeptSelect>>();
const postSelectRef = ref<InstanceType<typeof PostSelect>>();

const handleRbacClose = (obj: RbacInfo) => {
  // 调用移除
  remove(rbacList.value, item => item.rbacId === obj.rbacId);
  // 从对应组件移除
  if (obj.rbacType === USER_TYPE) {
    userSelectRef.value?.handleCancelSelect(obj.rbacId);
  } else if (obj.rbacType === ROLE_TYPE) {
    roleSelectRef.value?.handleCancelSelect(obj.rbacId);
  } else if (obj.rbacType === DEPT_TYPE) {
    deptSelectRef.value?.handleCancelSelect(obj.rbacId);
  } else if (obj.rbacType === POST_TYPE) {
    postSelectRef.value?.handleCancelSelect(obj.rbacId);
  }
};

const handleQueryName = () => {
  if (activeName.value === USER_TYPE) {
    userSelectRef.value?.handleNameQuery(filterName.value);
  } else if (activeName.value === ROLE_TYPE) {
    roleSelectRef.value?.handleNameQuery(filterName.value);
  } else if (activeName.value === DEPT_TYPE) {
    deptSelectRef.value?.handleNameQuery(filterName.value);
  } else if (activeName.value === POST_TYPE) {
    postSelectRef.value?.handleNameQuery(filterName.value);
  }
};

defineExpose({
  handleOpen
});
</script>
<style scoped lang="scss">
.selected-users {
  min-height: 150px;
  padding: 5px;
  border: var(--el-border-width) dashed var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: auto;
}

.todo-selected-wrap {
  min-height: 200px;
  margin-top: 10px;
  padding: 5px;
  border: var(--el-border-width) solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: auto;
}
</style>
