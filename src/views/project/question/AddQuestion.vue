<template>
  <div>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ itemId ? $t("project.bank.modifyItem") : $t("project.bank.addQuestion") }}
        </span>
      </template>
      <template #extra>
        <div class="flex items-center mr20">
          <el-button
            class="ml-2"
            size="default"
            type="primary"
            @click="handleSaveItems"
          >
            {{ itemId ? $t("project.bank.modifyItem") : $t("project.bank.saveItem") }}
          </el-button>
        </div>
      </template>
    </el-page-header>
    <FormDesign
      :key="formDesignKey"
      ref="formDesignRef"
      :edit-form-info="false"
    />
  </div>
</template>
<script lang="ts" name="AddQuestion" setup>
import FormDesign from "@/views/formgen/components/FormDesign/index.vue";
import { nextTick, onMounted, provide, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { batchSaveQuestionBankItem, getQuestionBankItem, updateQuestionBankItem } from "@/api/question/bankItem";
import { removeHtmlTag } from "@/views/formgen/utils";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";

provide("loadFormInfo", () => {});
provide("loadAllItems", () => {});
provide("updateItemInfo", () => {});
provide("deleteItemInfo", () => {});
provide("createItemInfo", () => {
  return new Promise(resolve => resolve(true));
});
provide("dragSort", () => {});
provide("checkPublicForm", () => {
  if (itemId) {
    return new Promise(resolve => resolve(false));
  }
  return new Promise(resolve => resolve(true));
});

const route = useRoute();

const router = useRouter();
const formDesignRef = ref<any>(null);
const bankId = route.query.id;
const itemId = route.query.itemId;
const bankType = route.query.type;

console.log(bankType);
const handleSaveItems = () => {
  if (!itemId) {
    const itemList = formDesignRef.value!.drawingList.map((item: any) => {
      return {
        bankId: bankId,
        itemType: item.typeId,
        label: removeHtmlTag(item.config.label),
        scheme: item
      };
    });
    batchSaveQuestionBankItem(itemList).then(() => {
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
      goBack();
    });
  } else {
    updateQuestionBankItem({
      id: itemId as number,
      scheme: formDesignRef.value!.drawingList[0]
    }).then(() => {
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
      goBack();
    });
  }
};

const formDesignKey = ref<string>("1");

onMounted(() => {
  // 如果是编辑会携带题目信息
  if (itemId) {
    getQuestionBankItem(itemId as number).then(res => {
      formDesignRef.value!.formConf.status = 2;
      formDesignRef.value!.drawingList.push(res.data.scheme);
    });
  }
  formDesignRef.value!.formConf.type = bankType;
  nextTick(() => {
    // 查找.left-tabs下面的第三个.el-tabs__item
    let tabs = document.querySelectorAll(".left-tabs .el-tabs__item");
    console.log(tabs);
    if (tabs.length >= 3) {
      // 获取第三个.tab并移除它
      let thirdTab = tabs[2];
      thirdTab.parentNode.removeChild(thirdTab);
    }
  });
});

const goBack = () => {
  router.go(-1);
};
</script>
<style lang="scss" scoped>
:deep(.el-page-header__header) {
  line-height: 48px;
  box-shadow: var(--el-box-shadow);
  padding-left: 20px;
  background-color: #ffffff;
  border-bottom: var(--el-border);
}
</style>
