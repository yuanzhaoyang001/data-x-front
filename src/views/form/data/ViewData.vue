<template>
  <el-form
    ref="form"
    label-width="80px"
    label-position="top"
    class="view-form"
  >
    <div
      v-for="field in tempFields"
      :key="field.value"
    >
      <el-form-item
        v-if="!hiddenFormItemIds.includes(field.value)"
        class="ml15"
      >
        <template #label>
          <label class="field-label">{{ field.label }}</label>
          <div class="exam-wrap"></div>
        </template>
        <template #default>
          <div class="w100">
            <!--  滑动题-->
            <div v-if="field.type === 'SORT'">
              <div v-if="pageFormModel[field.value]">
                <text-copy
                  v-for="sort in pageFormModel[field.value]"
                  :key="sort.value"
                  class="mb5"
                  :text="sort.label"
                />
              </div>
            </div>
            <div v-else-if="field.type === 'UPLOAD'">
              <div v-if="pageFormModel[field.value]">
                <file-list :files="pageFormModel[field.value]" />
              </div>
            </div>
            <div v-else-if="field.type === 'IMAGE_UPLOAD'">
              <div v-if="pageFormModel[field.value]">
                <img-list :image-list="pageFormModel[field.value]" />
              </div>
            </div>
            <div v-else-if="field.type === 'SIGN_PAD'">
              <div v-if="pageFormModel[field.value]">
                <img-list :image-list="[{ url: pageFormModel[field.value] }]" />
              </div>
            </div>
            <div v-else-if="field.type === 'USER_SELECT'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatEmpValue(pageFormModel[field.value])" />
              </div>
            </div>
            <div v-else-if="field.type === 'DEPT_SELECT'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatDeptValue(pageFormModel[field.value])" />
              </div>
            </div>
            <!--  矩阵-->
            <div
              v-else-if="
                field.type === 'MATRIX_INPUT' ||
                field.type === 'MATRIX_SELECT' ||
                field.type === 'MATRIX_SCALE' ||
                field.type === 'MATRIX_SLIDER' ||
                field.type === 'MATRIX_DROPDOWN'
              "
            >
              <div v-if="pageFormModel[field.value]">
                <matrix-view
                  :is-print="isPrint"
                  :matrix-layout="field.scheme.table"
                  :value="pageFormModel[field.value]"
                  :type="field.type"
                />
              </div>
            </div>
            <!--   商品-->
            <div v-else-if="field.type === 'GOODS_SELECT'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatGoodsValue(pageFormModel[field.value], field.scheme)" />
              </div>
            </div>
            <!--   预约-->
            <div v-else-if="field.type === 'RESERVE_DAY'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatReserveValue(pageFormModel[field.value], field.scheme)" />
              </div>
            </div>
            <div v-else-if="field.type === 'RESERVE_TIME_RANGE'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatReserveTimeValue(pageFormModel[field.value], field.scheme)" />
              </div>
            </div>
            <div v-else-if="field.type === 'SUB_FORM'">
              <div v-if="pageFormModel[field.value]">
                <sub-form-view
                  :model="pageFormModel[field.value]"
                  :fields="field.scheme.childList"
                />
              </div>
            </div>
            <!-- 省市区-->
            <div v-else-if="field.type === 'PROVINCE_CITY'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatProvinceValue(pageFormModel[field.value])" />
              </div>
            </div>
            <!-- 省市区-->
            <div v-else-if="field.type === 'CONFIRMATION_CODE'">
              <div v-if="pageFormModel[field.value]">
                <text-copy :text="formatConfirmationCode(pageFormModel[field.value])" />
              </div>
            </div>
            <div
              v-else-if="
                field.type === 'MATRIX_INPUT' ||
                field.type === 'MATRIX_SELECT' ||
                field.type === 'MATRIX_SCALE' ||
                field.type === 'MATRIX_SLIDER' ||
                field.type === 'MATRIX_DROPDOWN' ||
                field.type === 'TABLE_SELECT'
              "
            >
              <div v-if="pageFormModel[field.value]">
                <matrix-view
                  :is-print="isPrint"
                  :matrix-layout="field.scheme.table"
                  :value="pageFormModel[field.value]"
                  :type="field.type"
                />
              </div>
            </div>
            <!-- 人脸-->
            <div
              v-else-if="field.type === 'FACE_IDENTIFY'"
              class="form-item-content"
            >
              <text-copy :text="formatFaceIdentify(pageFormModel[field.value])" />
            </div>
            <!-- 普通显示-->
            <div
              v-else
              class="form-item-content"
            >
              <text-copy :text="formatValue(pageFormModel[field.value])" />
            </div>
          </div>
        </template>
      </el-form-item>
    </div>
  </el-form>
</template>

<script name="ViewData" setup>
import { onBeforeMount, ref, watch } from "vue";
import TextCopy from "./components/TextCopy.vue";
import FileList from "./components/FileList.vue";
import ImgList from "./components/ImgList.vue";
import MatrixView from "./components/MatrixView.vue";
import SubFormView from "./components/SubFormView.vue";
import { getCodeDesc } from "@/views/formgen/components/FormItem/ConfirmationCode/ConfirmationCode";
import { formatFaceIdentify } from "@/views/form/data/table/formatTableColumn";
import { inject } from "vue-demi";
import { getHiddenFormItemIds } from "@/views/formgen/components/BizProjectForm/FormLogic";

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  },
  pageFormModel: {
    type: Object,
    default: () => {}
  },
  isPrint: {
    type: Boolean,
    default: false
  }
});

const tempFields = ref([]);

watch(
  () => props.fields,
  val => {
    tempFields.value = val.filter(item => {
      let bool = /.*\d+.*/g.test(item.value);
      return item.scheme && bool;
    });
  },
  { deep: true, immediate: true }
);

const formLogicData = inject("formLogicData");
const hiddenFormItemIds = ref(null);

watch(
  () => props.pageFormModel,
  () => {
    hiddenFormItemIds.value =
      getHiddenFormItemIds(
        props.pageFormModel,
        formLogicData.value,
        props.fields.map(item => item.scheme).filter(item => item)
      ) || [];
  },
  { deep: true, immediate: true }
);

onBeforeMount(async () => {});

const formatValue = value => {
  if (Array.isArray(value)) {
    return value.join(",");
  }
  return value;
};

const formatEmpValue = value => {
  if (!value) {
    return null;
  }
  return value.map(item => item.nickName).join(",");
};

const formatDeptValue = value => {
  if (!value) {
    return null;
  }
  return value.map(item => item.name).join(",");
};

const formatGoodsValue = (value, field) => {
  let text = "";
  Object.keys(value).forEach(key => {
    let project = field.goodsList.find(row => row.id == key);
    if (project) {
      text += `${project.goodsName}：${value[key]}个 `;
    }
  });
  return text;
};

const formatProvinceValue = value => {
  if (Array.isArray(value)) {
    return value.join(",");
  } else {
    return value["cascadeValue"]?.join(" ") + " " + value["detailAddr"];
  }
};

const formatConfirmationCode = value => {
  return getCodeDesc(value);
};

const formatReserveValue = (value, field) => {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let project = field.reserveProjectList.find(row => row.id == key);
    if (project) {
      text += `${project.name}：${value[key]} `;
    }
  });
  return text;
};

const formatReserveTimeValue = (value, field) => {
  if (!value) {
    return null;
  }
  let text = "";
  Object.keys(value).forEach(key => {
    let project = field.reserveProjectList.find(row => row.id == key);
    if (project) {
      text += `${project.name}：${value[key]} `;
    }
  });
  return text;
};
</script>
<style lang="scss" scoped>
.view-form {
  height: 100%;
  padding-bottom: 90px;
}

.field-label {
  font-size: 18px;
  font-weight: bold;
}
</style>
