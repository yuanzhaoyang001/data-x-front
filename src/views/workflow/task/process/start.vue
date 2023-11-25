<template>
  <div class="app-container t-form-theme-wrap">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span class="el-icon-document">{{ $t("workflow.start.baseInfo") }}</span>
          <el-button
            style="float: right"
            type="primary"
            @click="goBack"
            size="default"
          >
            {{ $t("workflow.start.back") }}
          </el-button>
        </div>
      </template>
      <!--初始化流程加载表单信息-->
      <biz-project-form
        v-if="formConf.formKey"
        :form-config="formConf"
        @submit="submitForm"
      />
    </el-card>
  </div>
</template>

<script>
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import { getBusinessFormRequest } from "@/api/workflow/workflow";
import { createFormResultRequest } from "@/api/project/data";

import UAParser from "ua-parser-js";
import { closeCurrentTag } from "@/utils/other";
import { i18n } from "@/i18n";

const ua = new UAParser(navigator.userAgent);

export default {
  name: "Record",
  components: {
    BizProjectForm
  },
  props: {},
  emits: ["onCurrentContextmenuClick"],
  data() {
    return {
      formConf: {
        formKey: ""
      }
    };
  },
  created() {
    // 初始化表单
    getBusinessFormRequest(this.$route.query.deployId).then(res => {
      if (res.data) {
        this.formConf.formKey = res.data.formKey;
      }
    });
  },
  methods: {
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      closeCurrentTag(this.$route);
      this.$router.go(-1);
    },
    /** 申请流程表单数据提交 */
    submitForm(data) {
      if (data) {
        // 完成时间
        createFormResultRequest({
          ...data,
          formKey: this.formConf.formKey
        }).then(() => {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.goBack();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.app-container {
  height: 100%;
}

.box-card {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
