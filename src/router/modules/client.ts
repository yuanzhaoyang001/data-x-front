import { RouteRecordRaw } from "vue-router";
import path from "node:path";

export const clientRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "clientLayout",
    component: () => import("@/views/client/layout/index.vue"),
    redirect: "/form/my",
    children: [
      {
        path: "/user/center",
        component: () => import("@/views/system/user/profile/index.vue"),
        name: "UserCenter",
        meta: { title: "个人中心" }
      },
      {
        path: "/workflow/task/record/start",
        component: () => import("@/views/workflow/task/process/start.vue"),
        name: "workflowStart",
        meta: { title: "流程发起", icon: "", isHide: true }
      },
      {
        path: "/workflow/task/record/handle",
        component: () => import("@/views/workflow/task/process/handle.vue"),
        name: "workflowHandle",
        meta: { title: "流程发起", icon: "", isHide: true }
      }
    ]
  },
  {
    path: "/client/message",
    name: "ClientMessage",
    component: () => import("@/views/client/message/index.vue")
  }
];
