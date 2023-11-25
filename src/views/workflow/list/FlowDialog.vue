<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    append-to-body
  >
    <el-steps
      :space="200"
      :active="stepActive"
      simple
      class="mb10"
      :process-status="processStatus"
      finish-status="success"
    >
      <el-step :title="$t('workflow.flowList.basicInformation')"></el-step>
      <el-step :title="$t('workflow.flowList.chooseIcon')"></el-step>
      <el-step
        :title="stepActive === 2 ? $t('workflow.flowList.visibleRange') : $t('workflow.flowList.initiatorPermissions')"
      ></el-step>
    </el-steps>
    <div v-show="stepActive === 0">
      <FlowBasicInfo ref="flowBasicInfoRef" />
    </div>
    <div v-show="stepActive === 1">
      <FlowIcon ref="flowIconInfoRef" />
    </div>
    <div v-show="stepActive === 2">
      <div class="initiator-wrap">
        <div class="from-box">
          <div class="user-container">
            <span>{{ $t("workflow.flowList.userPermission") }}</span>
            <el-select
              v-model="userIdList"
              multiple
              @click="handleAssignUser"
            >
              <el-option
                v-for="(item, index) in userList"
                :key="item"
                :label="item.nickName"
                :value="item.id"
                @close="handleUserClose(index)"
              ></el-option>
            </el-select>
          </div>

          <div class="user-container">
            <span>{{ $t("workflow.flowList.role") }}</span>
            <el-select
              v-model="roleIdList"
              multiple
              @click="handleAssignRole"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="item"
                :label="item.roleName"
                :value="item.id"
                @close="handleRoleClose(index)"
              ></el-option>
            </el-select>
          </div>
          <div class="user-container">
            <span>{{ $t("workflow.flowList.department") }}</span>
            <el-select
              v-model="deptIdList"
              multiple
              @click="handleAssignDept"
            >
              <el-option
                v-for="(item, index) in deptList"
                :key="item"
                :label="item.label"
                :value="item.id"
                @close="handleDeptClose(index)"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="bottom-text">{{ $t("workflow.flowList.specifiedPersonnelNote") }}</div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          v-if="stepActive === 0"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
        <el-button
          @click="previousDialog"
          v-if="stepActive === 1 || stepActive === 2"
        >
          <el-icon class="el-icon--right">
            <ele-Back />
          </el-icon>
          {{ $t("workflow.flowList.previousStep") }}
        </el-button>
        <el-button
          type="primary"
          @click="nextDialog"
          v-if="stepActive === 0 || stepActive === 1"
        >
          {{ $t("workflow.flowList.nextStep") }}
          <el-icon class="el-icon--right">
            <ele-Right />
          </el-icon>
        </el-button>
        <el-button
          type="primary"
          @click="saveDialog"
          v-if="stepActive === 2"
        >
          {{ $t("workflow.flowList.save") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <user-choose-table
    ref="userChooseTableRef"
    :no-record="true"
    @submit="handleSubmitAssign"
  />
  <role-choose-table
    ref="roleChooseTableRef"
    @submit="handleSubmitAssignRole"
  />
  <dept-choose-tree
    ref="deptChooseTreeRef"
    @submit="handleSubmitAssignDept"
  />
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import FlowBasicInfo from "./FlowBasicInfo.vue";
import FlowIcon from "./FlowIcon.vue";
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import RoleChooseTable from "@/views/system/role/chooseTable.vue";
import DeptChooseTree from "@/views/system/dept/chooseTree.vue";
import { MessageUtil } from "@/utils/messageUtil";
import { isEqual, uniqWith } from "lodash-es";
import {
  DeptEntityType,
  DeptType,
  FlowExtensionInfo,
  getExtensionInfoId,
  postExtensionInfoUpdate,
  postFormExtensionInfoAdd,
  RoleType,
  UserType
} from "@/api/workflow/flowExtension";
import { ElMessageBox } from "element-plus";
import { i18n } from "@/i18n";

const dialogVisible = ref<boolean>(false);
const stepActive = ref<number>(1);
const flowBasicInfoRef = ref<InstanceType<typeof FlowBasicInfo> | any>();
const flowIconInfoRef = ref<InstanceType<typeof FlowIcon> | any>();
const userChooseTableRef = ref<InstanceType<typeof UserChooseTable> | null>(null);
const deptChooseTreeRef = ref<InstanceType<typeof RoleChooseTable> | null>(null);
const roleChooseTableRef = ref<InstanceType<typeof DeptChooseTree> | null>(null);
const userList = ref<UserType[]>([]);
const userIdList = ref<number[]>([]);
const roleList = ref<RoleType[]>([]);
const roleIdList = ref<number[]>([]);
const deptList = ref<DeptType[]>([]);
const deptIdList = ref<DeptType[]>([]);
const flowInfo = ref<FlowExtensionInfo>();
const id = ref<number>(0);

const title = ref<string>("");
const processStatus = ref<string>("finish");

const openDialog = async (flowId: number) => {
  id.value = flowId;
  dialogVisible.value = true;
  stepActive.value = 0;
  if (id.value) {
    title.value = i18n.global.t("workflow.flowList.modifyFlow");
    await nextTick(async () => {
      const res = await getExtensionInfoId(id.value);
      flowBasicInfoRef.value.flowInfoData.name = res.data.name;
      flowBasicInfoRef.value.flowInfoData.categoriesId = res.data.categoriesId;
      flowIconInfoRef.value.flowIconData.color = res.data.color;
      flowIconInfoRef.value.flowIconData.icon = res.data.icon;
      deptList.value =
        res.data.deptList?.map((item: DeptEntityType) => {
          return { id: item.id, label: item.deptName };
        }) || [];
      deptIdList.value = deptList.value.map(item => item.id);
      roleList.value = res.data.roleList || [];
      roleIdList.value = roleList.value.map(item => item.id);
      userList.value = res.data.userList || [];
      userIdList.value = userList.value.map(item => item.id);
    });
  } else {
    title.value = i18n.global.t("workflow.flowList.addFlow");
    await nextTick(async () => {
      flowIconInfoRef.value.flowIconData.color = "#4C4EDB";
      flowIconInfoRef.value.flowIconData.icon = "";
      flowBasicInfoRef.value.flowInfoData.name = "";
      flowBasicInfoRef.value.flowInfoData.categoriesId = "";
      deptIdList.value = [];
      roleIdList.value = [];
      userIdList.value = [];
    });
  }
};

const nextDialog = async () => {
  if (stepActive.value === 0) {
    const res = await flowBasicInfoRef.value.getFlowInfoData();
    flowInfo.value = res;
    if (flowInfo.value) {
      stepActive.value = stepActive.value + 1;
    }
  } else if (stepActive.value === 1) {
    const res = await flowIconInfoRef.value.getFlowIcon();
    flowInfo.value.color = res.color;
    flowInfo.value.icon = res.icon;
    if (flowInfo.value) {
      stepActive.value = stepActive.value + 1;
    }
  }
};
const previousDialog = () => {
  stepActive.value = stepActive.value - 1;
};
const saveDialog = async () => {
  if (userList.value || deptList.value || roleList.value) {
    const setInfo = flowInfo.value;

    const formData: FlowExtensionInfo = {
      name: setInfo?.name,
      color: setInfo?.color,
      icon: setInfo?.icon,
      categoriesId: setInfo?.categoriesId,
      userIdList: userIdList.value,
      roleIdList: roleIdList.value,
      deptIdList: deptIdList.value
    };
    let res: any = null;
    try {
      if (id.value) {
        formData.id = id.value;
        res = await postExtensionInfoUpdate(formData);
      } else {
        res = await postFormExtensionInfoAdd(formData);
      }
    } catch (e) {}
    ElMessageBox.confirm(i18n.global.t("workflow.flowList.confirmText"), i18n.global.t("formI18n.all.waring"), {
      confirmButtonText: i18n.global.t("formI18n.all.confirm"),
      cancelButtonText: i18n.global.t("formI18n.all.cancel"),
      type: "warning"
    })
      .then(() => {
        emits("design", res.data.formKey);
      })
      .catch(() => {
        emits("refresh");
      });
    dialogVisible.value = false;
  } else {
    MessageUtil.warning(i18n.global.t("workflow.flowList.chooseFlowUser"));
  }
};

const emits = defineEmits(["design", "refresh"]);

const handleAssignUser = () => {
  userChooseTableRef.value.showDialog([]);
};
const handleAssignDept = () => {
  deptChooseTreeRef.value.showDialog([]);
};
const handleAssignRole = () => {
  roleChooseTableRef.value.showDialog([]);
};

const handleSubmitAssign = (val: []) => {
  userList.value = uniqWith([...userList.value, ...val], isEqual);
  userIdList.value = userList.value.map(item => item.id);
};
const handleSubmitAssignRole = (val: []) => {
  roleList.value = uniqWith([...roleList.value, ...val], isEqual);
  roleIdList.value = roleList.value.map(item => item.id);
};
const handleSubmitAssignDept = (val: []) => {
  let tempDeptList: any[] = [];
  // 递归获取 如果val里面得item里面有children 就递归获取
  const getDeptList = (val: []) => {
    val.forEach((item: any) => {
      if (item.children) {
        tempDeptList.push({ id: item.id, label: item.label });
        getDeptList(item.children);
      } else {
        tempDeptList.push(item);
      }
    });
  };
  getDeptList(val);
  deptList.value = uniqWith([...deptList.value, ...tempDeptList], isEqual);
  deptIdList.value = deptList.value.map(item => item.id);
};
const handleUserClose = (index: number) => {
  userIdList.value.splice(index, 1);
};
const handleDeptClose = (index: number) => {
  deptList.value?.splice(index, 1);
};
const handleRoleClose = (index: number) => {
  roleList.value?.splice(index, 1);
};
defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.form-content {
  display: flex;
}

.initiator-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}

.add-personnel-search {
  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }
}

.add-personnel-body {
  flex: 1;
  padding: 0 10px;
}

.user-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  span {
    margin-bottom: 20px;
  }
}
:deep(.el-step__icon.is-text) {
  border-radius: 0%;
  border: none;
}
.bottom-text {
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  color: #3d3d3d;
}
.from-box {
  width: 60%;
}
</style>
