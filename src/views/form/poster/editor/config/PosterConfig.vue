<template>
  <el-form
    ref="formRef"
    :model="posterConfig"
    label-width="120px"
    label-position="top"
    size="default"
  >
    <el-form-item
      prop="name"
      :label="$t('form.formPoster.name')"
      :rules="[
        {
          required: true,
          message: i18n.global.t('form.formPoster.enterPosterName'),
          trigger: 'blur'
        }
      ]"
    >
      <el-input v-model="posterConfig.name" />
    </el-form-item>
    <el-form-item
      prop="posterFileType"
      :label="$t('form.formPoster.fileFormat')"
    >
      <el-radio-group v-model="posterConfig.posterFileType">
        <el-radio-button :label="PosterFileType.PNG">PNG</el-radio-button>
        <el-radio-button :label="PosterFileType.JPG">JPG</el-radio-button>
        <el-radio-button :label="PosterFileType.JPEG">JPEG</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.size')">
      <span class="mr10">{{ $t("form.formPoster.width") }}</span>
      <el-input-number
        v-model="posterConfig.width"
        controls-position="right"
        style="width: 40%"
      />
      <span class="mr10 ml5">{{ $t("form.formPoster.height") }}</span>
      <el-input-number
        v-model="posterConfig.height"
        controls-position="right"
        style="width: 40%"
      />
    </el-form-item>
    <el-form-item
      prop="posterBgColor"
      :label="$t('form.formPoster.backgroundColor')"
    >
      <el-color-picker
        v-model="posterConfig.posterBgColor"
        size="default"
        :show-alpha="false"
      />
    </el-form-item>
    <el-form-item
      prop="posterBgImage"
      :label="$t('form.formPoster.backgroundImage')"
    >
      <ImageUpload v-model:value="posterConfig.posterBgImage" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="PosterConfig">
import { storeToRefs } from "pinia";
import { usePosterStore } from "@/stores/formPoster";
import { PosterFileType } from "../types/poster";
import { i18n } from "@/i18n";

const store = usePosterStore();

const { posterConfig }: any = storeToRefs(store);
</script>

<style lang="scss" scoped></style>
