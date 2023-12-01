<template>
  <el-dialog
    :close-on-click-modal="false"
    :fullscreen="fullscreen"
    v-model="dialogVisible"
    width="70%"
    class="full-dialog"
  >
    <template #header>
      <div class="t__dialog__header">
        <span class="el-dialog__title">{{ dialogTitle }}</span>
        <div class="t__dialog__menu">
          <i
            class="iconfont el-dialog__close"
            :class="fullscreen ? 'icon-tuichuquanping' : 'icon-fullscreen'"
            @click="handleFullScreen"
          />
        </div>
      </div>
    </template>
    <div>
      <div class="body">
        <el-tabs v-model="activeName">
          <el-tab-pane
            :label="$t('formgen.importItem.textImport')"
            name="textImport"
          >
            <el-row>
              <el-col :span="12">
                <el-input
                  v-model="content"
                  :autosize="{ minRows: 29, maxRows: 29 }"
                  :placeholder="$t('formgen.importItem.inputDesc')"
                  type="textarea"
                  @change="handleSplitContent"
                />
              </el-col>
              <el-col
                :offset="2"
                :span="10"
                class="right"
              >
                <el-scrollbar>
                  <generate-form
                    v-if="formConf.fields.length"
                    :key="formParseKey"
                    ref="generateForm"
                    :form-conf="formConf"
                    :page-form-model="{}"
                    style="margin-bottom: 40px"
                  />
                </el-scrollbar>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('formgen.importItem.importText')"
            name="importHelp"
          >
            <el-alert
              :closable="false"
              class="m10"
              type="success"
            >
              <template #title>
                <div>
                  <p>{{ $t("formgen.importItem.templateText1") }}</p>
                  <p>{{ $t("formgen.importItem.templateText2") }}</p>
                  <p>{{ $t("formgen.importItem.templateText3") }}</p>
                  <p>{{ $t("formgen.importItem.templateText4") }}</p>
                  <p>{{ $t("formgen.importItem.templateText5") }}</p>
                </div>
              </template>
            </el-alert>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <template #footer>
      <span class="t-dialog__footer">
        <el-button @click="dialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
        <el-button
          type="primary"
          v-re-click
          @click="handleImport"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import _ from "lodash-es";
import { allComponents } from "../../GenerateForm/config";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { formItemConvertData } from "../../../utils/convert";
import { batchCreateProjectItem } from "../../../api";
import mittBus from "@/utils/mitt";

export default {
  name: "ImportFormItem",
  components: {
    GenerateForm
  },
  props: {
    formKey: {
      type: String,
      default: ""
    }
  },
  emits: ["success"],
  data() {
    return {
      activeName: "textImport",
      content:
        "【单选框组】您经常创建什么类型的项目？\n" + "问卷调研\n" + "满意度调查\n" + "投票评选\n" + "表单报名\n" + "测评考试",
      dialogVisible: false,
      dialogTitle: "导入题目",
      fullscreen: false,
      formConf: {
        fields: [],
        labelPosition: "top",
        formKey: "temp001"
      },
      formParseKey: ""
    };
  },
  computed: {
    allComponentList() {
      return allComponents.map(item => item.list).flat();
    }
  },
  watch: {
    content() {
      this.handleSplitContent();
    }
  },
  created() {
    this.handleSplitContent();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    handleSplitContent: function () {
      let fields = [];
      let items = this.content.split(/【/g);
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (!item) {
          continue;
        }
        let options = item.split("\n");
        if (options) {
          // 第一行为标题
          let title = _.replace(options[0], /.*?】/g, "");
          // 类型
          let type = options[0].substr(0, options[0].indexOf("】"));
          // 查找问题结构定义
          let fieldConfig = _.find(this.allComponentList, function (o) {
            return o.config.label === type;
          });
          if (!fieldConfig) {
            continue;
          }
          let tempFieldConfig = JSON.parse(JSON.stringify(fieldConfig));
          if (fieldConfig.typeId === "DESC_TEXT") {
            tempFieldConfig.content = title;
          }
          // 如果是选择型组件
          if (tempFieldConfig.config.options) {
            // 去除第一个元素
            let removeFirstArr = _.drop(options);
            let itemOptions = [];
            for (let j = 0; j < removeFirstArr.length; j++) {
              if (removeFirstArr[j]) {
                itemOptions.push({
                  label: removeFirstArr[j],
                  value: new Date().getTime() + j
                });
              }
            }
            tempFieldConfig.config.options = itemOptions;
          }
          tempFieldConfig.config.formId = `${_.toLower(tempFieldConfig.typeId)}-${new Date().getTime() + i}`;
          tempFieldConfig.config.label = title;
          tempFieldConfig.vModel = `${tempFieldConfig.formId}`;
          fields.push(tempFieldConfig);
        }
      }
      this.formConf.fields = fields;
      this.formParseKey = "import-preview" + new Date();
    },
    handleFullScreen() {
      this.fullscreen = !this.fullscreen;
    },
    handleImport() {
      let itemList = this.formConf.fields.map(item => {
        console.log(item);
        return formItemConvertData(item, this.formKey);
      });
      console.log(itemList);
      batchCreateProjectItem(itemList).then(res => {
        this.msgSuccess("保存成功");
        // 刷新列表
        mittBus.emit("refreshFormList");
        this.$emit("success");
        this.dialogVisible = false;
        // 冒泡排序
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  padding: 5px;
  height: 100%;
}

:deep(.el-dialog__body) {
  padding: 0px !important;
  margin-bottom: 0px !important;
}

.right {
  height: 700px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 20px 40px;
}
</style>
