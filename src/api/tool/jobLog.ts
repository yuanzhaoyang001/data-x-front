import request from "@/utils/request";

// 查询调度日志列表
export function listJobLog(query: any) {
  return request({
    url: "/system/jobLog/page",
    method: "get",
    params: query
  });
}

// 删除调度日志
export function delJobLog(jobLogId: number) {
  return request({
    url: "/system/jobLog/delete" + jobLogId,
    method: "post"
  });
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: "/system/jobLog/clean",
    method: "post"
  });
}
