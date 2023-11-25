<template>
  <div class="iconfont-container">
    <div class="icon-body">
      <el-input
        v-model="name"
        style="position: relative"
        clearable
        :placeholder="$t('system.menu.enterIconName')"
        @input="filterIcons"
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <ele-Search />
          </el-icon>
        </template>
      </el-input>
      <div class="icon-list">
        <div
          v-for="(v, index) in tempIconList"
          :key="index"
          @click="selectedIcon(v)"
        >
          <i
            :class="v"
            class="iconfont"
          />
          <span>{{ v }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="IocnfontSelect">
import initIconfont from "@/utils/getStyleSheets";
import { onMounted, ref } from "vue";

const name = ref("");
const iconList = ref([]);
const tempIconList = ref([]);

onMounted(() => {
  initIconfont.ali().then(res => (iconList.value = res));
});

function filterIcons() {
  tempIconList.value = iconList.value.filter(item => item.includes(name.value));
}

// 定义props
const emit = defineEmits(["selected"]);

const selectedIcon = name => {
  emit("selected", `${name} iconfont`);
  document.body.click();
};

const reset = () => {
  name.value = "";
  tempIconList.value = iconList.value;
};

defineExpose({
  reset
});
</script>

<style lang="scss" scoped>
.iconfont-container {
  .icon-body {
    width: 100%;
    padding: 10px;

    .icon-list {
      height: 200px;
      overflow-y: scroll;

      div {
        height: 62px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 33%;
        float: left;
        text-align: center;
      }

      span {
        display: block;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //用省略号显示
        white-space: nowrap; //不换行
      }
    }
  }
}
</style>
