<template>
  <div>
    <el-input
      ref="main"
      v-model="address"
      :clearable="disabled"
      readonly
      size="default"
      :placeholder="$t('formgen.inputMap.getLocation')"
      prefix-icon="ele-Location"
      @clear="handleClear"
      @click="handleShow"
    />

    <el-row v-if="box">
      <div
        :id="mapId"
        class="input-map-content-container"
        tabindex="0"
      />

      <!--      搜索地理位置，选择地址卡片，已弃用-->
      <!--      <div id="map__result"-->
      <!--           class="input-map-content-result"-->
      <!--      />-->

      <el-row :gutter="1">
        <el-col
          :xs="8"
          :sm="4"
          :md="4"
          :lg="4"
          :xl="2"
        >
          <el-button
            class="locationIcon"
            icon="ele-Location"
            :loading="showLoding"
            @click="getCurrentLocation"
          >
            {{ $t("formgen.inputMap.location") }}
          </el-button>
        </el-col>
        <el-col
          :xs="16"
          :sm="20"
          :md="20"
          :lg="20"
          :xl="22"
        >
          <el-input
            :id="inputId"
            :disabled="showSerachInput"
            v-model="formattedAddress"
            class="input-map-content-input"
            prefix-icon="ele-Search"
            clearable
            :placeholder="$t('formgen.inputMap.getMapSelection')"
            @clear="clear"
          />
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { Popup } from "vant";
import "vant/lib/popup/style";
import "vant/lib/cascader/style";
import mixin from "./mixin";

export default {
  name: "MobileInputMap",
  components: {
    [Popup.name]: Popup
  },
  mixins: [mixin],
  data() {
    return {};
  }
};
</script>

<style scoped>
:deep(.amap-marker-img) {
  width: 25px !important;
  height: 34px !important;
}

:deep(.input-map-marker) {
  position: absolute !important;
  top: -20px !important;
  right: -118px !important;
  color: #fff !important;
  padding: 4px 10px !important;
  -webkit-box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
  box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
  white-space: nowrap;
  font-size: 12px;
  background-color: #25a5f7 !important;
  border-radius: 3px;
}

.locationIcon {
  width: 100px;
  margin-top: 5px;
}

.input-map-content-container {
  width: 100%;
  height: 150px;
  margin: 0 auto;
  margin-top: 5px;
  border-radius: 6px;
}

.input-map-content-input {
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
