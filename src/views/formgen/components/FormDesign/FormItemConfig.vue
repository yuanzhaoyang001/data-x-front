<template>
  <div>
    <!-- 组件属性 -->
    <el-form
      label-position="left"
      label-width="120px"
      size="small"
    >
      <el-form-item :label="$t('formgen.formItemConfig.itemId')">
        <div
          v-copyText="activeData.config.formId"
          class="id-wrap"
        >
          {{ activeData.config.formId }}
        </div>
      </el-form-item>
      <el-form-item
        v-if="activeData.config.componentName !== undefined"
        :label="$t('formgen.formItemConfig.itemName')"
      >
        {{ activeData.config.componentName }}
      </el-form-item>
      <!--      <el-form-item-->
      <!--        v-if="-->
      <!--          activeData.config.label !== undefined &&-->
      <!--            activeData.config.showLabel !== false "-->
      <!--        label="标题"-->
      <!--      >-->
      <!--        <el-input-->
      <!--          v-model="activeData.config.label"-->
      <!--          placeholder="请输入标题"-->
      <!--          @input="changeRenderKey"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item
        v-if="activeData.placeholder !== undefined"
        :label="$t('formgen.formItemConfig.placeholder')"
      >
        <el-input
          v-model="activeData.placeholder"
          :placeholder="$t('formgen.formItemConfig.inputPlaceholder')"
          @input="changeRenderKey"
        />
      </el-form-item>
      <el-form-item
        v-if="activeData.config.span !== undefined"
        :label="$t('formgen.formItemConfig.labelWidth')"
      >
        <el-slider
          v-model="activeData.config.span"
          :marks="{ 12: '' }"
          :max="24"
          :min="1"
        />
      </el-form-item>
      <el-form-item
        v-if="activeData.config.layout === 'rowFormItem' && activeData.gutter !== undefined"
        :label="$t('formgen.formItemConfig.gridSpacing')"
      >
        <el-input-number
          v-model="activeData.gutter"
          :min="0"
          :placeholder="$t('formgen.formItemConfig.gridSpacing')"
        />
      </el-form-item>
      <el-form-item
        v-if="activeData.config.layout === 'rowFormItem' && activeData.type !== undefined"
        :label="$t('formgen.formItemConfig.layoutModel')"
      >
        <el-radio-group v-model="activeData.type">
          <el-radio-button label="default" />
          <el-radio-button label="flex" />
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="activeData.justify !== undefined && activeData.type === 'flex'"
        :label="$t('formgen.formItemConfig.horizontal')"
      >
        <el-select
          v-model="activeData.justify"
          :style="{ width: '100%' }"
          :placeholder="$t('formgen.formItemConfig.horizontal')"
        >
          <el-option
            v-for="(item, index) in justifyOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="activeData.align !== undefined && activeData.type === 'flex'"
        :label="$t('formgen.formItemConfig.vertical')"
      >
        <el-radio-group v-model="activeData.align">
          <el-radio-button label="top" />
          <el-radio-button label="middle" />
          <el-radio-button label="bottom" />
        </el-radio-group>
      </el-form-item>
      <form-item-exam-config
        v-if="formConf.type == 4"
        :active-data="activeData"
      />
      <el-form-item v-if="activeData.vModel !== undefined && activeData.config.showDefaultValue !== false">
        <template #label>
          <span>
            {{ $t("formgen.formItemConfig.default") }}
            <el-tooltip
              class="item"
              :content="$t('formgen.formItemConfig.defaultText')"
              effect="dark"
              placement="top-start"
            >
              <el-icon><ele-QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <el-input
          v-model="activeData.config.defaultValue"
          :placeholder="$t('formgen.formItemConfig.default')"
          readonly
          @input="onDefaultValueInput"
        >
          <template #prepend>
            <el-button
              icon="ele-Setting"
              @click="$refs.defaultValueConfig.open()"
            />
          </template>
          <template #append>
            <el-button
              icon="ele-Close"
              @click="clearDefaultValue"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="activeData.config.showLabel !== undefined"
        :label="$t('formgen.formItemConfig.showTitle')"
      >
        <el-switch v-model="activeData.config.showLabel" />
      </el-form-item>

      <el-form-item
        v-if="activeData.clearable !== undefined"
        :label="$t('formgen.formItemConfig.isClear')"
      >
        <el-switch v-model="activeData.clearable" />
      </el-form-item>

      <el-form-item
        v-if="activeData.readonly !== undefined"
        :label="$t('formgen.formItemConfig.readOnly')"
      >
        <el-switch v-model="activeData.readonly" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span>
            {{ $t("formgen.formItemConfig.hideItem") }}
            <el-tooltip
              class="item"
              :content="$t('formgen.formItemConfig.hideItemText')"
              effect="dark"
              placement="top-start"
            >
              <el-icon><ele-QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>

        <el-switch v-model="activeData.config.hideType" />
      </el-form-item>
      <el-form-item :label="$t('formgen.formItemConfig.titleDesc')">
        <el-switch v-model="activeData.titleDesc" />
      </el-form-item>
      <div v-if="activeData.titleDesc">
        <form-tinymce
          v-model:value="activeData.description"
          :toolbar="formTitleToolbar"
        />
      </div>

      <el-form-item
        v-if="activeData['color'] !== undefined"
        :label="$t('formgen.formItemConfig.color')"
      >
        <el-color-picker v-model="activeData['color']" />
      </el-form-item>

      <el-form-item
        v-if="activeData.config.required !== undefined && activeData.config.showRequired !== false"
        :label="$t('formgen.formItemConfig.required')"
      >
        <el-switch v-model="activeData.config.required" />
      </el-form-item>
      <component
        :is="configComponent"
        :active-data="activeData"
        :form-conf="formConf"
        :fields="fields"
        @add-fields="
          val => {
            $emit('add-fields', val);
          }
        "
      />
      <template v-if="Array.isArray(activeData.config.regList) && activeData.config.showRegList !== false">
        <el-divider>{{ $t("formgen.formItemConfig.regularVerification") }}</el-divider>
        <div
          v-for="(item, index) in activeData.config.regList"
          :key="index"
          class="reg-item"
        >
          <span
            class="close-btn"
            @click="activeData.config.regList.splice(index, 1)"
          >
            <el-icon><ele-Close /></el-icon>
          </span>
          <el-form-item :label="$t('formgen.formItemConfig.regularExpression')">
            <template #label>
              <span>
                {{ $t("formgen.formItemConfig.regularExpression") }}
                <el-tooltip
                  class="item"
                  :content="$t('formgen.formItemConfig.regularExpressionText')"
                  effect="dark"
                  placement="top-start"
                >
                  <el-icon><ele-QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-input
              v-model="item.pattern"
              :placeholder="$t('formgen.formItemConfig.inputRegular')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('formgen.formItemConfig.errorTips')"
            style="margin-bottom: 0"
          >
            <el-input
              v-model="item.message"
              :placeholder="$t('formgen.formItemConfig.errorTips')"
            />
          </el-form-item>
        </div>
        <div style="margin-left: 20px">
          <el-button
            icon="ele-CirclePlus"
            link
            type="primary"
            @click="addReg"
          >
            {{ $t("formgen.formItemConfig.addRegular") }}
          </el-button>
        </div>
      </template>
      <custom-validate-list
        :active-data="activeData"
        :fields="fields"
      />
    </el-form>
    <default-value-config
      ref="defaultValueConfig"
      :current-item="activeData"
    />
  </div>
</template>

<script>
import { isNumberStr } from "../../utils";
import { camelCase, debounce, isArray, upperFirst } from "lodash-es";
import DefaultValueConfig from "./DefaultValueConfig.vue";
import FormItemExamConfig from "./FormItemExamConfig.vue";
import { computed } from "vue";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import FormulaDialog from "@/views/formgen/components/formula/index.vue";
import CustomValidateList from "@/views/formgen/components/FormDesign/component/CustomValidateList.vue";

export default {
  name: "FormItemConfig",
  components: {
    CustomValidateList,
    FormulaDialog,
    FormTinymce,
    FormItemExamConfig,
    DefaultValueConfig
  },
  props: ["activeData", "formConf", "fields"],
  setup(props) {
    // 动态导入组件
    const modules = import.meta.glob("./ItemConfig/**.vue", { eager: true });
    // 维护一个map 存储组件名和对象
    const components = {};
    Object.keys(modules).forEach(key => {
      const name = modules[key].default.name;
      if (name) {
        components[name] = modules[key].default;
      }
    });

    // if(['SELECT'].includes(typeId)){
    //   result = 'select'
    // }
    // if(['CASCADER'].includes(typeId)){
    //   result = 'cascader'
    // }
    // if(['checkbox'].includes(typeId)){
    //   result = 'checkbox'
    // }
    const configComponent = computed(() => {
      const prefix = "ConfigItem";
      const { typeId } = props.activeData;
      let name = null;
      // 无配置项的组件
      if (["PAGINATION", "SIGN_PAD", "PHONE_VERIFICATION"].includes(typeId)) {
      } else if (["INPUT", "TEXTAREA"].includes(typeId)) {
        name = `${prefix}Input`;
      } else {
        name = prefix + upperFirst(camelCase(typeId));
      }
      let configComponent = null;
      if (name) {
        configComponent = components[name];
      }
      return configComponent;
    });

    return {
      configComponent
    };
  },
  data() {
    return {
      formTitleToolbar:
        " styles fontsize bold italic underline strikethrough undo redo  removeformat alignleft aligncenter alignright  subscript superscript " +
        " hr  charmap    forecolor backcolor   link ",
      loading: null,
      justifyOptions: [
        {
          label: "start",
          value: "start"
        },
        {
          label: "end",
          value: "end"
        },
        {
          label: "center",
          value: "center"
        },
        {
          label: "space-around",
          value: "space-around"
        },
        {
          label: "space-between",
          value: "space-between"
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.config;
          return data.componentName || `${config.label}: ${data.vModel}`;
        }
      }
    };
  },
  computed: {},
  watch: {
    activeData: {
      handler(newValue, oldValue) {
        // 切换选中时不触发
        if (newValue.config.formId === oldValue.config.formId) {
          if (newValue) {
            this.dataChange(newValue);
          }
        }
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.config.regList.push({
        pattern: "",
        message: ""
      });
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (val instanceof Object) {
        return JSON.stringify(val);
      }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    clearDefaultValue() {
      let defaultValue = null;
      if (Array.isArray(this.activeData.config.defaultValue)) {
        defaultValue = [];
      }
      this.activeData.config["defaultValue"] = defaultValue;
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.config.defaultValue)) {
        // 数组
        this.activeData.config["defaultValue"] = str.split(",").map(val => (isNumberStr(val) ? +val : val));
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.activeData.config["defaultValue"] = JSON.parse(str);
      } else {
        // 字符串和数字
        this.activeData.config["defaultValue"] = isNumberStr(str) ? +str : str;
      }
    },
    dataChange: debounce(function (val) {
      this.$emit("data-change", val);
    }, 430),
    changeRenderKey() {
      this.activeData.config.renderKey = +new Date();
    }
  },
  emits: ["add-fields", "data-change"]
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/right";

.id-wrap {
  cursor: pointer;
}
</style>
