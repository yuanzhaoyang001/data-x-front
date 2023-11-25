<template>
  <div class="h100">
    <div id="luckysheet"></div>
    <PrintPageSizeDialog ref="printPageSizeDialogRef" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, nextTick, onUnmounted, ref } from "vue";
import { loadAll } from "./loadLuckySheet";
import { MessageUtil } from "@/utils/messageUtil";
import { PrintCellType, printCellTypeArray } from "@/views/form/publish/PrintTemplate/types";
import PrintPageSizeDialog from "./PrintPageSizeDialog.vue";

const props = defineProps({
  sheetData: {
    type: Array,
    default: () => null
  }
});

onMounted(() => {
  loadAll(initSheet);
});

onUnmounted(() => {
  window.luckysheet.destroy();
});

const printPageSizeDialogRef = ref<any>(null);

const currentCell = ref<any>(null);

const initSheet = () => {
  window.luckysheet.create({
    container: "luckysheet",
    title: "", // 设定表格名称
    lang: "zh", // 设定表格语言
    plugins: [],
    showtoolbar: true,
    showtoolbarConfig: {
      // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
      undoRedo: true,
      font: false, // '字体'
      fontSize: true, // '字号大小'
      bold: true, // '粗体 (Ctrl+B)'
      italic: true, // '斜体 (Ctrl+I)'
      strikethrough: true, // '删除线 (Alt+Shift+5)'
      underline: true, // '下划线 (Alt+Shift+6)'
      textColor: true, // '文本颜色'
      fillColor: true, // '单元格颜色'
      border: true, // '边框'
      mergeCell: true, // '合并单元格'
      horizontalAlignMode: true, // '水平对齐方式'
      verticalAlignMode: true, // '垂直对齐方式'
      textWrapMode: true, // '换行方式'
      textRotateMode: true, // '文本旋转方式',
      paintFormat: false, // 格式刷
      currencyFormat: false, // 货币格式
      percentageFormat: true, // 百分比格式
      numberDecrease: true, // '减少小数位数'
      numberIncrease: true, // '增加小数位数
      moreFormats: true, // '更多格式'
      image: true, // '插入图片'
      link: false, // '插入链接'
      chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
      postil: false, // '批注'
      pivotTable: false, // '数据透视表'
      function: false, // '公式'
      frozenMode: false, // '冻结方式'
      sortAndFilter: false, // '排序和筛选'
      conditionalFormat: false, // '条件格式'
      dataVerification: false, // '数据验证'
      splitColumn: false, // '分列'
      screenshot: true, // 截图
      exportXlsx: false,
      findAndReplace: true, // 查找替换
      protection: false, // 工作表保护
      print: false // 打印
    },
    cellRightClickConfig: {
      copy: true, // 复制
      copyAs: true, // 复制为
      paste: true, // 粘贴
      insertRow: true, // 插入行
      insertColumn: true, // 插入列
      deleteRow: true, // 删除选中行
      deleteColumn: true, // 删除选中列
      deleteCell: true, // 删除单元格
      hideRow: false, // 隐藏选中行和显示选中行
      hideColumn: false, // 隐藏选中列和显示选中列
      rowHeight: true, // 行高
      columnWidth: true, // 列宽
      clear: true, // 清除内容
      matrix: false, // 矩阵操作选区
      sort: true, // 排序选区
      filter: true, // 筛选选区
      chart: false, // 图表生成
      image: false, // 插入图片
      link: false, // 插入链接
      data: false, // 数据验证
      cellFormat: true // 设置单元格格式
      // customs: [
      //   {
      //     title: "查查查",
      //     onClick: function (clickEvent, event, params) {
      //       console.log("function test click", clickEvent, event, params);
      //     }
      //   }
      // ]
    },
    showinfobar: false,
    showsheetbar: false,
    showstatisticBar: true,
    enableAddRow: false, // 允许添加行
    enableAddBackTop: false, // 回到顶部
    data: props.sheetData || [
      {
        name: "", // 工作表名称
        color: "", // 工作表颜色
        index: 0, // 工作表索引
        status: 1, // 激活状态
        order: 0, // 工作表的下标
        hide: 0, // 是否隐藏
        row: 60, // 行数
        column: 26, // 列数
        defaultRowHeight: 25, // 自定义行高
        defaultColWidth: 100, // 自定义列宽
        celldata: [],
        config: {
          merge: {}, // 合并单元格
          rowlen: {}, // 表格行高
          columnlen: {}, // 表格列宽
          rowhidden: {}, // 隐藏行
          colhidden: {}, // 隐藏列
          authority: {} // 工作表保护
        },
        scrollLeft: 0, // 左右滚动条位置
        scrollTop: 0, // 上下滚动条位置
        luckysheet_select_save: [], // 选中的区域
        calcChain: [], // 公式链
        isPivotTable: false, // 是否数据透视表
        pivotTable: {}, // 数据透视表设置
        filter_select: {}, // 筛选范围
        filter: null, // 筛选配置
        luckysheet_alternateformat_save: [], // 交替颜色
        luckysheet_alternateformat_save_modelCustom: [], // 自定义交替颜色
        luckysheet_conditionformat_save: {}, // 条件格式
        frozen: {}, // 冻结行列配置
        chart: [], // 图表配置
        zoomRatio: 1, // 缩放比例
        image: [], // 图片
        showGridLines: 1, // 是否显示网格线
        dataVerification: {} // 数据验证配置
      }
    ],
    hook: {
      /**
       * 单元格点击事件，用于获取选中单元格是否绑定了段落数据
       */
      cellMousedown(cell, position) {
        let value, temp;
        let columnObject = {
          columnName: undefined,
          fieldType: undefined,
          imageSourceType: PrintCellType.COLUMN,
          barCodeType: undefined,
          barCodeShowWords: false
        };
        if (cell != null) {
          try {
            temp = JSON.parse(cell.v);
            if (temp != null && temp.value != null) {
              value = temp.value;
            } else {
              value = cell.v;
            }
            // 单元格数据类型为绑定字段
            if (temp != null && printCellTypeArray.includes(temp.cellType)) {
              columnObject = {
                columnName: temp.columnName,
                fieldType: temp.fieldType,
                imageSourceType: temp.imageSourceType || PrintCellType.COLUMN,
                barCodeType: temp.barCodeType,
                barCodeShowWords: temp.barCodeShowWords || false
              };
            }
          } catch (e) {
            temp = null;
            value = cell.v;
          }
        }
        currentCell.value = {
          position: position,
          cellType: (temp || {}).cellType || PrintCellType.COLUMN,
          cell: cell,
          value: value,
          ...columnObject
        };
        return false;
      },
      /**
       * 渲染单元格之前格式化显示文本
       */
      cellRenderBefore(cell, position, sheet, ctx) {
        if (cell == null || cell.v == null) return true;
        let value = cell.v;
        try {
          let temp = JSON.parse(value);
          if (temp.ct) {
            cell.ct = temp.ct;
            cell.m = temp.showVal;
            window.luckysheet.setCellValue(position.r, position.c, {
              ...cell,
              v: JSON.stringify({
                ...temp,
                ct: undefined
              })
            });
          }
        } catch (e) {
          //
        }
      },
      /**
       * 根据段落信息渲染左侧行标题颜色
       */
      rowTitleCellRenderAfter(rowNum, position, ctx) {
        // let fragmentInfo = that_.findFragment(rowNum - 1);
        // if (fragmentInfo != null) {
        //   ctx.canvas.getContext("2d").fillStyle = FRAGMENT_COLOR[fragmentInfo.index % FRAGMENT_COLOR.length];
        //   ctx.canvas.getContext("2d").fillRect(0, position.top, position.width, position.height);
        // }
        return false;
      }
    }
  });
  nextTick(() => {
    // 添加自定义的按钮到工具栏 官方没提供 这里我直接操作dom
    let toolbar = document.querySelector(".luckysheet-wa-editor");
    // 创建一个临时元素（可以是 div 等任何元素）
    const tempElement = document.createElement("div");

    // 将 HTML 字符串赋值给临时元素的 innerHTML 属性
    tempElement.innerHTML =
      '<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="纸张设置" id="luckysheet-paper" role="button" style="user-select: none;">\n' +
      '            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block" style="user-select: none;">\n' +
      '                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block" style="user-select: none;">\n' +
      '                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">\n' +
      '                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-undo iconfont icon-dayinshezhi" style="user-select: none;">\n' +
      "                        </div>\n" +
      "                    </div>\n" +
      "                </div>\n" +
      "            </div>\n" +
      "        </div>";

    // 获取临时元素的第一个子元素，这就是你的 HTML 字符串表示的元素
    const newElement: any = tempElement.firstChild;
    const leftThemeElement = document.querySelector(".luckysheet-toolbar-left-theme");
    toolbar?.insertBefore(newElement, leftThemeElement);
    const paperElement = document.getElementById("luckysheet-paper") as any;
    paperElement.addEventListener("click", () => {
      printPageSizeDialogRef.value.handleShow();
    });
  });
};

/**
 * 获取luckysheet数据
 */
const getSheetData = () => {
  let sheetData = window.luckysheet.getAllSheets();
  if (sheetData[0] != null && Array.isArray(sheetData[0].celldata)) {
    sheetData[0].celldata.forEach((data: any) => {
      if (data.v.v != null && data.v.v !== "") {
        try {
          let value = JSON.parse(data.v.v);
          if (value.cellType != null) {
            value.ct = data.v.ct;
          }
          data.v.v = JSON.stringify(value);
          window.luckysheet.setCellValue(data.r, data.c, {
            ...data.v
          });
        } catch (e) {
          //
        }
      }
    });
  }
  return sheetData;
};

/**
 * 设置当前选中的单元格值
 * @param value 值
 * @param printCellType 单元格类型
 */
const setSheetCurrentCellVal = (value: string, printCellType?: PrintCellType) => {
  if (!currentCell.value) {
    MessageUtil.warning("请先选中单元格");
    return;
  }
  let cellValue = {
    cellType: currentCell.value.cellType,
    value: value,
    columnName: value,
    barCodeType: PrintCellType.COLUMN,
    showVal: "${" + value + "}"
  };
  if (printCellType === PrintCellType.BARCODE) {
    cellValue = {
      cellType: PrintCellType.BARCODE,
      value: value,
      columnName: value,
      barCodeType: "CODA_BAR",
      showVal: "${" + value + ".barcode}"
    };
  } else if (printCellType === PrintCellType.QRCODE) {
    cellValue = {
      cellType: PrintCellType.QRCODE,
      value: value,
      columnName: value,
      barCodeType: "QR_CODE",
      showVal: "${" + value + ".qrcode}"
    };
  } else if (printCellType === PrintCellType.IMAGE) {
    cellValue = {
      cellType: PrintCellType.IMAGE,
      value: value,
      columnName: value,
      barCodeType: PrintCellType.IMAGE
    };
  }
  window.luckysheet.setCellValue(currentCell.value.position.r, currentCell.value.position.c, {
    ...currentCell.value.cell,
    v: JSON.stringify(cellValue) == null ? "" : JSON.stringify(cellValue),
    m: cellValue.showVal
  });
};

defineExpose({
  getSheetData,
  setSheetCurrentCellVal
});

// onUnmounted(() => {
//   window.luckysheet.destroy();
// });
</script>
<style scoped lang="scss">
#luckysheet {
  height: 100%;

  :deep(.luckysheet-icon) {
    color: var(--el-color-primary);
  }

  :deep(.luckysheet-inline-block) {
    color: var(--el-color-primary);
  }
}
</style>
