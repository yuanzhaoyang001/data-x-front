<template>
  <div
    class="license-wrap"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <el-card>
      <template #header>
        <div class="clearfix text-center">
          <h1 class="text-center">Tduck授权中心</h1>
        </div>
      </template>
      <div class="license-content">
        <el-descriptions
          title="设备信息"
          :column="1"
          border
        >
          <template #extra>
            <el-button
              type="primary"
              @click="handleCopy"
            >
              一键复制
            </el-button>
          </template>
          <el-descriptions-item label="mac地址">
            {{ deviceInfo.macAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="序列号">
            {{ deviceInfo.cpuId }}
          </el-descriptions-item>
          <el-descriptions-item label="唯一Id">
            {{ deviceInfo.deviceId }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div
        v-if="!licenseInfo"
        class="m10 flex-center upload-licnse"
      >
        <el-divider>上传授权文件</el-divider>
        <el-upload
          drag
          :action="getUploadUrl"
          accept=".td"
          :limit="1"
          :on-success="handleUploadSuccess"
        >
          <el-icon>
            <ele-Upload />
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">只能上传授权文件,文件名td结尾</div>
          </template>
        </el-upload>
      </div>
      <div
        v-else
        class="mt10"
      >
        <el-descriptions
          title="授权信息"
          :column="1"
          border
        >
          <el-descriptions-item label="授权单位">
            {{ licenseInfo.applicant }}
          </el-descriptions-item>
          <el-descriptions-item label="联系方式">
            {{ licenseInfo.contact }}
          </el-descriptions-item>
          <el-descriptions-item label="到期时间">
            {{ parseTime(new Date(licenseInfo.expireTime)) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import { baseUrl } from "@/utils/auth";

export default {
  name: "License",
  components: {
    ElIconUpload
  },
  data() {
    return {
      deviceInfo: {},
      licenseInfo: null,
      fullscreenLoading: true
    };
  },
  computed: {
    getUploadUrl() {
      return `${baseUrl}/license/uploadLicense`;
    }
  },
  created() {
    this.getDeviceInfo();
    this.getLicenseInfo();
  },
  methods: {
    handleUploadSuccess(res, file) {
      console.log(res);
      if (res.code) {
        this.msgSuccess("授权成功");
        location.href = "/";
      } else {
        this.msgError(res.msg);
      }
    },
    handleCopy() {
      this.$copyText(JSON.stringify(this.deviceInfo)).then(
        () => {
          this.$message({
            message: "复制成功",
            type: "success"
          });
        },
        () => {
          this.$message({
            message: "复制失败",
            type: "error"
          });
        }
      );
    },
    getDeviceInfo() {
      request.get("/license/getDeviceInfo").then(res => {
        this.deviceInfo = res.data;
        this.fullscreenLoading = false;
      });
    },
    getLicenseInfo() {
      request.get("/license/getLicenseInfo").then(res => {
        this.licenseInfo = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.license-wrap {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;

  .el-card {
    padding: 50px 100px;
  }

  :deep(.el-descriptions-item__cell) {
    padding: 15px 90px;
  }

  .upload-licnse {
    align-items: center;

    .el-upload__tip {
      text-align: center;
    }
  }
}
</style>
