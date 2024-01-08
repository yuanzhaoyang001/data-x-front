<template>
  <div>
    <el-table
      v-loading="loading"
      ref="postTableRef"
      :data="postList"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <!--      <el-table-column align="center" label="岗位编号" prop="id" />-->
      <el-table-column
        align="center"
        :label="$t('system.position.code')"
        prop="postCode"
      />
      <el-table-column
        align="center"
        :label="$t('system.position.name')"
        prop="postName"
      />
      <!--      <el-table-column-->
      <!--        align="center"-->
      <!--        :label="$t('system.position.level')"-->
      <!--        prop="level"-->
      <!--      />-->
      <el-table-column
        align="center"
        :label="$t('system.position.managerPosition')"
        prop="leaderPost"
        width="180"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.leaderPost === 1"
            type="success"
          >
            {{ $t("system.position.yes") }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
          >
            {{ $t("system.position.no") }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('system.position.createTime')"
        prop="createTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <template v-show="total > 0">
      <pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.current"
        :total="total"
        @pagination="getList"
      />
    </template>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { listPost } from "@/api/system/post";
import { POST_TYPE } from "@/api/system/rbacFunctionality";

const emit = defineEmits(["select"]);

const loading = ref(true);
const dialogVisible = ref(false);
const total = ref(0);
const postList = ref([]);

const queryParams = reactive({
  current: 1,
  size: 5,
  postCode: undefined,
  postName: undefined,
  status: undefined
});

onMounted(() => {
  getList();
});

const postTableRef = ref(null);

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});

const getList = () => {
  loading.value = true;
  listPost(queryParams).then(response => {
    postList.value = response.data.records;
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
      .filter(item => item.rbacType === POST_TYPE)
      .forEach(item => {
        const row = postList.value.find(row => row.id == item.rbacId);
        if (row) {
          postTableRef.value.toggleRowSelection(row, true);
        }
      });
  });
};

const handleNameQuery = name => {
  queryParams.postName = name;
  queryParams.current = 1;
  getList();
};

const selectedPostList = ref([]);

// 取消选中某行
const handleCancelSelect = id => {
  postTableRef.value.toggleRowSelection(
    selectedPostList.value.find(item => item.id === id),
    false
  );
};

const handleSelectionChange = selection => {
  selectedPostList.value = selection;
  emit("select", selection);
};
const handleCancelAll = () => {
  postTableRef.value.clearSelection();
};
defineExpose({
  handleCancelSelect,
  handleCancelAll,
  handleNameQuery
});
</script>
<style scoped lang="scss"></style>
