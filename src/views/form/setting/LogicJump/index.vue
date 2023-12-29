<template>
  <div>
    <div class="desc-text mb10">{{ $t("form.setting.settingDesc") }}</div>
    <div class="flex">
      <el-button
        type="primary"
        @click="addLogic"
      >
        {{ $t("form.setting.addLogicBtn") }}
      </el-button>
    </div>
    <div
      v-for="(jumpLogicItem, sIndex) in commitJumpLogicList"
      :key="sIndex"
      class="logic-item"
    >
      <div class="close-wrap">
        <el-button
          class="text-danger"
          link
          type="primary"
          @click="handelDeleteLogic(sIndex)"
        >
          <el-icon class="remove rotate">
            <ele-CircleClose />
          </el-icon>
        </el-button>
      </div>
      <el-card class="logic-card">
        <el-row
          v-for="(item, index) in jumpLogicItem.logicList"
          :key="index"
          :gutter="10"
          align="middle"
          class="mt20"
          justify="center"
          type="flex"
        >
          <el-col :span="4">
            <div v-if="index === 0">{{ $t("form.setting.ifLabel") }}</div>
            <div v-else>
              <el-select
                v-model="item.relation"
                :disabled="index !== 1"
                @change="val => handleRelationChange(val, sIndex)"
              >
                <el-option
                  :label="$t('form.setting.andLabel')"
                  value="AND"
                />
                <el-option
                  :label="$t('form.setting.orLabel')"
                  value="OR"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="item.formItemId"
              :placeholder="$t('form.setting.selectPlaceholder')"
              @change="handleFormTypeChange(item)"
            >
              <el-option
                v-for="projectItem in allProjectItemList"
                :key="projectItem.id"
                :label="projectItem.textLabel"
                :value="projectItem.formItemId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="item.expression"
              :placeholder="$t('form.setting.selectPlaceholder')"
              @change="handleExpressionChange(item)"
            >
              <el-option
                v-if="basicTypes.includes(item.type)"
                :label="$t('form.setting.equalsLabel')"
                value="eq"
              ></el-option>
              <el-option
                v-if="basicTypes.includes(item.type)"
                :label="$t('form.setting.notEqualsLabel')"
                value="ne"
              ></el-option>
              <el-option
                v-if="numValTypes.includes(item.type)"
                :label="$t('form.setting.greaterThanLabel')"
                value="gt"
              ></el-option>
              <el-option
                v-if="numValTypes.includes(item.type)"
                :label="$t('form.setting.lessThanLabel')"
                value="lt"
              ></el-option>
              <el-option
                v-if="numValTypes.includes(item.type)"
                :label="$t('form.setting.greaterThanOrEqualsLabel')"
                value="ge"
              ></el-option>
              <el-option
                v-if="numValTypes.includes(item.type)"
                :label="$t('form.setting.lessThanOrEqualsLabel')"
                value="le"
              ></el-option>
              <el-option
                :label="$t('form.setting.containsLabel')"
                value="ct"
                v-if="['INPUT', 'TEXTAREA', 'CHECKBOX'].includes(item.type)"
              ></el-option>
              <el-option
                :label="$t('form.setting.notContainsLabel')"
                value="nc"
                v-if="['INPUT', 'TEXTAREA', 'CHECKBOX'].includes(item.type)"
              ></el-option>
              <el-option
                :label="$t('form.setting.isEmptyLabel')"
                value="null"
              ></el-option>
              <el-option
                :label="$t('form.setting.isNotEmptyLabel')"
                value="notnull"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <div :class="[item.expression === 'null' || item.expression === 'notnull' ? 'disable' : '']">
              <el-input
                v-if="['INPUT', 'TEXTAREA', 'NUMBER', 'RATE', 'SLIDER'].includes(item.type)"
                v-model="item.optionValue"
                :placeholder="$t('form.setting.inputPlaceholder')"
              ></el-input>
              <el-date-picker
                v-else-if="item.type === 'DATE'"
                v-model="item.optionValue"
                class="width100"
                format="YYYY-MM-DD"
                :placeholder="$t('form.setting.datePlaceholder')"
                type="date"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
              <FormOptionSelect
                class="width100"
                v-else
                v-model="item.optionValue"
                allow-create
                clearable
                default-first-option
                filterable
                :item="getFormItem(item.formItemId)"
              ></FormOptionSelect>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="icon-box">
              <el-button
                link
                type="primary"
                @click="handelAddLogicList(sIndex)"
              >
                <el-icon size="18">
                  <ele-CirclePlus />
                </el-icon>
              </el-button>
              <el-button
                v-if="index !== 0"
                link
                type="primary"
                @click="handelDeleteLogicList(sIndex, index)"
              >
                <el-icon
                  class="remove text-danger"
                  size="18"
                >
                  <ele-Remove />
                </el-icon>
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          class="mt10"
          align="middle"
          justify="center"
        >
          <el-col :span="3">
            <el-select v-model="jumpLogicItem.promptJump.promptJumpType">
              <el-option
                :label="$t('form.setting.promptLabel')"
                value="prompt"
              />
              <el-option
                :label="$t('form.setting.jumpLabel')"
                value="jump"
              />
            </el-select>
          </el-col>
          <el-col :span="13"></el-col>
          <el-col :span="8">
            <el-button
              v-if="jumpLogicItem.promptJump.promptJumpType === 'prompt' && formInfoStore.formType === 4"
              icon="ele-StarFilled"
              text
              type="primary"
              @click="handleInsertScore(sIndex)"
            >
              {{ $t("form.setting.insertScore") }}
            </el-button>
            <el-dropdown
              ref="dropdownRef"
              trigger="click"
            >
              <el-button
                icon="ele-Picture"
                text
                type="primary"
              >
                {{ $t("form.setting.insertPoster") }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in formPosterList"
                    :key="item.id"
                    @click="handlePosterInsertImg(sIndex, item)"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-input
              v-if="jumpLogicItem.promptJump.promptJumpType === 'jump'"
              v-model="jumpLogicItem.promptJump.promptJumpContent"
              :placeholder="$t('form.setting.promptPlaceholder')"
            ></el-input>
          </el-col>
        </el-row>
        <div
          class="tinymce-edit"
          v-if="jumpLogicItem.promptJump.promptJumpType === 'prompt'"
        >
          <form-tinymce
            toolbar="styleselect fontsizeselect bold italic underline strikethrough undo redo  blockquote removeformat alignleft aligncenter alignright  subscript superscript  hr bullist numlist link image charmap preview  pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen "
            v-model:value="jumpLogicItem.promptJump.promptJumpContent"
            :ref="(el: any) => (tinymceRefs[sIndex] = el)"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" name="LogicJump" setup>
import { nextTick, onMounted, ref } from "vue";
import { listProjectItemRequest } from "@/api/project/form";
import FormOptionSelect from "@/views/components/FormOptionSelect/index.vue";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { useRoute } from "vue-router";
import { useFormInfo } from "@/stores/formInfo";
import { listFormPoster, PosterEntity } from "@/api/project/poster";

const allProjectItemList = ref<any[]>([]);
const basicTypes = ref([
  "NUMBER",
  "RATE",
  "SLIDER",
  "DATE",
  "INPUT",
  "TEXTAREA",
  "RADIO",
  "IMAGE_SELECT",
  "SELECT",
  "FUNCTION_CALC"
]);
const numValTypes = ref(["NUMBER", "RATE", "SLIDER", "DATE", "FUNCTION_CALC"]);
const commitJumpLogicList = ref([
  {
    promptJump: {
      promptJumpContent: "",
      promptJumpType: "prompt"
    },
    logicList: [
      {
        formItemId: null,
        relation: "",
        expression: "",
        optionValue: "",
        type: ""
      }
    ]
  }
]);

const tinymceRefs = ref<any[]>([]);

const formKey = ref("");

const route = useRoute();

const props = defineProps({
  submitSettingForm: {
    type: Object
  }
});

const formPosterList = ref<PosterEntity[]>([]);

onMounted(() => {
  formKey.value = route.query.key as string;
  queryProjectItems();
  if (props.submitSettingForm!.commitJumpLogicList && props.submitSettingForm!.commitJumpLogicList.length > 0) {
    // JSON deep copy to avoid reference
    commitJumpLogicList.value = JSON.parse(JSON.stringify(props.submitSettingForm!.commitJumpLogicList));
  }
  listFormPoster(route.query.key as unknown as string).then(res => {
    formPosterList.value = res.data;
  });
});

const addLogic = () => {
  commitJumpLogicList.value.push({
    promptJump: {
      promptJumpContent: "",
      promptJumpType: "prompt"
    },
    logicList: [
      {
        formItemId: null,
        relation: "",
        expression: "",
        optionValue: "",
        type: ""
      }
    ]
  });
};

const handelAddLogicList = (index: number) => {
  let item = commitJumpLogicList.value[index];
  item.logicList.push({
    relation: item.logicList[1] ? item.logicList[1].relation : "",
    formItemId: null,
    expression: "",
    optionValue: "",
    type: ""
  });
};

const handelDeleteLogicList = (sIndex: number, index: number) => {
  commitJumpLogicList.value[sIndex].logicList.splice(index, 1);
};

const handelDeleteLogic = (sIndex: number) => {
  commitJumpLogicList.value.splice(sIndex, 1);
};

const formInfoStore = useFormInfo();

const queryProjectItems = () => {
  listProjectItemRequest({ key: formKey.value }).then(res => {
    allProjectItemList.value = res.data.filter((item: any) => item.type !== "PAGINATION");
    // 如果是考试的话增加分数
    if (formInfoStore.formType == 4) {
      allProjectItemList.value.push({
        id: 10086,
        formItemId: "totalScore",
        type: "NUMBER",
        label: "考试分数",
        textLabel: "考试分数"
      });
    }
  });
};

const handleRelationChange = (val: string, index: number) => {
  commitJumpLogicList.value[index].logicList.forEach(item => {
    item.relation = val;
  });
};

const handleFormTypeChange = (item: any) => {
  item.type = allProjectItemList.value.find((i: any) => i.formItemId === item.formItemId)?.type;
  item.optionValue = null;
  item.expression = null;
};

const handleExpressionChange = (item: any) => {
  if (item.expression === "null" || item.expression === "notnull") {
    item.optionValue = null;
  }
};

const getFormItem = (formItemId: string) => {
  let formItem = allProjectItemList.value.find((item: any) => item.formItemId === formItemId);
  if (formItem) {
    return {
      field: formItem
    };
  }
  return {};
};

const handleInsertScore = (index: number) => {
  nextTick(() => {
    tinymceRefs.value[index]?.handleInsertContent("#{totalScore}");
  });
};

const handlePosterInsertImg = (index: number, poster: PosterEntity) => {
  const img = `<div style="max-width: 500px;max-height: 500px"><img src="/tduck-api/report/poster/generate/${poster.posterKey}?dataId=#{dataId}" alt="${poster.name}"/></div><a style="text-decoration: none; color: #409EFF;"
          href="/tduck-api/report/poster/generate/${poster.posterKey}?dataId=#{dataId}">下载</a>`;
  nextTick(() => {
    console.log(poster);
    tinymceRefs.value[index]?.handleInsertContent(img);
  });
};

defineExpose({
  commitJumpLogicList
});
</script>

<style lang="scss" scoped>
.width100 {
  width: 100%;
}

.logic-item {
  position: relative;

  .close-wrap {
    position: absolute;
    right: 10px;
    top: 10px;

    i {
      font-size: 20px;
    }
  }
}
.logic-card {
  background-color: var(--el-color-primary-light-10);
  margin-top: 10px;
  border-radius: 10px;
}

.disable {
  pointer-events: none;
  cursor: not-allowed;
}

:deep(.disable input) {
  background-color: #f6f8f9;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  position: relative;
}

.rotate {
  transition: transform 0.5s;
}

.rotate:hover {
  transform: rotate(90deg);
}

.tinymce-edit {
  width: 100%;
  margin-top: 8px;
}
</style>
