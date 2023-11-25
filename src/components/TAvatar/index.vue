<template>
  <div class="avatar-wrap">
    <el-avatar
      :size="size"
      :src="url"
      v-if="url"
    />
    <div
      v-else
      class="default-avtar-wrap"
      :style="{ height: `${size}px`, width: `${size}px` }"
    >
      <p :style="{ fontSize: `${size}` }">
        {{ getFirst }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts" name="TAvatar">
import { computed } from "vue";

interface Props {
  size: number;
  url?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
  name: "TAvatar"
});

const getFirst = computed(() => {
  return props.name && props.name.substring(0, 1);
});
</script>

<style scoped lang="scss">
.avatar-wrap {
}

.default-avtar-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  border-radius: 50%;
}
</style>
