import request from "@/utils/request";

// 查询定时任务调度列表
export function listJob(query: any) {
  return request({
    url: "/system/job/page",
    method: "get",
    params: query
  });
}

// 查询定时任务调度详细
export function getJob(jobId: number) {
  return request({
    url: "/system/job/" + jobId,
    method: "get"
  });
}

// 新增定时任务调度
export function addJob(data: any) {
  return request({
    url: "/system/job/add",
    method: "post",
    data: data
  });
}

// 修改定时任务调度
export function updateJob(data: any) {
  return request({
    url: "/system/job/update",
    method: "post",
    data: data
  });
}

// 删除定时任务调度
export function delJob(jobId: number) {
  return request({
    url: "/system/job/delete/" + `${jobId}`,
    method: "post"
  });
}

// 任务状态修改
export function changeJobStatus(id: number, status: any) {
  const data = {
    id,
    status
  };
  return request({
    url: "/system/job/changeStatus",
    method: "post",
    data: data
  });
}

// 定时任务立即执行一次
export function runJob(id: number, jobGroup: any) {
  const data = {
    id,
    jobGroup
  };
  return request({
    url: "/system/job/run",
    method: "post",
    data: data
  });
}
