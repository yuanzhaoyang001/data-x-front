import type { App } from "vue";
import { getDicts } from "@/api/system/dict/data";
import { getConfigValue } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/tduck";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import commonFunction from "@/utils/commonFunction";

/**
 * 导出
 * @param app
 */

export function business(app: App) {
  // 全局方法挂载
  app.config.globalProperties.getDicts = getDicts;
  app.config.globalProperties.getConfigValue = getConfigValue;
  app.config.globalProperties.parseTime = parseTime;
  app.config.globalProperties.resetForm = resetForm;
  app.config.globalProperties.addDateRange = addDateRange;
  app.config.globalProperties.selectDictLabel = selectDictLabel;
  app.config.globalProperties.selectDictLabels = selectDictLabels;
  app.config.globalProperties.download = download;
  app.config.globalProperties.handleTree = handleTree;

  // 工具方法挂载
  app.config.globalProperties.$api = request;
  // 全局弹窗
  app.config.globalProperties.msgSuccess = function (msg: string) {
    ElMessage({
      message: msg,
      type: "success"
    });
  };
  app.config.globalProperties.msgError = function (msg: string) {
    ElMessage.error(msg);
  };
  app.config.globalProperties.msgWarning = function (msg: string) {
    ElMessage({
      message: msg,
      type: "warning"
    });
  };
  app.config.globalProperties.msgInfo = function (msg: string) {
    ElMessage({
      message: msg,
      type: "warning"
    });
  };
}
