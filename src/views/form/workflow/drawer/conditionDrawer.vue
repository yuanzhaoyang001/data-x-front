<template>
  <el-drawer
    :append-to-body="true"
    v-model="conditionDrawer"
    class="condition_copyer"
    direction="rtl"
    size="550px"
    :title="$t('workflow.flowDesign.branchSetting')"
  >
    <div class="demo-drawer__content">
      <div class="condition_content">
        <div
          v-for="(cond, index) in conditionList"
          :key="`conditionList` + index"
          class="condition_list mb10"
        >
          <span class="desc-text mt5">
            {{ index != 0 ? $t("workflow.flowDesign.or") : "" }}
          </span>
          <el-icon
            class="text-danger el-icon-circle-close"
            @click="conditionList.splice(index, 1)"
          >
            <ele-CircleClose />
          </el-icon>
          <el-row
            v-for="(subCond, subIndex) in cond.subConditionList"
            :key="`subConditionList` + subIndex"
            :gutter="10"
            align="middle"
            class="p10 mb5"
            type="flex"
          >
            <el-col :span="6">
              <el-select
                v-model="subCond.field"
                :placeholder="$t('workflow.flowDesign.choose')"
              >
                <el-option
                  v-for="item in formFields"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="subCond.op"
                :placeholder="$t('workflow.flowDesign.choose')"
              >
                <el-option
                  v-for="item in opList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="subCond.value"
                :placeholder="$t('formI18n.all.pleaseEnter')"
              />
            </el-col>
            <el-col :span="4">
              <el-icon
                class="icon text-success"
                @click="handleAddCondition(cond.subConditionList)"
              >
                <ele-Plus />
              </el-icon>
              <el-icon
                class="icon text-danger"
                @click="cond.subConditionList.splice(subIndex, 1)"
              >
                <ele-Delete />
              </el-icon>
            </el-col>
          </el-row>
        </div>
        <el-button
          class="width-full"
          icon="ele-Plus"
          @click="handleAddConditionList"
        >
          {{ $t("workflow.flowDesign.addBranch") }}
        </el-button>
      </div>
      <div class="demo-drawer__footer clear">
        <el-button
          size="default"
          type="primary"
          @click="saveCondition"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
        <el-button
          size="default"
          @click="closeDrawer"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { listFormFieldsRequest } from "@/api/project/form";
import { mapActions, mapState, mapStores } from "pinia";
import { useFormWorkflow } from "@/stores/formWorkflow";
import { i18n } from "@/i18n";

export default {
  name: "ConditionDrawer",
  props: ["formKey"],
  data() {
    return {
      conditionsConfig: {},
      branchNode: {},
      index: 0,
      conditionVisible: false,
      conditionList: [
        {
          subConditionList: [
            {
              field: null
            }
          ]
        }
      ],
      opList: [
        {
          value: "eq",
          label: i18n.global.t("form.setting.equalsLabel")
        },
        {
          value: "ne",
          label: i18n.global.t("form.setting.notEqualsLabel")
        },
        {
          value: "gt",
          label: i18n.global.t("form.setting.greaterThanLabel")
        },
        {
          value: "ge",
          label: i18n.global.t("form.setting.greaterThanOrEqualsLabel")
        },
        {
          value: "lt",
          label: i18n.global.t("form.setting.lessThanLabel")
        },
        {
          value: "le",
          label: i18n.global.t("form.setting.lessThanOrEqualsLabel")
        },
        {
          value: "like",
          label: i18n.global.t("form.setting.containsLabel")
        },
        {
          value: "noLike",
          label: i18n.global.t("form.setting.notContainsLabel")
        }
      ],
      formFields: []
    };
  },
  computed: {
    ...mapStores(useFormWorkflow),
    ...mapState(useFormWorkflow, ["conditionDrawer"]),
    conditionsConfig1() {
      return this.formWorkflowStore.conditionsConfig;
    }
  },
  watch: {
    conditionsConfig1: {
      handler(val) {
        if (!val) return;
        this.conditionsConfig = val.value;
        this.index = val.index;
        this.branchNode = val.index != undefined ? this.conditionsConfig.branchNodes[val.index] : { conditionList: [] };
        if (this.branchNode.conditionList) {
          this.conditionList = this.branchNode.conditionList;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    listFormFieldsRequest(this.formKey).then(res => {
      if (res.data) {
        this.formFields = res.data;
      }
    });
  },
  methods: {
    ...mapActions(useFormWorkflow, ["updateCondition", "updateConditionsConfig"]),
    saveCondition() {
      this.conditionsConfig.branchNodes[this.index].conditionList = this.conditionList;
      this.updateCondition();
      this.updateConditionsConfig({
        value: this.conditionsConfig,
        flag: true,
        id: this.conditionsConfig1.id
      });
    },
    handleAddConditionList() {
      this.conditionList.push({
        subConditionList: [
          {
            field: null
          }
        ]
      });
    },
    handleAddCondition(conditionList) {
      conditionList.push({
        field: null,
        op: null
      });
    },
    closeDrawer() {
      this.updateCondition();
    }
  }
};
</script>

<style lang="scss">
.condition_copyer {
  .condition_content {
    padding: 20px 20px 0;
    height: 90%;
  }
}

.desc-text {
  color: #606266;
  margin-top: 10px;
  font-size: 15px;
}

.condition_list {
  padding: 10px;
  position: relative;
  background-color: #f2f3f4;

  &:hover {
    .el-icon-circle-close {
      display: inline-block;
    }
  }

  .icon {
    font-size: 16px;
    margin-right: 5px;
  }

  .el-icon-circle-close {
    position: absolute;
    right: 5px;
    top: 3px;
    z-index: 1;
    display: none;
  }
}
</style>
