<template>
  <div class="marquee-wrap">
    <div
      class="marquee-list"
      style="height: 100px"
    >
      <Vue3Marquee
        :duration="speed"
        :vertical="false"
      >
        <div :style="getStyle">
          {{ text }}
        </div>
      </Vue3Marquee>
    </div>
  </div>
</template>

<script lang="ts" name="TScrollText" setup>
import Vue3Marquee from "@/components/Vue3Marquee/index.vue";
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: ""
  },
  fontSize: {
    type: Number,
    default: 16
  },
  colorType: {
    type: String,
    default: "default"
  },
  colorValue: {
    type: String,
    default: "#000000"
  },
  colorGradient: {
    type: Array,
    default: () => ["#000000", "#000000"]
  },
  speed: {
    type: Number,
    default: 20
  },
  bold: {
    type: Boolean,
    default: false
  },
  italic: {
    type: Boolean,
    default: false
  }
});

const getStyle = computed(() => {
  let style: any = {
    fontSize: `${props.fontSize}px`,
    height: `${props.fontSize + 20}px`,
    lineHeight: `${props.fontSize + 20}px`,
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal"
  };
  if (props.colorType === "default") {
    style = { ...style, color: props.colorValue };
  } else {
    style = {
      ...style,
      background: `linear-gradient(to right, ${props.colorGradient[0]}, ${props.colorGradient[1]})`,
      backgroundClip: "text",
      color: "transparent",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    };
  }
  return style;
});
</script>

<style lang="scss" scoped>
.marquee-wrap {
  height: 100%;
}

.marquee-list {
  width: 80%;
  margin: 0 30px;
  margin-top: 20px;
}
</style>
