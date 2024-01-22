<template>
  <div>
    <el-table
      ref="roleTableRef"
      v-loading="loading"
      :data="roleList"
      row-key="id"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        :reserve-selection="true"
      />
      <el-table-column
        :label="$t('form.setting.roleID')"
        prop="id"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('form.setting.roleName')"
        prop="roleName"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('form.setting.permissionKey')"
        prop="roleKey"
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
import { pageRole } from "@/api/system/role";
import { ROLE_TYPE } from "@/api/system/rbacFunctionality";

const emit = defineEmits(["select"]);

const loading = ref(true);
const dialogVisible = ref(false);
const total = ref(0);
const roleList = ref([]);

const queryParams = reactive({
  current: 1,
  size: 5,
  roleName: undefined,
  roleKey: undefined,
  status: undefined
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

const roleTableRef = ref(null);

const getList = () => {
  loading.value = true;
  pageRole(queryParams).then(response => {
    roleList.value = response.data.records;
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
      .filter(item => item.rbacType === ROLE_TYPE)
      .forEach(item => {
        const row = roleList.value.find(row => row.id == item.rbacId);
        if (row) {
          roleTableRef.value.toggleRowSelection(row, true);
        }
      });
  });
};

const handleNameQuery = name => {
  queryParams.roleName = name;
  queryParams.current = 1;
  getList();
};

const selectedRoleList = ref([]);

// 取消选中某行
const handleCancelSelect = id => {
  roleTableRef.value.toggleRowSelection(
    selectedRoleList.value.find(item => item.id === id),
    false
  );
};

const handleSelectionChange = selection => {
  selectedRoleList.value = selection;
  emit("select", selection);
};

const handleCancelAll = () => {
  roleTableRef.value.clearSelection();
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
