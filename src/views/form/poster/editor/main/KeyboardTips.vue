<template>
  <el-dialog
    v-model="dialogVisible"
    title="键盘快捷建"
    draggable
    @close="handleClose"
  >
    <table>
      <tr>
        <th>{{ $t("form.formPoster.function") }}</th>
        <th>{{ $t("form.formPoster.windowsSystem") }}</th>
        <th>{{ $t("form.formPoster.macSystem") }}</th>
      </tr>
      <tr>
        <th>{{ $t("form.formPoster.copy") }}</th>
        <td>Ctrl + C</td>
        <td>Command + C</td>
      </tr>
      <tr>
        <th>{{ $t("form.formPoster.paste") }}</th>
        <td>Ctrl + V</td>
        <td>Command + V</td>
      </tr>
      <tr>
        <th>{{ $t("form.formPoster.undo") }}</th>
        <td>Ctrl + Z</td>
        <td>Command + Z</td>
      </tr>
      <tr>
        <th>{{ $t("form.formPoster.redo") }}</th>
        <td>Ctrl + Y</td>
        <td>Command + Shift + Z</td>
      </tr>
      <tr>
        <th>{{ $t("form.formPoster.delete") }}</th>
        <td>Del</td>
        <td>Del</td>
      </tr>
      <tr>
        <th>{{ $t("form.formPoster.move1px") }}</th>
        <th>{{ $t("form.formPoster.upDownKey") }}</th>
        <th>{{ $t("form.formPoster.upDownKey") }}</th>
      </tr>
    </table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { UPDATE_MODEL_EVENT } from "@/utils/constants";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});
const dialogVisible = ref(props.modelValue);
watch(
  () => props.modelValue,
  val => {
    dialogVisible.value = val;
  }
);

const emits = defineEmits([UPDATE_MODEL_EVENT]);

const handleClose = () => {
  emits(UPDATE_MODEL_EVENT, false);
};
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  width: 100%;
  border: var(--el-border);
  margin-bottom: 20px;
}
table th {
  border-collapse: collapse;
  border-right: var(--el-border);
  border-bottom: var(--el-border);
  background-color: var(--el-color-primary-light-8);
  padding: 8px 9px;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
}
table td {
  border-collapse: collapse;
  border-right: var(--el-border);
  border-bottom: var(--el-border);
  padding: 8px 9px;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  word-break: break-all;
}

table tr:last-child td {
  border-bottom: none;
}
table tr:nth-child(odd) {
  background-color: #ffffff !important;
}
table tr:nth-child(even) {
  background-color: #f8f8f8 !important;
}
</style>
