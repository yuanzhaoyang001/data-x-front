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
    <el-form-item :label="$t('formgen.radio.scoreSetting')">
      <div
        class="cp"
        @click="$refs.optionScoreDialog.openQuotaSetting()"
      >
        <el-button
          v-if="isScoreSetting"
          type="primary"
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
    <option-score
      ref="optionScoreDialog"
      :active-data="activeData"
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
export default {
  name: "ConfigItemRadio"
};
</script>

<script name="ConfigItemRadio" setup>
import ConfigItemOption from "./option.vue";
import OptionQuota from "./optionQuota.vue";
import OptionScore from "./optionScore.vue";
import { computed, onBeforeMount } from "vue";

const props = defineProps({
  activeData: {
    type: Object,
    default() {
      return {};
    }
  }
});

const isQuotaSetting = computed(() => {
  const arr = props.activeData.config.options.filter(e => {
    return typeof e.quotaSetting === "number";
  });
  return arr.length;
});

const isScoreSetting = computed(() => {
  const arr = props.activeData.config.options.filter(e => {
    return typeof e.score === "number";
  });
  return arr.length;
});

onBeforeMount(() => {
  console.log(props.activeData);
  if (!Object.hasOwnProperty.call(props.activeData.config, "withExclusiveChoice")) {
    props.activeData.config.withExclusiveChoice = false;
    props.activeData.config.exclusiveChoiceApiCodes = [];
    props.activeData.config.quotaBlankWarning = "";
    props.activeData.config.quotaCycleRule = "fixed";
    props.activeData.config.hideQuota = false;
    props.activeData.config.hideChoiceWhenQuotaEmpty = false;
    props.activeData.config.quotaRecoverable = true;
  }
});
</script>
