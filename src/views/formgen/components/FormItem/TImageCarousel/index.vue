<template>
  <el-carousel
    classs="t-form-carousel"
    :height="`${config.height ? config.height : 300}px`"
  >
    <el-carousel-item
      v-for="(option, index) in getOptions()"
      :key="index"
    >
      <p class="text-center">
        {{ item.label }}
      </p>
      <el-image
        :fit="config.imageFit"
        :src="option.image"
        style="width: 100%"
        :style="{ height: `${config.height ? config.height : 300}px` }"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import mixin from "../mixin";

export default {
  name: "TImageCarousel",
  mixins: [mixin]
};
</script>

<style lang="scss">
.t-form-carousel {
  :deep(.el-carousel__container) {
    min-height: 150px !important;
  }
}
</style>
