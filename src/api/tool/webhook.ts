import request from "@/utils/request";

/**
 * 查询配置的webhook
 */
// 查询db数据库列表
export function getWebHook(sourceType: string, sourceId: string | number) {
  return request({
    url: "/webhook/config/",
    method: "get",
    params: { sourceType, sourceId }
  });
}

/**
 * 保存webhook
 */
export function saveWebHook(data: any) {
  return request({
    url: "/webhook/config/save",
    method: "post",
    data: data
  });
}

/**
 * 发送测试webHook
 */
export function sendTestWebHook(data: any) {
  return request({
    url: "/webhook/config/sendTest",
    method: "post",
    data: data
  });
}
