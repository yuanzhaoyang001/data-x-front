// 跳转url
import { returnLogic } from "@/views/form/setting/LogicJump/logic";

export function jumpUrl(url: string, dataId: number) {
  if (!url) {
    return;
  }
  // 如果url不包含http://或者https://，则自动添加
  if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
    url = "http://" + url;
  }
  // 如果url包含/poster/gen 则添加dataId参数
  if (url.indexOf("/poster/gen") !== -1) {
    url = addUrlParam(url, "dataId", dataId);
  }
  setTimeout(() => {
    window.location.replace(url);
  }, 500);
}

/**
 * 给url添加参数
 */
export function addUrlParam(url: string, name: string, value: any) {
  if (url.indexOf("?") !== -1) {
    url += "&";
  } else {
    url += "?";
  }
  url += name + "=" + value;
  return url;
}

/**
 * 获取逻辑跳转结果
 */
export function logicJumpResult(commitJumpLogicList: any, data: any) {
  let result = returnLogic(commitJumpLogicList, data);
  if (result.promptJumpType === "prompt") {
    result.promptJumpContent = result.promptJumpContent
      .replaceAll("#{totalScore}", data["totalScore"])
      .replaceAll("#{dataId}", data["dataId"]);
  }
  return result;
}
