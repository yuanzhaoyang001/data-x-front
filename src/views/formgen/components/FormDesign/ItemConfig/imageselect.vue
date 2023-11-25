<template>
  <div>
    <el-form-item :label="$t('formgen.imgSelect.showVote')">
      <el-switch v-model="activeData.config.showVoteResult" />
    </el-form-item>
    <el-form-item :label="$t('formgen.imgSelect.multipleChoice')">
      <el-switch
        v-model="activeData.multiple"
        @change="multipleChange"
      />
    </el-form-item>
    <el-divider>{{ $t("formgen.imgSelect.option") }}</el-divider>
    <draggable
      :animation="340"
      v-model="activeData.config.options"
      item-key="value"
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
          <div class="width-full">
            <div class="flex-row">
              <el-input
                v-model="element.label"
                :placeholder="$t('formgen.imgSelect.option')"
                size="small"
              />
              <div
                class="close-btn select-line-icon"
                @click="activeData.config.options.splice(index, 1)"
              >
                <el-button
                  link
                  type="danger"
                >
                  {{ $t("formI18n.all.delete") }}
                </el-button>
              </div>
            </div>
            <div class="flex-row">
              <el-input
                v-model="element.image"
                :placeholder="$t('formgen.imgSelect.uploadImg')"
                size="small"
              />
              <el-upload
                ref="logoUpload"
                :action="getUploadUrl"
                :headers="getUploadHeader"
                :on-progress="uploadProgressHandle"
                :on-success="
                  (response, file, fileList) => {
                    element.image = response.data;
                    activeData.config.options[index] = element;
                    // $set(activeData.config.options, index, item);
                    closeUploadProgressHandle();
                  }
                "
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                style="text-align: center"
              >
                <template #trigger>
                  <div class="select-line-icon">
                    <el-button
                      link
                      type="primary"
                    >
                      {{ $t("formI18n.all.upload") }}
                    </el-button>
                  </div>
                </template>
              </el-upload>
            </div>
          </div>
        </div>
      </template>
    </draggable>
    <div style="margin-left: 20px">
      <el-button
        icon="ele-CirclePlus"
        style="padding-bottom: 0"
        link
        type="primary"
        @click="addImageSelectItem"
      >
        {{ $t("formgen.imgSelect.addOption") }}
      </el-button>
    </div>
    <el-divider />
  </div>
</template>

<script>
import mixin from "./mixin";
import draggable from "vuedraggable";
import _ from "lodash-es";

export default {
  name: "ConfigItemImageSelect",
  components: {
    draggable
  },
  mixins: [mixin],
  props: ["activeData"],
  data() {
    return {};
  },
  methods: {
    addImageSelectItem() {
      const lastItem = _.last(this.activeData.config.options);
      this.activeData.config.options.push({
        label: "",
        image: "",
        value: lastItem ? lastItem.value + 1 : 1
      });
    },
    multipleChange(val) {
      this.activeData.config["defaultValue"] = val ? [] : "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
