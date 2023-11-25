<template>
  <div
    class="home-container layout-pd"
    v-hasPermi="['system:mange:charts']"
  >
    <indicators />
    <el-row
      :gutter="15"
      class="home-card-two mb15"
    >
      <el-col
        :xs="24"
        :sm="14"
        :md="14"
        :lg="16"
        :xl="16"
      >
        <div class="home-card-item">
          <ViewAndWriteCount />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="10"
        :md="10"
        :lg="8"
        :xl="8"
        class="home-media"
      >
        <div
          class="home-card-item"
          style="padding: 10px"
        >
          <TopDataList />
        </div>
      </el-col>
    </el-row>
    <el-row
      :gutter="15"
      class="home-card-two mb15"
    >
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
      >
        <div class="home-card-item">
          <DeviceCountChart />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
      >
        <div class="home-card-item">
          <BrowserCountChart />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
      >
        <div class="home-card-item">
          <OsCountChart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import Indicators from "./Indicators.vue";
import ViewAndWriteCount from "./DataLineChart.vue";
import TopDataList from "./TopDataList.vue";
import DeviceCountChart from "./DeviceCountChart.vue";
import BrowserCountChart from "./BrowserCountChart.vue";
import OsCountChart from "./OsCountChart.vue";
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
  overflow: hidden;
  .home-card-one,
  .home-card-two,
  .home-card-three {
    .home-card-item {
      width: 100%;
      height: 130px;
      border-radius: 15px;
      transition: all ease 0.3s;
      padding: 20px;
      overflow: hidden;
      background: var(--el-color-white);
      color: var(--el-text-color-primary);
      border: 1px solid var(--next-border-color-light);
      &:hover {
        box-shadow: 0 2px 12px var(--next-color-dark-hover);
        transition: all ease 0.3s;
      }
      &-icon {
        width: 70px;
        height: 70px;
        border-radius: 100%;
        flex-shrink: 1;
        i {
          color: var(--el-text-color-placeholder);
        }
      }
      &-title {
        font-size: 15px;
        font-weight: bold;
        height: 30px;
      }
    }
  }
  .home-card-one {
    @for $i from 0 through 3 {
      .home-one-animation#{$i} {
        opacity: 0;
        animation-name: error-num;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-delay: calc($i/4) + s;
      }
    }
  }
  .home-card-two {
    .home-card-item {
      height: 350px;
      width: 100%;
      overflow: hidden;
    }
  }
}
</style>
