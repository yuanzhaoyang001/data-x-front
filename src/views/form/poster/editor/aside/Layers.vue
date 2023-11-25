<template>
  <div class="layers-container">
    <div class="sub-title">
      {{ $t("form.formPoster.layers") }}
    </div>
    <div
      class="layers-list-wrap"
      v-if="posterWidgetList && posterWidgetList.length"
    >
      <div
        class="layers-item"
        :class="selectedWidget && selectedWidget.id === w.id ? 'active' : ''"
        v-for="(w, index) in posterWidgetList"
        :key="w.id"
        @click="handleSelect(w)"
      >
        <div>
          <span>
            {{ index + 1 }}
          </span>
          {{ w.name ? w.name : $t("form.formPoster.unnamed") }}
        </div>
        <el-icon @click="handleDelete(w)"><ele-Delete /></el-icon>
      </div>
    </div>
    <el-empty />
  </div>
</template>

<script setup lang="ts" name="Layers">
import { usePosterStore } from "@/stores/formPoster";
import { storeToRefs } from "pinia";

const posterStore = usePosterStore();

const { posterWidgetList, selectedWidget } = storeToRefs(posterStore);

const handleSelect = (w: any) => {
  w.active = true;
  posterStore.activePosterWidget(w);
};

const handleDelete = (w: any) => {
  posterStore.deletePosterWidget(w);
};
</script>

<style scoped lang="scss">
.layers-container {
  padding: 5px;
  max-height: 100%;
  overflow: auto;
}

.sub-title {
  font-size: 16px;
  margin-top: 10px;
}

.layers-list-wrap {
  background-color: var(--el-bg-color-overlay);
  .layers-item {
    padding: 10px;
    margin: 10px;
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    user-select: none;
    border: var(--el-border-base);
    background-color: var(--el-fill-color-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    span:first-child {
      font-size: 13px;
    }

    .el-icon {
      cursor: pointer;
      user-select: none;
      color: var(--el-color-danger);
    }

    &:hover {
      background-color: var(--el-fill-color);
    }
  }
  .active {
    background-color: var(--el-fill-color);
  }
}
</style>
