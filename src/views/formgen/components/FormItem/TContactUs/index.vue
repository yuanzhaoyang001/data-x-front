<template>
  <div class="contactus-wrap">
    <div class="container">
      <div class="logo">
        <el-image
          :preview-src-list="[logoUrl]"
          :src="logoUrl"
          :style="{ width: `${logoWidth}px`, height: `${logoHeight}px` }"
        >
          <template #error>
            <el-icon>
              <ele-OfficeBuilding />
            </el-icon>
          </template>
        </el-image>
      </div>
      <div class="name">
        <div v-html="name"></div>
      </div>
      <div class="btn">
        <el-button
          :color="btnColor"
          type="primary"
          @click="handleContactBtn"
        >
          {{ contactBtnText }}
        </el-button>
      </div>
    </div>
    <el-image-viewer
      v-if="show"
      :url-list="[props.contactContent]"
      teleported
      @close="show = false"
    />
  </div>
</template>
<script lang="ts" name="TContactUs" setup>
import { defineProps, onMounted, ref } from "vue";
import { isMobile } from "@/utils/other";
import { copyText } from "@/utils";
import { MessageUtil } from "@/utils/messageUtil";

const props = defineProps({
  name: {
    type: String,
    default: ""
  },
  logoUrl: {
    type: String,
    default: ""
  },
  logoWidth: {
    type: Number,
    default: 100
  },
  logoHeight: {
    type: Number,
    default: 100
  },
  contactBtnText: {
    type: String,
    default: ""
  },
  btnColor: {
    type: String,
    default: "#4c4edb"
  },
  contactType: {
    type: String,
    default: ""
  },
  contactContent: {
    type: String,
    default: ""
  }
});

const show = ref(false);
onMounted(() => {});

const handleContactBtn = () => {
  if (props.contactType === "1") {
    show.value = true;
  } else if (props.contactType === "3") {
    if (isMobile()) {
      window.location.href = `tel:${props.contactContent}`;
    } else {
      // 复制手机号1
      copyText(props.contactContent);
      MessageUtil.success("已复制手机号");
    }
  }
};
</script>

<style lang="scss" scoped>
.contactus-wrap {
  height: 100%;
}

.logo {
  height: 100%;

  .el-image__inner {
    vertical-align: middle;
  }
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
}

.logo,
.btn {
  flex: 0 0 15%;
}

.name {
  flex: 1;
  padding-left: 20px;
  vertical-align: middle;
}

@media screen and (max-width: 768px) {
  .logo,
  .btn {
    flex: 0 0 30%;
  }

  .name {
    flex: 1;
    padding-left: 20px;
    vertical-align: middle;
  }
}
</style>
