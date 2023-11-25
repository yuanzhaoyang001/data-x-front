// eslint-disable-next-line no-unused-vars
// const amapKey = process.env.VUE_APP_MAP_KEY
// eslint-disable-next-line no-unused-vars
const amapVersion = "2.0";
const _createScript = url => {
  const jsapi = document.createElement("script");
  jsapi.charset = "utf-8";
  jsapi.src = url;
  document.head.appendChild(jsapi);
};

export default () =>
  new Promise(resolve => {
    if (!window.AMap) {
      window._AMapSecurityConfig = {
        securityJsCode: "f46f6a2232696d90b43b6bb9a5e06299"
      };
      // 判断window下有没有AMap对象，再判断是否引入cdn地图
      _createScript("https://webapi.amap.com/maps?v=2.0&key=d04c41dc23d67f0261c36e0dfa0dc817&&callback=aMapInitCallback");
      window.aMapInitCallback = () => {
        _createScript("//webapi.amap.com/ui/1.1/main.js");
        // 创建定时器 当AMapUI有值的时候 清除定时器 并resolve
        const interval = setInterval(() => {
          if (window.AMapUI) {
            clearInterval(interval);
            resolve(window.AMap);
          }
        }, 50);
      };
    } else resolve(window.AMap);
  });
