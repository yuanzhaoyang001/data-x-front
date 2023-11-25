<template>
  <el-image
    :src="src"
    :fit="fit"
  >
    <template #error>
      <div class="t-image-slot">
        <el-icon>
          <ele-Picture />
        </el-icon>
      </div>
    </template>
  </el-image>
</template>

<script>
import mixin from "../mixin";

export default {
  name: "TImage",
  mixins: [mixin],
  props: {
    src: {
      type: String,
      default: () => {
        return "";
      }
    },
    fit: {
      type: String,
      default: () => {
        return "contain";
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.t-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  min-height: 40px;
  font-size: 14px;
}
</style>
