<template>
  <div>
    <el-form-item :label="$t('formgen.carousel.imageFitModeLabel')">
      <el-select
        v-model="activeData.config['imageFit']"
        placeholder=""
      >
        <el-option
          :label="$t('formgen.carousel.fillOption')"
          value="fill"
        />
        <el-option
          :label="$t('formgen.carousel.containOption')"
          value="contain"
        />
        <el-option
          :label="$t('formgen.carousel.coverOption')"
          value="cover"
        />
        <el-option
          :label="$t('formgen.carousel.scaleDownOption')"
          value="none"
        />
        <el-option
          :label="$t('formgen.carousel.heightLabel')"
          value="scale-down"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('formgen.carousel.heightLabel')">
      <el-input-number
        v-model="activeData.config['height']"
        :label="$t('formgen.carousel.heightLabel')"
        :min="50"
        :max="10000"
        :step="5"
      />
    </el-form-item>
    <el-divider>{{ $t("formgen.carousel.optionsLabel") }}</el-divider>
    <draggable
      :animation="340"
      v-model="activeData.config.options"
      group="selectItem"
      handle=".option-drag"
      item-key="value"
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
                :placeholder="$t('formgen.carousel.optionNameLabel')"
                size="small"
              />
              <div
                class="close-btn select-line-icon"
                @click="activeData.config.options.splice(index, 1)"
              >
                <el-icon>
                  <ele-Remove />
                </el-icon>
              </div>
            </div>
            <div class="flex-row">
              <el-input
                v-model="element.image"
                :placeholder="$t('formgen.carousel.imageNameLabel')"
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
                    closeUploadProgressHandle();
                  }
                "
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                style="text-align: center"
              >
                <template #trigger>
                  <div class="select-line-icon">
                    <el-icon>
                      <ele-Upload />
                    </el-icon>
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
        icon="ele-Plus"
        style="padding-bottom: 0"
        link
        type="primary"
        @click="addImageCarouselItem"
      >
        {{ $t("formgen.carousel.addOptionLabel") }}
      </el-button>
    </div>
    <el-divider />
  </div>
</template>

<script>
import mixin from "./mixin";
import _ from "lodash-es";
import draggable from "vuedraggable";

export default {
  name: "ConfigItemImageCarousel",
  components: {
    draggable
  },
  mixins: [mixin],
  methods: {
    addImageCarouselItem() {
      const lastItem = _.last(this.activeData.config.options);
      this.activeData.config.options.push({
        label: "",
        image: "",
        value: lastItem ? lastItem.value + 1 : 1
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
