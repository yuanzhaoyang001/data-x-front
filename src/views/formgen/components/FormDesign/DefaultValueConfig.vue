<template>
  <el-dialog
    v-if="dialogVisible"
    :title="$t('formgen.defaultValue.setting')"
    v-model="dialogVisible"
    width="50%"
  >
    <el-form
      inline
      label-position="top"
      style="overflow: scroll"
      size="default"
    >
      <el-form-item>
        <template
          #label
          style="display: inline-block"
        >
          <span v-html="copyCurrentItem.config.label" />
        </template>
        <component
          v-bind="{ ...copyCurrentItem }"
          :is="formItemComponent"
          v-model:value="copyCurrentItem.config.defaultValue"
          class="form-item-component"
          :item="copyCurrentItem"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="default"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="setDefaultValue"
          size="default"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { jsonSimpleClone } from "../../utils";
import { camelCase, upperFirst } from "lodash-es";

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {}
  }
});

const copyCurrentItem = ref({});
const dialogVisible = ref(false);

const copyItem = () => {
  const item = jsonSimpleClone(props.currentItem);
  item.readonly = false;
  copyCurrentItem.value = item;
};

const open = () => {
  dialogVisible.value = true;
};

defineExpose({
  open
});

const setDefaultValue = () => {
  props.currentItem.config["defaultValue"] = copyCurrentItem.value?.config?.defaultValue;
  dialogVisible.value = false;
};

watch(() => props.currentItem, copyItem, { deep: true });

onMounted(() => {
  copyItem();
});

// 动态导入组件
const modules = import.meta.glob("../FormItem/**/**/**.vue", { eager: true });

const formItemComponent = computed(() => {
  // 小写下划线转大写驼峰
  const componentName = camelCase(copyCurrentItem.value.config.tag);
  return modules[`../FormItem/${upperFirst(componentName)}/index.vue`]?.default;
});
</script>
<style lang="scss" scoped>
:deep(.el-form-item) {
  width: 100%;
}
</style>
