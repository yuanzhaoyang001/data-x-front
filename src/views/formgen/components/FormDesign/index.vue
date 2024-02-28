<template>
  <div class="form-edit-container">
    <div class="left-board">
      <el-tabs
        class="left-tabs"
        style="height: 100%"
        tab-position="left"
      >
        <el-tab-pane>
          <template #label>
            <span class="tabs-label">
              <i class="iconfont icon-timu-04" />
              <span>{{ $t("formgen.index.subject") }}</span>
            </span>
          </template>
          <el-scrollbar
            :height="`${wdHeight - 100}px`"
            class="left-scrollbar"
          >
            <div class="components-list">
              <div
                v-for="(item, listIndex) in leftComponents"
                :key="listIndex"
              >
                <div class="components-title">
                  {{ item.title }}
                </div>
                <draggable
                  v-model="item.list"
                  :clone="cloneComponent"
                  :force-fallback="true"
                  :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                  :animation="180"
                  :move="handleMove"
                  :scroll="true"
                  :scroll-sensitivity="0"
                  :sort="false"
                  class="components-draggable"
                  item-key="typeId"
                  @end="onEnd"
                >
                  <template #item="{ element }">
                    <div class="components-item">
                      <div
                        class="components-body"
                        @click="addComponent(element)"
                      >
                        <form-svg-icon :name="element.config.tagIcon" />
                        {{ element.config.label }}
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="Config">
          <template #label>
            <span class="tabs-label">
              <hamburger-button
                fill="#333"
                size="24"
                theme="outline"
              />
              <span>{{ $t("formgen.index.outline") }}</span>
            </span>
          </template>
          <form-outline
            :form-item-list="drawingList"
            :form-key="formKey"
            @refresh-form-list="handleSortAllItem"
            @scroll-to-field="handleFormScrollToField"
          />
        </el-tab-pane>
        <el-tab-pane class="container">
          <template #label>
            <span class="tabs-label">
              <collection-files
                theme="outline"
                size="22"
                fill="#333"
                :strokeWidth="3"
                strokeLinejoin="bevel"
              />
              <span>{{ $t("formgen.index.questionBank") }}</span>
            </span>
          </template>
          <form-question @add="addComponent" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="center-board">
      <el-scrollbar
        ref="centerScrollbarRef"
        class="center-scrollbar"
      >
        <div
          v-if="formConf"
          ref="centerRowsRef"
          class="center-board-row t-form-theme-wrap"
        >
          <div
            v-if="editFormInfo"
            class="form-desc-wrap"
          >
            <el-row
              align="middle"
              class="center-name-box"
              justify="center"
              type="flex"
            >
              <el-col
                :span="21"
                class="text-center"
              >
                <form-tinymce
                  v-model:value="formConf.title"
                  :inline="true"
                  @change="handleSaveProjectInfo"
                />
              </el-col>
            </el-row>
            <el-row
              align="middle"
              class="center-desc-box"
              justify="center"
              type="flex"
            >
              <el-col :span="21">
                <form-tinymce
                  v-model:value="formConf.description"
                  :inline="true"
                  @change="handleSaveProjectInfo"
                />
              </el-col>
            </el-row>
            <div
              v-if="formConf.type == 4"
              class="evaluation-total-score"
            >
              <div class="total-score-title">{{ $t("formgen.index.total") }}</div>
              <div class="total-score">
                {{ totalScore }}
              </div>
            </div>
          </div>

          <el-form
            :label-position="formConf.labelPosition"
            :label-width="formConf.labelWidth + 'px'"
            class="design-form"
            size="default"
            ref="designFormRef"
          >
            <div
              v-if="!drawingList || !drawingList.length"
              class="empty-info"
            >
              <el-icon
                class="mr5 pointer"
                color="#409EFC"
                size="18"
              >
                <ele-Position />
              </el-icon>
              {{ $t("formgen.index.leftQuestion") }}
              <el-icon
                class="ml5 mr5"
                color="#409EFC"
                size="18"
              >
                <ele-Rank />
              </el-icon>
              {{ $t("formgen.index.drag") }}
            </div>
            <draggable
              v-model="drawingList"
              :animation="180"
              :force-fallback="true"
              :move="handleCenterMove"
              :scroll="true"
              :scroll-sensitivity="160"
              class="drawing-board"
              group="componentsGroup"
              handle=".mover"
              item-key="formItemId"
              tag="el-row"
              @end="onItemEnd"
            >
              <template #item="{ element, index }">
                <form-item-layout
                  :active-id="activeId"
                  :current-item="element"
                  :drawing-list="drawingList"
                  :form-conf="formConf"
                  :index="index"
                  @activeItem="activeFormItem"
                  @change="updateItemInfo"
                  @changeLabel="changeLabel"
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete"
                />
              </template>
            </draggable>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <right-panel
      :active-data="activeData"
      :fields="drawingList"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
      @add-fields="handleAddFields"
      @data-change="handleActiveDataChange"
    />
  </div>
</template>
<script lang="ts" name="FormEditor" setup>
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";

import draggable from "vuedraggable";
import { useRoute } from "vue-router";
import { useWindowSize } from "@vueuse/core";

import { CollectionFiles, HamburgerButton } from "@icon-park/vue-next";
import { cloneDeep, debounce, toLower } from "lodash-es";
import FormItemLayout from "./FormItemLayout.vue";
import RightPanel from "./RightPanel.vue";
import FormTinymce from "../tinymce/index.vue";
import FormSvgIcon from "../SvgIcon/index.vue";
import FormQuestion from "./FormQuestion.vue";
import FormOutline from "./FormOutline.vue";
import { deepClone, jsonSimpleClone, removeHtmlTag } from "../../utils";
import { FormActiveType, FormConfType } from "./types";
import { useFormInfo } from "@/stores/formInfo";
import { useFormDesign } from "./hooks/useFormDesign";
import { sortAllProjectItem } from "@/views/formgen/api";
import { ElLoading, ElMessage } from "element-plus";
import { i18n } from "@/i18n";
import { useExamForm } from "./hooks/useExamForm";
import mittBus from "@/utils/mitt";
import { useComponents } from "./hooks/useComponents";
import { setThemeVars } from "@/views/formgen/utils/theme";

const { setIsSaving } = useFormInfo();
let oldActiveId = ref<string | null>(null);

let tempActiveData = ref<any>();
const { height } = useWindowSize();
const wdHeight = ref(height);

const drawingList = ref<any>([]);
const activeId = ref<string | null | undefined>();

let activeData = ref<FormActiveType | null>();

const centerScrollbarRef = ref<any>(null);
const centerRowsRef = ref<HTMLDivElement>();

const formConf = ref<FormConfType | null>(null);

const { getAllComponents, getComponentsObj, getFormConfig } = useComponents();

const leftComponents = computed(() => {
  return getAllComponents(formType.value);
});

const formType = computed(() => {
  return formConf.value?.type;
});

const examFormHook = useExamForm();

const totalScore = computed(() => {
  return examFormHook.getTotalScore(drawingList.value);
});

const route = useRoute();

const formKey = ref<string>(route.query.key as string);

watch(
  () => activeData.value?.config.label,
  (val, oldVal) => {
    if (activeData.value?.placeholder === undefined || !activeData.value?.config.tag || oldActiveId.value !== activeId.value) {
      return;
    }
    // activeData.value!.placeholder = activeData.value?.placeholder.replace(removeHtmlTag(oldVal), "") + removeHtmlTag(val);
  },
  { deep: true }
);

watch(
  () => activeId.value,
  val => {
    oldActiveId.value = val as string;
  },
  { immediate: true, deep: true }
);

const formDesignHook = useFormDesign(drawingList, formConf, formKey);

const handleSaveProjectInfo = debounce(() => {
  formDesignHook.saveProjectInfo();
}, 200);

defineProps({
  /**
   * 是否编辑表单信息
   */
  editFormInfo: {
    type: Boolean,
    default: true
  }
});

// 外部传入方法 扩展组件功能
const loadFormInfo = inject<Function>("loadFormInfo", formDesignHook.queryProjectInfo);
const loadAllItems = inject<Function>("loadAllItems", formDesignHook.queryProjectItems);
const updateItemInfo = inject<Function>("updateItemInfo", formDesignHook.updateProjectItemInfo);
const deleteItemInfo = inject<Function>("deleteItemInfo", formDesignHook.deleteProjectItemInfo);
const createItemInfo = inject<Function>("createItemInfo", formDesignHook.saveProjectItemInfo);
const dragSort = inject<Function>("dragSort", formDesignHook.handleDragSort);
const checkPublicForm = inject<Function>("checkPublicForm", formDesignHook.handleCheckPublicForm);

onMounted(async () => {
  // 加载主题
  setThemeVars(null);
  // 复制对象 避免修改改变原始对象
  formConf.value = JSON.parse(JSON.stringify(getFormConfig((route.query.type as any) || 1)));
  formConf.value!.formKey = formKey.value;
  // 加载题目
  const loading = ElLoading.service({
    lock: true,
    text: "Loading"
  });
  await loadFormInfo();
  await loadAllItems();
  await nextTick(() => {
    loading.close();
  });
});

mittBus.on("refreshFormList", () => {
  loadAllItems();
});

const handleActiveDataChange = async (val: any) => {
  // 特殊处理自增表单 使修改的数据为自增表单组件本身
  let copyValue = jsonSimpleClone(val);
  if (val.isChild) {
    let parentItem = { ...val.parentItem };
    let tempVal = deepClone(val);
    delete tempVal.parentItem;
    delete tempVal.childIndex;
    parentItem.childList[val.childIndex] = tempVal;
    let tempParVal = { ...parentItem };
    tempParVal.childList.forEach((item: any) => {
      delete item.parentItem;
    });
    copyValue = tempParVal;
  }
  console.log(copyValue);
  updateItemInfo(copyValue);
};

const activeFormItem = (currentItem: any) => {
  activeData.value = currentItem;
  activeId.value = currentItem.config.formId;
};
const changeLabel = (currentItem: any, value: any) => {
  console.log("----", currentItem, value);
};
const handleMove = () => {
  if (formConf.value?.status == 2) {
    checkPublicForm();
    return false;
  }
  return true;
};
const onEnd = (obj: any) => {
  if (obj.from !== obj.to) {
    activeData.value = tempActiveData.value;
    activeId.value = `${toLower(tempActiveData.value.typeId)}-${new Date().getTime()}`;
    // 拖拽到自增表单不单独保存
    if (obj.to.className.indexOf("list-main") > -1) {
      return;
    }
    createItemInfo(tempActiveData.value).then(() => {
      onItemEnd(obj, true);
    });
  }
};
const handleCenterMove = (obj: any) => {
  if (obj.to.className === "list-main") {
    return false;
  }
};
const onItemEnd = (obj: any, createNew = false) => {
  setIsSaving(true);
  // createNew 避免新的组件拉到第一个不排序
  if (obj.oldIndex === obj.newIndex && !createNew) {
    setIsSaving(false);
    return;
  }
  dragSort(obj);
};

const addComponent = (item: any) => {
  checkPublicForm().then(res => {
    if (res) {
      const clone = cloneComponent(item);
      createItemInfo(clone);
      drawingList.value.push(clone);
      activeFormItem(clone);
      scrollToBottom();
    }
  });
};
const scrollToBottom = () => {
  nextTick(() => {
    centerScrollbarRef.value.setScrollTop(centerRowsRef.value!.clientHeight);
  });
};

const cloneComponent = (origin: any) => {
  const clone = cloneDeep(origin);
  // const config = clone.config;
  createIdAndKey(clone);
  if (clone.action) {
    clone.action += formKey.value;
  }
  // if (clone.placeholder !== undefined) {
  //   // clone.placeholder += config.label;
  // }
  tempActiveData.value = clone;
  return clone;
};

const createIdAndKey = (item: any) => {
  const config = item.config;
  config.formId = `${toLower(item.typeId)}${new Date().getTime()}`;
  config.renderKey = `${config.formId}${+new Date()}`;
  item.vModel = config.formId;

  return item;
};

const drawingItemCopy = (item: any, list: any) => {
  checkPublicForm().then(res => {
    if (res) {
      const clone = cloneComponent(item);
      clone.placeholder = item.placeholder;
      //加2 会在复制的下一个 +1 也行
      clone.sort = clone.sort + 2;
      // 数组指定位置1插入 找到原来的位置
      const index = list.findIndex((val: any) => val.config.formId === item.config.formId);
      list.splice(index + 1, 0, clone);
      activeFormItem(clone);
      createItemInfo(clone);
    }
  });
};
const drawingItemDelete = async (item: any, list: any) => {
  const isSuccess = await deleteItemInfo(item);
  if (isSuccess) {
    const index = list.findIndex((val: any) => val.config.formId === item.config.formId);
    list.splice(index, 1);

    await nextTick(() => {
      const len = drawingList.value.length;
      if (len) {
        activeFormItem(drawingList.value[len - 1]);
      }
    });
  }
};
// 类型切换 弃用
const tagChange = (newTag: any) => {
  console.log(newTag);
};

const handleSortAllItem = (sortIdList: string[]) => {
  sortAllProjectItem({
    formKey: formKey.value,
    sortIdList: sortIdList
  }).then(() => {
    ElMessage.success(i18n.global.t("formI18n.all.success"));
    loadAllItems();
  });
};

const designFormRef = ref<any>(null);

const handleFormScrollToField = (prop: string) => {
  designFormRef.value.scrollToField(prop);
};

/**
 * 新增字段 ocr组件使用
 * @param val
 */
const handleAddFields = (val: any) => {
  let fieldMapping: any = {};
  Object.keys(val).forEach(key => {
    let field = val[key] as any;
    // @ts-ignore
    let compo = JSON.parse(JSON.stringify(getComponentsObj()[field.type]));
    compo.config.label = field.label;
    const clone = cloneComponent(compo);
    createItemInfo(clone);
    drawingList.value.push(clone);
    fieldMapping[key] = clone.config.formId;
  });
  // @ts-ignore
  activeData.value.fieldMapping = fieldMapping;
  // 保存
  handleActiveDataChange(activeData.value);
};

defineExpose({
  drawingList,
  formConf
});
</script>

<style lang="scss">
@import "../../assets/styles/home.scss";
@import "../../assets/styles/right.scss";

.container {
  margin-left: 5px;

  .question-bank-input {
    margin: 10px auto;
  }
}
</style>
