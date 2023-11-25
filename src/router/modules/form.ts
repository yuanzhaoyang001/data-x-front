import { RouteRecordRaw } from "vue-router";

export const formRoutes: Array<RouteRecordRaw> = [
  {
    path: "/project/form",
    redirect: "editor",
    component: () => import("@/views/form/index.vue"),
    children: [
      {
        path: "editor",
        component: () => import("@/views/form/editor/index.vue"),
        meta: { title: "表单设计" },
        redirect: "index",
        children: [
          {
            path: "index",
            component: () => import("@/views/form/editor/design.vue"),
            meta: { title: "表单设计" }
          },
          {
            path: "logic",
            component: () => import("@/views/form/logic/index.vue"),
            meta: { title: "表单逻辑" }
          },
          {
            path: "theme",
            component: () => import("@/views/form/theme/index.vue"),
            meta: { title: "表单主题" }
          },
          {
            path: "setting",
            component: () => import("@/views/form/setting/index.vue"),
            meta: { title: "表单设置" }
          },
          {
            path: "dimension",
            component: () => import("@/views/form/dimension/index.vue"),
            meta: { title: "维度设置" }
          },
          {
            path: "workflow",
            component: () => import("@/views/form/workflow/index.vue"),
            meta: { title: "流程设置" }
          }
        ]
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { title: "表单设计" }
      },
      {
        path: "preview",
        component: () => import("@/views/form/preview/index.vue"),
        meta: { title: "表单预览" }
      },
      {
        path: "publish",
        component: () => import("@/views/form/publish/index.vue"),
        meta: { title: "表单发布" }
      },

      {
        path: "statistics",
        component: () => import("@/views/form/statistics/index.vue"),
        meta: { title: "表单统计" }
      },
      {
        path: "data",
        component: () => import("@/views/form/data/index.vue"),
        meta: { title: "表单统计" }
      }
    ]
  }
];
