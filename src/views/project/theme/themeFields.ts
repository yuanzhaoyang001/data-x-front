export default [
  {
    sort: 65536,
    style: {
      width: "100%"
    },
    config: {
      tag: "t-input",
      span: 24,
      label: "<p>单行文本</p>",
      append: "",
      formId: "input1691465572541",
      prepend: "",
      regList: [],
      tagIcon: "input",
      dataType: {
        type: "",
        message: ""
      },
      required: true,
      changeTag: true,
      renderKey: "input16914655725411691465572541",
      showLabel: true,
      labelWidth: null,
      defaultValue: null
    },
    typeId: "INPUT",
    vModel: "input1691465572541",
    disabled: false,
    readonly: false,
    clearable: true,
    maxlength: null,
    minlength: null,
    notRepeat: false,
    placeholder: "请输入单行文本",
    "prefix-icon": "",
    "suffix-icon": "",
    "show-word-limit": false,
    dId: 60378,
    displayType: false,
    regList: [],
    formItemId: "input1691465572541",
    key: "input1691465572541169147506108160378"
  },
  {
    max: 100000000,
    min: null,
    step: 1,
    style: {
      width: "100%"
    },
    config: {
      tag: "t-number",
      span: 24,
      label: "数字组件",
      formId: "number1691474889239",
      regList: [],
      tagIcon: "number",
      required: true,
      changeTag: true,
      renderKey: "number16914748892391691474889239",
      showLabel: true,
      labelWidth: null,
      defaultValue: null
    },
    typeId: "NUMBER",
    vModel: "number1691474889239",
    disabled: false,
    precision: null,
    placeholder: "请输入数字组件",
    dId: 60381,
    sort: 327680,
    displayType: false,
    regList: [],
    formItemId: "number1691474889239",
    key: "number1691474889239169147506108160381"
  },
  {
    type: "textarea",
    style: {
      width: "100%"
    },
    config: {
      tag: "t-textarea",
      span: 24,
      label: "多行文本",
      formId: "textarea1691474890294",
      regList: [],
      tagIcon: "textarea",
      required: true,
      changeTag: true,
      renderKey: "textarea16914748902941691474890294",
      showLabel: true,
      labelWidth: null,
      defaultValue: null
    },
    typeId: "TEXTAREA",
    vModel: "textarea1691474890294",
    autosize: {
      maxRows: 4,
      minRows: 4
    },
    disabled: false,
    readonly: false,
    maxlength: null,
    minlength: null,
    placeholder: "请输入多行文本",
    "show-word-limit": false,
    dId: 60382,
    sort: 393216,
    displayType: false,
    regList: [],
    formItemId: "textarea1691474890294",
    key: "textarea1691474890294169147506108160382"
  },
  {
    type: "date",
    style: {
      width: "100%"
    },
    config: {
      tag: "t-date-time",
      span: 24,
      label: "日期时间",
      formId: "date1691474890806",
      regList: [],
      tagIcon: "date",
      required: true,
      changeTag: true,
      renderKey: "date16914748908061691474890806",
      showLabel: true,
      labelWidth: null,
      defaultValue: null,
      defaultNowTime: false
    },
    format: "YYYY-MM-DD",
    typeId: "DATE",
    vModel: "date1691474890806",
    disabled: false,
    readonly: false,
    clearable: true,
    placeholder: "请选择日期时间",
    "value-format": "YYYY-MM-DD",
    dId: 60383,
    sort: 458752,
    displayType: false,
    regList: [],
    formItemId: "date1691474890806",
    key: "date1691474890806169147506108160383"
  },
  {
    max: 5,
    style: {},
    config: {
      tag: "t-rate",
      span: 24,
      label: "评分组件",
      formId: "rate1691474891634",
      regList: [],
      tagIcon: "rate",
      required: true,
      changeTag: true,
      renderKey: "rate16914748916341691474891634",
      showLabel: true,
      labelWidth: null,
      showRegList: false,
      defaultValue: 0
    },
    typeId: "RATE",
    vModel: "rate1691474891634",
    disabled: false,
    "show-text": false,
    "allow-half": false,
    "show-score": false,
    dId: 60384,
    sort: 524288,
    displayType: false,
    regList: [],
    placeholder: "此题为必填项目",
    formItemId: "rate1691474891634",
    key: "rate1691474891634169147506108160384"
  },
  {
    max: 100,
    min: 0,
    step: 1,
    style: {},
    config: {
      tag: "t-slider",
      span: 24,
      label: "滑块组件",
      formId: "slider1691474893606",
      regList: [],
      tagIcon: "slider",
      required: true,
      changeTag: true,
      renderKey: "slider16914748936061691474893606",
      showLabel: true,
      labelWidth: null,
      showRegList: false,
      defaultValue: 0
    },
    typeId: "SLIDER",
    vModel: "slider1691474893606",
    dId: 60385,
    sort: 589824,
    displayType: false,
    regList: [],
    placeholder: "此题为必填项目",
    formItemId: "slider1691474893606",
    key: "slider1691474893606169147506108160385"
  },
  {
    style: {
      width: "100%"
    },
    config: {
      tag: "t-select",
      span: 24,
      label: "下拉选择",
      formId: "select1691474896430",
      options: [
        {
          label: "选项一",
          value: 1
        },
        {
          label: "选项二",
          value: 2
        }
      ],
      regList: [],
      tagIcon: "select",
      required: true,
      changeTag: true,
      mobileTag: "mobile-t-select",
      renderKey: "select16914748964301691474896430",
      showLabel: true,
      labelWidth: null,
      optionsType: 0,
      dynamicOptions: {
        url: "",
        dataPath: "",
        labelField: "",
        valueField: ""
      },
      defaultValue: null
    },
    typeId: "SELECT",
    vModel: "select1691474896430",
    disabled: false,
    multiple: false,
    clearable: true,
    filterable: false,
    placeholder: "请选择下拉选择",
    dId: 60386,
    sort: 655360,
    displayType: false,
    regList: [],
    formItemId: "select1691474896430",
    key: "select1691474896430169147506108160386"
  },
  {
    sort: 720896,
    style: {},
    config: {
      tag: "t-radio-group",
      span: 24,
      label: "单选框组",
      border: false,
      formId: "radio1691474897466",
      inline: true,
      options: [
        {
          type: "option",
          label: "选项一",
          value: 1,
          quotaSetting: null
        },
        {
          type: "option",
          label: "选项二",
          value: 2,
          quotaSetting: null
        }
      ],
      regList: [],
      tagIcon: "radio",
      required: true,
      changeTag: true,
      hideQuota: false,
      renderKey: "radio16914748974661691474897466",
      showLabel: true,
      labelWidth: null,
      optionType: "default",
      optionsType: 0,
      showRegList: false,
      otherRequired: true,
      dynamicOptions: {
        url: "",
        dataPath: "",
        labelField: "",
        valueField: ""
      },
      quotaCycleRule: "fixed",
      showVoteResult: false,
      quotaRecoverable: true,
      quotaBlankWarning: "",
      withExclusiveChoice: false,
      exclusiveChoiceApiCodes: [],
      hideChoiceWhenQuotaEmpty: false,
      defaultValue: null
    },
    typeId: "RADIO",
    vModel: "radio1691474897466",
    disabled: false,
    dId: 60387,
    displayType: false,
    regList: [],
    placeholder: "此题为必填项目",
    formItemId: "radio1691474897466",
    key: "radio1691474897466169147506108160387"
  },
  {
    max: null,
    min: null,
    style: {},
    config: {
      tag: "t-checkbox-group",
      span: 24,
      label: "多选框组",
      border: false,
      formId: "checkbox1691474899654",
      inline: false,
      options: [
        {
          type: "option",
          label: "选项一",
          value: 1,
          quotaSetting: null
        },
        {
          type: "option",
          label: "选项二",
          value: 2,
          quotaSetting: null
        }
      ],
      regList: [],
      tagIcon: "checkbox",
      required: true,
      changeTag: true,
      hideQuota: false,
      renderKey: "checkbox16914748996541691474899654",
      showLabel: true,
      labelWidth: null,
      optionType: "default",
      optionsType: 0,
      showRegList: false,
      defaultValue: [],
      otherRequired: true,
      dynamicOptions: {
        url: "",
        dataPath: "",
        labelField: "",
        valueField: ""
      },
      quotaCycleRule: "fixed",
      showVoteResult: false,
      quotaRecoverable: true,
      quotaBlankWarning: "",
      withExclusiveChoice: false,
      exclusiveChoiceApiCodes: [],
      hideChoiceWhenQuotaEmpty: false
    },
    typeId: "CHECKBOX",
    vModel: "checkbox1691474899654",
    disabled: false,
    dId: 60388,
    sort: 786432,
    displayType: false,
    regList: [],
    placeholder: "此题为必填项目",
    formItemId: "checkbox1691474899654",
    key: "checkbox1691474899654169147506108160388"
  }
];
