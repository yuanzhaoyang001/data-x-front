// 动态加载css文件

const loadCSS = (url: string, isCache = true) => {
  const element = document.createElement("link");
  element.setAttribute("rel", "stylesheet");
  element.setAttribute("type", "text/css");
  if (!isCache) {
    element.setAttribute("href", url + "?t=" + new Date().getTime());
  } else {
    element.setAttribute("href", url);
  }
  document.head.appendChild(element);
};
/**
 * 动态加载js文件
 * @param {*} src
 * @param {*} callback
 *   loadScript("",function(){
 *   console.log("加载成功")
 * })
 * var that = this; 在方法里面使用that
 */
const loadJS = (src: string, callback: (this: HTMLScriptElement, ev: Event) => void, isCache = true): void => {
  const script = document.createElement("script");
  script.type = "text/JavaScript";
  if (!isCache) {
    script.src = src + "?t=" + new Date().getTime();
  } else {
    script.src = src;
  }
  if (script.addEventListener) {
    script.addEventListener("load", callback, false);
  }
  document.head.appendChild(script);
};

export const loadAll = (callback: () => void) => {
  // 开始加载
  const cssList = ["assets/iconfont/iconfont.css", "css/luckysheet.css", "plugins/plugins.css", "plugins/css/pluginsCss.css"];
  cssList.forEach(item => {
    loadCSS(window.origin + "/luckysheet/" + item);
  });
  let loadedScripts = 0;
  const jsList = ["luckysheet.umd.js","jquery.min.js", "plugins/js/plugin.js"];
  jsList.forEach(item => {
    loadJS(window.origin + "/luckysheet/" + item, () => {
      loadedScripts++;
      if (loadedScripts === jsList.length) {
        callback();
      }
    });
  });
};
