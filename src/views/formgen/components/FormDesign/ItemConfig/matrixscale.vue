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
    <el-form-item :label="$t('formgen.npsConfig.number')">
      <el-input-number
        v-model="activeData.table.level"
        :min="1"
        :max="100"
        label=""
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.table.copyWriting"
      :label="$t('formgen.npsConfig.minText')"
    >
      <el-input
        v-model="activeData.table.copyWriting.min"
        :placeholder="$t('formgen.npsConfig.minText')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.table.copyWriting"
      :label="$t('formgen.npsConfig.maxText')"
    >
      <el-input
        v-model="activeData.table.copyWriting.max"
        :placeholder="$t('formgen.npsConfig.maxText')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.matrix.icon')">
      <span
        v-for="icon in iconList"
        :key="icon"
        :class="[icon, icon === activeData.icon ? 'selected' : '']"
        :style="styleObject"
        @click="handleSelectIcon(icon)"
      />
    </el-form-item>

    <el-form-item :label="$t('formgen.matrix.iconColor')">
      <el-color-picker v-model="activeData.iconColor" />
    </el-form-item>

    <matrix-option :active-data="activeData" />
  </div>
</template>

<script>
import MatrixOption from "./matrix.vue";
import draggable from "vuedraggable";

export default {
  name: "ConfigItemMatrixScale",
  components: {
    MatrixOption,
    draggable
  },
  props: ["activeData"],
  data() {
    return {
      iconList: ["tduck-taiyang", "tduck-biaoqing-weixiao", "tduck-dianzan", "tduck-aixin", "tduck-star", "tduck-moonyueliang"]
    };
  },
  computed: {
    styleObject() {
      return {
        "--color": this.activeData.iconColor || "#f7ba2a"
      };
    }
  },
  methods: {
    handleSelectIcon(icon) {
      // console.log(icon)
      this.activeData["icon"] = icon;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../FormItem/MatrixScale/icon/iconfont.css";

[class^="tduck-"],
[class*=" tduck-"] {
  margin: 5px;

  &:hover {
    color: var(--color);
  }
}

.selected {
  color: var(--color);
}
</style>
