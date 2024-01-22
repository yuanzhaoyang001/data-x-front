<template>
  <div class="mobile-wrap">
    <div
      class="banner-wrap"
      @click="handleOpenConfig(MobileComType.BANNER)"
    >
      <van-swipe
        v-if="portalConfig.bannerList.length"
        :autoplay="3000"
        indicator-color="white"
        height="150"
      >
        <van-swipe-item
          v-for="(item, index) in portalConfig.bannerList"
          :key="index"
        >
          <img
            class="swipe-img"
            :src="item.url"
          />
        </van-swipe-item>
      </van-swipe>
      <van-empty
        image-size="50"
        v-else
        description="点击配置Banner"
      />
    </div>
    <div
      class="nav-wrap"
      @click="handleOpenConfig(MobileComType.NAV)"
    >
      <van-grid
        v-if="portalConfig.navList.length"
        :border="false"
        class="van-grid-wrap"
      >
        <van-grid-item
          icon="photo-o"
          :text="nav.name"
          v-for="nav in portalConfig.navList"
        >
          <template #icon>
            <img
              :src="nav.imgUrl"
              class="nav-img"
            />
          </template>
        </van-grid-item>
      </van-grid>
      <van-empty
        image-size="50"
        v-else
        description="点击配置导航按钮"
      />
    </div>
    <div
      class="tabbar-wrap"
      @click="handleOpenConfig(MobileComType.TABBAR)"
    >
      <van-tabbar
        style="position: absolute; bottom: 0; left: 0"
        v-model="active"
        v-if="portalConfig.tabBarList.length"
      >
        <van-tabbar-item
          v-for="bar in portalConfig.tabBarList"
          :key="bar.pagePath"
        >
          <template #icon="props">
            <img :src="bar.iconPath" />
          </template>
          {{ bar.text }}
        </van-tabbar-item>
      </van-tabbar>
      <div
        class="text-center"
        v-else
      >
        点击选择TabBar
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { GridItem, Grid, Swipe, Empty, FloatingBubble } from "vant";
import "vant/lib/swipe/style";
import "vant/lib/grid/style";
import "vant/lib/grid-item/style";
import "vant/lib/empty/style";
import "vant/lib/floating-bubble/style";

import { MobileComType } from "@/views/uniapp/portal/types/types";
import { allTabBarList, portalConfigStore } from "@/views/uniapp/portal/config";

const { portalConfig } = portalConfigStore;

const emit = defineEmits(["config"]);

const handleOpenConfig = type => {
  emit("config", type);
};

const active = ref(0);
</script>
<style scoped lang="scss">
.mobile-wrap {
  position: absolute;
  top: 70px;
  left: 25px;
  width: 322px;
  height: 670px;
  z-index: 10;
}

.swipe-img {
  width: 100%;
  height: 100%;
}

.nav-img {
  width: 50px;
  height: 50px;
}

.nav-wrap {
  height: 350px;
  overflow-y: auto;
  margin-top: 10px;

  .van-grid-wrap {
    margin: 5px;
    background-color: #ffffff;
    border-radius: 5px;
  }

  --van-grid-item-content-background: transparent;
}

.tabbar-wrap {
  position: absolute;
  bottom: 97px;
  width: 100%;
  left: 1px;
  height: 50px;
}
</style>
