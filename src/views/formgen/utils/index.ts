/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */

/* eslint-disable guard-for-in */
/**
 * num 小于0，左缩进num*2个空格； 大于0，右缩进num*2个空格。
 * @param {string} str 代码
 * @param {number} num 缩进次数
 * @param {number} len 【可选】缩进单位，空格数
 */
export function indent(str, num, len = 2) {
  if (num === 0) return str;
  const isLeft = num < 0;
  const result = [];
  let reg;
  let spaces = "";
  if (isLeft) {
    num *= -1;
    reg = new RegExp(`(^\\s{0,${num * len}})`, "g");
  } else {
    for (let i = 0; i < num * len; i++) spaces += " ";
  }

  str.split("\n").forEach(line => {
    line = isLeft ? line.replace(reg, "") : spaces + line;
    result.push(line);
  });
  return result.join("\n");
}

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase());
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str);
}

export const exportDefault = "export default ";

function stringify(obj) {
  return JSON.stringify(obj, (key, val) => {
    if (typeof val === "function") {
      return `${val}`;
    }
    return val;
  });
}

function parse(str) {
  JSON.parse(str, (k, v) => {
    if (v.indexOf && v.indexOf("function") > -1) {
      return eval(`(${v})`);
    }
    return v;
  });
}

export function jsonClone(obj) {
  return parse(stringify(obj));
}

export function jsonSimpleClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 深拷贝对象
export function deepClone(obj) {
  const _toString = Object.prototype.toString;

  // null, undefined, non-object, function
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  // DOM Node
  if (obj.nodeType && "cloneNode" in obj) {
    return obj.cloneNode(true);
  }

  // Date
  if (_toString.call(obj) === "[object Date]") {
    return new Date(obj.getTime());
  }

  // RegExp
  if (_toString.call(obj) === "[object RegExp]") {
    const flags = [];
    if (obj.global) {
      flags.push("g");
    }
    if (obj.multiline) {
      flags.push("m");
    }
    if (obj.ignoreCase) {
      flags.push("i");
    }

    return new RegExp(obj.source, flags.join(""));
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {};

  for (const key in obj) {
    result[key] = deepClone(obj[key]);
  }

  return result;
}

export function getQueryString(name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
  let r = window.location.search.substr(1).match(reg); // 获取url中"?"符后的字符串并正则匹配
  let context = "";
  // eslint-disable-next-line prefer-destructuring
  if (r != null) context = r[2];
  reg = null;
  r = null;
  // eslint-disable-next-line eqeqeq
  return context == null || context == "" || context == "undefined" ? "" : context;
}

/**
 * 获取当前域名
 *  http://www.baidu.com
 * @returns {string}
 */
export function getCurrentDomain() {
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * 判断是否是Url
 * @param str
 * @returns {boolean}
 */
export function checkIsUrl(str) {
  const oRegUrl = new RegExp();
  // aa.bb.com
  oRegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$");
  if (!oRegUrl.test(str)) {
    return false;
  }
  return true;
}

/**
 * 打开
 * @param url
 */
export function openUrl(url) {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.setAttribute("id", "d2admin-link-temp");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(document.getElementById("d2admin-link-temp"));
}

/**
 * json对象转url参数
 * @param json
 * @returns {string|*}
 */
export function jsonToParam(json) {
  if (!json) return "";
  return Object.keys(json)
    .map(key => {
      if (json[key] === undefined) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    })
    .join("&");
}

/**
 * 是否是json
 * @param str
 * @returns {boolean}
 */
// eslint-disable-next-line no-unused-vars
function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) === "object") {
      return true;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return false;
}

/**
 * 是否是移动端
 * @returns {boolean}
 */
export function isMobile() {
  const info = navigator.userAgent;
  const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
  for (let i = 0; i < agents.length; i++) {
    if (info.indexOf(agents[i]) >= 0) return true;
  }
  return false;
}

/**
 * 去除html标签 空格 保留文本
 */
export function removeHtmlTag(str) {
  if (!str) return "";
  return str
    .replace(/<formvariable[^<]*<\/formvariable>/g, "")
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, "");
}

/**
 * 用正则表达式实现html转码
 */
export function htmlEncodeByRegExp(str) {
  let s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/\s/g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/“/g, "&ldquo;");
  s = s.replace(/”/g, "&rdquo;");
  return s;
}

/**
 * 用正则表达式实现html解码
 */
export function htmlDecodeByRegExp(str) {
  let s = "";
  if (str.length == 0) return "";
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&ldquo;/g, "“");
  s = s.replace(/&rdquo;/g, "”");
  return s;
}
