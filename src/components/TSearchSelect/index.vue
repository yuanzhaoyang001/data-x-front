<template>
  <el-select
    v-bind="$attrs"
    v-model="selectValues"
    :popper-class="'multiple_select_popper_' + order"
    multiple
    :class="'multiple_select_checkbox_' + order"
    @visible-change="visibleChange"
    @change="changeSelect"
  >
    <template #empty>
      <div class="p5">
        <el-input
          ref="filterInput"
          v-model="filterValue"
          placeholder="请输入搜索的项"
          prefix-icon="ele-Search"
          @input="handleFilter(value)"
        />
      </div>
      <p class="el-select-dropdown__empty">无数据</p>
    </template>
    <div class="p5">
      <el-input
        v-model="filterValue"
        placeholder="请输入搜索的项"
        prefix-icon="ele-Search"
        @input="handleFilter(value)"
      />
    </div>
    <el-option
      v-if="options_.length"
      label="全选"
      value="全选"
    >
      <el-checkbox
        v-model="isSelectAll"
        @click.prevent
      >
        全选
      </el-checkbox>
    </el-option>
    <el-option
      v-for="item in options_"
      :key="item[props.value]"
      :label="item[props.label]"
      :value="item[props.value]"
    >
      <el-tooltip
        :disabled="!item.isExceed"
        :content="item[props.label]"
        placement="top"
        effect="light"
      >
        <el-checkbox
          v-model="selectValues.includes(item[props.value])"
          @click.prevent
        >
          {{ item[props.label] }}
        </el-checkbox>
      </el-tooltip>
    </el-option>
  </el-select>
</template>

<script>
import { debounce } from "throttle-debounce";

function inheriltClassAndStyle() {
  const attrs = this.$attrs;
  attrs.class && this.$el.classList.add(attrs.class);
  attrs.style &&
    Object.entries(attrs.style).forEach(([k, v]) => {
      this.$el.style[k] = v;
    });
}

export default {
  name: "TSearchSelect",
  // 似乎设不设置都可以
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 下拉选项
    options: {
      type: Array,
      default: () => []
    },
    // 选项键值对
    props: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value"
        };
      }
    },
    // 选项是否独占一行
    isInline: {
      type: Boolean,
      default: false
    },
    // 选项的宽度
    textWidth: {
      type: Number
    },
    // 组件唯一标识 （避免同一个页面引用多次，发生耦合） 主要是css选择器
    order: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      filterValue: "",
      selectValues: this.value,
      isSelectAll: false,
      multipleSelectCheckboxMaxWidth: 0,
      options_: []
    };
  },
  watch: {
    // 监听（全选or全不选）
    value: {
      deep: true,

      handler(arr) {
        this.selectValues = arr;
        this.isSelectAll = arr.length === this.options_.length;
      }
    },
    options: {
      deep: true,

      handler(arr) {
        this.options_ = JSON.parse(JSON.stringify(arr));
        this.isSelectAll = this.selectValues.length === this.options_.length;
      },

      immediate: true
    }
  },
  methods: {
    handleFilter: debounce(430, false, function (val) {
      let key = this.props.label;
      if (!this.filterValue) {
        this.options_ = JSON.parse(JSON.stringify(this.options));
      }
      this.options_ = this.options_.filter(item => {
        return item[key].indexOf(this.filterValue) !== -1;
      });
      if (this.options_.length === 0) {
        this.$nextTick(() => {
          this.$refs.filterInput.focus();
        });
      }
    }),
    changeSelect(val) {
      if (val.includes("全选")) {
        // 说明已经全选了，所以全不选
        if (val.length > this.options_.length) {
          this.selectValues = [];
        }
        // 反之，全选
        else {
          this.selectValues = this.options_.map(item => item[this.props.value]);
        }
      }
      this.$emit("update:value", this.selectValues);
    },
    // 判断元素是否溢出，溢出加上toolTip
    async visibleChange(visible) {
      await this.$nextTick();
      if (visible) {
        const maxLabelWidth = this.multipleSelectCheckboxMaxWidth - 80;
        const labels = document.querySelectorAll(
          `.multiple_select_popper_${this.order}.el-select-dropdown .el-checkbox.el-tooltip .el-checkbox__label`
        );
        labels.forEach((label, index) => {
          // eslint-disable-next-line no-prototype-builtins
          if (!this.options_[index].hasOwnProperty("isExceed")) {
            this.options_[index]["isExceed"] = label.scrollWidth - 10 > (this.textWidth || maxLabelWidth);
            label.style["width"] = this.textWidth + "px";
            label.style["max-width"] = (this.textWidth || maxLabelWidth) + "px";
            label.style["vertical-align"] = "middle";
            label.style["overflow"] = "hidden";
            label.style["text-overflow"] = "ellipsis";
            label.style["white-space"] = "nowrap";
          }
        });
        const items = document.querySelectorAll(
          `.multiple_select_popper_${this.order} .el-select-dropdown__item:not(:first-child)`
        );
        items.forEach(item => {
          item.style.display = this.isInline ? "inline-block" : "block";
        });
      }
    }
  },
  mounted() {
    const multipleSelectCheckbox = document.querySelector(`.multiple_select_checkbox_${this.order}.el-select`);
    const elSelectDropdown = document.querySelector(`.multiple_select_popper_${this.order}.el-select-dropdown`);
    const multipleSelectCheckboxMaxWidth = multipleSelectCheckbox.scrollWidth;
    this.multipleSelectCheckboxMaxWidth = multipleSelectCheckboxMaxWidth;
    elSelectDropdown.style["max-width"] = multipleSelectCheckboxMaxWidth + "px";
    inheriltClassAndStyle.call(this);
  },
  emits: ["update:value"]
};
</script>

<style scoped>
[class*="multiple_select_popper"].el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  content: "";
}
</style>
