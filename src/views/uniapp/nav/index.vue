<template>
  <div class="app-container">
    <el-button
      class="addition"
      icon="ele-Plus"
      plain
      type="primary"
      @click="addNav"
    >
      {{ $t("system.customButton.addCustomButton") }}
    </el-button>
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
              @click="changeNav(row)"
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
    <el-dialog
      :title="`${isUpdate ? $t('system.customButton.modifyButton') : $t('system.customButton.addButton')}`"
      v-model="isShowDialog"
      width="40%"
      append-to-body
      :before-close="closeDialog"
    >
      <el-form
        style="width: 80%"
        :model="navForm"
        :rules="rules"
        ref="navForm"
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

<script>
import { getByKey, saveConfig } from "@/api/uniapp";
import Sortable from "sortablejs";
import { i18n } from "@/i18n";

export default {
  name: "HomeNav",
  data() {
    return {
      configKey: "homeNav",
      navForm: {
        name: "",
        imgUrl: "",
        type: "",
        addressUrl: "",
        appId: ""
      },
      navList: [],
      isUpdate: false,
      isShowDialog: false,
      loading: true,
      rules: {
        name: [{ required: true, message: i18n.global.t("system.customButton.buttonNameRequired"), trigger: "blur" }],
        imgUrl: [
          {
            required: true,
            message: i18n.global.t("system.customButton.imageAddressRequired"),
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: i18n.global.t("system.customButton.jumpPathRequired"), trigger: "blur" }]
      }
    };
  },
  created() {
    this.getNav();
  },
  methods: {
    addNav() {
      this.navForm = {
        name: "",
        imgUrl: "",
        type: "",
        addressUrl: ""
      };
      this.isUpdate = false;
      this.isShowDialog = true;
    },
    handleSubmit() {
      this.$refs["navForm"].validate(valid => {
        if (valid) {
          if (!this.isUpdate) {
            this.navList.push(this.navForm);
          }
          saveConfig({
            configKey: this.configKey,
            configValue: this.navList
          }).then(res => {
            this.msgSuccess(this.isUpdate ? i18n.global.t("formI18n.all.success") : i18n.global.t("formI18n.all.success"));
            this.isShowDialog = false;
          });
        }
      });
    },
    deleteNav(row) {
      this.$confirm(i18n.global.t("system.customButton.isDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          console.log("cancel");
        })
        .then(response => {
          this.navList.splice(row, 1);
          saveConfig({ configKey: this.configKey, configValue: this.navList }).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
          });
        })
        .catch(() => {});
    },
    changeNav(row) {
      this.isShowDialog = true;
      this.navForm = row;
      this.isUpdate = true;
    },
    getNav() {
      getByKey({ configKey: this.configKey }).then(res => {
        this.loading = false;
        this.navList = res.data || [];
        this.$nextTick(() => {
          this.rowDrop();
        });
      });
    },
    cancel() {
      this.isShowDialog = false;
      this.$refs["navForm"].clearValidate();
    },
    closeDialog() {
      this.$refs["navForm"].clearValidate();
      this.isShowDialog = false;
      this.navForm = {
        name: "",
        imgUrl: "",
        type: "",
        addressUrl: ""
      };
    },
    rowDrop() {
      const el = document.querySelector(".el-table__body-wrapper tbody");
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        setData: function (dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          let tempNavList = this.navList;
          const currRow = tempNavList.splice(evt.oldIndex, 1)[0];
          tempNavList.splice(evt.newIndex, 0, currRow);
          this.navList = [];
          this.$nextTick(() => {
            this.navList = tempNavList;
          });
          saveConfig({
            configKey: this.configKey,
            configValue: tempNavList
          }).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.images {
  width: 50px;
  height: 50px;
}

.app-container {
  padding: 20px;
}

.addition {
  margin-bottom: 10px;
}
</style>
