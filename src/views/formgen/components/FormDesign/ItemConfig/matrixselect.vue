<template>
  <div>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.matrix.organization") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.matrix.content')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.isSelectOrganization" />
    </el-form-item>
    <el-form-item :label="$t('formgen.matrix.multiple')">
      <el-switch
        v-model="activeData.multiple"
        @change="handleChange"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.matrixSelect.optionCount')">
      <el-button
        link
        type="primary"
        icon="ele-Edit"
        @click="handleOpenSelectedRule"
      >
        {{ $t("formgen.matrixSelect.setting") }}
      </el-button>
    </el-form-item>
    <el-dialog
      :title="$t('formgen.matrixSelect.setting')"
      v-model="dialogVisible"
      v-if="!activeData.multiple"
    >
      <table>
        <thead>
          <tr>
            <th>{{ $t("formgen.matrixSelect.optionColText") }}</th>
            <th>{{ $t("formgen.matrixSelect.optionColText2") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="col in activeData.table.columns"
            :key="col.id"
          >
            <td>{{ col.label }}</td>
            <td>
              <el-select v-model="columnSelectedCountRule[col.id]">
                <el-option
                  value="null"
                  :label="$t('formgen.matrixSelect.unlimited')"
                />
                <el-option
                  v-for="(item, index) in activeData.table.rows.length"
                  :key="index"
                  :label="`${item}${$t('formgen.matrixSelect.selectUnit')}`"
                  :value="item"
                ></el-option>
              </el-select>
            </td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t("form.viewOrUpdate.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="handleSaveSelectedRule"
        >
          {{ $t("form.viewOrUpdate.confirm") }}
        </el-button>
      </template>
    </el-dialog>
    <matrix-option :active-data="activeData" />
  </div>
</template>

<script>
import MatrixOption from "./matrix.vue";
import draggable from "vuedraggable";

export default {
  name: "ConfigItemMatrixSelect",
  components: {
    MatrixOption,
    draggable
  },
  props: ["activeData"],
  data() {
    return {
      dialogVisible: false,
      // 列选择次数的规则
      columnSelectedCountRule: {}
    };
  },
  methods: {
    handleOpenSelectedRule() {
      this.dialogVisible = true;
      this.columnSelectedCountRule = this.activeData.columnSelectedCountRule || {};
    },
    handleChange() {
      this.activeData.config.defaultValue = {};
    },
    handleSaveSelectedRule() {
      this.activeData.config.columnSelectedCountRule = this.columnSelectedCountRule;
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}

/* 设置表头样式 */
th {
  background-color: #f2f6fc;
  color: #000000;
  padding: 10px;
  text-align: center;
  border: 1px solid #dcdfe6;
}

/* 设置表格单元格样式 */
td {
  padding: 10px;
  text-align: center;
  border: 1px solid #dcdfe6;
}

/* 设置鼠标悬停效果 */
tr:hover {
}
</style>
