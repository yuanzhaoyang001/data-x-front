<template>
  <div
    ref="matrixTableWrapper"
    class="matrix-table-wrapper"
  >
    <table
      v-if="matrixLayout.rows"
      ref="matrixTable"
      class="matrix-table not-print"
    >
      <thead>
        <tr v-if="matrixLayout.columns">
          <td style="width: 150px" />
          <td
            v-for="column in matrixLayout.columns"
            :key="column.id"
          >
            {{ column.label }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in matrixLayout.rows"
          :key="row.id"
        >
          <td style="width: 150px">
            {{ row.label }}
          </td>
          <template v-if="type === 'MATRIX_INPUT'">
            <td
              v-for="column in matrixLayout.columns"
              :key="column.id"
            >
              <div>
                <span v-if="value[row.id]">{{ value[row.id][column.id] }}</span>
              </div>
            </td>
          </template>
          <template v-else-if="type === 'MATRIX_DROPDOWN'">
            <td
              v-for="column in matrixLayout.columns"
              :key="column.id"
            >
              <div>
                <span v-if="value[row.id]">{{ value[row.id][column.id].label }}</span>
                <span
                  v-if="value[row.id]"
                  class="ml5"
                >
                  分数：({{ value[row.id][column.id].score }})
                </span>
              </div>
            </td>
          </template>
          <template v-else-if="type === 'MATRIX_SELECT'">
            <td :colspan="matrixLayout.columns.length">
              <span v-if="Array.isArray(value[row.id])">{{ value[row.id].join(",") }}</span>
              <span v-else>{{ value[row.id] }}</span>
            </td>
          </template>
          <template v-else-if="type === 'TABLE_SELECT'">
            <td
              v-for="column in matrixLayout.columns"
              :key="column.id"
            >
              <div>
                <span v-if="value[row.id]">{{ formatVal(value[row.id][column.id]) }}</span>
              </div>
            </td>
          </template>
          <template v-else-if="type === 'MATRIX_SCALE' || type === 'MATRIX_SLIDER'">
            <td>
              {{ value[row.id] }}
            </td>
          </template>
          <template v-else></template>
        </tr>
      </tbody>
    </table>
    <div
      ref="matrixTablePrintWrapper"
      class="matrix-table-print-wrapper print"
    />
  </div>
</template>

<script>
export default {
  name: "MatrixView",
  props: {
    type: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => {}
    },
    matrixLayout: {
      type: Object,
      default: () => {}
    }
  },
  emits: ["update:value"],
  mounted() {
    let table = this.$refs.matrixTable.cloneNode(true);
    table.className = "matrix-table-print";
    this.$refs.matrixTablePrintWrapper.appendChild(table);
  },
  methods: {
    formatVal(val) {
      // 如果是数组
      if (Array.isArray(val)) {
        return val.join(",");
      }
      return val;
    }
  }
};
</script>

<style lang="scss" scoped>
.matrix-table-wrapper {
  overflow: scroll;
  height: 100%;
  display: flex;
}

.matrix-table {
  font-size: 11px;
  border-width: 1px;
  border-color: #dcdfe6;
  border-collapse: collapse;
  min-width: 90%;
}

.matrix-table td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #dcdfe6;
  background-color: #ffffff;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.print {
  display: none;
}

.matrix-table-print {
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  table-layout: auto;
  width: 100%;
  font-size: 11px;
  color: #303133;
  border-width: 1px;
  border-color: #dcdfe6;
  border-collapse: collapse;

  thead {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dadcde;
    line-height: 40px;
    font-weight: bold;
    color: #454c70;
  }

  tr {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dadcde;
    line-height: 23px;
    min-height: 23px;
  }

  td {
    padding: 5px 10px;
    font-size: 14px;
    width: 100px;
    border-width: 1px;
    border-style: solid;
    border-color: #dcdfe6;
    background-color: #ffffff;
    word-break: break-all;
  }
}
</style>
