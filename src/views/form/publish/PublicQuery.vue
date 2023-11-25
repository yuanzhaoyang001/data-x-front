<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.public.publicQuery") }}</span>
        <span class="desc-text ml10">
          {{ $t("form.public.publicQueryDescription") }}
        </span>
      </div>
    </template>
    <div class="p10">
      <el-button
        type="primary"
        icon="ele-Plus"
        class="mt10"
        @click="handleOpenPublicQuery()"
      >
        {{ $t("form.public.addPublicQuery") }}
      </el-button>
      <el-card
        v-for="q in publicQueryList"
        :key="q.id"
        shadow="never"
        :body-style="{ padding: '20px' }"
        class="mt10"
      >
        <template #header>
          <div class="clearfix">
            <span class="large-font-size">{{ q.name }}</span>
            <span class="base-font-size text-placeholder-color ml5">
              {{ q.description }}
            </span>
            <span class="base-font-size text-placeholder-color ml5">
              {{ q.createTime }}
            </span>
            <el-button
              link
              type="primary"
              class="text-danger top-right-btn"
              @click="handleDeleteQuery(q)"
            >
              {{ $t("formI18n.all.delete") }}
            </el-button>
            <el-button
              class="top-right-btn mr10"
              link
              type="primary"
              @click="handleOpenPublicQuery(q)"
            >
              {{ $t("form.public.modify") }}
            </el-button>
          </div>
        </template>
        <el-switch
          v-model="q.openStatus"
          active-color="#13ce66"
          :active-text="$t('form.public.open')"
          :inactive-text="$t('form.public.close')"
          @change="
            val => {
              handlePublishChange(q, val);
            }
          "
        />
        <url-operate :link-url="`${queryDataLink}${q.id}`" />
      </el-card>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('form.public.publicQuery')"
      width="60%"
    >
      <el-form
        ref="queryForm"
        :model="form"
        label-width="130px"
      >
        <el-form-item
          :label="$t('form.public.queryName')"
          prop="name"
          :rules="[{ required: true, message: $t('form.public.queryName'), trigger: 'change' }]"
        >
          <el-input
            v-model="form.name"
            link
            :placeholder="$t('form.public.enterContent')"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('form.public.queryDescription')"
          :rules="[{ message: $t('form.public.queryDescription'), trigger: 'change' }]"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :placeholder="$t('form.public.enterContent')"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('form.public.queryConditions')">
          <div class="flex w100">
            <el-button
              icon="ele-Plus"
              class="ml35"
              link
              type="primary"
              circle
              @click="handleAddQueryField"
            >
              {{ $t("form.public.addCondition") }}
            </el-button>
          </div>
          <div
            v-for="(q, index) in form.queryFields"
            :key="q.formItemId + index"
            class="mt5 w100"
          >
            <el-select
              v-model="q.formItemId"
              :placeholder="$t('form.public.queryConditions')"
            >
              <el-option
                v-for="item in allFields"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="q.method"
              class="ml10"
              :placeholder="$t('form.public.queryConditions')"
            >
              <el-option
                :label="$t('form.public.equal')"
                value="EQ"
              />
              <el-option
                :label="$t('form.public.fuzzy')"
                value="INCLUDE"
              />
            </el-select>
            <el-icon
              class="ml10 text-danger cursor-pointer"
              @click="form.queryFields.splice(index, 1)"
            >
              <ele-Delete />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item :label="$t('form.public.displayFields')">
          <el-select
            v-model="form.showFields"
            multiple
            collapse-tags
            :placeholder="$t('form.public.selectDisplayFields')"
          >
            <el-option
              v-for="item in allFields"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('form.public.displayStyle')">
          <el-radio-group v-model="form.config.styleType">
            <el-radio label="CARD">{{ $t("form.public.card") }}</el-radio>
            <el-radio label="TABLE">{{ $t("form.public.table") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>{{ $t("form.public.allConditions") }}</span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('form.public.needInputAllConditions')"
              placement="left"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-switch v-model="form.config.inputAllCondition" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>{{ $t("form.public.allowModify") }}</span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('form.public.allowModifyDescription')"
              placement="left"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </template>
          <el-switch v-model="form.config.allowModify" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="savePublicQuery"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import UrlOperate from "./UrlOperate.vue";
import { deletePublicQueryRequest, getPublicQueryListRequest, savePublicQueryRequest } from "@/api/project/publish";
import { listFormFieldsRequest } from "@/api/project/form";
import { i18n } from "@/i18n";

export default {
  name: "PublicQuerySetting",
  components: {
    UrlOperate
  },
  data() {
    return {
      queryDataLink: "",
      formKey: "",
      publicQueryList: [],
      form: {
        queryFields: [],
        showFields: []
      },
      dialogVisible: false,
      // 全部字段
      allFields: []
    };
  },
  created() {
    this.formKey = this.$route.query.key;
    let url = window.location.protocol + "//" + window.location.host;
    this.queryDataLink = `${url}/q/${this.formKey}?qid=`;
    this.getPublicQueryInfo();
    this.queryFormFields();
    this.resetForm();
  },
  methods: {
    // 查询表单字段
    queryFormFields() {
      listFormFieldsRequest(this.formKey).then(res => {
        this.allFields = res.data;
      });
    },
    handlePublishChange(item, val) {
      item.status = val ? 1 : 0;
      savePublicQueryRequest(item).then(res => {});
    },
    handleAddQueryField() {
      this.form.queryFields.push({
        formItemId: null,
        method: null
      });
    },
    resetForm() {
      this.form = {
        name: null,
        description: "",
        queryFields: [
          {
            formItemId: null,
            method: null
          }
        ],
        showFields: [],
        config: {
          inputAllCondition: false,
          allowModify: false,
          styleType: "CARD"
        }
      };
    },
    handleOpenPublicQuery(item) {
      if (!item) {
        this.resetForm();
      } else {
        // 复制item到form
        this.form = JSON.parse(JSON.stringify(item));
      }
      this.dialogVisible = true;
    },
    handleDeleteQuery(item) {
      deletePublicQueryRequest(item).then(res => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.getPublicQueryInfo();
      });
    },
    savePublicQuery() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.form.formKey = this.formKey;
          savePublicQueryRequest(this.form).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.form = res.data;
            this.resetForm();
            this.dialogVisible = false;
            this.getPublicQueryInfo();
          });
        }
      });
    },
    getPublicQueryInfo() {
      getPublicQueryListRequest(this.formKey).then(res => {
        if (res.data) {
          this.publicQueryList = res.data.map(item => {
            item.openStatus = item.status === 1;
            return item;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ext-label {
  color: #303133;
}

.query-card {
  height: 100px;
}
</style>
