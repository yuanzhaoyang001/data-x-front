<template>
  <div>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.matrix.organization") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.matrix.content')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.isSelectOrganization" />
    </el-form-item>
    <el-form-item
      v-if="activeData.min !== undefined"
      :label="$t('formgen.number.minValue')"
    >
      <el-input-number
        v-model="activeData.min"
        :min="1"
        :max="activeData.max"
        :label="$t('formgen.number.maxValue')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.max"
      :label="$t('formgen.number.maxValue')"
    >
      <el-input-number
        v-model="activeData.max"
        :min="activeData.min"
        :label="$t('formgen.number.maxValue')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.matrix.unit')">
      <el-input
        v-model="activeData.unit"
        :placeholder="$t('formgen.matrix.unit')"
      />
    </el-form-item>
    <matrix-option :active-data="activeData" />
  </div>
</template>

<script>
import MatrixOption from "./matrix.vue";
import draggable from "vuedraggable";

export default {
  name: "ConfigItemMatrixSlider",
  components: {
    MatrixOption,
    draggable
  },
  props: ["activeData"],
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
