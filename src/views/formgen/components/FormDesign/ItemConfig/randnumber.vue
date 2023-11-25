<template>
  <div>
    <el-form-item :label="$t('formgen.randNumberConfig.submitShow')">
      <template #label>
        <span>
          {{ $t("formgen.randNumberConfig.submitShow") }}

          <el-tooltip
            class="item"
            :content="$t('formgen.randNumberConfig.content')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.submitVisible" />
    </el-form-item>
    <el-form-item
      v-for="(rule, index) in activeData.rules"
      :key="rule.type"
      :label="rule.label"
    >
      <el-input
        :placeholder="$t('formgen.randNumberConfig.random') + `${rule.length}` + $t('formgen.randNumberConfig.number')"
        readonly
      >
        <template #append>
          <el-button
            icon="ele-Tools"
            @click="handleOpenSetting(rule, index)"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-dialog
      :title="$t('formgen.randNumberConfig.roleSet')"
      v-model="dialogFormVisible"
    >
      <el-form :model="selectRule">
        <el-form-item
          v-if="selectRule.type == 'RAND_NUMBER'"
          :label="$t('formgen.randNumberConfig.randomNumberLength')"
          label-width="170px"
        >
          <el-input-number
            v-model="selectRule.length"
            :min="5"
            :max="20"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="default"
            @click="dialogFormVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            @click="handleSaveSetting"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ConfigItemRandomNumber",
  props: ["activeData"],
  data() {
    return {
      dialogFormVisible: false,
      selectRule: {},
      selectIndex: 0
    };
  },
  methods: {
    handleOpenSetting(item, index) {
      this.selectIndex = index;
      this.selectRule = item;
      this.dialogFormVisible = true;
    },
    handleSaveSetting() {
      this.activeData.rules[this.selectIndex] = this.selectRule;
      this.dialogFormVisible = false;
    }
  }
};
</script>
