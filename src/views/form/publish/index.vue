<template>
  <div class="setting-container">
    <el-tabs
      v-model="activeName"
      class="setting-tabs t-tabs"
      tab-position="left"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        :label="$t('form.leftTab.publicRelease')"
        name="publicPublish"
        v-if="hasFormButtonAuth('publicPublish')"
      >
        <template #label>
          <el-icon>
            <ele-View />
          </el-icon>

          {{ $t("form.leftTab.publicRelease") }}
        </template>
        <public-publish />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.leftTab.publicQuery')"
        name="publicQuery"
        v-if="hasFormButtonAuth('publicQuery')"
      >
        <template #label>
          <el-icon>
            <ele-Search />
          </el-icon>
          {{ $t("form.leftTab.publicQuery") }}
        </template>
        <public-query />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.leftTab.specifyFill')"
        name="targetedPublish"
        v-if="hasFormButtonAuth('targetedPublish')"
      >
        <template #label>
          <el-icon>
            <ele-Pointer />
          </el-icon>
          {{ $t("form.leftTab.specifyFill") }}
        </template>
        <targeted-publish />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.leftTab.dataView')"
        name="authGroup"
        v-if="hasFormButtonAuth('authGroup')"
      >
        <template #label>
          <el-icon>
            <ele-Connection />
          </el-icon>
          {{ $t("form.leftTab.dataView") }}
        </template>
        <auth-group />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.leftTab.dataPush')"
        name="dataPush"
        v-if="hasFormButtonAuth('dataPush')"
      >
        <template #label>
          <el-icon>
            <ele-Position />
          </el-icon>
          {{ $t("form.leftTab.dataPush") }}
        </template>
        <data-push />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.leftTab.dataAssistant')"
        name="dataHelper"
        v-if="hasFormButtonAuth('dataHelper')"
      >
        <template #label>
          <el-icon>
            <ele-MagicStick />
          </el-icon>
          {{ $t("form.leftTab.dataAssistant") }}
        </template>
        <data-helper />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.leftTab.notifyShare')"
        name="notifyShare"
        v-if="hasFormButtonAuth('notifyShare')"
      >
        <template #label>
          <el-icon>
            <ele-Comment />
          </el-icon>
          {{ $t("form.leftTab.notifyShare") }}
        </template>
        <notify-share />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasFormButtonAuth('printTemplate')"
        name="printTemplate"
      >
        <template #label>
          <el-icon>
            <ele-DocumentAdd />
          </el-icon>
          {{ $t("form.leftTab.printTemplate") }}
        </template>
        <print-template />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasFormButtonAuth('certificateGen')"
        name="certificateGen"
      >
        <template #label>
          <el-icon>
            <ele-Postcard />
          </el-icon>
          {{ $t("form.leftTab.certificateGen") }}
        </template>
        <certificate-gen />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="PublishTabs" setup>
import publicPublish from "./public.vue";
import PublicQuery from "./PublicQuery.vue";
import AuthGroup from "./AuthGroup.vue";
import TargetedPublish from "./TargetedPublish.vue";
import DataPush from "./DataPush.vue";
import DataHelper from "./DataHelper/index.vue";
import NotifyShare from "./NotifyShare/index.vue";
import PrintTemplate from "./PrintTemplate/index.vue";
import CertificateGen from "./CertificateGen/index.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormInfo } from "@/stores/formInfo";

const activeName = ref("publicPublish");

const router = useRouter();
const route = useRoute();

onMounted(() => {
  activeName.value = route.query.path;
});

const handleTabClick = tab => {
  router.push({ query: { ...route.query, path: tab.paneName } });
};

const { hasFormButtonAuth } = useFormInfo();
</script>

<style lang="scss" scoped>
.setting-container {
  width: 100%;
  display: flex;
  justify-content: center;

  .setting-tabs {
    border-radius: 8px;
    margin-top: 20px;
    width: 910px;
    min-height: 500px;
  }

  :deep(.el-tabs--left .el-tabs__header.is-left) {
    margin-right: 35px;
  }

  :deep(.el-card) {
    border-radius: 8px;
    border: none;
    box-shadow: none;
  }
}
</style>
