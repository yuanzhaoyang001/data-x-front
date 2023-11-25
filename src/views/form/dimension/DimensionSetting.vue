<template>
  <div class="setting-wrap">
    <div class="header">
      <div class="title">{{ $t("form.dimension.dimensionSetting") }}</div>
      <el-button
        icon="ele-Plus"
        plain
        size="default"
        type="primary"
        @click="handleAdd"
      >
        {{ $t("form.dimension.addDimension") }}
      </el-button>
    </div>
    <el-table
      :data="dimensionConf.dimensionList"
      border
      size="default"
      style="width: 100%"
    >
      <el-table-column
        :label="$t('form.dimension.dimensionSettingIndex')"
        min-width="60"
        type="index"
      ></el-table-column>
      <el-table-column
        :label="$t('form.dimension.dimensionName')"
        prop="name"
      />
      <el-table-column :label="$t('form.dimension.operationIndex1')">
        <template #default="scope">
          <el-button
            icon="ele-Edit"
            size="default"
            text
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            {{ $t("common.edit") }}
          </el-button>
          <el-button
            icon="ele-Delete"
            size="default"
            text
            type="danger"
            @click="handleDelete(scope.$index)"
          >
            {{ $t("common.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogFormVisible"
      :title="$t('form.dimension.dimension')"
      width="30%"
    >
      <el-input
        v-model="form.name"
        autocomplete="off"
        maxlength="50"
        minlength="1"
        show-word-limit
        type="textarea"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleSave"
          >
            {{ $t("common.enter") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { generateId } from "@/utils";
import { i18n } from "@/i18n";
import { DimensionConfig, DimensionInfo } from "./types";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";

const handleEdit = (index: number, row: DimensionInfo) => {
  currentIndex.value = index;
  dialogFormVisible.value = true;
  form.value = { ...row };
};
const handleDelete = (index: number) => {
  MessageBoxUtil.confirm(i18n.global.t("common.deleteConfirm"), () => {
    props.dimensionConf.dimensionList.splice(index, 1);
  });
};

const props = defineProps<{
  dimensionConf: DimensionConfig;
}>();

const currentIndex = ref<number>(0);

const form = ref<DimensionInfo>({
  id: "",
  name: "",
  fieldList: [],
  resultAdvices: []
});

const handleAdd = () => {
  form.value = {
    id: "",
    name: "",
    fieldList: [],
    resultAdvices: []
  };
  dialogFormVisible.value = true;
};
const dialogFormVisible = ref(false);

const handleSave = () => {
  if (form.value.id) {
    // 修改
    props.dimensionConf.dimensionList[currentIndex.value].name = form.value.name;
  } else {
    // 检查名字是否存在
    const isExist = props.dimensionConf.dimensionList.some(item => item.name === form.value.name);
    if (isExist) {
      MessageUtil.error(i18n.global.t("form.dimension.dimensionNameExist"));
      return;
    }
    // 新增
    props.dimensionConf.dimensionList.push({
      id: generateId(),
      name: form.value.name,
      fieldList: [],
      resultAdvices: []
    });
  }
  dialogFormVisible.value = false;
  MessageUtil.success(i18n.global.t("common.saveSuccess"));
};
</script>

<style lang="scss" scoped>
.setting-wrap {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .title {
    margin-left: 5px;
    font-size: 14px;
  }
}
</style>
