<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    draggable
    :title="$t('formgen.input.dataLinkSettingTitle')"
    width="50%"
  >
    <el-link
      :underline="false"
      icon="ele-CirclePlus"
      size="mini"
      type="primary"
      class="mb10 ml10"
      @click="handleAddDrawQuestionRule"
    >
      {{ $t("formgen.input.dataLinkSettingAddText") }}
    </el-link>
    <div
      v-for="(item, index) in dataLinkRuleList"
      :key="index"
      class="item-wrap"
    >
      <el-row
        align="middle"
        class="mt10"
        justify="center"
      >
        <el-col :span="4">
          {{ $t("formgen.input.dataLinkSettingLabel1") }}
        </el-col>
        <el-col :span="4">
          <el-select-v2
            @change="(val: string) => handleFormKeyChange(val, item)"
            v-model="item.linkFormKey"
            :options="allForms"
            :placeholder="$t('formgen.input.pleaseChoose')"
          />
        </el-col>
        <el-col
          :span="3"
          class="ml10"
        >
          {{ $t("formgen.input.dataLinkSettingLabel2") }}
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="item.linkFormItemId"
            size="small"
          >
            <el-option
              v-for="fItem in formItemListMap[item.linkFormKey as string]"
              :key="fItem.value"
              :label="fItem.label"
              :value="fItem.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col
          :span="4"
          class="ml10"
        >
          {{ $t("formgen.input.unionThisLabel") }}
          <el-icon
            class="cursor-pointer"
            color="#F56C6C"
            @click="handleDeleteDrawQuestionRule(index)"
          >
            <ele-Remove />
          </el-icon>
        </el-col>
      </el-row>
      <el-row
        align="middle"
        class="mt10"
        justify="center"
        v-for="(linage, lIndex) in item.linkageConfigList"
        :key="lIndex"
      >
        <el-col :span="4">
          {{ $t("formgen.input.dataLinkSettingLabel3") }}
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="linage.originFormItemId"
            size="small"
          >
            <el-option
              v-for="fItem in formItemListMap[item.linkFormKey as string]"
              :key="fItem.value"
              :label="fItem.label"
              :value="fItem.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col
          :span="3"
          class="ml10"
        >
          {{ $t("formgen.input.dataLinkSettingLabel4") }}
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="linage.targetFormItemId"
            size="small"
          >
            <el-option
              v-for="cItem in currentFormItemList"
              :key="cItem.value"
              :label="cItem.label"
              :value="cItem.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-icon
            class="cursor-pointer"
            color="#F56C6C"
            @click="item.linkageConfigList.splice(lIndex, 1)"
          >
            <ele-Remove />
          </el-icon>
        </el-col>
      </el-row>
      <div class="flex-center mt20">
        <el-link
          icon="ele-Plus"
          :underline="false"
          type="primary"
          @click="handleAddLinkageConfig(item)"
        >
          {{ $t("formgen.input.dataLinkSettingAddRuleText") }}
        </el-link>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("common.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          {{ $t("common.enter") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="DataLinkConfig" setup>
import { onMounted, ref } from "vue";
import { FormRey, getMyHasPermissionRequest, listProjectItemRequest } from "@/api/project/form";
import { ResultData } from "@/api/types";
import { useRoute } from "vue-router";

const dialogFormVisible = ref(false);

interface LinkageConfig {
  // 原来表单的题目
  originFormItemId: string | null;
  // 目标的题目
  targetFormItemId: string | null;
}

interface DataLinkRuleType {
  // 关联项目key
  linkFormKey: string | null;
  //  题目类型
  linkFormItemId: string | null;
  // 联动到本表单的配置
  linkageConfigList: LinkageConfig[];
}

const dataLinkRuleList = ref<DataLinkRuleType[]>([
  {
    linkFormKey: null,
    linkFormItemId: null,
    linkageConfigList: []
  }
]);

const handleAddDrawQuestionRule = () => {
  // 获取最后一条数据
  dataLinkRuleList.value.push({
    linkFormKey: null,
    linkFormItemId: null,
    linkageConfigList: []
  });
};

const handleDeleteDrawQuestionRule = (index: number) => {
  dataLinkRuleList.value.splice(index, 1);
};

const formKey = useRoute().query.key as string;

interface Option {
  value: string;
  label: string;
}

interface OptionListMap {
  [key: string]: Option[];
}

// 全部题目
const allForms = ref<Option[]>([]);
const formItemListMap = ref<OptionListMap>({});
// 当前表单的题目
const currentFormItemList = ref<Option[]>([]);

onMounted(async () => {
  getMyHasPermissionRequest().then((res: ResultData<FormRey[]>) => {
    if (res.data) {
      allForms.value = res.data.map(item => {
        return {
          label: item.textName || "",
          value: item.formKey
        };
      });
    }
  });
});

const handleFormKeyChange = (val: string, item: DataLinkRuleType) => {
  item.linkFormItemId = null;
  item.linkageConfigList = [
    {
      originFormItemId: null,
      targetFormItemId: null
    }
  ];
  getFormItems(item.linkFormKey as string);
};

const getFormItems = (formKey: string) => {
  listProjectItemRequest({ key: formKey }).then((res: any) => {
    if (res.data) {
      formItemListMap.value[formKey] = res.data
        .filter((item: any) => item.type === "INPUT")
        .map((item: any) => {
          return {
            label: item.textLabel,
            value: item.formItemId
          };
        });
    }
  });
};

const handleAddLinkageConfig = (item: DataLinkRuleType) => {
  item.linkageConfigList.push({
    originFormItemId: null,
    targetFormItemId: null
  });
};

const emit = defineEmits(["change"]);

const submitForm = async () => {
  dialogFormVisible.value = false;
  emit(
    "change",
    dataLinkRuleList.value.filter(
      (item: DataLinkRuleType) => item.linkFormKey && item.linkFormItemId && item.linkageConfigList.length
    )
  );
};

const showDialog = async (ruleList: DataLinkRuleType[]) => {
  if (ruleList && ruleList.length) {
    for (let dataLinkRuleType of ruleList) {
      getFormItems(dataLinkRuleType.linkFormKey as string);
    }
    dataLinkRuleList.value = ruleList;
  }
  // 当前表单的题目
  listProjectItemRequest({ key: formKey }).then((res: any) => {
    if (res.data) {
      currentFormItemList.value = res.data
        .filter((item: any) => item.type === "INPUT")
        .map((item: any) => {
          return {
            label: item.textLabel,
            value: item.formItemId
          };
        });
    }
  });
  dialogFormVisible.value = true;
};

defineExpose({ showDialog });
</script>
<style scoped lang="scss">
.item-wrap {
  background-color: var(--el-color-primary-light-10);
  padding: 10px;
  border-radius: var(--el-border-radius-base);
  border-bottom: var(--el-border);
  margin-bottom: 6px;
}
</style>
