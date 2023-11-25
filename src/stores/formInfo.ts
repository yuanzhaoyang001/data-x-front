import { defineStore } from "pinia";
import dayjs from "dayjs";
import { removeHtmlTag } from "@/views/formgen/utils";
import { getMyFormRoleRequest, getProjectRequest, MyFormRole } from "@/api/project/form";
import { AuthGroupInfo } from "@/api/project/extSetting";
import { Local, Session } from "@/utils/storage";
import { getAuthObjs } from "@/api/project/publish";

// 工作流配置
interface FormInfoState {
  // 表单当前文件夹
  currentFormFolder: any;
  // 返回url地址 进入表单设计器模块 返回到不同页面
  backRoute: string;
  // 当前表单名称
  currentFormName: string;
  // 最后一次保存的时间 比如12:00
  lastSaveTimeStr: string;
  // 是否在保存中状态
  isSaving: boolean;
  // 表单类型 1 普通 2流程 4 考试
  formType: number;
  // 表单按钮权限
  formButtonAuths: string[];
  // 我访问表单的角色
  myFormRole: MyFormRole | null;
  // 表单配置的权限组信息 来自共享表单
  authGroupInfo?: AuthGroupInfo | null;
}

/**
 * 表单流程
 * @methods
 */
export const useFormInfo = defineStore("formInfo", {
  state: (): FormInfoState => ({
    currentFormFolder: "",
    backRoute: Local.get("backRoute") || '"/form/my"',
    currentFormName: "",
    lastSaveTimeStr: "",
    isSaving: false,
    formType: 0,
    formButtonAuths: [],
    myFormRole: null,
    authGroupInfo: null
  }),
  actions: {
    // 设置表单当前文件夹
    setCurrentFormFolder(folder: string) {
      this.currentFormFolder = folder;
    },
    // 设置返回url地址
    setBackRoute(route: string) {
      Local.set("backRoute", route);
      this.backRoute = route;
    },
    // 设置当前表单名称
    setCurrentFormName(name: string) {
      // 去除富文本
      this.currentFormName = removeHtmlTag(name);
      this.setModifiedTime();
    },
    // 发生修改
    setModifiedTime() {
      this.lastSaveTimeStr = dayjs(new Date()).format("HH:mm");
    },
    // 设置保存状态
    setIsSaving(isSaving: boolean) {
      this.isSaving = isSaving;
      if (!isSaving) {
        this.setModifiedTime();
      }
    },
    // 设置表单类型
    setFormType(formType: number) {
      this.formType = formType;
    },
    // 是否拥有改按钮权限
    hasFormButtonAuth(auth: string) {
      if (this.myFormRole !== MyFormRole.COLLABORATOR) {
        return true;
      }
      return this.formButtonAuths.includes(auth);
    },
    // 加载表单信息
    async loadFormInfo(formKey: string, authGroupId: number) {
      if (!this.formType) {
        getProjectRequest(formKey).then((res: any) => {
          this.setFormType(res.data.type);
          this.setCurrentFormName(res.data.name);
        });
      }
      if (this.myFormRole) {
        return;
      }
      // 查询表单访问的角色 如果是协作者，需要存储按钮功能权限
      const resultData = await getMyFormRoleRequest(formKey);
      this.myFormRole = resultData.data;
      if (resultData.data == MyFormRole.COLLABORATOR) {
        // 查询表单权限
        const res = await getAuthObjs(authGroupId);
        if (res.data) {
          const authGroupInfo: AuthGroupInfo = res.data;
          this.authGroupInfo = authGroupInfo;
          if (authGroupInfo) {
            this.formButtonAuths = authGroupInfo.btnPerms || ["noAccess"];
            Session.set("formButtonAuths", this.formButtonAuths);
          }
        }
      }
    }
  }
});
