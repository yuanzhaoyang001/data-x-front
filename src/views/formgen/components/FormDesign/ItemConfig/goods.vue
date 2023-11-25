<template>
  <div>
    <el-form-item :label="$t('formgen.goodsConfig.hideInventory')">
      <el-switch v-model="activeData.showInventory" />
    </el-form-item>
    <el-form-item :label="$t('formgen.goodsConfig.showPhoto')">
      <el-switch v-model="activeData.showGoodsPhoto" />
    </el-form-item>
    <el-divider>
      {{ $t("formI18n.all.option") }}
    </el-divider>
    <div>
      <draggable
        :animation="340"
        v-model="activeData.goodsList"
        item-key="id"
        group="selectItem"
        handle=".option-drag"
      >
        <template #item="{ element, index }">
          <div class="select-item">
            <div class="select-line-icon option-drag">
              <el-icon>
                <ele-Operation />
              </el-icon>
            </div>
            <el-input
              v-model="element.goodsName"
              :placeholder="$t('formgen.goodsConfig.goodsName')"
              size="small"
            />
            <div
              class="select-line-icon"
              @click="handleSettingGoods(element, index)"
            >
              <el-icon>
                <ele-Tools />
              </el-icon>
            </div>
            <div
              class="close-btn select-line-icon"
              @click="activeData.goodsList.splice(index, 1)"
            >
              <el-icon>
                <ele-Remove />
              </el-icon>
            </div>
          </div>
        </template>
      </draggable>
      <div style="margin-left: 20px; margin-bottom: 10px">
        <el-button
          icon="ele-CirclePlus"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="addGoodsItem"
        >
          {{ $t("formgen.goodsConfig.addGoods") }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('formgen.goodsConfig.addGoods')"
      v-model="dialogVisible"
    >
      <el-form
        :model="selectGoods"
        label-position="left"
        label-width="80px"
      >
        <el-form-item
          v-if="activeData.showGoodsPhoto"
          :label="$t('formgen.goodsConfig.goodsPhoto')"
        >
          <el-upload
            :action="getUploadUrl"
            :headers="getUploadHeader"
            :on-success="handleUploadSuccess"
            :on-progress="uploadProgressHandle"
            list-type="picture-card"
            :file-list="selectGoods.imgList"
            :on-remove="handleRemove"
          >
            <el-icon>
              <ele-Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item
          :label="$t('formgen.goodsConfig.goodsName')"
          prop="goodsName"
        >
          <el-input v-model="selectGoods.goodsName" />
        </el-form-item>
        <el-form-item :label="$t('formgen.goodsConfig.goodsDesc')">
          <el-input v-model="selectGoods.description" />
        </el-form-item>
        <el-form-item :label="$t('formgen.goodsConfig.price')">
          <el-input-number
            v-model="selectGoods.price"
            :precision="2"
          />
        </el-form-item>
        <el-form-item :label="$t('formgen.goodsConfig.inventory')">
          <el-input-number v-model="selectGoods.inventory" />
        </el-form-item>
        <el-form-item :label="$t('formgen.goodsConfig.remain')">
          <el-input-number
            v-model="selectGoods.remainInventory"
            :disabled="true"
            :precision="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            @click="handleSaveGoodsSetting"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import mixin from "./mixin";
import _ from "lodash-es";
import { getRequest } from "@/api/baseRequest";
import { i18n } from "@/i18n";

export default {
  name: "ConfigItemGoodsSelect",
  components: {
    draggable
  },
  mixins: [mixin],
  props: ["activeData"],
  data() {
    return {
      dialogVisible: false,
      selectGoodsIndex: 0,
      selectGoods: {},
      showGoodsPhoto: false
    };
  },
  created() {
    this.queryGoodsSellQuantity();
  },
  methods: {
    queryGoodsSellQuantity() {
      getRequest("/form/ext/queryGoodsSellQuantity", {
        formKey: this.$route.query.key,
        formItemId: this.activeData.config.formId
      }).then(res => {
        if (res.data) {
          let data = res.data;
          this.activeData.goodsList.forEach((goods, index) => {
            let remainInventory = goods.inventory;
            if (data[goods.id]) {
              remainInventory = goods.inventory - data[goods.id];
            }
            goods.remainInventory = remainInventory;
            this.activeData.goodsList[index] = goods;
          });
        }
      });
    },
    addGoodsItem() {
      this.activeData.goodsList.push({
        id: new Date().getTime(),
        imgList: [],
        goodsName: i18n.global.t("formgen.goodsConfig.goodsName"),
        description: "",
        price: 100,
        count: 1,
        inventory: 100
      });
    },
    handleSettingGoods(goods, index) {
      this.selectGoodsIndex = index;
      this.dialogVisible = true;
      this.selectGoods = JSON.parse(JSON.stringify(goods));
    },
    handleUploadSuccess(response) {
      this.selectGoods.imgList.push({ url: response.data });
      this.closeUploadProgressHandle();
    },
    handleRemove(file, fileList) {
      _.remove(this.selectGoods.imgList, function (item) {
        return item.url === file.url;
      });
    },
    handleSaveGoodsSetting() {
      console.log(this.activeData.showGoodsPhoto);
      this.activeData.goodsList[this.selectGoodsIndex] = this.selectGoods;
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
