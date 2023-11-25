<template>
  <!-- 添加或修改单模板对话框 -->
  <el-dialog
    class="t-dialog t-dialog--top"
    :title="$t('project.addOrModifyTemplateDialog.saveTemplate')"
    v-model="open"
    width="35%"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
    >
      <el-form-item
        :label="$t('project.addOrModifyTemplateDialog.coverImage')"
        prop="coverImg"
      >
        <image-upload v-model:value="form.coverImg" />
      </el-form-item>
      <el-form-item
        :label="$t('project.addOrModifyTemplateDialog.templateName')"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :placeholder="$t('project.addOrModifyTemplateDialog.enterTemplateName')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('project.addOrModifyTemplateDialog.templateDescription')"
        prop="description"
      >
        <el-input
          v-model="form.description"
          type="textarea"
          rows="8"
          :placeholder="$t('project.addOrModifyTemplateDialog.enterTemplateDescription')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('project.addOrModifyTemplateDialog.templateType')"
        prop="categoryId"
      >
        <el-select
          v-model="form.categoryId"
          :placeholder="$t('project.addOrModifyTemplateDialog.selectProjectType')"
        >
          <el-option
            v-for="temp in templateTypeList"
            :key="temp.id"
            :label="temp.name"
            :value="temp.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('project.addOrModifyTemplateDialog.publicTemplate')"
        prop="scheme"
        v-hasPermi="['form:template:create']"
      >
        <template #label>
          <span>
            {{ $t("project.addOrModifyTemplateDialog.publicTemplate") }}
            <el-tooltip
              class="item"
              :content="$t('project.addOrModifyTemplateDialog.publicTemplateDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon><ele-QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <el-switch v-model="form.publicTemplate" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-re-click
          type="primary"
          @click="submitForm"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
        <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { createTemplateRequest, getFormTemplateTypeListRequest } from "@/api/project/template";

export default {
  name: "CreateTemplate",
  props: {
    formKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      templateTypeList: [],
      // 表单校验
      rules: {
        coverImg: [
          {
            required: true,
            message: this.$t("project.addOrModifyTemplateDialog.uploadCoverImage"),
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("project.addOrModifyTemplateDialog.projectNameRequired"),
            trigger: "blur"
          }
        ],
        categoryId: [
          {
            required: true,
            message: this.$t("project.addOrModifyTemplateDialog.projectTypeRequired"),
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    getFormTemplateTypeListRequest().then(res => {
      this.templateTypeList = res.data;
    });
  },
  methods: {
    handleOpen() {
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        formKey: null,
        coverImg: null,
        name: null,
        description: null,
        categoryId: null,
        scheme: null,
        status: 0,
        userId: null,
        updateTime: null,
        createTime: null,
        publicTemplate: false
      };
      this.resetForm("form");
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.formKey = this.formKey;
          this.form.userId = this.form.publicTemplate ? 0 : null;
          createTemplateRequest(this.form).then(res => {
            this.msgSuccess(this.$t("formI18n.all.success"));
            this.open = false;
            // 是否去模版中心查看
          });
        }
      });
    }
  }
};
</script>
