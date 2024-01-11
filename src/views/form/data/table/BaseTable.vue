<template>
  <div>
    <vxe-grid
      v-bind="gridOptions"
      ref="xGrid"
      @cell-click="
        $event => {
          emits('cell-click', $event);
        }
      "
      @cell-menu="
        $event => {
          $emit('cell-menu', $event);
        }
      "
      @menu-click="
        $event => {
          $emit('menu-click', $event);
        }
      "
    >
      <template #toolbar_buttons>
        <slot name="toolbar" />
      </template>
      <template #toolbar_tools>
        <slot name="tools" />
      </template>
      <template #operate="{ row }">
        <slot
          name="operate"
          :row="row"
        />
      </template>

      <!--自定义空数据模板-->
      <template #empty>
        <el-empty :description="$t('formI18n.all.nodata')" />
      </template>
      <!--      图片上传自定义列显示-->
      <template #img_default="{ row, column }">
        <div @click.stop>
          <el-image
            v-for="img in row[column.property]"
            :key="img.url"
            style="width: 45px; height: 45px"
            :src="img.url"
            fit="contain"
            :preview-src-list="getImgPreviewList(row[column.property])"
          />
        </div>
      </template>
      <!--  文件上传自定义列显示  -->
      <template #file_default="{ row, column }">
        <a
          v-for="file in row[column.property]"
          :key="file.url"
          :href="file.url"
          target="_blank"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="file.name"
            placement="top-start"
          >
            <el-icon size="20">
              <ele-Paperclip />
            </el-icon>
          </el-tooltip>
        </a>
      </template>
      <!--      手写签名-->
      <template #signpad_default="{ row, column }">
        <div v-if="row[column.property]">
          <el-image
            style="width: 45px; height: 45px"
            :src="row[column.property]"
            fit="contain"
          />
        </div>
        <div v-else></div>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup name="BaseTable">
import app from "@/main";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { i18n } from "@/i18n";
import { Local } from "@/utils/storage";
import { useRoute } from "vue-router";

app.use(VXETable);

const xGrid = ref(null);

const props = defineProps({
  gridOptions: {
    type: Object,
    default: () => ({})
  }
});

const emits = defineEmits(["cell-click", "cell-menu", "menu-click"]);
const getXGrid = () => {
  return xGrid.value;
};
const exportMsg = () => {
  VXETable.modal.message({
    content: i18n.global.t("form.formData.downloadIng"),
    status: "loading",
    duration: -1,
    id: "export-loading"
  });
};
const endExportMsg = () => {
  VXETable.modal.close("export-loading");
  VXETable.modal.message({ content: i18n.global.t("formI18n.all.success"), status: "success" });
};
const getImgPreviewList = arr => {
  return arr.map(e => {
    return e.url;
  });
};

onMounted(() => {
  window.addEventListener("beforeunload", () => {
    handleSaveFixedCol();
  });
});

const route = useRoute();

const handleSaveFixedCol = () => {
  let key = route.query.key || route.params.key;
  const fixedCols = xGrid.value
    .getColumns()
    .filter(item => item.fixed)
    .map(item => {
      return { field: item.field, fixed: item.fixed };
    });
  Local.set("fixedCols-" + key, fixedCols);
};

// 组件被销毁时 保存固定列
onBeforeUnmount(() => {
  handleSaveFixedCol();
  window.addEventListener("beforeunload", () => {});
});

defineExpose({
  exportMsg,
  endExportMsg,
  getXGrid
});
</script>
