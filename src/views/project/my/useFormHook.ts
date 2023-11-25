import { ref } from "vue";
import { useFormInfo } from "@/stores/formInfo";
import dayjs from "dayjs";
import { copyFormRequest, deleteFormRequest, logicDeleteFormRequest, stopFormRequest } from "@/api/project/form";
import { publishFormRequest } from "@/api/project/publish";
import { MessageUtil } from "@/utils/messageUtil";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";

// 按照惯例，组合式函数名以“use”开头
export function useForm(emit?: any) {
  const folderId = ref(0);
  const projectStatusList = [
    { code: "", name: "全部", color: "#006EFF" },
    { code: 1, name: "未发布", color: "#909399" },
    { code: 2, name: "收集中", color: "#409EFF" },
    { code: 3, name: "已停止", color: "#F56C6C" }
  ];
  const projectTypeList = [
    { code: "", name: "全部", color: "#006EFF" },
    { code: 1, name: "表单", color: "#5190DE" },
    { code: 2, name: "流程", color: "#FF770F" },
    { code: 4, name: "考试", color: "#59C075" }
  ];

  const formStore = useFormInfo();

  const formatDateFilter = (time: string) => {
    return dayjs(time).format("YYYY/MM/DD");
  };

  const getType = (key: string) => {
    const item = projectTypeList.find(e => e.code === key);
    return item ? item : { name: "", color: "" };
  };

  const logicDeleteForm = (key: string) => {
    logicDeleteFormRequest({ formKey: key }).then(res => {
      if (res.data) {
        MessageUtil.success("刪除成功");
        emit("refresh");
      }
    });
  };

  const router = useRouter();
  const route = useRoute();

  const publishForm = (form: any) => {
    publishFormRequest({ formKey: form.formKey }).then(() => {
      MessageUtil.success("发布成功");
      emit("refresh");
    });
    toProjectHandle(form, "publish");
  };

  const deleteForm = (key: string) => {
    deleteFormRequest({ formKey: key }).then(res => {
      if (res.data) {
        MessageUtil.success("刪除成功");
        emit("refresh");
      }
    });
  };

  const stopProject = (key: string) => {
    stopFormRequest({ formKey: key }).then(res => {
      if (res.data) {
        MessageUtil.success("停止成功");
        emit("refresh");
      }
    });
  };

  const toProjectHandle = (form: any, type: string) => {
    formStore.setBackRoute(route.path);
    router.push({
      path: `/project/form/${type}`,
      query: { key: form.formKey, active: type, type: form.type, authGroupId: form.authGroupId }
    });
  };

  const handleCopyForm = (form: any) => {
    ElMessageBox.confirm("是否确认复制?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        copyFormRequest(form).then(res => {
          if (res.data) {
            MessageUtil.success("复制成功");
            toProjectHandle(res.data, "editor/index");
          }
        });
      })
      .catch(() => {});
  };

  return {
    projectStatusList,
    projectTypeList,
    folderId,
    formatDateFilter,
    getType,
    logicDeleteForm,
    publishForm,
    deleteForm,
    stopProject,
    toProjectHandle,
    handleCopyForm
  };
}
