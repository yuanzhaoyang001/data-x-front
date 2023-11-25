<template>
  <div>
    <el-form-item :label="$t('formgen.button.buttonNameLabel')">
      <el-input
        v-model="activeData.content"
        :placeholder="$t('formgen.button.buttonNameLabel')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.button.buttonFunctionLabel')">
      <el-select
        style="width: 100%"
        v-model="activeData.config['buttonFunction']"
        @change="clearInput"
        placeholder=""
      >
        <el-option
          :label="$t('formgen.button.goToLinkOption')"
          value="drop"
        />
        <el-option
          :label="$t('formgen.button.callOption')"
          value="call"
        />
      </el-select>
      <el-input
        style="margin-top: 5px"
        v-model="activeData.functionText"
        :placeholder="$t('formgen.button.enter')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.button.frontIconLabel')">
      <el-input
        v-model="activeData['icon']"
        placeholder=""
      >
        <template #append>
          <el-button
            icon="ele-Pointer"
            @click="openIconsDialog('icon')"
          >
            {{ $t("formgen.button.selectButtonLabel") }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('formgen.button.arrangementLabel')">
      <el-radio-group
        v-model="activeData['arrange']"
        size="small"
      >
        <el-radio-button label="left">{{ $t("formgen.button.leftOption") }}</el-radio-button>
        <el-radio-button label="center">{{ $t("formgen.button.centerOption") }}</el-radio-button>
        <el-radio-button label="right">{{ $t("formgen.button.rightOption") }}</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <!--    <el-form-item label="宽度占比">-->
    <!--      <el-input-number v-model="activeData.config['width']" label="宽度占比" :min="20" :max="100" :step="10" />-->
    <!--    </el-form-item>-->
    <icons-dialog
      :current="activeData[icon]"
      v-model:visible="iconsVisible"
      @select="setIcon"
    />
  </div>
</template>

<script>
import IconsDialog from "../IconsDialog.vue";

export default {
  name: "ConfigItemButton",
  components: {
    IconsDialog
  },
  props: ["activeData"],
  data() {
    return {
      icon: null,
      iconsVisible: false
    };
  },
  methods: {
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.icon = model;
    },
    setIcon(val) {
      this.activeData[this.icon] = val;
    },
    clearInput() {
      // 清空文本框的值
      this.activeData.functionText = "";
    }
  }
};
</script>
