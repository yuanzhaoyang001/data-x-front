<template>
  <div class="slider-wrapper">
    <!--		<van-slider v-if="isMobile" v-model:value="changeValue" :max="item.max" :min="item.min" :step="item.step" active-color="#1890ff">-->
    <!--			<template #button>-->
    <!--				<div class="custom-slider-button">{{ changeValue }}</div>-->
    <!--			</template>-->
    <!--		</van-slider>-->
    <van-slider
      v-if="isMobile"
      v-model="changeValue"
      :max="item.max"
      :min="item.min"
      :step="item.step"
    >
      <template #button>
        <div class="custom-slider-button">{{ changeValue }}</div>
      </template>
    </van-slider>

    <el-slider
      v-bind="{ ...item }"
      v-else
      v-model="changeValue"
    />
  </div>
</template>

<script>
import mixin from "../mixin";
import { isMobile } from "@/utils/other";
import { Slider } from "vant";

export default {
  name: "TSlider",
  components: {
    VanSlider: Slider
  },
  mixins: [mixin],
  data() {
    return {
      isMobile: isMobile()
    };
  },
  methods: {
    handleChange(val) {}
  }
};
</script>

<style lang="scss" scoped>
.slider-wrapper {
  width: 100%;
  height: 100%;
  padding: 0 10px;
}

@media screen and (max-width: 768px) {
  .slider-wrapper {
    padding: 0 15px;
    margin-bottom: 10px;
  }
}

.custom-slider-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: var(--form-theme-color);
  border-radius: 100px;
}
</style>
