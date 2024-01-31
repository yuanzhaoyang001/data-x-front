<template>
  <div class="cover-wrap">
    <div class="cover-mobile-wrap">
      <form-cover
        v-if="formThemeConfig?.enableCover"
        :formThemeConfig="formThemeConfig"
      />
      <el-empty v-else />
    </div>
  </div>
</template>
<script setup lang="ts" name="FormCoverPreview">
import FormCover from "@/views/form/write/component/FormCover.vue";
import { inject, Ref } from "vue";
import { FormThemeType } from "@/views/formgen/components/GenerateForm/types/form";

const formThemeConfig = inject<Ref<FormThemeType>>("formThemeConfig");
</script>
<style scoped lang="scss">
.cover-wrap {
  width: 100%;
  height: 100%;
}

.cover-mobile-wrap {
  position: relative;
  width: 320px;
  height: 560px;
  background-color: #ffffff;
  border-radius: 6px;
  margin: 30px auto;
}
</style>
