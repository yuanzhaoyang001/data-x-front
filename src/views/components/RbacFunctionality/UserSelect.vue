<template>
  <div>
    <el-table
      ref="userTableRef"
      v-loading="loading"
      :data="userList"
      row-key="id"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="50"
        :reserve-selection="true"
      />
      <el-table-column
        key="userId"
        align="center"
        :label="$t('form.setting.userTableUserId')"
        prop="id"
        width="100"
      />
      <el-table-column
        key="userName"
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('form.setting.userTableUserName')"
        prop="userName"
      >
        <template #default="{ row }">
          <div class="user-avatar-wrap">
            <t-avatar
              :size="18"
              :url="row?.avatar"
              :name="row.userName"
            ></t-avatar>
            <span class="name">
              {{ row.userName }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        key="nickName"
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('form.setting.userTableNickName')"
        prop="nickName"
      />
      <el-table-column
        key="deptName"
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('form.setting.userTableDeptName')"
        prop="dept.deptName"
      />
      <el-table-column
        key="phonenumber"
        align="center"
        :label="$t('form.setting.userTablePhoneNumber')"
        prop="phonenumber"
        width="130"
      />
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { pageUser } from "@/api/system/user";
import TAvatar from "@/components/TAvatar/index.vue";
import { USER_TYPE } from "@/api/system/rbacFunctionality";

const emit = defineEmits(["select"]);

const loading = ref(true);
const dialogVisible = ref(false);
const total = ref(0);
const userList = ref([]);

const queryParams = reactive({
  current: 1,
  size: 5,
  userName: undefined,
  nickName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: undefined
});

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});

onMounted(() => {
  getList();
});

const userTableRef = ref(null);

const getList = () => {
  loading.value = true;
  pageUser(queryParams).then(response => {
    userList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
    handleRowSelect();
  });
};

// 把编辑时之前的数据选中 因为这个表格需要传入完整的行数据
const handleRowSelect = () => {
  // 这里需要使用 nextTick，因为表格的渲染是异步的
  nextTick(() => {
    // 遍历之前选中的数据，找到对应的行，并选中
    props.value
      .filter(item => item.rbacType === USER_TYPE)
      .forEach(item => {
        const row = userList.value.find(row => row.id == item.rbacId);
        if (row) {
          userTableRef.value.toggleRowSelection(row, true);
        }
      });
  });
};

const handleNameQuery = name => {
  queryParams.nickName = name;
  queryParams.current = 1;
  getList();
};

const selectedUserList = ref([]);

// 取消选中某行
const handleCancelSelect = id => {
  userTableRef.value.toggleRowSelection(
    selectedUserList.value.find(item => item.id === id),
    false
  );
};

const handleSelectionChange = selection => {
  selectedUserList.value = selection;
  emit("select", selection);
};

const handleCancelAll = () => {
  userTableRef.value.clearSelection();
};

defineExpose({
  handleCancelSelect,
  handleCancelAll,
  handleNameQuery
});
</script>
<style scoped lang="scss">
.user-avatar-wrap {
  display: flex;

  .name {
    margin-left: 10px;
  }
}
</style>
