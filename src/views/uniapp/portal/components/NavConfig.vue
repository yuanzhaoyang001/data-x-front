<template>
  <div class="banner-config-wrap">
    <el-button
      class="addition"
      icon="ele-Plus"
      plain
      size="small"
      type="primary"
      @click="addNav"
    >
      {{ $t("system.customButton.addCustomButton") }}
    </el-button>
    <VueDraggable
      v-model="navList"
      animation="150"
      @end="onEnd"
      target=".el-table .el-table__body tbody"
    >
      <el-table
        style="width: 100%"
        border
        :data="navList"
        ref="listTable"
        row-key="id"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          :label="$t('system.customButton.buttonName')"
          width="width"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="url"
          :label="$t('system.customButton.buttonImage')"
          width="width"
          align="center"
        >
          <template #default="{ row }">
            <img
              :src="row.imgUrl"
              alt=""
              class="images"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="prop"
          :label="$t('system.customButton.buttonType')"
          width="width"
          align="center"
        >
          <template #default="{ row }">
            <el-tag type="success">
              {{
                `${
                  row.type === 1
                    ? $t("system.customButton.miniProgramAddress")
                    : row.type === 2
                    ? $t("system.customButton.linkAddress")
                    : $t("system.customButton.thirdPartyMiniProgram")
                }`
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="prop"
          :label="$t('system.customButton.operation')"
          width="width"
          align="center"
        >
          <template #default="{ row, $index }">
            <el-tooltip
              :content="$t('system.customButton.modify')"
              placement="top"
            >
              <el-button
                link
                type="primary"
                icon="ele-Edit"
                @click="changeNav(row, $index)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :content="$t('system.customButton.delete')"
              placement="top"
            >
              <el-button
                link
                type="danger"
                icon="ele-Delete"
                @click="deleteNav($index)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </VueDraggable>
    <el-dialog
      :title="`${null !== index ? $t('system.customButton.modifyButton') : $t('system.customButton.addButton')}`"
      v-model="isShowDialog"
      width="40%"
      append-to-body
      :before-close="closeDialog"
    >
      <el-form
        style="width: 80%"
        :model="navForm"
        :rules="rules"
        ref="navFormRef"
      >
        <el-form-item
          :label="$t('system.customButton.buttonName')"
          label-width="110px"
          prop="name"
        >
          <el-input
            v-model="navForm.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.customButton.jumpType')"
          label-width="110px"
          prop="type"
        >
          <el-radio-group v-model="navForm.type">
            <el-radio :label="2">{{ $t("system.customButton.linkAddress") }}</el-radio>
            <el-radio :label="1">{{ $t("system.customButton.miniProgramPage") }}</el-radio>
            <el-radio :label="3">{{ $t("system.customButton.thirdPartyMiniProgram") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="navForm.type === 3"
          label="Appid"
          label-width="110px"
        >
          <el-input
            v-model="navForm.appId"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.customButton.jumpPath')"
          label-width="110px"
          prop="addressUrl"
        >
          <el-input
            v-model="navForm.addressUrl"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.customButton.buttonImage')"
          label-width="110px"
          prop="imgUrl"
        >
          <image-upload v-model:value="navForm.imgUrl" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
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
import { onMounted, reactive, ref } from "vue";
import { i18n } from "@/i18n";
import type { FormInstance } from "element-plus";
import { portalConfigStore } from "@/views/uniapp/portal/config";
import { Nav } from "@/views/uniapp/portal/types/types";
import { useDraggable, VueDraggable } from "vue-draggable-plus";

const navForm = reactive<Nav>({
  name: "",
  imgUrl: "",
  type: "",
  addressUrl: "",
  appId: ""
});
const { portalConfig } = portalConfigStore;

const navList = ref<Nav[]>(portalConfig.value.navList);
const index = ref<number | null>(null);
const isShowDialog = ref(false);
const loading = ref(true);
const rules = {
  name: [{ required: true, message: i18n.global.t("system.customButton.buttonNameRequired"), trigger: "blur" }],
  imgUrl: [
    {
      required: true,
      message: i18n.global.t("system.customButton.imageAddressRequired"),
      trigger: "blur"
    }
  ],
  type: [{ required: true, message: i18n.global.t("system.customButton.jumpPathRequired"), trigger: "blur" }]
};

const addNav = () => {
  navForm.name = "";
  navForm.imgUrl = "";
  navForm.type = "";
  navForm.addressUrl = "";
  index.value = null;
  isShowDialog.value = true;
};

const navFormRef = ref<FormInstance>();

const handleSubmit = () => {
  navFormRef.value!.validate(valid => {
    if (valid) {
      if (null === index.value) {
        navList.value.push({ ...navForm });
      } else {
        navList.value[index.value] = { ...navForm };
      }
      isShowDialog.value = false;
    }
  });
};

const deleteNav = (row: any) => {
  const data = navList.value || [];
  const index = data.findIndex((item: any) => item.name === row.name);
  data.splice(index, 1);
  navList.value = data;
};

const changeNav = (row: any, i: number) => {
  index.value = i;
  isShowDialog.value = true;
  navForm.name = row.name;
  navForm.imgUrl = row.imgUrl;
  navForm.type = row.type;
  navForm.addressUrl = row.addressUrl;
};

onMounted(() => {
  getNav();
});

const getNav = async () => {
  loading.value = false;
  navList.value = portalConfig.value.navList;
};

const cancel = () => {
  isShowDialog.value = false;
  navFormRef.value!.resetFields();
};

const closeDialog = () => {
  navFormRef.value!.resetFields();
  isShowDialog.value = false;
  navForm.name = "";
  navForm.imgUrl = "";
  navForm.type = "";
  navForm.addressUrl = "";
};

const onEnd = (event: SortableEvent) => {
  portalConfig.value.navList = navList.value;
};
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
