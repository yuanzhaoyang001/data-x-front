<template>
  <div class="lottery-config-wrap">
    <el-scrollbar height="70vh">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="default"
      >
        <el-form-item
          :label="$t('form.lottery.name')"
          prop="actName"
        >
          <el-input
            v-model="form.actName"
            :placeholder="$t('form.lottery.namePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('form.lottery.descLabel')">
          <el-input
            v-model="form.description"
            :placeholder="$t('form.lottery.descPlaceholder')"
            type="textarea"
          />
        </el-form-item>
        <el-form-item :label="$t('form.lottery.timeRangeLabel')">
          <el-date-picker
            v-model="form.startDate"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('form.lottery.timeRangeStartPlaceholder')"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
          <el-date-picker
            v-model="form.endDate"
            class="ml10"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('form.lottery.timeRangeEndPlaceholder')"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item :label="$t('form.lottery.actStatusLabel')">
          <el-switch v-model="form.actStatus" />
        </el-form-item>
        <el-form-item
          :label="$t('form.lottery.prizeListLabel')"
          prop="prizeList"
        >
          <div class="text-desc">
            {{ $t("form.lottery.prizeListDesc") }}
          </div>
          <el-table :data="form.drawPrizesList">
            <el-table-column
              :label="$t('form.lottery.prizeName')"
              prop="name"
            />
            <el-table-column
              :label="$t('form.lottery.prizeQuantity')"
              prop="quantity"
            />
            <el-table-column
              :label="$t('form.lottery.prizeWinProbability')"
              prop="winProbability"
            />
            <el-table-column
              :label="$t('form.lottery.opertion')"
              prop="action"
            >
              <template #default="scope">
                <el-button
                  link
                  size="small"
                  type="primary"
                  @click="handleUpdatePrize(scope.row)"
                >
                  {{ $t("common.edit") }}
                </el-button>
                <el-button
                  link
                  size="small"
                  type="danger"
                  @click="handleDeletePrize(scope.$index)"
                >
                  {{ $t("common.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex-center mt10">
            <el-button
              link
              type="primary"
              @click="handleOpenPrize"
            >
              {{ $t("form.lottery.handleOpenPrize") }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('form.lottery.rewardType')"
          prop="rewardType"
        >
          <div class="text-desc">
            {{ $t("form.lottery.rewardTypeDesc") }}
          </div>
          <el-radio-group v-model="form.rewardType">
            <el-radio :label="1">{{ $t("form.lottery.rewardTypeCode") }}</el-radio>
            <el-radio :label="2">{{ $t("form.lottery.rewardTypeInfo") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('form.lottery.extraInfo')">
          <div class="text-desc">{{ $t("form.lottery.extraInfoDesc") }}</div>
          <form-tinymce v-model:value="form.extraInfo.claimInfo" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSaveDrawActivities"
          >
            {{ $t("form.lottery.save") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <el-dialog
      v-model="dialogFormVisible"
      :title="$t('form.lottery.prizeTile')"
      width="30%"
    >
      <el-form
        ref="prizeFormRef"
        :model="prizeForm"
        :rules="prizeRules"
        label-position="top"
        size="default"
      >
        <el-form-item
          :label="$t('form.lottery.prizeName')"
          prop="name"
        >
          <el-input
            v-model="prizeForm.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          :label="$t('form.lottery.prizeImg')"
          prop="image"
        >
          <ImageUpload
            v-model:value="prizeForm.image"
            :limit="1"
          />
        </el-form-item>
        <el-form-item
          :label="$t('form.lottery.prizeWinProbability')"
          prop="winProbability"
        >
          <el-input-number
            v-model="prizeForm.winProbability"
            :max="100"
            :min="0"
          />
          <span class="ml5">%</span>
        </el-form-item>
        <el-form-item
          :label="$t('form.lottery.prizeQuantity')"
          prop="quantity"
        >
          <el-input-number v-model="prizeForm.quantity" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleSavePrize"
          >
            {{ $t("common.enter") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import type { FormRules } from "element-plus";
import { DrawActivities, DrawPrizesEntity, getActivitiesBySource, saveOrUpdateActivities } from "@/api/project/lottery";
import { useRoute } from "vue-router";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";
import { cloneDeep } from "lodash-es";
import { generateId, isNumber } from "@/utils";

const dialogFormVisible = ref(false);
const route = useRoute();

const form = ref<DrawActivities>({
  drawPrizesVoList: [],
  id: null,
  actName: "",
  description: "",
  sourceType: "FORM_LOTTERY",
  sourceId: route.query.key as string,
  drawPrizesList: [],
  actType: 1,
  rewardType: 1,
  startDate: "",
  endDate: "",
  actStatus: true,
  extraInfo: {
    // 领奖信息
    claimInfo: ""
  }
});

const formRef = ref<any>(null);

const handleSaveDrawActivities = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid, fields) => {
    if (valid) {
      form.value.drawPrizesList!.forEach(item => {
        if (!isNumber(item.id)) {
          item.id = null;
        }
      });
      saveOrUpdateActivities(form.value).then(() => {
        getActivitiesData();
        MessageUtil.success(i18n.global.t("common.saveSuccess"));
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const rules = reactive<FormRules<DrawActivities>>({
  actName: [{ required: true, message: i18n.global.t("form.lottery.actNamePlaceholder"), trigger: "blur" }],
  drawPrizesList: [{ required: true, message: i18n.global.t("form.lottery.drawPrizesListPlace"), trigger: "blur" }]
});

const prizeRules = reactive<FormRules<DrawPrizesEntity>>({
  name: [{ required: true, message: i18n.global.t("form.lottery.prizeNamePlaceholder"), trigger: "blur" }],
  image: [{ required: true, message: i18n.global.t("form.lottery.prizeImgPlaceholder"), trigger: "blur" }],
  winProbability: [{ required: true, message: i18n.global.t("form.lottery.prizeWinProbabilityPlaceholder"), trigger: "blur" }],
  quantity: [{ required: true, message: i18n.global.t("form.lottery.prizeQuantityPlaceholder"), trigger: "blur" }]
});

const prizeForm = ref<DrawPrizesEntity>({
  drawActivityId: null,
  extraInfo: null,
  id: null,
  name: "",
  image: "",
  winProbability: null,
  // 数量
  quantity: null
});

const handleOpenPrize = () => {
  dialogFormVisible.value = true;
  prizeForm.value = {
    drawActivityId: null,
    extraInfo: null,
    id: null,
    image: "",
    name: "",
    quantity: null,
    winProbability: null
  };
};

const prizeFormRef = ref<any>(null);

const handleUpdatePrize = (item: DrawPrizesEntity) => {
  prizeForm.value = item;
  dialogFormVisible.value = true;
};

const handleDeletePrize = (index: number) => {
  form.value.drawPrizesList!.splice(index, 1);
};

const handleSavePrize = async () => {
  if (!prizeFormRef.value) return;
  await prizeFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (prizeForm.value.id) {
        const index = form.value.drawPrizesList!.findIndex(item => item.id == prizeForm.value.id);
        if (index > -1) {
          form.value.drawPrizesList![index] = cloneDeep(prizeForm.value);
        }
      } else {
        prizeForm.value.id = generateId();
        form.value.drawPrizesList!.push(cloneDeep(prizeForm.value));
      }
      dialogFormVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const getActivitiesData = () => {
  getActivitiesBySource(form.value.sourceType, form.value.sourceId).then(res => {
    if (res.data) {
      form.value = res.data;
    }
  });
};
onMounted(() => {
  getActivitiesData();
});
</script>

<style lang="scss" scoped>
.text-desc {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>
