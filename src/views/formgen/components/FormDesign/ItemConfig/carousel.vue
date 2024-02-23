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
        :max="10000"
        :min="50"
        :step="5"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.carousel.mheightLabel')">
      <el-input-number
        v-model="activeData.config['mHeight']"
        :label="$t('formgen.carousel.mheightLabel')"
        :min="50"
        :max="10000"
        :step="5"
      />
    </el-form-item>
    <el-divider>{{ $t("formgen.carousel.optionsLabel") }}</el-divider>
    <VueDraggable
      :animation="340"
      v-model="activeData.config.options"
      group="selectItem"
      handle=".option-drag"
    >
      <div
        class="select-item"
        v-for="(element, index) in activeData.config.options"
        :key="element.value"
      >
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
    </VueDraggable>
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
import { VueDraggable } from "vue-draggable-plus";
import { generateId } from "@/utils";

export default {
  name: "ConfigItemImageCarousel",
  components: {
    VueDraggable
  },
  mixins: [mixin],
  methods: {
    addImageCarouselItem() {
      this.activeData.config.options.push({
        label: "",
        image: "",
        value: generateId()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
