<template>
  <div>
    <el-divider>{{ $t("formgen.option.optionSet") }}</el-divider>
    <el-radio-group v-model="activeData.config.optionsType">
      <el-radio-button :label="0">{{ $t("formgen.option.staticData") }}</el-radio-button>
      <el-radio-button :label="1">{{ $t("formgen.option.dynamic") }}</el-radio-button>
      <el-radio-button :label="2">{{ $t("formgen.option.dictionary") }}</el-radio-button>
    </el-radio-group>

    <!-- 远程赋值配置 -->
    <div v-if="activeData.config.optionsType === 1">
      <el-input
        v-model="activeData.config.dynamicOptions.url"
        @change="handleReQueryOptionsData"
        size="default"
        placeholder="https://api.tduckcloud.com/xxx.json"
      >
        <template #prepend>{{ $t("formgen.option.url") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.dataPath"
        placeholder="data"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.listPath") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.valueField"
        placeholder="value"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.value") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.labelField"
        placeholder="label"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.label") }}</template>
      </el-input>
    </div>
    <div
      v-if="activeData.config.optionsType === 0"
      class="mt10"
    >
      <draggable
        :animation="340"
        v-model="activeData.config.options"
        group="selectItem"
        handle=".option-drag"
        item-key="value"
      >
        <template #item="{ element, index }">
          <div class="select-item">
            <div class="select-line-icon option-drag">
              <el-icon>
                <ele-Operation />
              </el-icon>
            </div>
            <el-input
              v-model="element.label"
              :placeholder="$t('formgen.option.optionName')"
              size="small"
            >
              <template
                #append
                v-if="['RADIO', 'CHECKBOX'].includes(activeData.typeId)"
              >
                <el-icon
                  @click="handleOpenEdit(element.label, index)"
                  class="cursor-pointer"
                >
                  <text-style
                    theme="outline"
                    size="20"
                    :strokeWidth="4"
                    strokeLinejoin="bevel"
                  />
                </el-icon>
              </template>
            </el-input>
            <div
              class="close-btn select-line-icon"
              @click="activeData.config.options.splice(index, 1)"
            >
              <el-icon>
                <ele-Remove />
              </el-icon>
            </div>
          </div>
        </template>
      </draggable>
      <div style="margin-left: 20px; margin-bottom: 10px">
        <el-button
          icon="ele-CirclePlus"
          link
          type="primary"
          @click="addSelectItem"
        >
          {{ $t("formgen.option.addOption") }}
        </el-button>
        <el-button
          icon="ele-DocumentCopy"
          link
          type="primary"
          @click="openBatchEditDialogHandle"
        >
          {{ $t("formgen.option.batchEdit") }}
        </el-button>
        <el-button
          v-if="['CHECKBOX', 'RADIO'].indexOf(activeData.typeId) > -1"
          icon="ele-CirclePlus"
          link
          type="primary"
          @click="addSelectOtherItem"
        >
          {{ $t("formgen.option.addOther") }}
        </el-button>
      </div>
      <el-dialog
        :title="$t('formgen.option.batchEdit')"
        v-model="dialogVisible"
        width="50%"
      >
        <span class="desc-text">{{ $t("formgen.option.lineByOption") }}</span>
        <el-input
          v-model="batchItemValue"
          type="textarea"
          :autosize="{ minRows: 20, maxRows: 5000 }"
          :placeholder="$t('formgen.option.batchDesc')"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
            <el-button
              type="primary"
              @click="batchEditSelectItems"
            >
              {{ $t("formI18n.all.confirm") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        :title="$t('formgen.option.htmlEdit')"
        v-model="textEditDialogVisible"
        width="50%"
      >
        <form-tinymce
          v-model:value="htmlLabel"
          @click="
            event => {
              event.preventDefault(); // 阻止 label 元素的默认行为
            }
          "
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="textEditDialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
            <el-button
              type="primary"
              @click="handleSaveEditHtml"
            >
              {{ $t("formI18n.all.confirm") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div v-if="activeData.config.optionsType === 2">
      <el-form-item
        :label="$t('formgen.option.dictionarySelect')"
        class="mt10"
      >
        <el-select
          v-model="activeData.config.dictOptionType"
          :placeholder="$t('formgen.option.dictionarySelect')"
          @change="handleReQueryOptionsData"
        >
          <el-option
            v-for="item in dictTypeList"
            :key="item.dictType"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import _ from "lodash-es";
import draggable from "vuedraggable";
import { optionselect } from "@/api/system/dict/type";
import { execRemoteAPI } from "@/views/formgen/api/execRemoteAPI";
import { i18n } from "@/i18n";
import { TextStyle } from "@icon-park/vue-next";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";

export default {
  name: "ConfigItemOption",
  components: {
    FormTinymce,
    draggable,
    TextStyle
  },
  props: ["activeData"],
  data() {
    return {
      batchItemValue: "",
      dialogVisible: false,
      textEditDialogVisible: false,
      // 富文本临时文字
      htmlLabel: "",
      editIndex: null,
      dictTypeList: []
    };
  },
  created() {
    optionselect().then(res => {
      this.dictTypeList = res.data;
    });
  },
  methods: {
    async handleReQueryOptionsData() {
      const config = this.activeData.config;
      // 数据为从接口获取
      let finalOptions = [];
      if (config.optionsType && config.optionsType === 1) {
        execRemoteAPI.get(config.dynamicOptions.url).then(res => {
          const options = _.get(res.data, config.dynamicOptions.dataPath);
          if (options && _.isArray(options)) {
            const dyOptions = options.map(op => ({
              value: _.get(op, config.dynamicOptions.valueField),
              label: _.get(op, config.dynamicOptions.labelField)
            }));
            finalOptions = dyOptions;
          }
        });
      }
      // 从字典获取
      if (config.optionsType && config.optionsType === 2) {
        let dictRes = await execRemoteAPI.get(`/system/dict/data/type/${config.dictOptionType}`);
        finalOptions = dictRes.data.data.map(op => ({
          value: op.dictValue,
          label: op.dictLabel
        }));
      }
      this.activeData.config.options = finalOptions;
    },
    addSelectItem() {
      // 找到最大值
      let max = 1;
      if (this.activeData.config.options) {
        max = Math.max(...this.activeData.config.options.map(item => item.value), 1) + 1;
      }
      this.activeData.config.options.push({
        label: "",
        type: "option",
        value: max
      });
    },
    openBatchEditDialogHandle() {
      this.batchItemValue = _.join(
        this.activeData.config.options.map(item => item.label),
        "\n"
      );
      this.dialogVisible = true;
    },
    async batchEditSelectItems() {
      const arrStrs = this.batchItemValue;
      const arr = arrStrs.split("\n");
      if (arr.length > 1) {
        const options = [];
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element) {
            options.push({
              type: "option",
              label: element,
              value: index + 1
            });
          }
        }
        this.activeData.config.options = options;
        this.dialogVisible = false;
      }
    },
    handleOpenEdit(label, index) {
      this.textEditDialogVisible = true;
      this.editIndex = index;
      this.htmlLabel = label;
    },
    handleSaveEditHtml() {
      this.activeData.config.options[this.editIndex].label = this.htmlLabel;
      this.textEditDialogVisible = false;
    },
    addSelectOtherItem() {
      let max = 1;
      if (this.activeData.config.options) {
        max = Math.max(...this.activeData.config.options.map(item => item.value), 1) + 1;
      }
      this.activeData.config.options.push({
        label: i18n.global.t("formgen.option.others"),

        type: "input",
        value: max
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options.scss";
</style>
