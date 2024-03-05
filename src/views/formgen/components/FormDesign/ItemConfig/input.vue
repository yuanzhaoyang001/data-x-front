<template>
  <div>
    <el-form-item
      v-if="activeData.prepend !== undefined"
      :label="$t('formgen.input.prefix')"
    >
      <el-input
        v-model="activeData.prepend"
        :placeholder="$t('formgen.input.pleaseChoose')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.append !== undefined"
      :label="$t('formgen.input.suffix')"
    >
      <el-input
        v-model="activeData.append"
        :placeholder="$t('formgen.input.pleaseChoose')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData['prefix-icon'] !== undefined"
      :label="$t('formgen.input.beforeIcon')"
    >
      <el-input
        v-model="activeData['prefix-icon']"
        :placeholder="$t('formgen.input.pleaseChoose')"
      >
        <template #append>
          <el-button
            icon="ele-Pointer"
            @click="openIconsDialog('prefix-icon')"
          >
            {{ $t("formgen.input.choose") }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      v-if="activeData['suffix-icon'] !== undefined"
      :label="$t('formgen.input.afterIcon')"
    >
      <el-input
        v-model="activeData['suffix-icon']"
        :placeholder="$t('formgen.input.pleaseChoose')"
      >
        <template #append>
          <el-button
            icon="ele-Pointer"
            @click="openIconsDialog('suffix-icon')"
          >
            {{ $t("formgen.input.choose") }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      v-if="activeData.autosize !== undefined"
      :label="$t('formgen.input.minLine')"
    >
      <el-input-number
        v-model="activeData.autosize.minRows"
        :min="1"
        :placeholder="$t('formgen.input.minLine')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.autosize !== undefined"
      :label="$t('formgen.input.maxLine')"
    >
      <el-input-number
        v-model="activeData.autosize.maxRows"
        :min="1"
        :placeholder="$t('formgen.input.maxLine')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.maxlength !== undefined"
      :label="$t('formgen.input.maxInput')"
    >
      <el-input
        v-model="activeData.maxlength"
        :placeholder="$t('formgen.input.pleaseInputStrLength')"
      >
        <template #append>{{ $t("formgen.input.strNumber") }}</template>
      </el-input>
    </el-form-item>
    <el-form-item
      v-if="activeData['show-word-limit'] !== undefined"
      :label="$t('formgen.input.inputCount')"
    >
      <template #label>
        <span>
          {{ $t("formgen.input.inputCount") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.input.inputCountTips')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData['show-word-limit']" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.input.dataLink") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.input.dataLinkTips')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-button
        link
        bg
        type="primary"
        icon="ele-Setting"
        @click="$refs.dataLinkConfigRef.showDialog(activeData.config['dataLinkConfig'])"
      >
        {{ $t("formgen.input.dataLinkConfig") }}
      </el-button>
    </el-form-item>
    <el-form-item v-if="activeData.notRepeat !== undefined">
      <template #label>
        <span>
          {{ $t("formgen.input.dataOnlyOne") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.input.dataOnlyOneTips')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.notRepeat" />
    </el-form-item>
    <div
      class="reg-item"
    >
      <el-form-item
        v-if="activeData.config.dataType.change"
        :label="$t('formgen.input.inputTypeCheck')"
      >
        <el-select
          v-model="activeData.config.dataType.type"
          size="small"
          @change="dataTypeChange"
        >
          <el-option
            v-for="option in dataTypeList"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="activeData.config.dataType.type"
        :label="$t('formgen.input.error')"
        style="margin-bottom: 0"
      >
        <el-input
          v-model="activeData.config.dataType.message"
          :placeholder="$t('formgen.input.error')"
        />
      </el-form-item>
    </div>
    <icons-dialog
      :current="activeData[currentIconModel]"
      v-model:visible="iconsVisible"
      @select="setIcon"
    />
    <data-link-config
      ref="dataLinkConfigRef"
      :data="activeData.config?.dataLinkConfig"
      @change="handleDataLinkConfigChange"
    />
  </div>
</template>

<script>
import { i18n } from "@/i18n";
import IconsDialog from "../IconsDialog.vue";
import DataLinkConfig from "./DataLinkConfig.vue";

export default {
  name: "ConfigItemInput",
  components: {
    DataLinkConfig,
    IconsDialog
  },
  props: ["activeData"],
  data() {
    return {
      dataTypeList: [
        {
          value: null,
          label: i18n.global.t("formgen.input.noCheck")
        },
        {
          value: "string",
          label: i18n.global.t("formgen.input.string")
        },
        {
          value: "number",
          label: i18n.global.t("formgen.input.number")
        },
        {
          value: "integer",
          label: i18n.global.t("formgen.input.integer")
        },
        {
          value: "float",
          label: i18n.global.t("formgen.input.float")
        },
        {
          value: "url",
          label: i18n.global.t("formgen.input.url")
        },
        {
          value: "email",
          label: i18n.global.t("formgen.input.email")
        },
        {
          value: "phone",
          label: i18n.global.t("formgen.input.phone")
        },
        {
          value: "identity",
          label: i18n.global.t("formgen.input.identity")
        },
        {
          value: "hex",
          label: i18n.global.t("formgen.input.hex")
        }
      ],
      iconsVisible: false,
      currentIconModel: null
    };
  },
  methods: {
    dataTypeChange(value) {
      this.activeData.config.dataType.message = $t("formgen.input.pleaseInputConfirm")`${
        this.dataTypeList.find(item => item.value === value).label
      }`;
    },
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val;
    },
    handleDataLinkConfigChange(val) {
      this.activeData.config["dataLinkConfig"] = val;
    }
  }
};
</script>
