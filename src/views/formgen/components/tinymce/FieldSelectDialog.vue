<template>
  <!--  写一个dialog-->
  <el-dialog
    v-if="dialogVisible"
    v-model="dialogVisible"
    append-to-body
    title="关联字段"
    width="30%"
  >
    <div
      class="desc-text"
      style="margin-bottom: 10px"
    >
      请选择一个您需要进行关联的组件，最终将在标题中展示改组件选中的值，例如：您喜欢吃的水果(变量：水果组件值)
    </div>
    <el-row
      align="middle"
      justify="center"
      class="m10"
    >
      <el-col :span="6">关联表单组件</el-col>
      <el-col :span="12">
        <el-select
          v-model="field"
          placeholder="请选择显示字段"
          value-key="formItemId"
        >
          <el-option
            v-for="item in allFields"
            :key="item.formItemId"
            :label="item.textLabel"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="6">选中的值</el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup name="FieldSelectDialog">
import { listProjectItemRequest } from "@/api/project/form";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
  formItemId: {
    type: String,
    default: ""
  }
});
const emits = defineEmits(["submit"]);

defineExpose({
  open
});
// 定义ref导出的方法

const allFields = ref([]);
const formKey = ref("");
const field = ref(null);
const dialogVisible = ref(false);

function open() {
  formKey.value = route.query.key;
  dialogVisible.value = true;
  listProjectItemRequest({ key: formKey.value }).then(res => {
    allFields.value = res.data.filter(item => {
      return item.type !== "PAGINATION" && props.formItemId !== item.formItemId;
    });
  });
}

function handleSubmit() {
  emits(
    "submit",
    `<formvariable contenteditable="false" fieldid="${field.value.formItemId}">${field.value.textLabel}</formvariable>`
  );
  dialogVisible.value = false;
}
</script>

<style lang="scss" scoped>
.item-select {
  margin-top: 5px;
}
</style>
