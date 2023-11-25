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
    <matrix-option :active-data="activeData" />
    <el-divider>{{ $t("formgen.matrix.optionScore") }}</el-divider>
    <draggable
      :animation="340"
      :list="activeData.options"
      group="selectItem"
      item-key="id"
      handle=".option-drag"
    >
      <template #item="{ element, index }">
        <div class="select-item">
          <div class="select-line-icon option-drag">
            <el-icon>
              <ele-Operation />
            </el-icon>
          </div>
          <el-input
            v-model="element.label"
            placeholder=""
            size="small"
          />
          <el-input-number
            v-model="element.score"
            placeholder=""
            size="small"
            :controls="false"
          />
          <div
            class="close-btn select-line-icon"
            @click="activeData.options.splice(index, 1)"
          >
            <el-icon>
              <ele-Remove />
            </el-icon>
          </div>
        </div>
      </template>
    </draggable>
    <div>
      <el-button
        icon="ele-CirclePlus"
        style="padding-bottom: 0; margin-left: 20px"
        link
        type="primary"
        @click="addSelectItem"
      >
        {{ $t("formgen.option.addOption") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import MatrixOption from "./matrix.vue";
import { i18n } from "@/i18n";
import draggable from "vuedraggable";

export default {
  name: "ConfigItemMatrixDropdown",
  components: {
    MatrixOption,
    draggable
  },
  props: ["activeData"],
  data() {
    return {};
  },
  methods: {
    handleChange() {
      this.activeData.config["defaultValue"] = {};
    },
    addSelectItem() {
      this.activeData.options.push({
        label: i18n.global.t("formgen.option.optionName"),
        score: 1
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options.scss";
</style>
