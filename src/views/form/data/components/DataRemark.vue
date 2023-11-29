<template>
  <div class="data-remark">
    <el-input
      v-model="remarkEntity.content"
      class="mt20"
      type="textarea"
      :rows="5"
      :disabled="remarkEditDisable"
      placeholder="请输入备注内容"
    />
    <el-link
      type="primary"
      class="mt5"
      @click="remarkEdit(remarkButton)"
    >
      {{ remarkButton }}
    </el-link>
  </div>
</template>

<script>
import { getRemarkRequest, saveRemarkRequest } from "@/api/project/data";

export default {
  name: "DataRemark",
  props: {
    dataId: {
      type: Number,
      default: null
    },
    formKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      remarkEntity: {
        id: null,
        formKey: this.formKey,
        dataId: "",
        content: ""
      },
      remarkButton: "编辑",
      remarkEditDisable: true
    };
  },
  watch: {
    dataId: {
      handler(value) {
        if (value) {
          getRemarkRequest(this.dataId).then(res => {
            if (res.data) {
              this.remarkEntity.id = res.data.id;
              this.remarkEntity.content = res.data.content;
            } else {
              this.remarkEntity = {
                id: null,
                formKey: this.formKey,
                dataId: "",
                content: ""
              };
            }
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    remarkEdit(remarkButton) {
      if (remarkButton === "编辑") {
        // 切换保存按钮文案
        this.remarkEditDisable = false;
        this.remarkButton = "保存";
      } else if (remarkButton === "保存") {
        this.remarkEntity.dataId = this.dataId;
        //  保存备注
        saveRemarkRequest(this.remarkEntity).then(res => {
          //console.log(res)
        });
        // 保存后禁用编辑，更改按钮文字
        this.remarkEditDisable = true;
        this.remarkButton = "编辑";
      }
    }
  }
};
</script>
