<template>
  <div class="horizontal-input">
    <span v-for="(item, index) in arr">
      <span v-if="item">{{ item }}</span>
      <span
        v-if="index < arr.length - 1"
        contenteditable="true"
        class="span-input"
        @input="onInput($event, index)"
        @keydown="onSpanInput"
      >
        {{ value[index] }}
      </span>
    </span>
  </div>
</template>

<script>
import mixin from "../mixin";

export default {
  name: "HorizontalInput",
  mixins: [mixin],
  props: {
    input: {
      type: String,
      default: ""
    }
  },
  emits: ["change"],
  data() {
    return {
      inputArray: "",
      arr: []
    };
  },
  watch: {
    input: {
      handler(val) {
        this.initInputValueArr();
      },
      deep: true
    }
  },
  created() {
    this.initInputValueArr();
  },
  methods: {
    onSpanInput(el) {
      if (el.keyCode === 13) {
        el.preventDefault();
        return false;
      }
    },
    onInput(el, index) {
      const { offsetWidth, innerText } = el.target;
      console.log(offsetWidth);
      if (offsetWidth > 80) {
        el.target.classList.add("span-input-inline");
      } else {
        el.target.classList.remove("span-input-inline");
      }
      this.value[index] = innerText;
      this.$nextTick(() => {
        this.handleChange();
      });
    },
    initInputValueArr() {
      this.arr = this.input.split("$input");
    },
    handleChange() {
      this.$emit("change", this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-input__inner) {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #606266 !important;
  border-radius: 0px !important;
}

.horizontal-input {
  color: #606266;
  padding: 10px;

  .span-input {
    display: inline-block;
    min-width: 80px;
    border-bottom: 1px solid;
    padding: 0 5px;
    margin-right: 10px;
    line-height: 1;
  }

  .span-input-inline {
    display: inline;
  }
}
</style>
