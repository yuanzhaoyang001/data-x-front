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
          tagIcon: "divider",
          span: 24,
          required: false,
          regList: [],
          changeTag: false
        },
        navigationAddress: "橘子洲风景名胜区",
        // 经纬度
        location: [112.963081, 28.196505],
        style: { width: "100%" }
      }
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
