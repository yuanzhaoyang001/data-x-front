import { i18n } from "@/i18n";
import {
  advancedComponents,
  basicComponents,
  composeComponents,
  deptComponents,
  matrixComponents,
  reseverComponents,
  selectComponents
} from "@/views/formgen/components/GenerateForm/config";

export const videoComponent = {
  typeId: "VIDEO",
  config: {
    label: i18n.global.t("formgen.config.VIDEO"),
    defaultValue: "",
    displayType: true,
    showLabel: false,
    showDefaultValue: false,
    showRequired: false,
    showClearable: false,
    showRegList: false,
    tag: "t-video",
    tagIcon: "video",
    span: 24,
    required: false,
    regList: [],
    changeTag: false
  },
  // 地址类型 iframe 或者 video
  urlType: "iframe",
  // 视频地址
  videoUrl: ""
};

// 倒计时组件
export const countDownComponent = {
  typeId: "COUNT_DOWN",
  config: {
    label: i18n.global.t("formgen.config.COUNT_DOWN"),
    defaultValue: "",
    displayType: true,
    showLabel: false,
    showDefaultValue: false,
    showRequired: false,
    showClearable: false,
    showRegList: false,
    tag: "t-count-down",
    tagIcon: "countdown",
    span: 24,
    required: false,
    regList: [],
    changeTag: false
  },
  // 倒计时起止时间1
  startTime: null,
  // 倒计时起止时间2
  endTime: null,
  // 未开始时问文案
  notStartText: "",
  // 已经开始文案
  startedText: "",
  // 结束文案
  endText: "",
  // 背景颜色
  bgColor: "#4c4edb",
  // 文字颜色
  textColor: "#ffffff",
  icon: ""
};

// 轮播表格
export const marqueeListComponent = {
  typeId: "MARQUEE_LIST",
  config: {
    label: i18n.global.t("formgen.config.CAROUSEL_TABLE"),
    defaultValue: "",
    displayType: true,
    showLabel: false,
    showDefaultValue: false,
    showRequired: false,
    showClearable: false,
    showRegList: false,
    tag: "t-marquee-list",
    tagIcon: "marqueeList",
    span: 24,
    required: false,
    regList: [],
    changeTag: false
  },
  title: "标题",
  dataList: "",
  maxHeight: 200,
  vertical: true
};

// 滚动文字
export const scrollTextComponent = {
  typeId: "SCROLL_TEXT",
  config: {
    label: i18n.global.t("formgen.config.SCROLL_TEXT"),
    defaultValue: "",
    displayType: true,
    showLabel: false,
    showDefaultValue: false,
    showRequired: false,
    showClearable: false,
    showRegList: false,
    tag: "t-scroll-text",
    tagIcon: "scrollText",
    span: 24,
    required: false,
    regList: [],
    changeTag: false
  },
  text: "床前明月光，疑似地上霜，举头望明月，低头思故乡",
  fontSize: 16,
  // 普通和渐变
  colorType: "default",
  colorValue: "#000000",
  colorGradient: [],
  // 滚动速度
  speed: 20,
  bold: false,
  italic: false
};

export const contactUsComponents = {
  typeId: "CONTACT_US",
  config: {
    label: i18n.global.t("formgen.config.CONTACT_US"),
    defaultValue: "",
    displayType: true,
    showLabel: false,
    showDefaultValue: false,
    showRequired: false,
    showClearable: false,
    showRegList: false,
    tag: "t-contact-us",
    tagIcon: "contactUs",
    span: 24,
    required: false,
    regList: [],
    changeTag: false
  },
  name: "xxxx科技有限公司",
  logoUrl: "",
  logoWidth: 100,
  logoHeight: 100,
  // 联系方式
  contactType: "1",
  // 联系方式内容
  contactContent: "",
  // 联系按钮文字
  contactBtnText: "联系我们",
  btnColor: "#4c4edb",
  style: { width: "100%" }
};

export const allMarketingComponents = [
  {
    title: i18n.global.t("formgen.config.marketingComponents"),
    list: [
      {
        typeId: "MAP_NAVIGATION",
        config: {
          label: i18n.global.t("formgen.config.MAP_NAVIGATION"),
          defaultValue: "",
          displayType: true,
          showLabel: true,
          showDefaultValue: false,
          showRequired: false,
          showClearable: false,
          showRegList: false,
          tag: "map-navigation",
          tagIcon: "map-nav",
          span: 24,
          required: false,
          regList: [],
          changeTag: false
        },
        navigationAddress: "橘子洲风景名胜区",
        // 经纬度
        location: [112.963081, 28.196505],
        style: { width: "100%" }
      },
      contactUsComponents,
      videoComponent,
      countDownComponent,
      marqueeListComponent,
      scrollTextComponent
    ]
  },
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

interface ComponentsObj {
  [key: string]: any;
}

export let componentsObj: ComponentsObj = {};

export function getMarketingComponentsObj() {
  if (!componentsObj) {
    initComponentsObj();
  }
  return componentsObj;
}

export function initComponentsObj() {
  componentsObj = {};
  allMarketingComponents.forEach(comps => {
    comps.list.forEach(item => {
      componentsObj[item.typeId] = item;
    });
  });
}
