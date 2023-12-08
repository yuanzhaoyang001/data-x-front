<template>
  <div>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.inputMapConfig.setMapAddress") }}
        </span>
      </template>
      <el-autocomplete
        v-model="address"
        :fetch-suggestions="handleSearchAddress"
        popper-class="my-autocomplete"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <div class="value">{{ item.name }}</div>
        </template>
      </el-autocomplete>
    </el-form-item>
    <div
      :id="mapId"
      class="input-map-content-container"
      tabindex="0"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: "ConfigItemMapNavigation"
};
</script>

<script lang="ts" setup>
import { ref } from "vue";
import { generateId } from "@/utils";

const props = defineProps({
  activeData: {
    type: Object,
    default() {
      return {};
    }
  }
});

const mapId = ref(generateId("map-"));

const address = ref(props.activeData.navigationAddress);

const handleSearchAddress = (queryString: string, cb: any) => {
  window.AMap.plugin("AMap.PlaceSearch", function () {
    let placeSearch = new AMap.PlaceSearch({
      //city 指定搜索所在城市，支持传入格式有：城市名、citycode 和 adcode
      city: "全国"
    });
    placeSearch.search(address.value, function (status, result) {
      //查询成功时，result 即对应匹配的 POI 信息
      console.log(result);
      cb(result.poiList.pois || []);
    });
  });
};

const handleSelect = (val: any) => {
  address.value = val.name;
  props.activeData.navigationAddress = val.name;
  props.activeData.location = val.location;
};
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
