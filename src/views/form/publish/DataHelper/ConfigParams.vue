<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      clas="t-dialog"
      :title="$t('form.configParams.configTemplateVariables')"
    >
      <div class="desc-text">
        {{ $t("form.configParams.selectFormFieldComponents") }}

        <el-link
          href="/msg/template"
          type="primary"
          :underline="false"
          target="_blank"
        >
          {{ $t("form.configParams.configureMessageTemplate") }}
        </el-link>
      </div>
      <el-form
        v-if="!loading"
        class="mt10"
        label-position="top"
      >
        <div v-if="dynamicFields.length == 0">
          <el-empty :description="$t('form.configParams.templateNotConfigured')" />
        </div>

        <el-form-item
          v-for="field in dynamicFields"
          :key="field"
        >
          <template #label>
            {{ $t("form.configParams.templateVariables") }}
            <el-tag type="info">
              {{ field }}
            </el-tag>
            {{ $t("form.configParams.formComponents") }}
            <el-select
              size="default"
              v-model="templateParamMapping[field]"
            >
              <el-option
                v-for="item in fields"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            @click="handleSubmit"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import UserChooseTable from "@/views/system/user/chooseTable.vue";

export default {
  name: "ReminderPersons",
  components: { UserChooseTable },
  props: {
    templateList: {
      type: Array,
      default: () => []
    },
    selectTemplateId: {
      type: Number,
      default: 0
    },
    // 表单字段列表
    fields: {
      type: Array,
      default: () => []
    }
    //
  },
  emits: ["submit"],
  data() {
    return {
      templateParamMapping: {},
      dialogVisible: false,
      dynamicFields: [],
      loading: true
    };
  },
  created() {},
  methods: {
    show(params) {
      this.dialogVisible = true;
      this.loading = true;
      let item = this.templateList.find(item => item.id === this.selectTemplateId);
      if (item) {
        this.dynamicFields = [];
        const regex = /\${([^}]+)}/g;
        const matches = item.templateContent.matchAll(regex);
        for (const match of matches) {
          const extractedString = match[1];
          this.dynamicFields.push(extractedString);
        }
      }
      let initVal = params || {};
      this.dynamicFields.forEach(field => {
        this.templateParamMapping[field] = initVal[field];
      });
      this.loading = false;
    },
    handleSubmit() {
      this.dialogVisible = false;
      this.$emit("submit", this.templateParamMapping);
    }
  }
};
</script>
