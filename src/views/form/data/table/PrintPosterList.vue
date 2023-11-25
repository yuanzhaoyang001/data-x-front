<template>
  <div class="h100">
    <el-dropdown
      trigger="contextmenu"
      ref="dropdownRef"
    >
      <slot>
        <el-button
          text
          type="primary"
          @click="showClick()"
        >
          {{ $t("form.certificateGen.genCertificate") }}
        </el-button>
      </slot>
      <template #dropdown>
        <div class="p10">
          <el-empty
            style="width: 220px"
            v-if="!formPosterList || !formPosterList.length"
          />
          <el-dropdown-menu v-else>
            <el-dropdown-item
              v-for="item in formPosterList"
              :key="item.id"
              @click="handleDownloadPoster(item)"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { DropdownInstance } from "element-plus";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";
import { downloadFormPoster, listFormPoster, PosterEntity } from "@/api/project/poster";

const route = useRoute();

const formPosterList = ref<PosterEntity[]>([]);

const dropdownRef = ref<DropdownInstance>();

onMounted(() => {
  listFormPoster(route.query.key as unknown as string).then(res => {
    formPosterList.value = res.data;
  });
});

const props = defineProps({
  dataIds: {
    type: Array,
    default: () => []
  }
});

const handleDownloadPoster = async (poster: PosterEntity) => {
  if (!props.dataIds || !props.dataIds.length) {
    MessageUtil.error(i18n.global.t("form.formData.selectData"));
    return;
  }
  downloadFormPoster({
    selectedIds: props.dataIds as number[],
    posterKey: poster.posterKey as string
  });
};

function showClick() {
  if (!dropdownRef.value) return;
  dropdownRef.value.handleOpen();
}

defineExpose({
  showClick
});
</script>
<style scoped lang="scss">
.el-dropdown {
  height: 100%;
}

.detail-iframe {
  border: 0;
  width: 100%;
  min-height: 95vh;
}
:deep(.el-dialog__body) {
  padding: 0 10px;
}
</style>
