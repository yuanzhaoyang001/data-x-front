import { drop, find, replace, toLower } from "lodash-es";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { allComponents } from "@/views/formgen/components/GenerateForm/config";

const allComponentList = allComponents.map(item => item.list).flat();

/**
 * 解析文本
 * @param text 文本
 */
export function parseText(text: string): BasicComponent[] {
  let fields: BasicComponent[] = [];
  // 根据每个开始的题目分割 比如【单行文本
  let items = text.split(/【/g);
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (!item) {
      continue;
    }
    // 根据换行风格
    let options = item.split("\n");
    if (options) {
      let title = replace(options[0], /.*?】/g, "");
      // 找到类型文字
      let type = options[0].substr(0, options[0].indexOf("】"));
      let fieldConfig = find(allComponentList, (o: any) => o.config.label === type);
      if (!fieldConfig) {
        continue;
      }
      let tempFieldConfig: BasicComponent = JSON.parse(JSON.stringify(fieldConfig));
      // 找到题目数据定义
      tempFieldConfig.config.formId = `${toLower(tempFieldConfig.typeId)}${new Date().getTime() + i}`;
      // 分数解析出来
      const score = extractAndCountParentheses(title);
      if (score) {
        tempFieldConfig.examConfig = {
          answer: "",
          answerAnalysis: "",
          enableScore: true,
          score: score,
          scoringType: 1,
          showAnswer: false
        };
        // title移除分数
        title = title.replace(`（${score}分）`, "").replace(`(${score}分)`, "");
      } else {
        tempFieldConfig.examConfig = {
          answer: "",
          answerAnalysis: "",
          enableScore: false,
          score: 0,
          scoringType: 1,
          showAnswer: false
        };
      }
      tempFieldConfig.config.label = title;
      tempFieldConfig.vModel = `${tempFieldConfig.config.formId}`;
      if (fieldConfig.typeId === "DESC_TEXT") {
        tempFieldConfig.content = title;
      } else if (["INPUT", "NUMBER", "TEXTAREA"].includes(fieldConfig.typeId)) {
        // 第一个是题目
        if (options.length > 1) {
          tempFieldConfig.examConfig.scoringType = 3;
          tempFieldConfig.examConfig.answer = options[1].trim().replace("正确答案：", "").replace("正确答案", "");
          if (options[2]) {
            tempFieldConfig.examConfig.answerAnalysis = options[2].trim().replace("答案解析：", "").replace("答案解析", "");
          }
        }
      } else if (["CHECKBOX", "RADIO", "SELECT", "IMAGE_SELECT"].includes(fieldConfig.typeId)) {
        parseOptionItem(item, tempFieldConfig);
      }
      fields.push(tempFieldConfig);
    }
  }
  return fields;
}

/**
 * 解析选项
 * @param item 题目定义
 * @param component 组件定义
 */
const parseOptionItem = (item: string, component: BasicComponent) => {
  let options = item.split("\n");
  if (component.config.options) {
    // 删除第一个 因为第一个是题目
    // @ts-ignore
    let optionList = drop(options);
    // 剩下的才是选项
    let itemOptions = [];
    for (let j = 0; j < optionList.length; j++) {
      let option = optionList[j];
      if (option && !option.trim().startsWith("答案解析")) {
        // 正确答案
        const id = new Date().getTime() + j;
        if (option.indexOf("正确答案") > -1) {
          if (!component.examConfig!.answer) {
            component.examConfig!.answer = [id];
          } else {
            component.examConfig!.answer.push(id);
          }
          component.examConfig!.scoringType = 1;
          option = option.replace("(正确答案)", "").replace("（正确答案）", "").replace("正确答案：", "");
        }
        itemOptions.push({
          label: option,
          value: id
        });
      } else if (option && option.trim().startsWith("答案解析")) {
        component.examConfig!.answerAnalysis = option.trim().replace("答案解析：", "").replace("答案解析", "");
      }
    }
    component.config.options = itemOptions;
  }
};

/**
 * 提取分数
 * @param str
 */
const extractAndCountParentheses = (str: string): number => {
  // 匹配括号内的数字和汉字
  const regex = /[(（]([\d一二三四五六七八九十]+)分[)）]/g;

  // 使用 match 方法查找匹配项
  const matches = str.match(regex);

  if (matches) {
    // 提取每个括号中的数字和汉字并输出
    let score = 0;
    matches.forEach((match, index) => {
      const matchResult = match.match(/[(（]([\d一二三四五六七八九十]+)分[)）]/);
      if (matchResult) {
        const number = matchResult[1];
        console.log(`括号 ${index + 1}: 包含数字 ${number} 分`);
        score = Number(number);
      }
    });
    return score;
  } else {
    console.log("字符串中未找到括号");
    return 0; // 如果没有找到括号，返回 0 分
  }
};
