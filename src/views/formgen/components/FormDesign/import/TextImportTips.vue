<template>
  <el-tabs v-model="activeName">
    <el-tab-pane
      label="不含分值和答案(问卷)"
      name="first"
    >
      <el-scrollbar height="50vh">
        <div
          v-for="tips in tipsDataList"
          :key="tips.title"
          class="item-demo"
        >
          <div class="item">
            <span class="title">{{ tips.title }}</span>
            <p class="content">
              {{ tips.content }}
            </p>
          </div>
          <div class="preview">
            <generate-form
              ref="generateForm"
              :form-conf="{
                ...formConf,
                fields: parseText(tips.content)
              }"
              :page-form-model="{}"
            />
          </div>
        </div>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane
      label="含分值和答案(考试)"
      name="third"
    >
      <el-scrollbar height="50vh">
        <div
          v-for="tips in examTipsDataList"
          :key="tips.title"
          class="item-demo"
        >
          <div class="item">
            <span class="title">{{ tips.title }}</span>
            <p class="content">
              {{ tips.content }}
            </p>
          </div>
          <div class="preview">
            <generate-form
              ref="generateForm"
              :form-conf="{
                ...formConf,
                fields: parseText(tips.content)
              }"
              :page-form-model="{}"
            />
          </div>
        </div>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" name="ImportFormItem" setup>
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { ref } from "vue";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { parseText } from "@/views/formgen/components/FormDesign/import/parseTextItem";

const activeName = ref("first");
const tipsDataList = [
  {
    title: "单选题:",
    content: "【单选框组】您经常创建什么类型的项目？\n" + "问卷调研\n" + "投票评选\n" + "测评考试"
  },
  {
    title: "多选题:",
    content: "【多选框组】您了解过哪些问卷系统？\n" + "  问卷网\n" + "  腾讯问卷\n" + "  金数据\n" + "  填鸭表单\n"
  },
  {
    title: "填空题:",
    content: "【单行文本】请填写您的问题和建议"
  },
  {
    title: "下拉题:",
    content: "【下拉选择】性别\n" + "  男\n" + "  女"
  },
  {
    title: "图片选择题:",
    content: "【图片选择】请选择您最喜欢的图片?\n   图片1\n   图片2"
  },
  {
    title: "日期时间:",
    content: "【日期时间】请输入您的生日"
  },
  {
    title: "评分:",
    content: "【评分组件】给我们的体验打几分"
  },
  {
    title: "欢迎语:",
    content: "【文本描述】 感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧！"
  }
];

const examTipsDataList = [
  {
    title: "填空题:",
    content: "【单行文本】鹅鹅鹅，______？（10分）\n正确答案：曲项向天歌\n" + "答案解析：咏鹅"
  },
  {
    title: "单选题:",
    content: "【单选框组】2+2=？（10分）\n 1\n 4\n" + " 2（正确答案）\n" + "答案解析：问问百度\n"
  },
  {
    title: "多选题:",
    content:
      "【多选框组】 填鸭多选题支持哪些计分方式？（31分）\n" +
      " A.全部答对才得分（正确答案）\n" +
      " B.答对几项得几分，答错不得分（正确答案）\n" +
      " C.每个选项都有相应分值（正确答案）\n" +
      " 答案解析：多选题支持三种计分方式"
  }
];

const formConf = ref({
  fields: [] as BasicComponent[],
  labelPosition: "top",
  formKey: "temp001"
});
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
  height: 100%;
  margin-bottom: 0 !important;
}

:deep(.el-tabs__content) {
  height: 100%;
}

.right {
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 20px 40px;
}

:deep(.import-text-input .el-textarea__inner) {
  box-shadow: none;
  resize: none;
}

:deep(.input-wrap) {
  border: var(--el-border);
}
</style>
<style lang="scss">
.import-item-dialog .el-dialog__body {
  height: 85vh;
  padding: 10px 20px;
}

.item-demo {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
  user-select: text;

  .item {
    width: 40%;
    margin-right: 20px;

    .title {
      font-size: 14px;
      line-height: 25px;
      margin-left: 10px;
    }

    .content {
      font-size: 14px;
    }
  }
}

.item {
  margin-bottom: 10px;
  padding: 10px;

  .title {
    font-size: 14px;
    line-height: 25px;
    margin-left: 10px;
  }

  .content {
    font-size: 14px;
    color: var(--el-text-color);
    min-height: 70px;
    padding: 10px;
    border-radius: 5px;
    background-color: var(--el-bg-color-page);
    white-space: pre-wrap;
  }
}

.preview {
  width: 600px;
  border: var(--el-border);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;

  .generate-form {
    height: 100%;
  }
}

.item-demo {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
}
</style>
