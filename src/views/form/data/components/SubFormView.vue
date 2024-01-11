<template>
  <div>
    <el-table
      class="form-table"
      :row-key="record => record.key"
      :data="model"
    >
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="50"
      />
      <template
        v-for="(option, index) in fields"
        :key="index"
      >
        <el-table-column
          :label="getTableColumnLabel(option)"
          align="center"
        >
          <template #default="scope">
            {{ showText(scope.row, option.vModel, option) }}
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="300"
      >
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleViewData(scope.$index, scope.row)"
          >
            <el-icon>
              <ele-View />
            </el-icon>
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="详情"
      v-model="dialogVisible"
      width="40%"
      append-to-body
    >
      <ViewData
        :fields="viewFields"
        :page-form-model="pageFormModel"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SubFormView">
import { computed, defineAsyncComponent, ref } from "vue";
import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";
import { removeHtmlTag } from "@/views/formgen/utils";
import { commonFormat } from "@/views/form/data/table/formatTableColumn";

import ViewData from "../ViewData.vue";

// const ViewData = defineAsyncComponent(() => import("../ViewData.vue"));

const props = defineProps({
  model: {
    type: Array,
    default: () => []
  },
  fields: {
    type: Array,
    default: () => []
  }
});

const dialogVisible = ref(false);
const pageFormModel = ref({});

const viewFields = computed(() => {
  return props.fields.map(item => {
    const isLabel = isLabelTag(item.vModel);
    return {
      label: removeHtmlTag(item.config.label),
      value: isLabel ? `${item.vModel}label` : item.vModel,
      type: item.typeId,
      scheme: item
    };
  });
});

const getTableColumnLabel = option => {
  return removeHtmlTag(option.config.label);
};

const showText = (row, key, item) => {
  let value = row[key];
  if (isLabelTag(key)) {
    value = row[`${key}label`];
  }
  return commonFormat(item.typeId, key, value, { scheme: item });
};

const handleViewData = (index, row) => {
  dialogVisible.value = true;
  pageFormModel.value = row;
};
</script>

<style lang="scss" scoped>
.matrix-table {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #303133;
  border-width: 1px;
  border-color: #dcdfe6;
  border-collapse: collapse;
  width: 90%;
  overflow: auto;
}

.matrix-table {
  display: block;
  overflow-y: scroll;
}

.matrix-table th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #dcdfe6;
  background-color: #dedede;
}

.matrix-table td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #dcdfe6;
  background-color: #ffffff;
  word-break: break-all;
  text-align: center;
}
</style>
