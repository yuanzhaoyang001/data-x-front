import { RouteRecordRaw } from "vue-router";

export const projectRoutes: Array<RouteRecordRaw> = [
  {
    path: "/form/print/design",
    component: () => import("@/views/form/publish/PrintTemplate/TemplateDesign.vue"),
    meta: { title: "打印设计" }
  },
  {
    path: "/form/poster/editor",
    component: () => import("@/views/form/poster/editor/index.vue"),
    meta: { title: "证书设计" }
  },
  {
    path: "/project/template/preview",
    component: () => import("@/views/project/template/preview.vue"),
    meta: { title: "模版预览" }
  },
  {
    path: "/project/public/result",
    component: () => import("@/views/form/statistics/public.vue"),
    meta: { title: "数据", requireLogin: false }
  },
  {
    path: "/project/public/data",
    component: () => import("@/views/form/data/PublicData.vue"),
    meta: { title: "数据", requireLogin: false }
  },
  {
    path: "/m/project/form/data",
    component: () => import("@/views/form/data/mobile/DataIndex.vue"),
    meta: { title: "数据", requireLogin: false }
  },
  {
    path: "/project/form/view",
    component: () => import("@/views/form/preview/ProjectForm.vue"),
    meta: { title: "查看", requireLogin: false }
  },
  {
    path: "/exam/score/assign",
    component: () => import("@/views/form/exam/ExamAssignScore.vue"),
    meta: { title: "考试打分" }
  },
  {
    path: "/exam/result/:uniqueId",
    component: () => import("@/views/form/exam/ExamResult.vue"),
    meta: { title: "考试结果", requireLogin: false }
  },
  {
    path: "/exam/rank/list",
    component: () => import("@/views/form/exam/ExamRankList.vue"),
    meta: { title: "考试排行榜", requireLogin: false }
  },
  {
    path: "/form/dimension/result",
    component: () => import("@/views/form/dimension/EvaluationReportResult.vue"),
    meta: { title: "维度报告", requireLogin: false }
  },
  {
    path: "/project/workflow/form/data",
    component: () => import("@/views/workflow/task/process/form.vue"),
    meta: { title: "查看" }
  },
  {
    path: "/project/workflow/form/ReviewForm",
    component: () => import("@/views/workflow/task/process/ReviewForm.vue"),
    meta: { title: "审核表单" }
  },
  {
    path: "/project/confirmation",
    component: () => import("@/views/project/confirmation/index.vue"),
    meta: { title: "核销" }
  },
  {
    path: "/project/form/data/view",
    component: () => import("@/views/form/data/query/ViewGenFormData.vue"),
    meta: { title: "查看" }
  },
  {
    path: "/form/answer/result",
    component: () => import("@/views/form/write/AnswerResult/index.vue"),
    meta: { requireLogin: false, title: "查看" }
  },
  {
    path: "/form/lottery",
    component: () => import("@/views/form/write/component/SubmitLottery.vue"),
    meta: { requireLogin: false, title: "抽奖" }
  },
  {
    path: "/q/:key",
    component: () => import("@/views/form/data/PublicQuery.vue"),
    meta: { title: "查询", requireLogin: false }
  },
  {
    path: "/s/:key",
    meta: { requireLogin: false, title: "问卷" },
    component: () => import("@/views/form/write/index.vue")
  },
  {
    path: "/d/:key",
    meta: { title: "创建" },
    component: () => import("@/views/form/data/create.vue")
  },
  {
    path: "/question/bankItem/add",
    meta: { title: "新增题目" },
    component: () => import("@/views/project/question/AddQuestion.vue")
  }
];
