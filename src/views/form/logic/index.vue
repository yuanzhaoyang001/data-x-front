<template>
  <div class="project-logic-container">
    <div class="scrollbar-container">
      <p class="logic_title">
        {{ $t("form.logic.logicSettingsLabel") }}
      </p>
      <p class="text-desc">
        {{ $t("form.logic.logicDescription") }}
      </p>
      <div class="show-logic-container">
        <div
          v-if="!logicList.length"
          class="not-logic-container"
        >
          <el-row>
            <el-col>
              <el-button
                type="primary"
                @click="addLogicHandle"
              >
                <el-icon>
                  <ele-Plus />
                </el-icon>
                <span class="label">{{ $t("form.logic.addLogicLabel") }}</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div
          v-else
          class="logic-item-container"
        >
          <el-row
            align="middle"
            justify="center"
            type="flex"
          >
            <el-col
              :offset="0"
              :span="11"
            >
              <el-text
                :type="isSave"
                size="default"
              >
                {{ saveMessage }}
              </el-text>
            </el-col>
            <el-col
              :offset="7"
              :span="5"
            >
              <el-button
                icon="ele-Plus"
                size="default"
                :loading="isLoading"
                type="primary"
                @click="addLogicHandle"
              >
                <span class="label">{{ $t("form.logic.addLogicLabel") }}</span>
              </el-button>
            </el-col>
          </el-row>
          <el-divider />
          <el-scrollbar :style="{ height: scrollbarHeight }">
            <div
              v-for="(logicItem, index) in logicList"
              :key="logicItem.id"
              class="logic-item"
            >
              <el-card
                class="logic-card"
                shadow="never"
              >
                <div class="logic-item-delbtn">
                  <el-popconfirm
                    :title="$t('form.logic.confirmDeleteLabel')"
                    @confirm="handleRemoveLogicItem(index)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="danger"
                      >
                        <el-icon :size="16">
                          <ele-Delete />
                        </el-icon>
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
                <el-row
                  v-for="(cItem, cIndex) in logicItem.conditionList"
                  :key="cIndex"
                  :gutter="20"
                  align="middle"
                  class="mt5"
                  justify="center"
                  type="flex"
                >
                  <el-col
                    :span="3"
                    class="text-center"
                  >
                    <span v-if="cIndex === 0">{{ $t("form.logic.ifFormComponentLabel") }}</span>
                    <el-select
                      v-else
                      v-model="cItem.relation"
                      :disabled="cIndex !== 1"
                      @change="val => relationChangeHandle(val, logicItem)"
                      size="small"
                    >
                      <el-option
                        :label="$t('form.logic.andLabel')"
                        value="AND"
                      />
                      <el-option
                        :label="$t('form.logic.orLabel')"
                        value="OR"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select
                      v-model="cItem.formItemId"
                      :placeholder="$t('form.logic.select')"
                      style="width: 100%"
                      size="default"
                      @change="handleConditionChange(cItem)"
                    >
                      <el-option
                        v-for="item in getConditionProjectItemList(logicItem)"
                        :key="item.id"
                        :label="item.textLabel"
                        :value="item.formItemId"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-select
                      v-model="cItem.expression"
                      :placeholder="$t('form.logic.condition')"
                      size="default"
                    >
                      <el-option
                        v-for="item in getConditionOptions(cItem.formItemId)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <!--  下拉问题使用选项-->
                    <FormOptionSelect
                      class="width100"
                      size="default"
                      valueProp="value"
                      :placeholder="$t('form.logic.option')"
                      v-if="['RADIO', 'CHECKBOX', 'SELECT', 'IMAGE_SELECT'].includes(getFormItemIdType(cItem.formItemId))"
                      v-model="cItem.optionValue"
                      allow-create
                      clearable
                      default-first-option
                      filterable
                      :item="getFormItemOptions(cItem.formItemId)"
                    ></FormOptionSelect>
                    <!--  评分使用数字框-->
                    <el-input-number
                      v-else-if="getFormItemIdType(cItem.formItemId) === 'RATE'"
                      v-model="cItem.optionValue"
                      :min="0"
                    />
                    <el-input
                      v-else
                      :disabled="['notNull', 'isNull'].includes(cItem.expression)"
                      v-model="cItem.optionValue"
                      size="default"
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      link
                      type="primary"
                      @click="addConditionHandle(logicItem, cItem)"
                    >
                      <el-icon size="18">
                        <ele-CirclePlus />
                      </el-icon>
                    </el-button>
                    <el-button
                      v-if="cIndex !== 0"
                      class="remove"
                      link
                      type="primary"
                      @click="removeConditionHandle(logicItem, index, cIndex)"
                    >
                      <el-icon size="18">
                        <ele-Remove />
                      </el-icon>
                    </el-button>
                  </el-col>
                </el-row>
                <el-row
                  v-for="(trigger, tindex) in logicItem.triggerList"
                  :key="`t1${tindex}`"
                  align="middle"
                  type="flex"
                  class="mt5"
                >
                  <el-col :span="3"></el-col>
                  <el-col
                    :span="6"
                    class="text-center"
                  >
                    <span>{{ $t("form.logic.thenLabel") }}</span>
                    <el-select
                      v-model="trigger.type"
                      class="ml10"
                      :placeholder="$t('form.logic.type')"
                      size="default"
                      style="width: 80%"
                      @change="handleTriggerTypeChange(trigger)"
                    >
                      <el-option
                        :label="$t('form.logic.showLabel')"
                        value="show"
                      />
                      <el-option
                        :label="$t('form.logic.jumpLabel')"
                        value="jump"
                      />
                      <el-option
                        :label="$t('form.logic.finishLabel')"
                        value="finish"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="10">
                    <el-select
                      v-if="trigger.type !== 'finish'"
                      v-model="trigger.formItemId"
                      :placeholder="$t('form.logic.question')"
                      size="default"
                    >
                      <el-option
                        v-for="item in getTriggerItemList(logicItem)"
                        :key="item.id"
                        :label="item.textLabel"
                        :value="item.formItemId"
                        :disabled="item.disabled"
                      />
                    </el-select>
                    <span
                      v-if="trigger.type === 'show'"
                      class="ml20"
                    >
                      {{ $t("form.logic.otherwiseNotDisplayLabel") }}
                    </span>
                    <span
                      v-if="trigger.type === 'jump'"
                      class="ml20"
                    >
                      {{ $t("form.logic.otherwiseShowNextLabel") }}
                    </span>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      link
                      type="primary"
                      @click="addTriggerItemHandle(logicItem)"
                    >
                      <el-icon size="18">
                        <ele-CirclePlus />
                      </el-icon>
                    </el-button>
                    <el-button
                      v-if="tindex !== 0"
                      class="remove"
                      link
                      type="primary"
                      @click="removeTriggerItemHandle(logicItem, index, tindex)"
                    >
                      <el-icon size="18">
                        <ele-Remove />
                      </el-icon>
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script name="ProjectLogic" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { jsonSimpleClone } from "@/views/formgen/utils";
import { getFormLogicRequest, listProjectItemRequest, saveFormLogicRequest } from "@/api/project/form";
import { i18n } from "@/i18n";
import FormOptionSelect from "@/views/components/FormOptionSelect/index.vue";
import { useRoute } from "vue-router";
import { debounce } from "lodash-es";

const scrollbarHeight = ref("90vh");
const saveMessage = ref("");
const isSave = ref("info");
const isLoading = ref(false);
const formKey = ref("");
const defaultLogicItem = reactive({
  triggerList: [
    {
      formItemId: null,
      type: "show"
    }
  ],
  conditionList: [
    {
      formItemId: null,
      expression: null,
      optionValue: null,
      relation: "AND"
    }
  ]
});
const conditionOptions = ref([
  {
    value: "eq",
    label: i18n.global.t("form.logic.eq")
  },
  {
    value: "ne",
    label: i18n.global.t("form.logic.ne")
  },
  {
    value: "gt",
    label: i18n.global.t("form.logic.gt"),
    types: ["RATE"]
  },
  {
    value: "ge",
    label: i18n.global.t("form.logic.ge"),
    types: ["RATE"]
  },
  {
    value: "lt",
    label: i18n.global.t("form.logic.lt"),
    types: ["RATE"]
  },
  {
    value: "le",
    label: i18n.global.t("form.logic.le"),
    types: ["RATE"]
  },
  {
    value: "isNull",
    label: i18n.global.t("form.logic.null"),
    types: ["TEXT", "NUMBER", "DATE", "DATETIME", "TIME", "RATE"]
  },
  {
    value: "notNull",
    label: i18n.global.t("form.logic.notnull")
  },
  {
    value: "like",
    label: i18n.global.t("form.logic.like")
  },
  {
    value: "notLike",
    label: i18n.global.t("form.logic.notlike")
  }
]);
const allProjectItemList = ref([]);
const logicList = ref([]);

const route = useRoute();

onMounted(() => {
  formKey.value = route.query.key;
  queryProjectItems();
  queryProjectLogic();
  const setScrollbarHeight = () => {
    const windowHeight = window.innerHeight;
    scrollbarHeight.value = `${windowHeight - 300}px`;
  };
  setScrollbarHeight();
  window.addEventListener("resize", setScrollbarHeight);
});

watch(
  logicList,
  val => {
    if (val) {
      saveProjectLogic(val);
      isSave.value = "info";
      saveMessage.value = i18n.global.t("form.logic.handling");
    }
  },
  { deep: true }
);

const addConditionHandle = (logicItem, cItem) => {
  logicItem.conditionList.push({ relation: cItem.relation });
};

const removeConditionHandle = (logicItem, logicIndex, index) => {
  logicItem.conditionList.splice(index, 1);
};

const addTriggerItemHandle = logicItem => {
  logicItem.triggerList.push({ type: "show" });
};

const removeTriggerItemHandle = (logicItem, logicIndex, index) => {
  logicItem.triggerList.splice(index, 1);
};

const addLogicHandle = () => {
  isLoading.value = true;
  const newLogicItem = jsonSimpleClone(defaultLogicItem);
  newLogicItem.id = new Date().getTime();
  logicList.value.push(newLogicItem);
};

const getConditionOptions = formItemId => {
  if (!formItemId) return [];
  let type = formItemId.replace(/\d+/, "").toUpperCase();
  let conditionOptionsCopy = jsonSimpleClone(conditionOptions.value);
  if (type === "RATE") {
    conditionOptionsCopy.splice(0, 2);
  } else {
    conditionOptionsCopy.splice(2, 4);
  }
  return conditionOptionsCopy;
};

const relationChangeHandle = (val, logicItem) => {
  logicItem.conditionList.forEach(item => {
    item.relation = val;
  });
};

// 支持逻辑的组件
const supprtLogicComponentList = ["RADIO", "CHECKBOX", "SELECT", "IMAGE_SELECT", "RATE", "INPUT"];

const getConditionProjectItemList = () => {
  return jsonSimpleClone(allProjectItemList.value).filter(item => {
    return supprtLogicComponentList.includes(item.type);
  });
};

const getTriggerItemList = logicItem => {
  let selectedFormItemList = logicItem.conditionList.map(item => item.formItemId);
  let projectItemList = jsonSimpleClone(allProjectItemList.value);
  projectItemList.forEach(item => {
    if (selectedFormItemList.includes(item.formItemId)) {
      item.disabled = true;
    }
  });
  return projectItemList;
};

const getFormItemOptions = formItemId => {
  let formItem = allProjectItemList.value.find(item => item.formItemId == formItemId);
  if (formItem) {
    return {
      field: formItem
    };
  }
};

const handleConditionChange = cItem => {
  cItem["optionValue"] = null;
};

const handleRemoveLogicItem = index => {
  logicList.value.splice(index, 1);
};

const getFormItemIdType = formItemId => {
  if (!formItemId) return "";
  return formItemId.replace(/\d+/, "").toUpperCase();
};

const queryProjectLogic = () => {
  getFormLogicRequest({ formKey: formKey.value }).then(res => {
    if (res.data) {
      logicList.value = res.data.scheme ? res.data.scheme : [];
    }
  });
};

const handleTriggerTypeChange = trigger => {
  if (trigger.type === "finish") {
    trigger.formItemId = null;
  }
};

const queryProjectItems = () => {
  listProjectItemRequest({ key: formKey.value }).then(async res => {
    allProjectItemList.value = res.data.filter(item => {
      return item.type !== "PAGINATION";
    });
  });
};

const saveProjectLogic = debounce(function (logicList) {
  let data = { formKey: formKey.value, scheme: logicList };
  saveFormLogicRequest(data).then(() => {
    isLoading.value = false;
    isSave.value = "";
    saveMessage.value = i18n.global.t("form.logic.isSave");
  });
}, 430);
</script>

<style lang="scss" scoped>
.project-logic-container {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: #fff;

  .scrollbar-container {
    height: 100%;
  }

  .header-row {
    width: 230px;
    margin-bottom: 20px;
  }

  .logic_title {
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    color: #484848;
    text-align: left;
    margin-top: 20px;
  }
}

.text-desc {
  font-size: 14px;
  line-height: 20px;
  color: #9b9b9b;
  margin-bottom: 10px;
}

.not-logic-container {
  .el-icon-circle-plus-outline {
    font-size: 20px;
  }

  .label {
    font-size: 18px;
  }
}

.logic-item-container {
  height: 100%;

  .tips {
    font-size: 14px;
    color: #aaa;
  }

  .label {
    font-size: 15px;
  }

  .remove {
    color: #ff4949;
  }
}

.show-logic-container {
  border-radius: 8px;
  padding: 5px;
  min-width: 950px;
  height: 100%;
}

.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 24px;
}

.logic-item {
  position: relative;

  .logic-item-delbtn {
    display: flex;
    justify-content: flex-end;
  }
}

.logic-card {
  border-radius: 10px;
  background-color: var(--el-color-primary-light-10);
  margin-top: 10px;
}
</style>
