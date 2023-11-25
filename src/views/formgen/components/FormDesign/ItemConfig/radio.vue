<template>
  <div>
    <config-item-option :active-data="activeData" />
    <el-form-item
      :label="$t('formgen.radio.showVoteResult')"
      v-if="activeData.config.optionType === 'default'"
    >
      <el-switch v-model="activeData.config.showVoteResult" />
    </el-form-item>

    <el-form-item label-width="180px">
      <template #label>
        <span>
          {{ $t("formgen.radio.otherOption") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.radio.content')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.config.otherRequired" />
    </el-form-item>

    <el-form-item :label="$t('formgen.radio.arrangement')">
      <el-radio-group v-model="activeData.config.inline">
        <el-radio-button :label="true">{{ $t("formgen.radio.transverse") }}</el-radio-button>
        <el-radio-button :label="false">{{ $t("formgen.radio.direction") }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('formgen.radio.numberSetting')">
      <div
        class="cp"
        @click="$refs.optionQuotaDialog.openQuotaSetting()"
      >
        <el-button
          type="primary"
          v-if="isQuotaSetting"
        >
          {{ $t("formgen.radio.isSetting") }}
        </el-button>
        <el-button v-else>{{ $t("formgen.radio.notSetting") }}</el-button>
      </div>
    </el-form-item>
    <option-quota
      :active-data="activeData"
      ref="optionQuotaDialog"
    />

    <!--    <el-form-item
					v-if="activeData.config.optionType !== undefined"
					label="选项样式"
				>
					<el-radio-group v-model="activeData.config.optionType">
						<el-radio-button label="default">
							默认
						</el-radio-button>
						<el-radio-button label="button">
							按钮
						</el-radio-button>
					</el-radio-group>
				</el-form-item>-->
  </div>
</template>

<script>
import ConfigItemOption from "./option.vue";
import OptionQuota from "./optionQuota.vue";

export default {
  name: "ConfigItemRadio",
  components: {
    ConfigItemOption,
    OptionQuota
  },
  props: ["activeData"],
  data() {
    return {
      dialogVisible: false,
      quotaSettingVisible: false,
      quota: ""
    };
  },
  computed: {
    isQuotaSetting() {
      const arr = this.activeData.config.options.filter(e => {
        return typeof e.quotaSetting === "number";
      });
      return arr.length;
    }
  },
  created() {
    if (!Object.hasOwnProperty.call(this.activeData.config, "withExclusiveChoice")) {
      this.activeData.config.withExclusiveChoice = false;
      this.activeData.config.exclusiveChoiceApiCodes = [];
      this.activeData.config.quotaBlankWarning = "";
      this.activeData.config.quotaCycleRule = "fixed";
      this.activeData.config.hideQuota = false;
      this.activeData.config.hideChoiceWhenQuotaEmpty = false;
      this.activeData.config.quotaRecoverable = true;
    }
  },
  methods: {
    onQuotaSetting() {
      const { quota } = this;
      this.activeData.config.options.map(e => {
        e.quota = quota;
        e.quotaSetting = quota;
        return e;
      });
      this.quotaSettingVisible = false;
    },
    onChangeQuota(scope) {
      scope.row.quota = scope.row.quotaSetting;
    }
  }
};
</script>
