<template>
  <div class="signature-pad">
    <div
      class="signature-wrapper"
      @click="handleOpen"
    >
      <div
        v-if="signImageUrl"
        class="img-wrapper"
      >
        <img :src="signImageUrl" />
        <el-button
          link
          type="primary"
          class="re-sign"
        >
          重签
        </el-button>
      </div>
      <p v-else>点击进行手写签名</p>
    </div>
    <van-popup
      v-model:show="visible"
      position="bottom"
      round
      style="padding: 10px"
    >
      <canvas
        ref="signature_pad_box"
        class="canvasId"
        style="border: 2px dashed #409eff"
      />
      <div>
        <el-button
          plain
          type="danger"
          @click="clear"
        >
          清除
        </el-button>
        <el-button
          plain
          type="warning"
          @click="undo"
        >
          回撤
        </el-button>
        <el-button
          type="success"
          @click="savePng"
        >
          确认
        </el-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import SignaturePad from "signature_pad";
import request from "@/utils/request";
import { Popup } from "vant";
import "vant/lib/popup/style";

export default {
  name: "MobileSignPad",
  components: {
    [Popup.name]: Popup
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    // 文件上传地址
    action: {
      type: String,
      default: ""
    }
  },
  emits: ["update:value"],
  data() {
    return {
      visible: false,
      signaturePad: null,
      canvas: null,
      signImageUrl: "",
      config: {
        minWidth: 1,
        maxWidth: 3,
        penColor: this.color
      }
    };
  },
  mounted() {
    window.onresize = () =>
      (() => {
        this.resizeCanvas();
      })();
  },
  methods: {
    handleOpen() {
      this.visible = true;
      setTimeout(() => {
        this.init();
        // this.resizeCanvas()
      }, 500);
    },
    resizeCanvas() {
      console.log("resizeCanvas");
      const { canvas } = this;
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      // This part causes the canvas to be cleared
      canvas.width = document.body.clientWidth - 20;
      canvas.height = 300;
      canvas.getContext("2d").scale(ratio, ratio);

      // This library does not listen for canvas changes, so after the canvas is automatically
      // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
      // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
      // that the state of this library is consistent with visual state of the canvas, you
      // have to clear it manually.
      this.signaturePad.clear();
    },
    init() {
      this.canvas = this.$refs.signature_pad_box;
      const { canvas } = this;
      this.signaturePad = new SignaturePad(canvas, this.config);
      canvas.height = 300;
      canvas.width = document.body.clientWidth - 20;
    },
    clear() {
      this.signaturePad.clear();
    },
    undo() {
      const data = this.signaturePad.toData();
      if (data) {
        data.pop(); // remove the last dot or line
        this.signaturePad.fromData(data);
      }
    },
    savePng() {
      if (this.signaturePad.isEmpty()) {
        this.msgError("请先填写");
        return;
      }
      const data = this.signaturePad.toDataURL("image/png");
      const file = this.dataURLtoFile(data, `${new Date().getTime()}.png`);
      const param = new FormData(); // 创建form对象
      param.append("file", file); // 通过append向form对象添加数据
      const config = {
        headers: { "Content-Type": "multipart/formItem-data" }
      };
      request.post(this.action, param, config).then(res => {
        this.signImageUrl = res.data;
        this.$emit("update:value", res.data);
      });
    },
    reSign() {
      this.signImageUrl = "";
      this.signaturePad.clear();
    },
    dataURLtoFile(dataurl, filename) {
      // 获取到base64编码
      const arr = dataurl.split(",");
      // 将base64编码转为字符串
      const bstr = window.atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: "image/png"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.signature-wrapper {
  background: #f7f8fa;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  height: 200px;
  color: #616161;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-around;

  .img-wrapper {
    height: 100%;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }

    .re-sign {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
