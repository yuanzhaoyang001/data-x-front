<template>
  <div>
    <config-item-option :active-data="activeData" />
    <el-form-item
      :label="$t('formgen.checkBox.showVote')"
      v-if="activeData.config.optionType === 'default'"
    >
      <el-switch v-model="activeData.config.showVoteResult" />
    </el-form-item>

    <el-form-item label-width="180px">
      <template #label>
        <span>
          {{ $t("formgen.checkBox.otherOption") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.checkBox.content')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>

      <el-switch v-model="activeData.config.otherRequired" />
    </el-form-item>

    <el-form-item :label="$t('formgen.checkBox.leastSelect')">
      <template #label>
        <span>
          {{ $t("formgen.checkBox.leastSelect") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.checkBox.leastDesc')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-input-number
        :min="0"
        v-model="activeData.min"
        placeholder=""
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.checkBox.mostSelect')">
      <el-input-number
        :min="0"
        v-model="activeData.max"
        placeholder=""
      />
    </el-form-item>

    <el-form-item :label="$t('formgen.checkBox.arrangement')">
      <el-radio-group v-model="activeData.config.inline">
        <el-radio-button :label="true">{{ $t("formgen.checkBox.transverse") }}</el-radio-button>
        <el-radio-button :label="false">{{ $t("formgen.checkBox.direction") }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <!--    <el-form-item
					v-if="activeData.config.optionType !== undefined"
					label="选项样式"
				>
					<el-radio-group v-model="activeData.config.optionType">
						<el-radio-button label="default"> 默认 </el-radio-button>
						<el-radio-button label="button"> 按钮 </el-radio-button>
					</el-radio-group>
				</el-form-item>-->

    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.checkBox.mutualExclusion") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.checkBox.mutualExclusionDesc')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.config.withExclusiveChoice" />
    </el-form-item>

    <el-form-item
      class="exclusive-choice-api-codes"
      v-if="activeData.config.withExclusiveChoice"
    >
      <el-select
        v-model="activeData.config.exclusiveChoiceApiCodes"
        multiple
        placeholder=""
      >
        <el-option
          v-for="item in activeData.config.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('formgen.checkBox.numberSetting')">
      <div
        class="cp"
        @click="$refs.optionQuotaDialog.openQuotaSetting()"
      >
        <el-button
          type="primary"
          v-if="isQuotaSetting"
        >
          {{ $t("formgen.checkBox.isSetting") }}
        </el-button>
        <el-button v-else>{{ $t("formgen.checkBox.notSetting") }}</el-button>
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
  </div>
</template>

<script>
export default {
  name: "ConfigItemCheckbox"
};
</script>

<script name="ConfigItemCheckbox" setup>
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
<style lang="scss" scoped>
.exclusive-choice-api-codes {
  :deep(.el-form-item__content) {
    margin-left: 0 !important;

    .el-select {
      width: 100%;
    }
  }
}
</style>
