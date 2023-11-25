<template>
  <el-card class="confirmation">
    <h2 class="text-center text-bold">核销中心</h2>
    <el-row
      :gutter="20"
      class="mt20"
      justify="center"
      type="flex"
    >
      <el-col
        :sm="20"
        :md="16"
      >
        <el-input
          v-model="confirmation.code"
          placeholder="请输入核销码"
        ></el-input>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      class="mt20"
      justify="center"
      type="flex"
      style="margin-bottom: 20px"
    >
      <el-col
        :xs="{ span: 12, offset: 2 }"
        :md="{ span: 12, offset: 4 }"
      >
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handelEnquiryConfirmation"
        >
          点击查询
        </el-button>
      </el-col>
      <el-col
        :xs="{ span: 12, offset: 2 }"
        :md="{ span: 12, offset: 6 }"
      >
        <el-button
          v-if="showStatus"
          icon="ele-Check"
          type="primary"
          @click="handelConfirmation"
        >
          确认核销
        </el-button>
      </el-col>
    </el-row>

    <div
      v-if="showStatus === 2"
      class="view-wrap"
    >
      <div
        v-if="confirmationResult"
        class="view-card"
      >
        <generate-form
          ref="generateForm"
          :form-conf="formConf"
          :page-form-model="formModel"
          style="margin-bottom: 40px"
        />
      </div>
      <div v-else>
        <el-result
          v-if="errorMsg"
          :title="errorMsg"
          icon="warning"
        ></el-result>
      </div>
    </div>
    <div v-if="showStatus === 3">
      <el-result
        v-if="confirmationResult"
        icon="success"
        title="核销成功"
      ></el-result>
      <el-result
        v-else
        :title="errorMsg"
        icon="warning"
      ></el-result>

      <div class="view-wrap">
        <div
          v-if="confirmationResult"
          class="view-card"
        >
          <generate-form
            ref="generateForm"
            :form-conf="formConf"
            :page-form-model="formModel"
            style="margin-bottom: 40px"
          />
        </div>
      </div>
    </div>
    <el-empty
      v-if="showStatus === 1"
      description="请输入核销码进行查询核销"
    />
  </el-card>
</template>

<script>
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { useConfirmationCodeRequest, getEnquiryConfirmationCodeRequest } from "@/api/project/form";
import { removeHtmlTag } from "@/views/formgen/utils";

export default {
  components: {
    GenerateForm
  },
  data() {
    return {
      // 1.未查询 2。查询了 3.核销了
      showStatus: 1,
      // 操作状态是否成功
      confirmationResult: false,
      confirmation: {
        formKey: "",
        code: ""
      },
      errorMsg: "",
      formConf: {
        fields: [],
        formKey: "",
        disabled: true,
        span: 24,
        size: "small",
        labelPosition: "top",
        labelWidth: 100,
        formRules: "rules",
        gutter: 15,
        formBtns: false,
        resetBtn: false,
        theme: {
          backgroundImg: "",
          showFormTitle: true,
          showFormDescribe: true,
          showFormNumber: false,
          btnsColor: null
        }
      },
      formModel: {}
    };
  },
  mounted() {},
  methods: {
    handelEnquiryConfirmation() {
      if (this.confirmation.code.length === 0) {
        this.msgError("核销码不能为空");
        return;
      }
      this.confirmation.formKey = this.$route.query.key;
      getEnquiryConfirmationCodeRequest(this.confirmation).then(res => {
        this.confirmationResult = res.code === 200;
        this.showStatus = 2;
        this.errorMsg = res.msg;
        // 显示核销表单的逻辑
        if (res.data) {
          this.formConf.fields = res.data.fields
            .filter(item => {
              return item.scheme;
            })
            .map(item => {
              if (item.scheme) {
                item.scheme.viewMode = true;
                // 去除标签中富文本
                item.scheme.config.label = removeHtmlTag(item.scheme.config.label);
              }
              return item.scheme;
            });
          this.formModel = res.data.data.originalData;
        }
      });
    },
    handelConfirmation() {
      if (this.confirmation.code.length === 0) {
        this.msgError("核销码不能为空");
        return;
      }
      this.confirmation.formKey = this.$route.query.key;
      useConfirmationCodeRequest(this.confirmation).then(res => {
        this.errorMsg = res.msg;
        this.showStatus = 3;
        this.confirmationResult = res.code === 200;
        this.confirmation.code = "";
      });
    }
  }
};
</script>

<style scoped>
.confirmation {
  width: 60%;
  margin: 20px auto 0 auto;
  background-color: #ffffff;
  padding-top: 10px;
  min-height: 70vh;
}

.generateForm {
  margin: 20px;
}

:deep(.el-form-item__label) {
  text-align: left !important;
}

.view-wrap {
  width: 100%;

  .view-card {
    width: 70%;
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    padding: 10px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 750px) {
  .confirmation {
    width: 100%;
    margin: 0px auto 0 auto;
    background-color: #ffffff;
    padding-top: 10px;
    min-height: 70vh;
  }

  .generateForm {
    margin-top: 20px;
  }

  .view-wrap {
    width: 100%;

    .view-card {
      width: 100%;
      background-color: #ffffff;
      border: 1px solid #ebeef5;
      padding: 10px;
      margin-top: 20px;
    }
  }
}
</style>
