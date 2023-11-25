<template>
  <div
    class="seal-container"
    ref="sealRef"
    style="--seal-color: #409eff; color: var(--seal-color)"
  >
    <div class="outer-circle">
      <div class="inner-circle">
        <div class="star-row">
          <div class="stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
          </div>
        </div>
        <div class="text-row">{{ name }}</div>
        <div class="star-row">
          <div class="stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="FlowSeal">
import { computed, onMounted, ref, watch } from "vue";
import { useCssVar } from "@vueuse/core";
import { SealColorType } from "@/views/workflow/task/process/types";

const sealRef = ref<HTMLElement | null>(null);

const props = defineProps<{
  colorType: SealColorType;
  size: number;
  name: string;
}>();

// 枚举MAp
const colorMap = new Map<SealColorType, string>([
  [SealColorType.DEFAULT, "#409EFF"],
  [SealColorType.SUCCESS, "#67C23A"],
  [SealColorType.FAIL, "#F56C6C"],
  [SealColorType.WARNING, "#909399"]
]);

onMounted(() => {
  const color = useCssVar("--seal-color", sealRef, { initialValue: colorMap.get(props.colorType) });
  color.value = colorMap.get(props.colorType) || "#409EFF";
});

const sealColor = computed(() => {
  return colorMap.get(props.colorType);
});
</script>
<style scoped lang="scss" var>
.seal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  transform: rotate(-30deg);
}

.inner-circle {
  width: 80px;
  height: 80px;
  border: 1px solid var(--seal-color);
  border-radius: 50%;
  background-color: #fff;
  position: relative;
}

.outer-circle {
  width: 100px;
  height: 100px;
  border: 3px solid var(--seal-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.star-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 33%;
}

.stars {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.star {
  width: 10px;
  height: 10px;
  background-color: var(--seal-color);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  margin: 0 5px;
}

.text-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 33%;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
  color: var(--seal-color);
}
</style>
