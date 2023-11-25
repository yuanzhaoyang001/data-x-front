<template>
  <div class="">
    <div
      class="tips"
      v-if="srcList && srcList.length > 1"
    >
      点击图片查看更多
    </div>
    <el-image
      style="width: 100px; height: 100px"
      :src="url"
      :preview-src-list="srcList"
    >
      <template #error>
        <div class="image-slot">
          <el-icon>
            <ele-Picture />
          </el-icon>
        </div>
      </template>
    </el-image>
  </div>
</template>

<script>
export default {
  name: "ImgList",
  props: {
    imageList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    url() {
      if (this.imageList && this.imageList.length) {
        return this.imageList[0].url;
      }
      return null;
    },
    srcList() {
      return this.imageList.map(item => item.url);
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>
