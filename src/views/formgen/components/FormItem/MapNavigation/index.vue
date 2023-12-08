<template>
  <div class="h100">
    <div class="pl20 map-header">
      <el-icon>
        <ele-MapLocation />
      </el-icon>
      {{ props.navigationAddress }}
    </div>
    <div
      :id="mapId"
      class="input-map-content-container"
      tabindex="0"
      @click="handleClickMap"
    />
  </div>
</template>
<script lang="ts" name="MapNavigation" setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { generateId } from "@/utils";
import MapLoader from "@/views/formgen/components/FormItem/InputMap/amap";

const props = defineProps({
  navigationAddress: {
    type: String,
    default: ""
  },
  location: {
    type: Object,
    default() {
      return {};
    }
  }
});

const mapId = ref(generateId("map-"));

let mapInstance = null;

onMounted(() => {
  initMap();
});

watch(
  () => props.location,
  () => {
    initMap();
  }
);

const initMap = () => {
  MapLoader().then(
    AMap => {
      console.log("地图加载成功");
      mapInstance = new AMap.Map(mapId.value, {
        zoom: 15,
        zoomEnable: false,
        dragEnable: false,
        // 自动定位到所在城市并显示
        resizeEnable: false,
        center: props.location // 初始化地图中心点位置
      });
      const content = `<div><img class="amap-marker-img" style="width: 20px" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">
                          <span class="input-map-marker">${props.navigationAddress}</span></div>`;
      const marker = new window.AMap.Marker({
        content, // 自定义点标记覆盖物内容
        position: props.location,
        title: props.navigationAddress,
        zoom: 10
      });
      mapInstance.add(marker);
    },
    e => {
      console.log("地图加载失败", e);
    }
  );
};

const handleClickMap = () => {
  // 新窗口打开
  window.open(
    `https://ditu.amap.com/regeo?lng=${props.location[0]}&lat=${props.location[1]}&name=${props.navigationAddress}&src=uriapi&callnative=1&innersrc=uriapi`
  );
};
</script>

<style lang="scss" scoped>
.input-map-content-container {
  margin-top: 10px;
  width: 100%;
  height: 200px;
  border-radius: 10px;
}

.map-header {
  line-height: 30px;
  height: 30px;
  color: var(--el-text-color-primary);
}
</style>
