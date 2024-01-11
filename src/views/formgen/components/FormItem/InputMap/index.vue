<template>
  <div>
    <el-input
      ref="main"
      v-model="address"
      :clearable="disabled"
      readonly
      :placeholder="$t('formgen.inputMap.getLocation')"
      prefix-icon="ele-Location"
      class="locationStlye"
      @clear="handleClear"
      @click="handleShow"
    />
    <el-row
      v-if="box"
      class="w100"
    >
      <div
        :id="mapId"
        class="input-map-content-container"
        tabindex="0"
      />

      <!--      搜索地理位置，选择地址卡片，已弃用-->
      <!--      <div id="map__result"-->
      <!--           class="input-map-content-result"-->
      <!--      />-->

      <el-row
        :gutter="1"
        class="w100"
      >
        <el-col
          :xs="8"
          :sm="4"
          :md="4"
          :lg="4"
          :xl="4"
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
          :lg="20"
          :md="20"
          :sm="20"
          :xl="20"
          :xs="16"
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
import mixin from "./mixin";

export default {
  name: "InputMap",
  mixins: [mixin]
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
  margin-top: 10px;
}

.input-map-content-container {
  margin-top: 10px;
  width: 100%;
  height: 200px;
  border-radius: 10px;
}

.input-map-content-result {
  display: block !important;
  position: absolute;
  top: 0;
  right: -8px;
  width: 250px;
  height: 200px;
  overflow-y: auto;
}

.input-map-content-input {
  margin-bottom: 10px;
  margin-top: 10px;
}

:deep(.el-dialog__headerbtn) {
  z-index: 999;
}
</style>
