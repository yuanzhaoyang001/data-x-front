<template>
  <div class="itxst">
    <div class="col">
      <div class="title">请将左面的选项拖到右边完成排序</div>
      <draggable
        v-model="changeSortList"
        :move="onLeftMove"
        animation="300"
        chosen-class="chosenClass"
        class="left-draggable"
        drag-class="dragClass"
        ghost-class="ghostClass"
        group="site"
        @end="onEnd"
        @start="onStart"
      >
        <transition-group class="left-draggable-group">
          <div
            v-for="item in changeSortList"
            :key="item.value"
            class="item"
          >
            <div class="item-name">
              {{ item.label }}
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="col">
      <div class="title">上下可拖动排序</div>
      <draggable
        v-model="changeValue"
        :move="onRightMove"
        animation="100"
        chosen-class="chosenClass"
        class="right-draggable"
        drag-class="dragClass"
        ghost-class="ghostClass"
        group="site"
        @end="onEnd"
        @start="onStart"
      >
        <transition-group class="right-draggable-group">
          <div
            v-for="(item, index) in changeValue"
            :key="item.value"
            class="item"
          >
            <span class="seq-num">
              {{ index + 1 }}
            </span>
            <span class="item-name">
              {{ item.label }}
            </span>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import mixin from "../mixin";

export default {
  name: "TSort",
  components: {
    draggable
  },
  mixins: [mixin],
  props: ["sortList"],
  data() {
    return {
      changeSortList: []
    };
  },
  watch: {
    sortList(val) {
      this.changeSortList = this.changeValue
        ? this.sortList.filter(item => !this.changeValue.find(i => i.value === item.value))
        : this.sortList;
    }
  },
  mounted() {
    this.changeSortList = this.changeValue
      ? this.sortList.filter(item => !this.changeValue.find(i => i.value === item.value))
      : this.sortList;
  },
  methods: {
    onLeftMove(e, originalEvent) {
      if (e.to.className !== "right-draggable-group") {
        return false;
      }
      //false表示阻止拖拽
      return true;
    },
    onRightMove(e, originalEvent) {
      if (e.to.className !== "right-draggable-group") {
        return false;
      }
      //false表示阻止拖拽
      return true;
    },
    onStart() {},
    onEnd() {}
  }
};
</script>

<style lang="scss" scoped>
.ghostClass {
}

.chosenClass {
  opacity: 1 !important;
}

.dragClass {
  opacity: 1 !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}

.itxst {
  margin: 10px;
}

.title {
  padding: 6px 12px;
}

.col {
  width: 48%;
  flex: 1;
  padding: 10px;
  border: solid 1px #eee;
  border-radius: 5px;
  float: left;
  min-height: 150px;
}

.col + .col {
  margin-left: 10px;
}

.item {
  line-height: 30px;
  min-height: 30px;
  border: solid 1px #eee;

  &:hover {
    background-color: #fdfdfd;
    cursor: move;
  }

  .item-name {
    margin-left: 10px;
    word-break: break-all;
  }
}

.item + .item {
  margin-top: 6px;
}

.right-draggable {
  min-height: 100px;

  .right-draggable-group {
    min-height: 100px;
    display: block;
  }
}

.seq-num {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #409eff;
  display: inline-block;
  text-align: center;
  color: #ffffff;
  line-height: 20px;
  margin: 0px 5px;
}

@media screen and (max-width: 768px) {
  .title {
    padding: 0 !important;
  }
}
</style>
