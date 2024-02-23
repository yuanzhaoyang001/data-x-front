<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      class="t-dialog"
      :title="$t('form.downloadFile.title')"
      width="40%"
    >
      {{ $t("form.downloadFile.defaultExportDescription") }}

      <span class="text-danger">{{ $t("form.downloadFile.warning") }}</span>
      <el-form class="mt10">
        <el-form-item :label="$t('form.downloadFile.exportModeLabel')">
          <el-switch
            v-model="allDownload"
            active-color="#ed5565"
            :active-text="$t('form.downloadFile.fullExportText')"
            :inactive-text="$t('form.downloadFile.currentExportText')"
            @change="changeAllDownload"
          />
        </el-form-item>
        <el-form-item :label="$t('form.downloadFile.fileNameLabel')">
          <el-radio-group v-model="queryParams.fileNameType">
            <el-radio :label="1">
              {{ $t("form.downloadFile.defaultNameLabel") }}
              <el-tooltip
                class="item"
                :content="$t('form.downloadFile.defaultNameTooltip')"
                effect="dark"
                placement="top-start"
              >
                <el-icon>
                  <ele-QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-radio>
            <el-radio :label="2">{{ $t("form.downloadFile.customNameLabel") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="queryParams.fileNameType == '2'"
          :label="$t('form.downloadFile.dynamicNameLabel')"
        >
          {{ queryParams.dynamicFileName }}
          <el-button
            link
            type="primary"
            @click="handleOpenDynamicFiledEditor"
          >
            <el-icon>
              <ele-Edit />
            </el-icon>
            {{ $t("form.downloadFile.set") }}
          </el-button>
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
            @click="handleDownload"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <dynamic-filed-editor
      ref="dynamicFiledEditor"
      :fields="fields"
      :mode="`text/plain`"
      :value="queryParams.dynamicFileName"
      @save="
        val => {
          queryParams.dynamicFileName = val;
        }
      "
    >
      <template #tips>
        {{ $t("form.downloadFile.dynamicNameDescription") }}
      </template>
    </dynamic-filed-editor>
  </div>
</template>

<script>
import { downloadFormDataFileRequest } from "@/api/project/data";
import DynamicFiledEditor from "@/views/formgen/components/formula/DynamicFiledEditor.vue";
import { i18n } from "@/i18n";
import TProcess from "@/components/HandleProcess/process";

export default {
  name: "DownloadFile",
  components: {
    DynamicFiledEditor
  },
  props: {
    queryParams: {
      type: Object,
      default: () => {}
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      //全量导出
      allDownload: false,
      dialogVisible: false
    };
  },
  methods: {
    openDownloadFile() {
      this.queryParams["fileNameType"] = 1;
      this.queryParams["dynamicFileName"] = "";
      this.dialogVisible = true;
    },
    changeAllDownload(val) {
      if (val) {
        this.queryParams.size = null;
        this.queryParams.current = null;
      }
    },
    handleOpenDynamicFiledEditor() {
      this.$refs.dynamicFiledEditor.open();
    },
    handleDownload() {
      this.dialogVisible = false;
      let params = JSON.parse(JSON.stringify(this.queryParams));
      if (this.allDownload) {
        params.size = null;
        params.current = null;
      }
      downloadFormDataFileRequest(this.queryParams).then(res => {
        TProcess({
          tips: i18n.global.t("form.downloadFile.exportAllAttachmentsTip"),
          message: i18n.global.t("form.downloadFile.exportingAttachments"),
          requestKey: res.data
        });
      });
    }
  }
};
</script>
