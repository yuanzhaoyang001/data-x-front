<template>
  <div
    :style="getCoverStyle"
    class="form-cover-wrap"
    @touchmove="handleCloseCover"
  >
    <div
      v-html="formThemeConfig?.coverTitle"
      class="cover-title"
    ></div>
    <div
      class="cover-btn-wrap"
      v-if="formThemeConfig?.coverOpenType === 'btn' && formThemeConfig?.coverBtnText"
    >
      <el-button
        @click="handleCloseCover"
        :color="formThemeConfig?.coverBtnColor"
        size="default"
      >
        {{ formThemeConfig?.coverBtnText }}
      </el-button>
    </div>
    <div
      class="cover-scroll-wrap"
      v-if="formThemeConfig?.coverOpenType === 'scroll' && formThemeConfig?.coverBtnText"
    >
      <div>
        <span :style="{ color: formThemeConfig?.coverBtnTextColor }">
          {{ formThemeConfig?.coverBtnText }}
        </span>
      </div>
    </div>
    <div
      class="scroll-arrow"
      v-if="formThemeConfig?.coverOpenType === 'scroll' && formThemeConfig?.coverBtnText"
    >
      <el-icon
        :size="14"
        :color="formThemeConfig?.coverBtnTextColor"
      >
        <ele-DArrowRight />
      </el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { FormThemeType } from "@/views/formgen/components/GenerateForm/types/form";

const props = defineProps<{
  formThemeConfig: FormThemeType | null;
}>();

const getCoverStyle = computed(() => {
  if (!props.formThemeConfig) {
    return {};
  }
  if (props.formThemeConfig?.enableCover && props.formThemeConfig?.coverType === "color") {
    return {
      backgroundColor: props.formThemeConfig?.coverColor
    };
  } else if (props.formThemeConfig?.enableCover && props.formThemeConfig?.coverType === "img") {
    return {
      backgroundImage: `url(${props.formThemeConfig?.coverImgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    };
  }
  return {};
});

const emit = defineEmits(["close"]);

const handleCloseCover = () => {
  emit("close");
};
</script>

<style scoped lang="scss">
.form-cover-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 9999;
  border-radius: 10px;
}

.cover-title {
  text-align: center;
  width: 80%;
  overflow-wrap: break-word;
  margin: 50px auto;
}

.cover-btn-wrap {
  position: absolute;
  bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  width: 100%;
  overflow: hidden;
}

.cover-scroll-wrap {
  font-weight: bold;
  position: absolute;
  bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
  width: 100%;
}

.scroll-arrow {
  position: absolute;
  width: 100%;
  bottom: 15px;
  animation: move 2s infinite;
  display: flex;
  align-items: center;

  .el-icon {
    margin: 0 auto;
    width: 14px;
    height: 14px;
    transform: rotate(270deg);
  }
}

@keyframes move {
  0% {
    bottom: 15px;
    opacity: 1;
  }

  100% {
    bottom: 60px;
    opacity: 0;
  }
}
</style>
