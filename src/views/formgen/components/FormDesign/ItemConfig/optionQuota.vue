<template>
  <el-dialog
    :close-on-click-modal="false"
    v-model="dialogVisible"
    :title="$t('formgen.optionQuota.title')"
    width="50%"
  >
    <div>
      <p>{{ $t("formgen.optionQuota.desc") }}</p>
      <div
        class="el-form el-form--label-top"
        style="margin-top: 20px"
      >
        <div class="el-form-item">
          <div
            class="el-form-item__label"
            style="display: flex"
          >
            <div style="flex: 1">
              <b>{{ $t("formgen.optionQuota.optionSet") }}</b>
            </div>
            <div>
              <el-popover
                v-model="quotaSettingVisible"
                trigger="click"
                width="300"
              >
                <div>
                  <p>{{ $t("formgen.optionQuota.title") }}</p>
                  <div style="margin: 30px 0">
                    <el-input-number
                      v-model="quota"
                      :min="0"
                      class="w100"
                      placeholder=""
                    ></el-input-number>
                  </div>
                  <div>
                    <div class="el-popconfirm__action">
                      <el-button
                        size="default"
                        type="primary"
                        @click="onQuotaSetting()"
                      >
                        {{ $t("formI18n.all.confirm") }}
                      </el-button>
                      <el-button
                        size="default"
                        @click="quotaSettingVisible = false"
                      >
                        {{ $t("formI18n.all.cancel") }}
                      </el-button>
                    </div>
                  </div>
                </div>
                <template #reference>
                  <el-button
                    link
                    type="primary"
                  >
                    {{ $t("formgen.optionQuota.batchSet") }}
                  </el-button>
                </template>
              </el-popover>
            </div>
          </div>
          <div class="el-form-item__content">
            <el-table
              border
              :data="copyActiveData.config.options"
            >
              <el-table-column
                :label="$t('formgen.optionQuota.optionSet')"
                property="label"
              >
                <template #default="scope">
                  {{ removeHtmlTag(scope.row.label) }}
                </template>
              </el-table-column>
              <el-table-column
                property="quotaSetting"
                :label="$t('formgen.optionQuota.title')"
              >
                <template #default="scope">
                  <el-input-number
                    :min="0"
                    class="w100"
                    v-model="scope.row.quotaSetting"
                    placeholder=""
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('formgen.optionQuota.remainingQuota')"
                property="quotaSetting"
              >
                <template #default="scope">
                  <span v-if="scope.row.quotaSetting">
                    {{ getSurplusQuota(scope.row) }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="el-form-item">
          <div class="el-form-item__label">
            <b>{{ $t("formgen.optionQuota.desc2") }}</b>
            {{ $t("formgen.optionQuota.desc3") }}
          </div>
          <div class="el-form-item__content">
            <el-input v-model="copyActiveData.config.quotaBlankWarning"></el-input>
          </div>
        </div>
        <div class="el-form-item">
          <div class="el-form-item__label">
            <b>{{ $t("formgen.optionQuota.resetQuota") }}</b>
            <el-tooltip
              class="item"
              :content="$t('formgen.optionQuota.content')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
          <div>
            <el-radio-group v-model="copyActiveData.config.quotaCycleRule">
              <el-radio label="fixed">{{ $t("formgen.optionQuota.noReset") }}</el-radio>
              <el-radio label="per_day">{{ $t("formgen.optionQuota.byDay") }}</el-radio>
              <el-radio label="per_week">{{ $t("formgen.optionQuota.byWeek") }}</el-radio>
            </el-radio-group>
            <div>
              <!--              <el-checkbox v-model="copyActiveData.config.quotaRecoverable"-->
              <!--              >删除数据后，选项名额自动恢复-->
              <!--              </el-checkbox-->
              <!--              >-->
            </div>
            <div>
              <el-checkbox v-model="copyActiveData.config.hideChoiceWhenQuotaEmpty">
                {{ $t("formgen.optionQuota.desc4") }}
              </el-checkbox>
            </div>
            <div>
              <el-checkbox v-model="copyActiveData.config.hideQuota">{{ $t("formgen.optionQuota.desc5") }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          size="default"
          @click="dialogVisible = false"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
        <el-button
          type="primary"
          size="default"
          @click="saveQuotaSetting"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="OptionQuota">
import { removeHtmlTag } from "../../../utils";
import { ref, watch } from "vue";
import { useOptionQuota } from "@/views/formgen/components/FormItem/hooks/useOptionQuotaHook";

const props = defineProps({
  activeData: {
    type: Object,
    default: () => ({})
  }
});

const copyActiveData = ref(JSON.parse(JSON.stringify(props.activeData)));
const dialogVisible = ref(false);
const quotaSettingVisible = ref(false);
const quota = ref("");

const optionQuotaHook = useOptionQuota({
  item: props.activeData
});

const { getSurplusQuota } = optionQuotaHook;
watch(
  () => props.activeData,
  val => {
    copyActiveData.value = JSON.parse(JSON.stringify(val));
  },
  { deep: true }
);

const openQuotaSetting = () => {
  dialogVisible.value = true;
  optionQuotaHook.getOptionUsedQuota();
};

const onQuotaSetting = () => {
  props.activeData.config.options.map((e: any) => {
    e.quotaSetting = "";
    return e;
  });
  quotaSettingVisible.value = false;
};

const saveQuotaSetting = () => {
  const copyData = copyActiveData.value;
  props.activeData.config.quotaCycleRule = copyData.config.quotaCycleRule;
  props.activeData.config.hideChoiceWhenQuotaEmpty = copyData.config.hideChoiceWhenQuotaEmpty;
  props.activeData.config.hideQuota = copyData.config.hideQuota;
  props.activeData.config.quotaBlankWarning = copyData.config.quotaBlankWarning;
  props.activeData.config.quotaRecoverable = copyData.config.quotaRecoverable;
  props.activeData.config.options = copyData.config.options;
  dialogVisible.value = false;
};

defineExpose({
  openQuotaSetting
});
</script>
