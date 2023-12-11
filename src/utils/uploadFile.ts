import { baseUrl, getTokenHeader } from "@/utils/auth";
import { ElLoading } from "element-plus";

/**
 * 上传文件的header
 */
export const getUploadHeader = () => {
  return getTokenHeader();
};

/**
 * 上传文件url
 */
export const getUploadUrl = () => {
  // 动态baseURL
  return `${baseUrl}/user/file/upload`;
};

let loadingInstanceGlobal: any = null;
/**
 * 上传文件进度条
 */
export const uploadProgressHandle = (callback?: any) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "上传中",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
    fullscreen: true
  });
  loadingInstanceGlobal = loadingInstance;
  if (callback) {
    callback(loadingInstance);
  }
};

/**
 * 关闭上传文件进度条
 * @param loadingInstance
 * @param callback
 */
export const closeUploadProgressHandle = (loadingInstance?: any, callback?: any) => {
  setTimeout(() => {
    if (loadingInstance) {
      loadingInstance.close();
    } else {
      loadingInstanceGlobal.close();
    }
  }, 100);
  if (callback) {
    callback();
  }
};
