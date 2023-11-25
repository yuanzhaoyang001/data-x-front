<template>
  <el-form
    ref="formRef"
    :model="widgetConfig"
    label-width="120px"
    label-position="top"
    size="default"
  >
    <el-form-item
      prop="id"
      label="Id"
    >
      <span>{{ widgetConfig.id }}</span>
      <el-button
        type="primary"
        size="small"
        class="ml20"
        bg
        text
        @click="handleCopy"
      >
        {{ $t("form.formPoster.copy") }}
      </el-button>
      <el-button
        type="danger"
        size="small"
        bg
        text
        @click="handleDelete"
      >
        {{ $t("form.formPoster.delete") }}
      </el-button>
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.name')">
      <el-input
        v-model="widgetConfig.name"
        :placeholder="$t('form.formPoster.enterComponentName')"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.position')">
      <el-row>
        <el-col :span="12">
          <span class="mr5">x</span>
          <el-input-number
            v-model="widgetConfig.x"
            controls-position="right"
            style="width: 80%"
          />
        </el-col>
        <el-col :span="12">
          <span class="mr5">y</span>
          <el-input-number
            v-model="widgetConfig.y"
            controls-position="right"
            style="width: 80%"
          />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.size1')">
      <el-row>
        <el-col :span="12">
          <span class="mr5">
            {{ $t("form.formPoster.width") }}
          </span>
          <el-input-number
            v-model="widgetConfig.width"
            controls-position="right"
            style="width: 80%"
          />
        </el-col>
        <el-col :span="12">
          <span class="mr5">
            {{ $t("form.formPoster.height") }}
          </span>
          <el-input-number
            v-model="widgetConfig.height"
            controls-position="right"
            style="width: 80%"
          />
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="BaseConfig">
import { PropType } from "vue";
import { PosterWidget } from "../../types/poster";
import { usePosterStore } from "@/stores/formPoster";

const props = defineProps({
  widgetConfig: {
    type: Object as PropType<PosterWidget>,
    required: true
  }
});
const store = usePosterStore();

const handleDelete = () => {
  store.deletePosterWidget(props.widgetConfig);
};
const handleCopy = () => {
  store.copyPosterWidget(props.widgetConfig);
};
</script>

<style scoped lang="scss"></style>
