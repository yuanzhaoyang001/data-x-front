import MapLoader from "./amap.ts";

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    longAndLat: {
      type: Boolean,
      default: false
    },
    selectLocation: {
      type: Boolean,
      default: false
    },
    showSerachInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mapId: "",
      inputId: "",
      formattedAddress: "",
      address: "",
      poi: {},
      text: "",
      marker: null,
      map: null,
      box: false,
      showLoding: false
    };
  },
  watch: {
    poi(val) {
      this.formattedAddress = val.formattedAddress;
    },
    value(val) {
      if (!val) {
        this.poi = {};
      }
    },
    text(val) {
      if (val) {
        this.poi = {
          longitude: val[0],
          latitude: val[1],
          formattedAddress: val[2]
        };
        // eslint-disable-next-line prefer-destructuring
        // 如果显示经纬度，拼接参数
        this.address = val[2];
        if (this.longAndLat) {
          this.address = `${this.address}-(经度：${this.poi.longitude}, 纬度：${this.poi.latitude})`;
        }
      }
    },
    box: {
      handler(val) {
        if (this.box) {
          this.$nextTick(() =>
            this.init(() => {
              if (this.longitude && this.latitude) {
                this.addMarker(this.longitude, this.latitude);
                this.getAddress(this.longitude, this.latitude);
              }
            })
          );
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.address = this.value;
    this.mapId = "map__container" + new Date().getTime();
    this.inputId = "map__input" + new Date().getTime();
  },
  methods: {
    clear() {
      this.poi = {};
      this.formattedAddress = "";
      this.clearMarker();
    },
    handleSubmit() {
      this.setVal();
      this.address = this.poi.formattedAddress;
      if (this.longAndLat) {
        this.address = `${this.address}-(经度：${this.poi.longitude}, 纬度：${this.poi.latitude})`;
      }
      this.$emit("update:value", this.address);
      //选择位置后关闭地图
      //this.box = false
    },
    handleClear() {
      this.text = [];
      this.poi = {};
    },
    setVal() {
      this.text = [this.poi.longitude, this.poi.latitude, this.poi.formattedAddress];
    },
    handleShow() {
      // this.$refs.main.blur()
      this.box = true;
    },
    // 新增坐标
    addMarker(lng, lat) {
      this.clearMarker();
      this.marker = new window.AMap.Marker({
        position: [lng, lat]
      });
      this.map.add(this.marker);
    },
    // 清空坐标
    clearMarker() {
      if (this.marker) {
        this.map.remove(this.marker);
        this.marker = null;
      }
    },
    // 获取坐标
    getAddress(lng, lat) {
      const that = this;
      window.AMap.plugin("AMap.Geocoder", () => {
        // 回调函数
        const geocoder = new window.AMap.Geocoder({});
        this.map.setCenter([lng, lat]); //设置地图中心点
        geocoder.getAddress([lng, lat], (status, result) => {
          console.log(result);
          if (status === "complete" && result.info === "OK") {
            const { regeocode } = result;
            that.poi = Object.assign(regeocode, {
              longitude: lng,
              latitude: lat
            });
            // 自定义点标记内容
            that.clearMarker();
            const content = `<div><img class="amap-marker-img" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">
                          <span class="input-map-marker">${that.poi.formattedAddress}</span></div>`;
            that.marker = new window.AMap.Marker({
              content, // 自定义点标记覆盖物内容
              position: [lng, lat],
              title: that.poi.formattedAddress,
              zoom: 20
            });
            that.map.add(that.marker);
            //同步更新到地址栏
            this.handleSubmit();
          }
        });
      });
    },
    // 获取当前位置
    getCurrentLocation() {
      const that = this;
      this.showLoding = true;
      window.AMap.plugin("AMap.Geolocation", () => {
        const geolocation = new window.AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new window.AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "LT"
        });

        geolocation.getCurrentPosition((status, result) => {
          if (status === "complete") {
            console.log("定位成功，执行success");
            // result是具体的定位信息
            console.log(result);
            const { lng, lat } = result.position;
            that.getAddress(lng, lat);
            this.showLoding = false;
          } else {
            console.log("定位失败，执行error");
            console.log(result);
            this.showLoding = false;
          }
        });
      });
    },
    handleClose() {
      window.poiPicker.clearSearchResults();
      this.box = false;
    },
    addClick() {
      //仅开启选选择坐标才允许点击选取坐标
      if (this.selectLocation) {
        this.map.on("click", e => {
          // if (this.disabled) return
          console.log(e);
          const { lnglat } = e;
          // 经度
          const { lng } = lnglat;
          // 纬度
          const { lat } = lnglat;
          this.addMarker(lng, lat);
          this.getAddress(lng, lat);
        });
      }
    },
    init() {
      MapLoader().then(
        AMap => {
          console.log("地图加载成功");
          this.map = new AMap.Map(this.mapId, {
            zoom: 15,
            // 自动定位到所在城市并显示
            resizeEnable: true,
            // eslint-disable-next-line consistent-return
            center: (() => {
              if (this.longitude && this.latitude) return [this.longitude, this.latitude];
            })(),
            ...this.params
          });
          this.getCurrentLocation();
          this.initPoip();
          this.addClick();
        },
        e => {
          console.log("地图加载失败", e);
          this.box = false;
        }
      );
    },
    initPoip() {
      // https://lbs.amap.com/api/amap-ui/reference-amap-ui/other/poipicker
      if (!window.AMapUI) {
        return;
      }
      // 加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      window.AMapUI.loadUI(["misc/PoiPicker"], PoiPicker => {
        const poiPicker = new PoiPicker({
          input: this.inputId,
          placeSearchOptions: {
            map: this.map,
            pageSize: 10
          }
          //searchResultsContainer: 'map__result'
        });
        // 初始化poiPicker
        this.poiPickerReady(poiPicker);
      });
    },
    poiPickerReady(poiPicker) {
      window.poiPicker = poiPicker;
      // 选取了某个POI
      poiPicker.on("poiPicked", poiResult => {
        this.clearMarker();
        const { source } = poiResult;
        const poi = poiResult.item;
        console.log(poiResult);
        this.poi = Object.assign(poi, {
          formattedAddress: poi.name,
          longitude: poi.location.lng,
          latitude: poi.location.lat
        });

        //同步更新到地址栏
        this.handleSubmit();

        if (source !== "search") {
          poiPicker.searchByKeyword(poi.name);
        }
      });
    }
  },
  emits: ["update:value"]
};
