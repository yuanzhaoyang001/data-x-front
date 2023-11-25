<template>
  <div class="view-container">
    <h4
      class="form-name-text"
      v-html="title"
    />
    <el-descriptions
      :column="1"
      border
      class="form-view"
      direction="vertical"
      title=""
    >
      <el-descriptions-item
        v-for="f in formFields"
        :key="f.value"
        :label="f.label"
      >
        <div v-if="['IMAGE_UPLOAD'].includes(f.type)">
          <span
            v-for="(file, index) in formModel[f.value]"
            :key="index"
          >
            <el-image
              :preview-src-list="[file.url]"
              :src="file.url"
              fit="cover"
              style="width: 100px; height: 100px"
            />
          </span>
        </div>
        <div v-else-if="['SUB_FORM'].includes(f.type) && formModel[f.value]">
          <div
            v-for="sub in formModel[f.value]"
            :key="sub"
          >
            <div
              v-for="f1 in f.childList"
              :key="f1.formItemId"
            >
              <span>{{ f1.config.label }}:</span>
              <span>{{ getSubFormValueFormat(f1, sub) }}</span>
            </div>
            <el-divider />
          </div>
        </div>
        <div v-else-if="['SIGN_PAD'].includes(f.type)">
          <el-image
            :preview-src-list="formModel[f.value]"
            :src="formModel[f.value]"
            fit="cover"
            style="width: 100px; height: 100px"
          />
        </div>
        <div v-else>
          {{ getValueFormat(f) }}
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import _ from "lodash-es";
import { getFormDataDetailsRequest } from "@/api/project/data";
import { formatMatrixInputData, formatMatrixSelectData } from "@/views/form/data/table/formatTableColumn";

export default {
  name: "PublicView",
  data() {
    return {
      title: "",
      // 表单字段
      formFields: [],
      // 表单
      formModel: {}
    };
  },
  created() {
    // this.haveValueFields = this.fields.filter(item => {
    //   let value = this.formModel[item.config.formId]
    //   return value != undefined && value != '' && value != null && value != []
    // })
    let key = this.$route.query.key || this.$route.params.key;
    let dataId = this.$route.query.dataId || this.$route.params.dataId;
    // queryProject(key).then((res) => {
    //   this.title = res.data.name
    // })
    getFormDataDetailsRequest(dataId).then(res => {
      this.formModel = res.data.formData;
      this.formFields = res.data.formFields;
    });
  },
  methods: {
    getSubFormLabelMap(f, key) {
      if (f.childList) {
        let item = f.childList.find(child => child.vModel == key);
        return item ? item.config.label : "";
      }
    },
    getKeys(o) {
      return _.keys(o);
    },
    /**
     * 自增表单数据格式化
     * @param f
     * @param formModel
     * @returns {*}
     */
    getSubFormValueFormat(f, formModel) {
      if (["CASCADER", "RADIO", "CHECKBOX", "IMAGE_SELECT", "SELECT"].includes(f.typeId)) {
        return _.isArray(formModel[`${f.config.formId}label`])
          ? formModel[`${f.config.formId}label`].join(",")
          : formModel[`${f.config.formId}label`];
      } else if (["UPLOAD"].includes(f.typeId)) {
        return formModel[`${f.config.formId}`].map(item => item.url).join(",");
      }
      return formModel[f.config.formId];
    },

    /**
     * 默认数据格式化
     * @param f
     * @returns {*}
     */
    getValueFormat(f) {
      if (["CASCADER", "RADIO", "CHECKBOX", "IMAGE_SELECT", "SELECT"].includes(f.type)) {
        return _.isArray(this.formModel[`${f.value}`]) ? this.formModel[`${f.value}`].join(",") : this.formModel[`${f.value}`];
      } else if (["UPLOAD"].includes(f.type)) {
        return this.formModel[`${f.value}`].map(item => item.url).join(",");
      } else if (["USER_SELECT", "DEPT_SELECT"].includes(f.type)) {
        return this.formModel[`${f.value}`].map(item => item.name).join(",");
      } else if ("MATRIX_INPUT" === f.type) {
        return formatMatrixInputData(this.formModel[f.value], f);
      } else if (["MATRIX_SELECT", "MATRIX_SCALE"].includes(f.type)) {
        return formatMatrixSelectData(this.formModel[f.value], f);
      }
      return this.formModel[f.value];
    }
  }
};
</script>

<style lang="scss" scoped>
.view-container {
  padding-bottom: 20px;
}

.form-name-text {
  text-align: center;
  height: 60px;
  vertical-align: middle;
  line-height: 60px;
  font-size: 20px;
}

.form-view {
  max-width: 700px;
  margin: 0 auto;
}
</style>
