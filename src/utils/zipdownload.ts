import axios from "axios";
import { baseUrl, getToken } from "./auth";

const mimeMap = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip"
};

export function downLoadZip(str, filename) {
  let url = str;
  axios({
    method: "get",
    url: url,
    responseType: "blob",
    headers: { Authorization: "Bearer " + getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.zip);
  });
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement("a");
  let blob = new Blob([res.data], { type: mimeType });
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
  let contentDisposition = decodeURI(res.headers["content-disposition"]);
  let result = patt.exec(contentDisposition);
  let fileName = result[1];
  fileName = fileName.replace(/\"/g, "");
  aLink.href = URL.createObjectURL(blob);
  aLink.setAttribute("download", fileName); // 设置下载文件名称
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
}
