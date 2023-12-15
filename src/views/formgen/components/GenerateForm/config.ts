// 表单属性【右面板】
import { baseUrl } from "@/utils/auth";
import { i18n } from "@/i18n";

export const formConf = {
  formRef: "elForm",
  formModel: "formData",
  size: "default",
  labelPosition: "top",
  labelWidth: 100,
  formRules: "rules",
  gutter: 20,
  disabled: false,
  span: 24,
  title: i18n.global.t("formgen.config.title"),
  description: i18n.global.t("formgen.config.description"),
  formBtns: true,
  unFocusedComponentBorder: true
};

// 基础组件 【基础组件】
export const basicComponents = [
  {
    // 组件的自定义配置
    typeId: "INPUT",
    config: {
      label: i18n.global.t("formgen.config.INPUT"),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "t-input",
      tagIcon: "input",
      defaultValue: undefined,
      required: true,
      span: 24,
      // 正则校验规则
      regList: [],
      // 公式校验
      formulaValidate: [],
      prepend: "",
      append: "",
      // 数据类型
      dataType: {
        type: "",
        message: ""
      }
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    style: { width: "100%" },
    clearable: true,
    "prefix-icon": "",
    "suffix-icon": "",
    minlength: null,
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
    // 不允许重复数据
    notRepeat: false
  },
  {
    // 组件的自定义配置
    typeId: "NUMBER",
    config: {
      label: i18n.global.t("formgen.config.NUMBER"),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "t-number",
      tagIcon: "number",
      defaultValue: undefined,
      required: true,
      span: 24,
      // 正则校验规则
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    style: { width: "100%" },
    min: null,
    max: 100000000,
    step: 1,
    precision: null,
    disabled: false
  },
  {
    typeId: "TEXTAREA",
    config: {
      label: i18n.global.t("formgen.config.TEXTAREA"),
      labelWidth: null,
      showLabel: true,
      tag: "t-textarea",
      tagIcon: "textarea",
      defaultValue: undefined,
      required: true,
      span: 24,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true
    },
    type: "textarea",
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: "100%" },
    minlength: null,
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false
  },
  {
    typeId: "DATE",
    config: {
      label: i18n.global.t("formgen.config.DATE"),
      tag: "t-date-time",
      tagIcon: "date",
      defaultNowTime: false,
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true
    },
    placeholder: i18n.global.t("formgen.config.SELECT_DATE"),
    type: "date",
    style: { width: "100%" },
    disabled: false,
    clearable: true,
    format: "YYYY-MM-DD",
    "value-format": "YYYY-MM-DD",
    readonly: false
  },
  {
    typeId: "RATE",
    config: {
      label: i18n.global.t("formgen.config.RATE"),
      tag: "t-rate",
      tagIcon: "rate",
      defaultValue: 0,
      span: 24,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true
    },
    style: {},
    max: 5,
    "allow-half": false,
    "show-text": false,
    "show-score": false,
    disabled: false
  },
  {
    typeId: "UPLOAD",
    config: {
      label: i18n.global.t("formgen.config.UPLOAD"),
      tag: "t-upload",
      tagIcon: "upload",
      defaultValue: null,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: i18n.global.t("formgen.config.clickUpload"),
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true,
      fileSize: 10,
      sizeUnit: "MB"
    },
    action: `${baseUrl}/form/file/upload/`,
    disabled: false,
    accept: "",
    name: "file",
    "auto-upload": true,
    "list-type": "text",
    limit: 2,
    multiple: false
  },
  {
    typeId: "IMAGE_UPLOAD",
    config: {
      label: i18n.global.t("formgen.config.IMAGE_UPLOAD"),
      tag: "t-image-upload",
      tagIcon: "image-upload",
      defaultValue: [],
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: i18n.global.t("formgen.config.clickUpload"),
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true,
      fileSize: 10,
      sizeUnit: "MB"
    },
    action: `${baseUrl}/form/file/upload/`,
    disabled: false,
    accept: "image/*",
    name: "file",
    "auto-upload": true,
    limit: 2,
    multiple: false
  },
  {
    typeId: "SORT",
    config: {
      label: i18n.global.t("formgen.config.SORT"),
      tag: "t-sort",
      tagIcon: "sort",
      defaultValue: [],
      span: 24,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true
    },
    sortList: [
      {
        value: 1,
        label: i18n.global.t("formgen.config.SORT1")
      },
      {
        value: 2,
        label: i18n.global.t("formgen.config.SORT2")
      }
    ],
    style: {}
  },
  {
    typeId: "SLIDER",
    config: {
      label: i18n.global.t("formgen.config.SLIDER"),
      tag: "t-slider",
      tagIcon: "slider",
      defaultValue: 0,
      span: 24,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true
    },
    style: {},
    max: 100,
    min: 0,
    step: 1
  },
  {
    typeId: "HORIZONTAL_INPUT",
    config: {
      label: i18n.global.t("formgen.config.HORIZONTAL_INPUT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "horizontal-input",
      showDefaultValue: false,
      tagIcon: "fill-blank",
      required: true,
      span: 24,
      defaultValue: [],
      showRegList: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    input: i18n.global.t("formgen.config.Enter_HORIZONTAL_INPUT"),
    placeholder: i18n.global.t("formgen.config.Enter_HORIZONTAL_INPUT"),
    style: { width: "100%" }
  }
];

// 选择组件
export const selectComponents = [
  {
    typeId: "SELECT",
    config: {
      label: i18n.global.t("formgen.config.SELECT"),
      showLabel: true,
      labelWidth: null,
      tag: "t-select",
      tagIcon: "select",
      mobileTag: "mobile-t-select",
      span: 24,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true,
      // 0 静态数据  1 动态数据
      optionsType: 0,
      dynamicOptions: {
        url: "",
        dataPath: "",
        valueField: "",
        labelField: ""
      },
      options: [
        {
          label: i18n.global.t("formgen.config.value1"),
          value: 1
        },
        {
          label: i18n.global.t("formgen.config.value2"),
          value: 2
        }
      ]
    },
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    style: { width: "100%" },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  },
  {
    typeId: "CASCADER",
    config: {
      label: i18n.global.t("formgen.config.CASCADER"),
      url: "",
      method: "get",
      dataKey: "list",
      showLabel: true,
      labelWidth: null,
      tag: "t-cascader",
      tagIcon: "cascader",
      defaultValue: [],
      // 公式校验
      formulaValidate: [],
      // dataType: 'static',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      // 0 静态数据  1 动态数据
      optionsType: 0,
      dynamicOptions: {
        url: "",
        dataPath: "",
        valueField: "",
        labelField: "",
        childrenField: ""
      },
      options: [
        {
          id: 1,
          value: 1,
          label: i18n.global.t("formgen.config.value1"),
          children: [
            {
              id: 2,
              value: 2,
              label: i18n.global.t("formgen.config.value3")
            }
          ]
        }
      ]
    },
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    style: { width: "100%" },
    props: {
      props: {
        multiple: false,
        label: "label",
        value: "value",
        children: "children"
      }
    },
    "show-all-levels": true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: "/"
  },
  {
    typeId: "RADIO",
    config: {
      label: i18n.global.t("formgen.config.RADIO"),
      labelWidth: null,
      showLabel: true,
      showRegList: false,
      tag: "t-radio-group",
      tagIcon: "radio",
      changeTag: true,
      defaultValue: undefined,
      inline: true,
      span: 24,
      optionType: "default",
      regList: [],
      // 公式校验
      formulaValidate: [],
      required: true,
      border: false,
      // 其他是否必填
      otherRequired: true,
      // 显示投票结果
      showVoteResult: false,
      // 0 静态数据  1 动态数据
      optionsType: 0,
      dynamicOptions: {
        url: "",
        dataPath: "",
        valueField: "",
        labelField: ""
      },
      options: [
        {
          label: i18n.global.t("formgen.config.value1"),
          type: "option",
          value: 1,
          quotaSetting: null // 名额设置
        },
        {
          label: i18n.global.t("formgen.config.value2"),
          type: "option",
          value: 2,
          quotaSetting: null // 名额设置
        }
      ],
      quotaBlankWarning: "", // 剩余名额为0时，显示文案
      quotaCycleRule: "fixed", // 选项名额重置 fixed：不重置 per_day：按天 per_week：按周
      hideQuota: false, // 选项名额为空时隐藏选项
      hideChoiceWhenQuotaEmpty: false, // 不向填表者展示选项名额剩余数字
      quotaRecoverable: true // 删除数据后，选项名额自动恢复
    },
    style: {},
    disabled: false
  },
  {
    typeId: "CHECKBOX",
    config: {
      label: i18n.global.t("formgen.config.CHECKBOX"),
      tag: "t-checkbox-group",
      tagIcon: "checkbox",
      defaultValue: [],
      span: 24,
      showLabel: true,
      inline: false,
      showRegList: false,
      labelWidth: null,
      optionType: "default",
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true,
      border: false,
      // 其他是否必填
      otherRequired: true,
      // 显示投票结果
      showVoteResult: false,
      // 0 静态数据  1 动态数据
      optionsType: 0,
      dynamicOptions: {
        url: "",
        dataPath: "",
        valueField: "",
        labelField: ""
      },
      options: [
        {
          label: i18n.global.t("formgen.config.value1"),
          type: "option",
          value: 1,
          quotaSetting: null // 名额设置
        },
        {
          label: i18n.global.t("formgen.config.value2"),
          type: "option",
          value: 2,
          quotaSetting: null
        }
      ],
      exclusiveChoiceApiCodes: [], // 互斥选项
      withExclusiveChoice: false, // 是否开启互斥

      quotaBlankWarning: "", // 剩余名额为0时，显示文案
      quotaCycleRule: "fixed", // 选项名额重置 fixed：不重置 per_day：按天 per_week：按周

      hideQuota: false, // 选项名额为空时隐藏选项
      hideChoiceWhenQuotaEmpty: false, // 不向填表者展示选项名额剩余数字
      quotaRecoverable: true // 删除数据后，选项名额自动恢复
    },
    style: {},
    min: null,
    max: null,
    disabled: false
  },
  {
    typeId: "IMAGE_SELECT",
    config: {
      label: i18n.global.t("formgen.config.IMAGE_SELECT"),
      showLabel: true,
      labelWidth: null,
      defaultValue: null,
      showDefaultValue: true,
      showRequired: true,
      showClearable: false,
      showRegList: false,
      // 显示投票结果
      showVoteResult: false,
      tag: "t-image-select",
      tagIcon: "image-select",
      span: 24,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true,
      options: [
        {
          label: i18n.global.t("formgen.config.value1"),
          value: 1
        }
      ]
    },
    multiple: false,
    style: { width: "100%" }
  }
];

// 高阶组件 【左面板】
export const advancedComponents = [
  {
    typeId: "SIGN_PAD",
    config: {
      label: i18n.global.t("formgen.config.SIGN_PAD"),
      defaultValue: "",
      showLabel: true,
      showDefaultValue: true,
      showRequired: true,
      showClearable: false,
      showRegList: false,
      tag: "sign-pad",
      mobileTag: "mobile-sign-pad",
      tagIcon: "sign-pad",
      span: 24,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: false
    },
    color: "#000000",
    style: { width: "100%" },
    action: "/form/file/upload/"
  },
  {
    typeId: "PROVINCE_CITY",
    config: {
      label: i18n.global.t("formgen.config.PROVINCE_CITY"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "province-city",
      // 移动端组件
      mobileTag: "mobile-province-city",
      tagIcon: "city",
      defaultValue: undefined,
      required: true,
      span: 24,
      showRegList: false,
      requireDetailAddr: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    placeholder: i18n.global.t("formgen.config.selectCity"),
    style: { width: "100%" }
  },
  {
    typeId: "INPUT_MAP",
    config: {
      label: i18n.global.t("formgen.config.INPUT_MAP"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      mobileTag: "input-map",
      tag: "input-map",
      tagIcon: "map",
      defaultValue: undefined,
      required: true,
      span: 24,
      showRegList: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    placeholder: i18n.global.t("formgen.config.location"),
    style: { width: "100%" },
    longAndLat: false
  },
  {
    typeId: "PHONE_VERIFICATION",
    config: {
      label: i18n.global.t("formgen.config.PHONE_VERIFICATION"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "phone-verification",
      // mobileTag: 'mobile-phone-verification',
      tagIcon: "mobile",
      defaultValue: undefined,
      required: true,
      span: 24,
      showRegList: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    style: { width: "100%" }
  },
  {
    typeId: "NPS",
    config: {
      label: i18n.global.t("formgen.config.NPS"),
      tag: "t-nps",
      tagIcon: "nps",
      defaultValue: 0,
      span: 24,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      required: true,
      regList: [],
      // 公式校验
      formulaValidate: [],
      changeTag: true
    },
    table: {
      copyWriting: {
        max: i18n.global.t("formgen.config.max"),
        min: i18n.global.t("formgen.config.min")
      },
      // 起始值
      min: 1,
      level: 10
    },
    style: {},
    "allow-half": false,
    "show-text": false,
    "show-score": false,
    disabled: false
  },
  {
    typeId: "SUB_FORM",
    config: {
      label: i18n.global.t("formgen.config.SUB_FORM"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-sub-form",
      mobileTag: "mobile-t-sub-form",
      tagIcon: "sub-form",
      defaultValue: [],
      required: true,
      span: 24,
      showRegList: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    childList: [],
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "OCR",
    config: {
      label: i18n.global.t("formgen.config.OCR"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-ocr",
      tagIcon: "ocr",
      defaultValue: [],
      required: false,
      span: 24,
      showRegList: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    ocrType: "GENERAL",
    // 识别字段和表单映射规则
    fieldMapping: {},
    placeholder: "",
    style: { width: "100%" }
  },
  {
    // 组件的自定义配置
    typeId: "SCAN",
    config: {
      label: i18n.global.t("formgen.config.SCAN"),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "t-scan",
      tagIcon: "scan",
      defaultValue: undefined,
      required: true,
      span: 24,
      // 正则校验规则
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: i18n.global.t("formgen.config.pleaseEnter"),
    style: { width: "100%" },
    clearable: true,
    // 开启截取
    openCut: false,
    // 截取开始位置
    cutStart: 0,
    // 截取结束位置
    cutEnd: 0,
    // 启用微信扫码
    enableWxScan: false
  },
  {
    typeId: "RANDOM_NUMBER",
    config: {
      label: i18n.global.t("formgen.config.RANDOM_NUMBER"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-random-number",
      tagIcon: "random-number",
      showDefaultValue: false,
      defaultValue: [],
      required: false,
      span: 24,
      showRegList: false,
      regList: [],
      hideType: true
    },
    rules: [{ type: "RAND_NUMBER", label: i18n.global.t("formgen.config.RANDOM_NUMBER"), length: 5 }],
    // 提交后可见
    submitVisible: true,
    style: { width: "100%" }
  },
  {
    typeId: "FUNCTION_CALC",
    config: {
      label: i18n.global.t("formgen.config.FUNCTION_CALC"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-fun-calc",
      tagIcon: "fx",
      showDefaultValue: false,
      defaultValue: "",
      required: false,
      span: 24,
      showRegList: false,
      regList: []
    },
    readonly: false,
    calcFormula: "",
    "prefix-icon": "",
    style: { width: "100%" }
  },
  {
    typeId: "GOODS_SELECT",
    config: {
      label: i18n.global.t("formgen.config.GOODS_SELECT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-goods",
      tagIcon: "goods",
      span: 24,
      showDefaultValue: false,
      defaultValue: {},
      showRequired: true,
      required: true,
      showRegList: false,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    // 显示库存
    showInventory: true,
    goodsList: [
      {
        id: 1,
        imgList: [],
        goodsName: i18n.global.t("formgen.config.goods1"),
        description: "",
        price: 100,
        count: 0,
        inventory: 100
      }
    ],
    style: { width: "100%" }
  },
  {
    // 组件的自定义配置
    typeId: "CONFIRMATION_CODE",
    config: {
      label: i18n.global.t("formgen.config.CONFIRMATION_CODE"),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "confirmation-code",
      tagIcon: "verificationCode",
      defaultValue: undefined,
      required: true,
      span: 24,
      hideType: true,
      regList: [],
      // 公式校验
      formulaValidate: []
    },
    //有效期类型
    validityType: "DEFINITE_DATE",
    // 固定时间
    definiteDate: null,
    // 有效天数
    dynamicDay: null,
    displayText: "",
    reConfirm: true,
    confirmationCodeType: "BAR_CODE"
  },
  {
    // 组件的自定义配置
    typeId: "FACE_IDENTIFY",
    config: {
      label: i18n.global.t("formgen.config.FACE_IDENTIFY"),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "face-identify",
      tagIcon: "face",
      defaultValue: {},
      required: true,
      span: 24
    }
  },
  {
    // 组件的自定义配置
    typeId: "VALIDATE_CODE",
    config: {
      label: i18n.global.t("formgen.config.VALIDATE_CODE"),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "validate-code",
      tagIcon: "validatecode",
      defaultValue: undefined,
      required: true,
      span: 24,
      hideType: false,
      regList: []
    },
    // 长度
    length: 4
  }
];

// 预约组件 【左面板】
export const reseverComponents = [
  {
    typeId: "RESERVE_DAY",
    config: {
      label: i18n.global.t("formgen.config.RESERVE_DAY"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-reserve",
      tagIcon: "reserve",
      showDefaultValue: false,
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    reserveProjectList: [
      {
        id: 1,
        name: i18n.global.t("formgen.config.value1"),
        // 每周预约名额
        quotaWeek: {
          // 周日到周六
          0: null,
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null
        },
        // 预约时间范围 1:长期预约 2.限时预约
        reserveDateRangeType: 1,
        // 预约时间范围
        reserveDateRange: [],
        // 开放预约的星期几
        openWeekDays: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    style: { width: "100%" }
  },
  {
    typeId: "RESERVE_TIME_RANGE",
    config: {
      label: i18n.global.t("formgen.config.RESERVE_TIME_RANGE"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-reserve-time-range",
      tagIcon: "reserve-time",
      showDefaultValue: false,
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    reserveProjectList: [
      {
        id: 1,
        name: i18n.global.t("formgen.config.value1"),
        timeRangeList: [],
        // 预约时间范围 1:长期预约 2.限时预约
        reserveDateRangeType: 1,
        // 预约时间范围
        reserveDateRange: [],
        // 开放预约的星期几
        openWeekDays: [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    style: { width: "100%" }
  }
];

// 矩阵组件 【左面板】
export const matrixComponents = [
  {
    typeId: "MATRIX_INPUT",
    config: {
      label: i18n.global.t("formgen.config.MATRIX_INPUT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "matrix-input",
      mobileTag: "mobile-matrix-input",
      tagIcon: "Matrix-filling",
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    table: {
      rows: [
        {
          label: i18n.global.t("formgen.config.row1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.row2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.row3"),
          id: 3
        }
      ],
      columns: [
        {
          label: i18n.global.t("formgen.config.col1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.col2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.col3"),
          id: 3
        }
      ]
    },
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "MATRIX_SELECT",
    config: {
      label: i18n.global.t("formgen.config.MATRIX_SELECT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "matrix-select",
      mobileTag: "mobile-matrix-select",
      tagIcon: "multiple-fill-blank",
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    table: {
      rows: [
        {
          label: i18n.global.t("formgen.config.row1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.row2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.row3"),
          id: 3
        }
      ],
      columns: [
        {
          label: i18n.global.t("formgen.config.col1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.col2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.col3"),
          id: 3
        }
      ]
    },
    // 选项可选次数
    columnSelectedCountRule: {},
    multiple: false,
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "MATRIX_SCALE",
    config: {
      label: i18n.global.t("formgen.config.MATRIX_SCALE"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "matrix-scale",
      mobileTag: "mobile-matrix-scale",
      tagIcon: "oil-table-chart",
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    table: {
      rows: [
        {
          label: i18n.global.t("formgen.config.row1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.row2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.row3"),
          id: 3
        }
      ],
      copyWriting: {
        max: i18n.global.t("formgen.config.min"),
        min: i18n.global.t("formgen.config.max")
      },
      level: 5
    },
    icon: "tduck-star",
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "MATRIX_SLIDER",
    config: {
      label: i18n.global.t("formgen.config.MATRIX_SLIDER"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "matrix-slider",
      mobileTag: "mobile-matrix-slider",
      tagIcon: "matrix-slider",
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    table: {
      rows: [
        {
          label: i18n.global.t("formgen.config.row1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.row2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.row3"),
          id: 3
        }
      ]
    },
    min: 1,
    max: 10,
    unit: "",
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "MATRIX_DROPDOWN",
    config: {
      label: i18n.global.t("formgen.config.MATRIX_DROPDOWN"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "matrix-dropdown",
      mobileTag: "mobile-matrix-dropdown",
      tagIcon: "matrix-dropdown",
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    table: {
      rows: [
        {
          label: i18n.global.t("formgen.config.row1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.row2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.row3"),
          id: 3
        }
      ],
      columns: [
        {
          label: i18n.global.t("formgen.config.col1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.col2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.col3"),
          id: 3
        }
      ]
    },
    options: [
      {
        label: i18n.global.t("formgen.config.value1"),
        score: 1
      },
      {
        label: i18n.global.t("formgen.config.value2"),
        score: 2
      }
    ],
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "TABLE_SELECT",
    config: {
      label: i18n.global.t("formgen.config.TABLE_SELECT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "table-select",
      mobileTag: "mobile-table-select",
      tagIcon: "table-select",
      defaultValue: {},
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    table: {
      rows: [
        {
          label: i18n.global.t("formgen.config.row1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.row2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.row3"),
          id: 3
        }
      ],
      columns: [
        {
          label: i18n.global.t("formgen.config.col1"),
          id: 1
        },
        {
          label: i18n.global.t("formgen.config.col2"),
          id: 2
        },
        {
          label: i18n.global.t("formgen.config.col3"),
          id: 3
        }
      ]
    },
    currentRowAndCol: {
      rowIndex: 0,
      colIndex: 0,
      type: "RADIO"
    },
    tableOptions: [
      [
        {
          type: "RADIO",
          options: [
            { label: i18n.global.t("formgen.config.value1"), score: 1 },
            { label: i18n.global.t("formgen.config.value2"), score: 2 }
          ]
        },
        {
          type: "RADIO",
          options: [
            { label: i18n.global.t("formgen.config.value1"), score: 1 },
            { label: i18n.global.t("formgen.config.value2"), score: 2 }
          ]
        }
      ],
      [
        {
          type: "RADIO",
          options: [
            { label: i18n.global.t("formgen.config.value1"), score: 1 },
            { label: i18n.global.t("formgen.config.value2"), score: 2 }
          ]
        },
        {
          type: "RADIO",
          options: [
            { label: i18n.global.t("formgen.config.value1"), score: 1 },
            { label: i18n.global.t("formgen.config.value2"), score: 2 }
          ]
        }
      ]
    ],
    firstColName: "",
    placeholder: "",
    style: { width: "100%" }
  }
];

// 排版组件 【左面板】
export const composeComponents = [
  {
    typeId: "PAGINATION",
    config: {
      label: i18n.global.t("formgen.config.PAGINATION"),
      defaultValue: i18n.global.t("formgen.config.paginationText"),
      displayType: true,
      showLabel: false,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: "form-pagination",
      tagIcon: "page",
      span: 24,
      required: false,
      regList: [],
      changeTag: false
    },
    prev: true,
    currPage: true,
    totalPage: true,
    currPageNum: 1,
    totalPageNum: 1,
    style: { width: "100%" }
  },
  {
    typeId: "DIVIDER",
    config: {
      label: i18n.global.t("formgen.config.DIVIDER"),
      defaultValue: "",
      displayType: true,
      showLabel: false,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: "t-divider",
      tagIcon: "divider",
      span: 24,
      required: false,
      regList: [],
      changeTag: false
    },
    color: "#dcdfe6",
    content: "",
    style: { width: "100%" }
  },
  {
    typeId: "BUTTON",
    config: {
      label: i18n.global.t("formgen.config.BUTTON"),
      defaultValue: "",
      displayType: true,
      showLabel: false,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: "t-button",
      tagIcon: "button-assembly",
      span: 24,
      required: false,
      regList: [],
      changeTag: false,
      width: "20",
      buttonFunction: "drop"
    },
    icon: "el-icon-link",
    arrange: "left",
    content: i18n.global.t("formgen.config.buttonText"),
    style: { width: "100%" }
  },
  {
    typeId: "IMAGE",
    config: {
      label: i18n.global.t("formgen.config.IMAGE"),
      showLabel: false,
      displayType: true,
      labelWidth: null,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: "t-image",
      tagIcon: "image",
      span: 24,
      required: false,
      regList: [],
      changeTag: true,
      error: "image"
    },
    style: { width: "100%" },
    src: "",
    fit: "contain",
    alt: ""
  },
  {
    typeId: "IMAGE_CAROUSEL",
    config: {
      label: i18n.global.t("formgen.config.IMAGE_CAROUSEL"),
      showLabel: false,
      displayType: true,
      imageFit: "contain",
      height: 300,
      mHeight: 150,
      labelWidth: null,
      defaultValue: null,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: "t-image-carousel",
      tagIcon: "image-carousel",
      span: 24,
      required: false,
      regList: [],
      changeTag: true,
      options: [
        {
          label: i18n.global.t("formgen.config.IMAGE_CAROUSEL"),
          image: ""
        }
      ]
    },
    style: { width: "100%" }
  },
  {
    typeId: "DESC_TEXT",
    config: {
      label: i18n.global.t("formgen.config.DESC_TEXT"),
      defaultValue: "",
      displayType: true,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: "desc-text",
      tagIcon: "rich-text",
      span: 24,
      required: false,
      regList: [],
      changeTag: false
    },
    content: i18n.global.t("formgen.config.DESC_TEXT_EXAMPLE"),
    style: { width: "100%" }
  }
];

// 人员组织 【左面板】
export const deptComponents = [
  {
    typeId: "USER_SELECT",
    config: {
      label: i18n.global.t("formgen.config.USER_SELECT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-user-select",
      tagIcon: "user-select",
      defaultValue: [],
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    placeholder: "",
    style: { width: "100%" }
  },
  {
    typeId: "DEPT_SELECT",
    config: {
      label: i18n.global.t("formgen.config.DEPT_SELECT"),
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: "t-dept-select",
      tagIcon: "dept-select",
      defaultValue: [],
      required: true,
      span: 24,
      showRegList: false,
      regList: []
    },
    placeholder: "",
    style: { width: "100%" }
  }
];

export const allComponents = [
  {
    title: i18n.global.t("formgen.config.basicComponents"),
    list: basicComponents
  },
  {
    title: i18n.global.t("formgen.config.selectComponents"),
    list: selectComponents
  },
  {
    title: i18n.global.t("formgen.config.advancedComponents"),
    list: advancedComponents
  },
  {
    title: i18n.global.t("formgen.config.reseverComponents"),
    list: reseverComponents
  },
  {
    title: i18n.global.t("formgen.config.matrixComponents"),
    list: matrixComponents
  },
  {
    title: i18n.global.t("formgen.config.composeComponents"),
    list: composeComponents
  },
  {
    title: i18n.global.t("formgen.config.deptComponents"),
    list: deptComponents
  }
];
export default { allComponents, composeComponents };

export let componentsObj: any = {};

export function getAllComponentsObj() {
  if (!componentsObj || !Object.keys(componentsObj).length) {
    initComponentsObj();
  }
  return componentsObj;
}

function initComponentsObj() {
  allComponents.forEach(comps => {
    comps.list.forEach(item => {
      componentsObj[item.typeId] = item;
    });
  });
}
