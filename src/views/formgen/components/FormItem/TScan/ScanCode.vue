<template>
  <div
    v-if="showModal"
    class="modal-container"
    :class="[!isLoad ? 'modal-mask' : '']"
  >
    <div
      class="close-btn"
      @click="closeModal"
      v-show="!isLoad"
    ></div>
    <div
      class="switch-qrscan"
      @click="handleSwitchScan"
    >
      <el-icon>
        <ele-RefreshRight />
      </el-icon>
    </div>
    <div class="modal-content">
      <div
        id="qr-reader"
        style="margin: 0; padding: 0"
      ></div>
    </div>
    <div class="tips">请将方形框对准二维码或条形码</div>
    <div class="album-file">
      <label
        for="qr-input-file"
        class="custom-file-upload"
      >
        <el-icon>
          <ele-Picture />
        </el-icon>
      </label>
      <input
        type="file"
        id="qr-input-file"
        accept="image/*"
      />
    </div>
  </div>
</template>

<script>
import loadHtml5Qrcode from "../../../utils/loadHtmlQrCode";

let successAudio = null;
export default {
  name: "ScanCode",
  data() {
    return {
      showModal: false,
      // 加载完成
      isLoad: false,
      html5QrCodeInstance: null,
      devices: [],
      currentCameraId: null
    };
  },
  created() {
    // 提前加载html5Qrcode插件
    loadHtml5Qrcode(Html5Qrcode => {});
  },
  mounted() {
    // 监听ESC按键事件
    document.addEventListener("keydown", e => {
      if (e.keyCode === 27) {
        this.closeModal();
      }
    });
  },
  methods: {
    // 检测是否能使用
    checkScan() {
      // 是否是https 如果不是https就不让使用
      if (window.location.protocol !== "https:") {
        this.$message.error("扫描只能支持https访问");
        return false;
      }
      return true;
    },
    openModal() {
      if (!this.checkScan()) {
        return;
      }
      this.showModal = true;
      this.isLoad = true;
      loadHtml5Qrcode(Html5Qrcode => {
        this.isLoad = true;
        this.$nextTick(() => {
          const html5QrCodeInstance = new Html5Qrcode("qr-reader");
          this.startScan(Html5Qrcode, html5QrCodeInstance);
          this.handleFileSelect(html5QrCodeInstance);
          this.html5QrCodeInstance = html5QrCodeInstance;
          // 加载下扫码成功的声音
          successAudio = new Audio(window.origin + "/audio/di.mp3");
        });
      });
      document.body.style.overflow = "hidden"; // 防止背景滚动
    },
    closeModal() {
      this.showModal = false;
      this.stopScan(this.html5QrCodeInstance);
      document.body.style.overflow = ""; // 恢复背景滚动
    },
    // 开启摄像头扫描
    startScan(Html5Qrcode, html5QrCodeInstance) {
      // This method will trigger user permissions
      Html5Qrcode.getCameras()
        .then(devices => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          this.devices = devices;
          if (devices && devices.length) {
            // 有后置摄像头就用后置摄像头，否则用前置摄像头
            let cameraId = devices.length > 1 ? devices[1].id : devices[0].id;
            this.handleStartCamera(cameraId, html5QrCodeInstance);
          }
        })
        .catch(err => {
          // handle err
          console.log(err);
        });
    },
    handleSwitchScan() {
      // 找到下一个摄像头
      let camera = this.devices.find(item => item.id !== this.currentCameraId);
      if (!camera) {
        this.msgError("未找到其他摄像头");
      }
      this.html5QrCodeInstance.stop().then(res => {
        this.handleStartCamera(camera.id, this.html5QrCodeInstance);
      });
    },
    handleStartCamera(cameraId, html5QrCodeInstance) {
      const loading = this.$loading({
        lock: true,
        text: "正在启动摄像头，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // .. use this to start scanning.
      // 计算一个屏幕长款比 保留5位小数
      let aspectRatio = Math.round((window.innerHeight / window.innerWidth) * 100000) / 100000;
      html5QrCodeInstance
        .start(
          cameraId,
          {
            aspectRatio: aspectRatio,
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 250, height: 250 } // Optional, if you want bounded box UI
          },
          (decodedText, decodedResult) => {
            // do something when code is read
            this.scanResult(decodedText);
          },
          errorMessage => {
            // alert(errorMessage)
            // parse error, ignore it.
          }
        )
        .then(res => {
          setTimeout(() => {
            this.isLoad = false;
          }, 1000);
          loading.close();
          this.currentCameraId = cameraId;
        })
        .catch(err => {
          // Start failed, handle it.
        });
    },
    //监听文件选择识别
    handleFileSelect(html5QrCodeInstance) {
      // File based scanning
      const fileInput = document.getElementById("qr-input-file");
      fileInput.addEventListener("change", async e => {
        if (e.target.files.length === 0) {
          // No file selected, ignore
          return;
        }
        const imageFile = e.target.files[0];
        await html5QrCodeInstance.stop();
        await html5QrCodeInstance.clear();
        // Scan QR Code
        html5QrCodeInstance
          .scanFile(imageFile, true)
          .then(decodedText => {
            // success, use decodedText
            console.log(decodedText);
            this.scanResult(decodedText);
          })
          .catch(err => {
            // failure, handle it.
            console.log(`Error scanning file. Reason: ${err}`);
          });
      });
    },
    stopScan(html5QrCodeInstance) {
      html5QrCodeInstance
        .stop()
        .then(ignore => {
          // QR Code scanning is stopped.
        })
        .catch(err => {
          // Stop failed, handle it.
        });
    },
    scanResult(result) {
      successAudio.play();
      this.closeModal();
      this.$emit("change", result);
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

// 遮罩层
.modal-mask {
  background-color: rgba(0, 0, 0, 0.5);
}

.tips {
  position: absolute;
  top: 25%;
  left: 25%;
  width: 100%;
  height: 100%;
  z-index: 1000;
  font-size: 14px;
  color: #ffffff;
}

.modal-content {
  position: relative;
  height: 100%;
  width: 100%;
}

.close-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ededeb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.close-btn:hover {
  background-color: #fff;
}

.close-btn::before,
.close-btn::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 2px;
  background-color: #a29695;
}

.close-btn::before {
  transform: rotate(45deg);
}

.close-btn::after {
  transform: rotate(-45deg);
}

.album-file {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: rgba(196, 196, 196, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 28px;
  /*font-weight: bold;*/
  color: #f3efec;
  border-radius: 4px;
  text-align: center;
}

#qr-input-file {
  display: none;
  opacity: 0;
  visibility: hidden;
  border: 0;
  outline: none;
  background-color: transparent;
}

.switch-qrscan {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ededeb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
