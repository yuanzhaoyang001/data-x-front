<template>
  <el-col
    :class="className"
    :span="config.span"
  >
    <!-- 动态表格设计模块 start -->
    <template v-if="currentItem?.typeId === 'SUB_FORM'">
      <div
        class="batch-box"
        @click="emitEvent('activeItem', currentItem)"
      >
        <div class="batch-label">
          {{ config.label }}
          <span class="desc-text">{{ $t("formgen.formItemLayout.desc") }}</span>
        </div>
        <div class="draggable-box">
          <draggable
            :id="currentItem.formId"
            v-model="currentItem.childList"
            :move="handleMove"
            class="list-main"
            item-key="vModel"
            tag="el-row"
            v-bind="{
              group: insertAllowed ? 'componentsGroup' : '',
              ghostClass: 'moving',
              animation: 180,
              handle: '.sub-drag-move'
            }"
            @start="handleSubFormStart"
            @end="handleSubFormEnd"
            @change="handleChange($event, currentItem)"
          >
            <template #item="{ element, index }">
              <div
                :key="element.vModel"
                :class="activeId === element.config.formId ? 'active-from-item' : ''"
                class="drag-move"
                @click.stop="activeChildItem(element, index, currentItem)"
              >
                <form-item
                  :key="element.renderKey"
                  :current-item="element"
                  :index="index"
                  class="form-item"
                />
                <div class="drawing-item-operation-wrap">
                  <span
                    class="drawing-item-copy mover sub-drag-move"
                    :title="$t('formI18n.all.copy')"
                  >
                    <el-icon><ele-Rank /></el-icon>
                  </span>
                  <span
                    class="drawing-item-copy"
                    :title="$t('formI18n.all.copy')"
                    @click="copyChildItem(element)"
                  >
                    <el-icon><ele-CopyDocument /></el-icon>
                  </span>
                  <span
                    class="drawing-item-delete"
                    :title="$t('formI18n.all.delete')"
                    @click="deleteChildItem(element)"
                  >
                    <el-icon><ele-Delete /></el-icon>
                  </span>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <div class="drawing-item-operation-wrap">
        <span
          class="drawing-item-copy mover"
          :title="$t('formI18n.all.move')"
        >
          <el-icon><ele-Rank /></el-icon>
        </span>
        <span
          class="drawing-item-copy"
          :title="$t('formI18n.all.copy')"
          @click="emitEvent('copyItem', currentItem, drawingList)"
        >
          <el-icon><ele-CopyDocument /></el-icon>
        </span>
        <span
          class="drawing-item-delete"
          :title="$t('formI18n.all.delete')"
          @click="emitEvent('deleteItem', currentItem, drawingList)"
        >
          <el-icon><ele-Delete /></el-icon>
        </span>
      </div>
    </template>

    <template v-else>
      <form-item
        :key="currentItem?.renderKey"
        :current-item="currentItem"
        :index="index"
        class="form-item"
        @change="emitEvent('change', currentItem)"
        @click="emitEvent('activeItem', currentItem)"
      />
      <div class="drawing-item-operation-wrap">
        <span
          class="drawing-item-copy mover"
          :title="$t('formI18n.all.move')"
        >
          <el-icon
            color="#484848"
            size="18"
          >
            <ele-Rank />
          </el-icon>
        </span>
        <span
          class="drawing-item-copy"
          :title="$t('formI18n.all.copy')"
          @click="emitEvent('copyItem', currentItem, drawingList)"
        >
          <el-icon
            color="#484848"
            size="18"
          >
            <ele-CopyDocument />
          </el-icon>
        </span>
        <span
          class="drawing-item-plus"
          :title="$t('form.examConfig.addQuestions')"
          @click="handleAddToQuestionBank(currentItem)"
        >
          <el-icon
            color="#484848"
            size="18"
          >
            <ele-Paperclip />
          </el-icon>
        </span>
        <span
          class="drawing-item-delete"
          :title="$t('formI18n.all.delete')"
          @click="emitEvent('deleteItem', currentItem, drawingList)"
        >
          <el-icon
            color="#484848"
            size="18"
          >
            <ele-Delete />
          </el-icon>
        </span>
      </div>
    </template>

    <add-to-question-bank ref="addToQuestionBankRef" />
  </el-col>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import FormItem from "./FormItem.vue";
import { cloneDeep, toLower } from "lodash-es";
import AddToQuestionBank from "@/views/formgen/components/FormDesign/component/AddToQuestionBank.vue";

const props = defineProps({
  currentItem: Object,
  index: Number,
  drawingList: Array,
  activeId: String,
  formConf: Object
});
const emit = defineEmits(["change", "activeItem", "copyItem", "deleteItem"]);

const insertAllowed = ref(true);

const config = computed<any>(() => props.currentItem?.config);

const className = computed(() => {
  let className = props.activeId === config?.value.formId ? "drawing-item active-from-item" : "drawing-item";
  if (props.formConf?.unFocusedComponentBorder) className += " unfocus-bordered";
  return className;
});

const emitEvent = (name: string, val: any, list?: any) => {
  //@ts-ignore
  emit(name, val, list);
};

const activeChildItem = (child: any, index: number, currentItem: any) => {
  child.isChild = true;
  child.childIndex = index;
  child.parentItem = cloneDeep(currentItem);
  emitEvent("activeItem", child);
};

const copyChildItem = (item: any) => {
  let clone = cloneDeep(item);
  clone = createIdAndKey(clone);
  props.currentItem?.childList.push(clone);
  emit("change", props.currentItem);
};

const deleteChildItem = (index: number) => {
  props.currentItem?.childList.splice(index, 1);
  emit("change", props.currentItem);
};

const handleChange = (evt: Event, parent: any) => {
  // 如果有不支持自增表单的组件 可以在这里给他从数组移除
  emit("change", parent);
};

const handleMove = (e: Event, originalEvent: Event) => {
  // 自增表单组件不允许向外拖拽
  if ((e as any).to.className === "drawing-board") {
    return false;
  }
  return true;
};

const createIdAndKey = (item: any) => {
  const config = item.config;
  config.formId = `${toLower(item.typeId)}-${new Date().getTime()}`;
  config.renderKey = `${config.formId}${+new Date()}`;
  item.vModel = `${config.formId}`;
  return item;
};

const addToQuestionBankRef = ref<InstanceType<typeof AddToQuestionBank> | null>(null);

const handleAddToQuestionBank = (item: any) => {
  addToQuestionBankRef.value?.showDialog(item);
};

const handleSubFormStart = () => {
  // 解决子表单里面组件拖动会导致富文本复制
  let elements = document.querySelectorAll(".mce-content-body");
  elements.forEach(function (element: any) {
    element.style.pointerEvents = "none";
  });
};
const handleSubFormEnd = () => {
  // 解决子表单里面组件拖动会导致富文本复制
  let elements = document.querySelectorAll(".mce-content-body");
  elements.forEach(function (element: any) {
    element.style.pointerEvents = "auto";
  });
};
</script>
