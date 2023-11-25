import { TinyColor } from "@ctrl/tinycolor";

export const getHoverColor = (baseColor: string) => {
  const color = new TinyColor(baseColor);
  return color.tint(90).toString();
};

export const getHoverColorAmount = (baseColor: string, amount: number) => {
  const color = new TinyColor(baseColor);
  return color.tint(amount).toString();
};

/**
 * 获取主题色的Hover
 *
 */
export const getThemeHoverColor = () => {
  // 从 css var中获取主题色
  const baseColor = getComputedStyle(document.documentElement).getPropertyValue(`--form-theme-color`);
  return getHoverColor(baseColor);
};

export const themeDefaultValues: any = {
  headImgUrl: "",
  logoImgUrl: "",
  backgroundColor: "",
  backgroundImg: "",
  logoPosition: "",
  showFormTitle: true,
  submitBtnText: "提交",
  showFormDescribe: true,
  showFormNumber: false,
  showSubmitBtn: true,
  showSupport: true,
  showFootDescription: false,
  labelFontSize: "14px",
  labelFontColor: "#303133",
  optionFontSize: "14px",
  optionFontColor: "#606266",
  themeColor: getComputedStyle(document.documentElement).getPropertyValue(`--el-color-primary`),
  themeHoverColor: getThemeHoverColor()
};

/**
 * 设置主题变量
 */
export const setThemeVars = (theme: any) => {
  if (!theme || Object.keys(theme).length === 0) {
    setDefaultFormVars();
    return;
  }
  const formWrapDocument = document.querySelector(".t-form-theme-wrap") as HTMLElement;
  if (!formWrapDocument) return;
  Object.keys(theme).forEach(key => {
    let value = theme[key];
    // 布尔类型转换下
    if (key.startsWith("show")) {
      value = value == true ? "block" : "none";
    }
    if (key === "themeColor" && value) {
      formWrapDocument.style.setProperty("--form-theme-color", value);
      formWrapDocument.style.setProperty("--form-theme-hover-color", getHoverColor(value));
      formWrapDocument.style.setProperty("--el-color-primary", value);
    } else {
      // 默认主题
      formWrapDocument.style.setProperty("--form-theme-color", themeDefaultValues.themeColor);
      formWrapDocument.style.setProperty("--form-theme-hover-color", themeDefaultValues.themeHoverColor);
      formWrapDocument.style.setProperty("--el-color-primary", themeDefaultValues.themeColor);
    }
    if (!value) {
      value = themeDefaultValues[key];
    }
    if (value) {
      formWrapDocument.style.setProperty(`--form-theme-${key}`, value);
    }
  });
};

const setDefaultFormVars = () => {
  const formWrapDocument = document.querySelector(".t-form-theme-wrap") as HTMLElement;
  if (!formWrapDocument) return;
  Object.keys(themeDefaultValues).forEach(key => {
    formWrapDocument.style.setProperty(key, themeDefaultValues[key]);
    if (key === "themeColor") {
      const value = themeDefaultValues[key];
      formWrapDocument.style.setProperty("--form-theme-color", value);
      formWrapDocument.style.setProperty("--form-theme-hover-color", getHoverColor(value));
      formWrapDocument.style.setProperty("--el-color-primary", value);
    }
  });
};
