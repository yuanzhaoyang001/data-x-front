<template>
  <el-carousel
    classs="t-form-carousel"
    :style="getHeightStyle"
  >
    <el-carousel-item
      v-for="(option, index) in getOptions()"
      :key="index"
    >
      <p class="text-center">
        {{ option.label }}
      </p>
      <el-image
        :fit="config.imageFit"
        :src="option.image"
        style="width: 100%"
        :style="getHeightStyle"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts" name="TImageCarousel" setup>
import { computed } from "vue";
import { formEmits, formItemProps, useFormItem } from "../hooks/useFormItemHook";
import { isMobile } from "@/views/formgen/utils";

const props = defineProps({
  ...formItemProps
});

const emits = defineEmits(formEmits);

const { config, getOptions } = useFormItem(props, emits);

const getHeightStyle = computed(() => {
  if (isMobile()) {
    console.log("isMobile");
    return {
      height: `${config?.mHeight ? config?.mHeight : 150}px`
    };
  }
  return {
    height: `${config?.height ? config?.height : 300}px`
  };
});
</script>

<style lang="scss">
.t-form-carousel {
  :deep(.el-carousel__container) {
    min-height: 150px !important;
  }
}
</style>
