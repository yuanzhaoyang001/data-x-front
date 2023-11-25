import request from "@/utils/request";

export function saveConfig(data: any) {
  return request({
    url: "/uniapp/config/save",
    method: "post",
    data: data
  });
}

export function getByKey(data: any) {
  return request({
    url: "/uniapp/config/getByKey",
    method: "get",
    params: data
  });
}
