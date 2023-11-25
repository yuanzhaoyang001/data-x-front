<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="dark"
        :content="props.showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
      >
        <el-button
          circle
          icon="ele-Search"
          @click="toggleSearch"
        />
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="刷新"
        placement="top"
      >
        <el-button
          circle
          icon="ele-Refresh"
          @click="refresh"
        />
      </el-tooltip>
      <el-tooltip
        v-if="props.columns"
        class="item"
        effect="dark"
        content="显隐列"
        placement="top"
      >
        <el-button
          circle
          icon="ele-Menu"
          @click="showColumn"
        />
      </el-tooltip>
    </el-row>
    <el-dialog
      :title="title"
      v-model:visible="open"
      append-to-body
    >
      <el-transfer
        v-model:value="value"
        :titles="['显示', '隐藏']"
        :data="props.columns"
        @change="dataChange"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const value = ref([]);
const title = "显示/隐藏";
const open = ref(false);

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  columns: {
    type: Array
  }
});

const emit = defineEmits(["update:showSearch", "queryTable"]);

// 显隐列初始默认隐藏列
onMounted(() => {
  for (let item in props.columns) {
    if (props.columns[item].visible === false) {
      value.value.push(parseInt(item));
    }
  }
});

// 搜索
const toggleSearch = () => {
  emit("update:showSearch", !props.showSearch);
};

// 刷新
const refresh = () => {
  emit("queryTable");
};

// 右侧列表元素变化
const dataChange = data => {
  for (let item in props.columns) {
    const key = props.columns[item].key;
    props.columns[item].visible = !data.includes(key);
  }
};

// 打开显隐列dialog
const showColumn = () => {
  open.value = true;
};
</script>

<style lang="scss" scoped>
/* 表格右侧工具栏样式 */
.top-right-btn {
  margin-left: auto;
}

:deep(.el-transfer__button) {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}

:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}
</style>
