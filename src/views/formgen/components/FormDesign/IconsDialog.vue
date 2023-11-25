<template>
  <div class="icon-dialog">
    <el-dialog
      :model-value="visible"
      width="980px"
      :close-on-click-modal="false"
      :modal-append-to-body="true"
      @open="onOpen"
      @close="onClose"
    >
      <template #header>
        <div class="p10">
          <span>{{ $t("formgen.iconDialog.selectIcon") }}</span>
          <el-input
            v-model="key"
            size="small"
            :style="{ width: '260px' }"
            :placeholder="$t('formgen.iconDialog.iconName')"
            prefix-icon="ele-Search"
            clearable
            class="ml10"
          />
        </div>
      </template>
      <el-card
        shadow="hover"
        :header="$t('formgen.iconDialog.headText') + sheetsIconList.length"
      >
        <el-scrollbar height="600px">
          <el-row class="iconfont-row">
            <el-col
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
              :xl="2"
              v-for="(v, k) in sheetsIconList"
              :key="k"
              @click="onSelect(v)"
            >
              <div class="iconfont-warp">
                <div class="flex-margin">
                  <div class="iconfont-warp-value">
                    <SvgIcon
                      :name="v"
                      :size="30"
                    />
                  </div>
                  <div class="iconfont-warp-label mt10">{{ v }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon/index.vue";
import initIconfont from "@/utils/getStyleSheets";

export default {
  name: "IconDialog",
  props: ["current", "visible"],
  emits: ["select", "update:visible"],
  components: {
    SvgIcon
  },
  data() {
    return {
      activeName: "iconfont",
      sheetsIconList: [],
      tempSheetsIconList: [],
      active: null,
      key: ""
    };
  },
  watch: {
    key(val) {
      if (val) {
        this.tempSheetsIconList = this.sheetsIconList.filter(name => name.indexOf(val) > -1);
      } else {
        this.tempSheetsIconList = this.sheetsIconList;
      }
    }
  },
  created() {
    // 初始化获取 css 样式，这里使用fontawesome的图标(记得加上前缀 `fa`)，其它第三方请自行做判断
    initIconfont.ele().then(res => {
      this.sheetsIconList = res;
      this.tempSheetsIconList = res;
    });
  },
  methods: {
    onOpen() {
      this.active = this.current;
      this.key = "";
    },
    onClose() {},
    onSelect(icon) {
      this.active = icon;
      this.$emit("select", icon);
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.iconfont-row {
  border-top: 1px solid var(--next-border-color-light);
  border-left: 1px solid var(--next-border-color-light);

  .iconfont-warp {
    text-align: center;
    border-right: 1px solid var(--next-border-color-light);
    border-bottom: 1px solid var(--next-border-color-light);
    height: 70px;
    overflow: hidden;
    display: flex;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 12px var(--next-color-dark-hover);
      cursor: pointer;
      transition: all 0.3s ease;

      .iconfont-warp-value {
        i {
          color: var(--el-color-primary);
          transition: all 0.3s ease;
        }
      }

      .iconfont-warp-label {
        color: var(--el-color-primary);
        transition: all 0.3s ease;
      }
    }

    .iconfont-warp-value {
      i {
        color: #606266;
        font-size: 12px;
        transition: all 0.3s ease;
      }
    }

    .iconfont-warp-label {
      color: #99a9bf;
      font-size: 9px;
      transition: all 0.3s ease;
    }
  }
}

.icon-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    margin-bottom: 0;
    margin-top: 4vh !important;
    display: flex;
    flex-direction: column;
    max-height: 92vh;
    overflow: hidden;
    box-sizing: border-box;

    .el-dialog__header {
      padding-top: 14px;
    }

    .el-dialog__body {
      margin: 0 20px 20px 20px;
      padding: 0;
      overflow: auto;
    }
  }
}
</style>
