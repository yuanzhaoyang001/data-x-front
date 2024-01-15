const _createScript = (url: string) => {
  const existingScript = document.querySelector(`script[src="${url}"]`);
  if (!existingScript) {
    const jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
};

let isCallbackSet = false;

export default () =>
  new Promise(resolve => {
    if (!window.AMap) {
      window._AMapSecurityConfig = {
        securityJsCode: "0450fd3e8504dc49e8754515f8c9f09a"
      };
      // 判断window下有没有AMap对象，再判断是否引入cdn地图
      _createScript("https://webapi.amap.com/maps?v=2.0&key=2bbf2299b4863b6c7341524deb0a88d7&&callback=aMapInitCallback");
      window.aMapInitCallback = () => {
        _createScript("//webapi.amap.com/ui/1.1/main.js");
        // 创建定时器 当AMapUI有值的时候 清除定时器 并resolve
        const interval = setInterval(() => {
          if (window.AMapUI) {
            clearInterval(interval);
            resolve(window.AMap);
            isCallbackSet = true;
          }
        }, 50);
      };
      // 如果是多次调用 aMapInitCallback只会执行一次 这里补充下 避免一个页面多个地图时不显示
      const interval1 = setInterval(() => {
        if (isCallbackSet) {
          clearInterval(interval1);
          resolve(window.AMap);
        }
      }, 50);
    } else resolve(window.AMap);
  });
