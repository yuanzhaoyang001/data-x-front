<template>
  <div class="banner-config-wrap">
    <el-button
      class="addition"
      size="small"
      icon="ele-Plus"
      plain
      type="primary"
      @click="addBanner"
    >
      {{ $t("system.banner.addHomeBanner") }}
    </el-button>
    <el-table
      style="width: 100%"
      border
      :data="bannerList"
      ref="listTable"
      row-key="id"
      v-loading="loading"
    >
      <el-table-column
        prop="name"
        :label="$t('system.banner.name')"
        width="width"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="prop"
        :label="$t('system.banner.image')"
        width="width"
        align="center"
      >
        <template #default="{ row }">
          <img
            :src="row.url"
            alt=""
            class="images"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        :label="$t('system.banner.buttonType')"
        width="width"
        align="center"
      >
        <template #default="{ row }">
          <el-tag type="success">
            {{
              `${
                row.type === 1
                  ? $t("system.banner.miniProgramAddress")
                  : row.type === 2
                  ? $t("system.banner.linkAddress")
                  : $t("system.banner.thirdPartyMiniProgram")
              }`
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        :label="$t('system.banner.operation')"
        width="width"
        align="center"
      >
        <template #default="{ row, $index }">
          <el-tooltip
            :content="$t('system.banner.modify')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="changeBanner(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.banner.delete')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="deleteBanner($index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="`${isUpdate ? $t('system.banner.modify') : $t('system.banner.addBanner')}`"
      v-model="isShowDialog"
      width="50%"
      append-to-body
      :before-close="closeDialog"
    >
      <el-form
        style="width: 80%"
        :model="bannerForm"
        :rules="rules"
        ref="bannerFormRef"
      >
        <el-form-item
          :label="$t('system.banner.name')"
          label-width="100px"
          prop="name"
        >
          <el-input
            v-model="bannerForm.name"
            auto-complete="off"
            :placeholder="$t('system.banner.enterParameterName')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.banner.image')"
          label-width="100px"
          prop="url"
        >
          <image-upload v-model:value="bannerForm.url" />
        </el-form-item>
        <el-form-item
          :label="$t('system.banner.buttonType')"
          label-width="100px"
        >
          <el-radio-group v-model="bannerForm.type">
            <el-radio :label="2">{{ $t("system.banner.linkAddress") }}</el-radio>
            <el-radio :label="1">{{ $t("system.banner.miniProgramPage") }}</el-radio>
            <el-radio :label="3">{{ $t("system.banner.thirdPartyMiniProgram") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="bannerForm.type === 3"
          label="appid"
          label-width="100px"
        >
          <el-input
            v-model="bannerForm.appId"
            :placeholder="$t('system.banner.enterAppid')"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.banner.jumpPath')"
          label-width="100px"
        >
          <el-input
            v-model="bannerForm.addressUrl"
            auto-complete="off"
            :placeholder="$t('system.banner.enterContent')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">{{ $t("formI18n.all.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getByKey, saveConfig } from "@/api/uniapp";
import Sortable from "sortablejs";
import { i18n } from "@/i18n";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { portalConfigStore } from "@/views/uniapp/portal/config";

const bannerForm = ref({
  name: "",
  url: "",
  type: "",
  addressUrl: "",
  appId: ""
});

const { portalConfig } = portalConfigStore;

const bannerList = ref(portalConfig.value.bannerList);
const isUpdate = ref(false);
const isShowDialog = ref(false);
const loading = ref(true);
const rules = {
  name: [{ required: true, message: i18n.global.t("system.banner.nameRequired"), trigger: "blur" }],
  url: [{ required: true, message: i18n.global.t("system.banner.imageAddressRequired"), trigger: "blur" }]
};

const getBanners = async () => {
  loading.value = true;
  bannerList.value = portalConfig.value.bannerList;
  loading.value = false;
};

const addBanner = () => {
  isUpdate.value = false;
  isShowDialog.value = true;
  bannerForm.value = {
    appId: "",
    name: "",
    url: "",
    type: "",
    addressUrl: ""
  };
};

const bannerFormRef = ref<>();

const handleSubmit = () => {
  bannerForm.value.validate(valid => {
    if (valid) {
      if (!isUpdate.value) {
        bannerList.value.push(bannerForm.value);
      }
      saveConfig({
        configKey,
        configValue: bannerList.value
      }).then(() => {
        ElMessage.success(this.isUpdate ? i18n.global.t("formI18n.all.success") : i18n.global.t("formI18n.all.success"));
        isShowDialog.value = false;
      });
    }
  });
};

const deleteBanner = row => {
  ElMessage.confirm(i18n.global.t("system.customButton.isDelete"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      bannerList.value.splice(bannerList.value.indexOf(row), 1);
      saveConfig({
        configKey,
        configValue: bannerList.value
      }).then(() => {
        ElMessage.success(i18n.global.t("formI18n.all.success"));
      });
    })
    .catch(() => {});
};

const changeBanner = row => {
  isShowDialog.value = true;
  bannerForm.value = row;
  isUpdate.value = true;
};

const closeDialog = () => {
  bannerForm.value.resetFields();
  isShowDialog.value = false;
};

const rowDrop = e => {
  const tempBannerList = bannerList.value;
  const currRow = tempBannerList.splice(e.oldIndex, 1)[0];
  tempBannerList.splice(e.newIndex, 0, currRow);
  bannerList.value = [];
  bannerList.value = tempBannerList;
  saveConfig({
    configKey,
    configValue: tempBannerList
  }).then(() => {
    ElMessage.success(i18n.global.t("formI18n.all.success"));
  });
};

onMounted(() => {
  getBanners();
});
</script>

<style lang="scss" scoped>
.images {
  width: 100px;
  height: 50px;
}

.banner-config-wrap {
  padding: 20px;
}

.addition {
  margin-bottom: 10px;
}
</style>
