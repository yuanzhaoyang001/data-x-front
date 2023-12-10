import {
  allComponents as allExamComponents,
  examConf,
  getExamComponentsObj
} from "@/views/formgen/components/GenerateForm/examConfig";
import { allMarketingComponents, getMarketingComponentsObj } from "@/views/formgen/components/GenerateForm/marketingConfig";
import { allComponents, formConf, getAllComponentsObj } from "@/views/formgen/components/GenerateForm/config";

export function useComponents() {
  function getAllComponents(type: number | null = 1) {
    if (type == 4) {
      return allExamComponents;
    } else if (type === 5) {
      return allMarketingComponents;
    }
    return allComponents;
  }

  function getFormConfig(type: number = 1) {
    if (type === 4) {
      return examConf;
    }
    return formConf;
  }

  function getComponentsObj(type = 1) {
    if (type === 4) {
      return getExamComponentsObj();
    } else if (type === 5) {
      return getMarketingComponentsObj();
    }
    return getAllComponentsObj();
  }

  return {
    getAllComponents,
    getFormConfig,
    getComponentsObj
  };
}
