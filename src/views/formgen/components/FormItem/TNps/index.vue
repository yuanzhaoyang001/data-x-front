<template>
  <div class="w100">
    <div class="t-nps-box">
      <span
        v-for="n in table.level"
        class="item"
        :key="n"
        @mousemove="setCurrentHoverValue(n)"
        @click="handleClick(n)"
        :class="[currentHoverValue >= n ? 'hover' : '', changeValue === n ? 'active' : '']"
      >
        {{ n }}
      </span>
    </div>
    <div class="tip-text">
      <div>
        {{ table.copyWriting.min }}
      </div>
      <div>
        {{ table.copyWriting.max }}
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";

export default {
  name: "TNps",
  mixins: [mixin],
  props: {
    table: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentHoverValue: 0,
      dataValue: {}
    };
  },
  watch: {
    table: {
      handler(value) {
        this.initValue();
      },
      deep: true
    }
  },
  methods: {
    initValue() {
      this.dataValue = this.value;
    },
    setCurrentHoverValue(val) {
      if (val < this.changeValue) {
        return;
      }
      this.currentHoverValue = val;
    },
    handleClick(val) {
      this.currentHoverValue = val;
      this.changeValue = val;
    }
  }
};
</script>

<style lang="scss">
.tip-text {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.t-nps-box {
  display: flex;
  align-items: center;
  width: 100%;

  .item {
    transition: all 0.3s ease;
    height: var(--el-component-size-small);
    line-height: var(--el-component-size-small);
    flex: 1;
    width: 1px;
    text-align: center;
    background-color: #f2f3f9;
    display: inline-block;
    color: #314666;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
  }

  .hover {
    background-color: var(--form-theme-hover-color);
  }

  .active {
    background-color: var(--form-theme-color);
    color: #fff;
  }
}

/*// 变亮
*/
@function tint($color, $percentage) {
  @return mix(white, $color, $percentage);
}
</style>
