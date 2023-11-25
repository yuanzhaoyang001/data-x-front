<template>
  <div :key="renderKey">
    <el-form-item :label="$t('formgen.matrix.firstColNameLabel')">
      <el-input v-model="activeData.firstColName" />
    </el-form-item>
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
    <matrix-option :active-data="activeData" />
    <el-divider>{{ $t("formgen.matrix.tableOptionsLabel") }}</el-divider>
    <p
      class="desc-text"
      style="text-align: center"
    >
      {{ $t("formgen.matrix.clickTableCellLabel") }}
    </p>
    <div
      v-if="isShowOptionConfig"
      class="mt10"
    >
      <el-form-item :label="$t('formgen.matrix.typeLabel')">
        <el-select
          v-model="activeData.currentRowAndCol.type"
          @change="handleChangeOptionType"
        >
          <el-option
            :content="$t('formgen.matrix.singleChoiceLabel')"
            value="RADIO"
          ></el-option>
          <el-option
            :content="$t('formgen.matrix.multipleChoiceLabel')"
            value="CHECKBOX"
          ></el-option>
        </el-select>
      </el-form-item>
    </div>
    <draggable
      v-if="isShowOptionConfig"
      :animation="340"
      v-model="activeData.tableOptions[activeData.currentRowAndCol.rowIndex][activeData.currentRowAndCol.colIndex].options"
      group="selectItem"
      item-key="label"
      handle=".option-drag"
    >
      <template #item="{ element, index }">
        <div
          :key="index"
          class="select-item"
        >
          <div class="select-line-icon option-drag">
            <el-icon>
              <ele-Operation />
            </el-icon>
          </div>
          <el-input
            v-model="element.label"
            :placeholder="$t('formgen.option.optionName')"
            size="small"
          />
          <div
            class="close-btn select-line-icon"
            @click="
              activeData.tableOptions[activeData.currentRowAndCol.rowIndex][activeData.currentRowAndCol.colIndex].options.splice(
                index,
                1
              )
            "
          >
            <el-icon>
              <ele-Remove />
            </el-icon>
          </div>
        </div>
      </template>
    </draggable>
    <div>
      <el-button
        icon="ele-CirclePlus"
        style="padding-bottom: 0; margin-left: 20px"
        link
        type="primary"
        @click="addSelectItem"
      >
        {{ $t("formgen.matrix.addOptionLabel") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import MatrixOption from "./matrix.vue";
import draggable from "vuedraggable";
import { i18n } from "@/i18n";

export default {
  name: "ConfigItemTableSelect",
  components: {
    MatrixOption,
    draggable
  },
  props: ["activeData"],
  data() {
    return {
      renderKey: new Date().getTime()
    };
  },
  computed: {
    isShowOptionConfig() {
      const activeData = this.activeData;
      const tableOptions = this.activeData.tableOptions;
      return (
        tableOptions[activeData.currentRowAndCol.rowIndex] &&
        tableOptions[activeData.currentRowAndCol.rowIndex][activeData.currentRowAndCol.colIndex]
      );
    }
  },
  watch: {
    "activeData.table": {
      handler(val) {
        if (val) {
          // 初始化默认选项
          for (let rowI = 0; rowI < val.rows.length; rowI++) {
            for (let colI = 0; colI < val.columns.length; colI++) {
              let row = this.activeData.tableOptions[rowI];
              if (!row) {
                row = [];
                this.activeData.tableOptions[rowI] = [];
              }
              let col = row[colI];
              if (!col) {
                col = {
                  type: "RADIO",
                  options: [
                    {
                      label: i18n.global.t("formgen.option.optionName"),
                      score: 1
                    }
                  ]
                };
                this.activeData.tableOptions[rowI][colI] = col;
              }
            }
          }
        }
      },
      deep: true
    },
    "activeData.currentRowAndCol": {
      handler(val) {
        if (val) {
          // 强制刷新组件数据渲染 不然会出现数据不同步的问题
          this.renderKey = new Date().getTime();
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange() {
      this.activeData.config["defaultValue"] = {};
    },
    addSelectItem() {
      const rowIndex = this.activeData.currentRowAndCol.rowIndex;
      const colIndex = this.activeData.currentRowAndCol.colIndex;
      let rowColData = this.activeData.tableOptions[rowIndex][colIndex];
      rowColData.options.push({
        label: i18n.global.t("formgen.option.optionName"),
        score: 1
      });
      this.activeData.tableOptions[rowIndex][colIndex] = rowColData;
    },
    handleChangeOptionType(val) {
      // 找到id 填充默认值 不然这个checkbox会报错
      const rowIndex = this.activeData.currentRowAndCol.rowIndex;
      const colIndex = this.activeData.currentRowAndCol.colIndex;
      let rowId = this.activeData.table.rows[rowIndex].id;
      let colId = this.activeData.table.columns[colIndex].id;
      const rowValData = this.activeData.config.defaultValue[rowId];
      if (!rowValData) {
        this.activeData.config.defaultValue[`${rowId}`] = {};
      }
      if (val === "CHECKBOX") {
        this.activeData.config.defaultValue[`${rowId}`][`${colId}`] = [];
      } else {
        this.activeData.config.defaultValue[`${rowId}`][`${colId}`] = "";
      }
      console.log(JSON.stringify(this.activeData.config.defaultValue));
      let rowColData = this.activeData.tableOptions[rowIndex][colIndex];
      rowColData.type = val;
      this.activeData.tableOptions[rowIndex][colIndex] = rowColData;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options.scss";
</style>
