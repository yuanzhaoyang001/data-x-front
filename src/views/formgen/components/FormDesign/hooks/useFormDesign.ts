import { ref, Ref } from "vue";
import {
  createProjectItem,
  deleteProjectItem,
  queryProject,
  queryProjectItemList,
  sortProjectItem,
  stopPublishFormRequest,
  updateProject,
  updateProjectItem
} from "@/views/formgen/api";
import { useFormInfo } from "@/stores/formInfo";
import { debounce } from "lodash-es";
import { ElMessageBox } from "element-plus";
import { dbDataConvertForItemJson, formItemConvertData } from "@/views/formgen/utils/convert";
import { i18n } from "@/i18n";

/**
 * 表单设计Hook
 * @param drawingList 所有题目
 * @param formConf  表单配置
 *  @param formKey  表单key
 */
export function useFormDesign(drawingList: Ref<any>, formConf: Ref<any>, formKey: Ref<string>) {
  const { setCurrentFormName, setIsSaving, setFormType } = useFormInfo();

  /**
   * 是否显示已经发布了的弹窗
   */
  const showPublishConfirm = ref<boolean>(false);

  /**
   * 查询表单信息
   */
  const queryProjectInfo = async () => {
    const res = await queryProject(formKey.value);
    formConf.value.status = res.data.status;
    formConf.value.title = res.data.name;
    formConf.value.type = res.data.type;
    if (res.data.description) {
      formConf.value.description = res.data.description;
    }
    setFormType(res.data.type);
    setCurrentFormName(formConf.value.title);
  };

  /**
   * 更新标题和描述
   */
  const saveProjectInfo = () => {
    setCurrentFormName(formConf.value.title);
    updateProject({
      formKey: formKey.value,
      name: formConf.value.title,
      description: formConf.value.description
    }).then(() => {});
  };

  /**
   * 检查是否发布
   */
  const handleCheckPublicForm = async () => {
    let noPublish = true;
    if (formConf.value.status === 2 && !showPublishConfirm.value) {
      noPublish = false;
      showPublishConfirm.value = true;
      try {
        await ElMessageBox.confirm(i18n.global.t("form.form.isEdit"), i18n.global.t("formI18n.all.waring"), {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel")
        });
        await stopPublishFormRequest({ formKey: formKey.value });
        await queryProjectInfo();
        noPublish = true;
      } catch (error) {
        noPublish = false;
      } finally {
        showPublishConfirm.value = false;
      }
    }

    return noPublish;
  };

  /**
   * 更新题目
   */
  const updateProjectItemInfo = debounce((val: any) => {
    setIsSaving(true);
    const data = formItemConvertData(val, formKey.value);
    updateProjectItem(data).then(() => {
      setIsSaving(false);
    });
  });

  /**
   * 删除题目
   * @param val
   */
  const deleteProjectItemInfo = async (val: any) => {
    setIsSaving(true);
    const data = formItemConvertData(val, formKey.value);
    try {
      await deleteProjectItem(data);
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 保存题目
   * @param item
   */
  const saveProjectItemInfo = async (item: any) => {
    setIsSaving(true);
    let isSuccess = false;
    const params = formItemConvertData(item, formKey.value);
    const pItem = item;

    await createProjectItem(params).then(res => {
      setIsSaving(false);
      pItem.sort = res.data.sort;
      isSuccess = true;
    });
    // 如果是分页组件 刷新所有分页的页码
    if (item.typeId === "PAGINATION") {
      updatePaginationList();
    }
    return isSuccess;
  };

  /**
   *  更新分页的信息
   */
  const updatePaginationList = () => {
    const { length } = drawingList.value.filter((item: any) => item.typeId === "PAGINATION");
    let curr = 1;
    drawingList.value.forEach((item: any, index: any) => {
      if (item.typeId === "PAGINATION") {
        item.totalPageNum = length;
        item.currPageNum = curr++;
        drawingList.value[index] = item;
      }
    });
  };

  /**
   * 查询全部题目
   */
  const queryProjectItems = async () => {
    const res = await queryProjectItemList({ key: formKey.value });
    const tempList = res.data.map((item: any) => dbDataConvertForItemJson(item));
    drawingList.value = tempList;
    // 更新分页
    updatePaginationList();
  };

  /**
   * 处理拖动排序
   * @param  obj 排序的信息
   */
  const handleDragSort = (obj: any) => {
    const params: any = { formKey: formKey.value };
    if (drawingList.value[obj.newIndex - 1]) {
      params.beforePosition = drawingList.value[obj.newIndex - 1].sort;
    }
    if (drawingList.value[obj.newIndex + 1]) {
      params.afterPosition = drawingList.value[obj.newIndex + 1].sort;
    }
    params.formItemId = drawingList.value[obj.newIndex].config.formId;
    if (params.beforePosition || params.afterPosition) {
      sortProjectItem(params).then(res => {
        drawingList.value[obj.newIndex].sort = res.data.sort;
        if (res.data.refreshAll) {
          queryProjectItems();
        }
        setIsSaving(false);
      });
    } else {
      setIsSaving(false);
    }
  };

  return {
    queryProjectInfo,
    saveProjectInfo,
    handleCheckPublicForm,
    updateProjectItemInfo,
    deleteProjectItemInfo,
    saveProjectItemInfo,
    updatePaginationList,
    queryProjectItems,
    handleDragSort
  };
}
