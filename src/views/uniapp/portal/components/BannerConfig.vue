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
    <div id="table-container">
      <VueDraggable
        v-model="bannerList"
        animation="150"
        @end="onEnd"
        target=".el-table .el-table__body tbody"
      >
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
              <el-image
                :preview-src-list="[row.url]"
                :z-index="9999"
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
      </VueDraggable>
    </div>
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
import { i18n } from "@/i18n";
import { nextTick, onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { VueDraggable } from "vue-draggable-plus";
import { portalConfigStore } from "@/views/uniapp/portal/config";
import { Banner } from "@/views/uniapp/portal/types/types";
import { useDraggable } from "vue-draggable-plus";
import { SortableEvent } from "sortablejs";
import { cloneDeep } from "lodash-es";

const bannerForm = ref<Banner>({
  name: "",
  url: "",
  type: "",
  addressUrl: "",
  appId: ""
});

const { portalConfig } = portalConfigStore;

const bannerList = ref<Banner[]>(portalConfig.value.bannerList);
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

const bannerFormRef = ref<FormInstance>();

const handleSubmit = () => {
  bannerFormRef.value!.validate(valid => {
    if (valid) {
      if (!isUpdate.value) {
        bannerList.value.push(bannerForm.value);
      }
      isShowDialog.value = false;
    }
  });
};

const deleteBanner = row => {
  ElMessageBox.confirm(i18n.global.t("system.customButton.isDelete"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      bannerList.value.splice(bannerList.value.indexOf(row), 1);
    })
    .catch(() => {});
};

const changeBanner = row => {
  isShowDialog.value = true;
  bannerForm.value = row;
  isUpdate.value = true;
};

const closeDialog = () => {
  bannerFormRef.value!.resetFields();
  isShowDialog.value = false;
};

const onEnd = (event: SortableEvent) => {
  portalConfig.value.bannerList = bannerList.value;
};

onMounted(() => {
  getBanners();
});
</script>

<style lang="scss" scoped>
.images {
  width: 60px;
  height: 30px;
}

.banner-config-wrap {
  padding: 20px;
}

.addition {
  margin-bottom: 10px;
}
</style>
