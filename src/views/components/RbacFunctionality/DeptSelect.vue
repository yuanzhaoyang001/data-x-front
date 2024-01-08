<template>
  <el-tree
    ref="deptTreeRef"
    node-key="id"
    :data="deptOptions"
    show-checkbox
    :expand-on-click-node="false"
    :filter-node-method="filterNode"
    :props="defaultProps"
    default-expand-all
    @check-change="handleCheckChange"
  />
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { treeselect } from "@/api/system/dept";
import { ElTree } from "element-plus";
import { DEPT_TYPE } from "@/api/system/rbacFunctionality";

interface Tree {
  [key: string]: any;
}

const deptOptions = ref([]);

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.indexOf(value) > -1;
};
const defaultProps = {
  children: "children",
  label: "label"
};

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});

onMounted(async () => {
  await getTreeselect();
});

const getTreeselect = async () => {
  const res = await treeselect();
  deptOptions.value = res.data;
  await nextTick();
  const deptIds = props.value.filter(item => item.rbacType === DEPT_TYPE).map(item => item.rbacId);
  deptTreeRef.value!.setCheckedKeys(deptIds);
};

const emit = defineEmits(["select"]);

const deptTreeRef = ref<InstanceType<typeof ElTree>>();

const handleCheckChange = data => {
  const checkedNodes = deptTreeRef.value!.getCheckedNodes(true, false);
  emit("select", checkedNodes);
};

const handleCancelSelect = (id: number) => {
  deptTreeRef.value!.setChecked(id, false, false);
};

const handleCancelAll = () => {
  deptTreeRef.value?.setCheckedKeys([]);
};

const handleNameQuery = name => {
  deptTreeRef.value?.filter(name);
};

defineExpose({ handleCancelSelect, handleCancelAll, handleNameQuery });
</script>

<style scoped lang="scss"></style>
