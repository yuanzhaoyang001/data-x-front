<template>
  <div class="container-panel">
    <div class="table-content-box">
      <div class="content-box-header">
        <span class="figure-title">{{ $t("form.setting.listValidationSettings") }}</span>
        <span class="figure-tips">{{ $t("form.setting.listValidationTips") }}</span>
      </div>
      <div class="white-header">
        <p class="white-tip">
          {{ $t("form.setting.listInputPrompt") }}
          <el-popover
            :width="200"
            placement="right"
          >
            <template #reference>
              <i>
                <el-icon>
                  <ele-QuestionFilled />
                </el-icon>
              </i>
            </template>
            <template #default>
              <div class="white-popover-content">
                <p class="tip">{{ $t("form.setting.listInputPromptPopover") }}</p>
              </div>
            </template>
          </el-popover>
        </p>
        <el-input
          @change="saveSettingHandle"
          class="answer-tip-input"
          v-model="settingData.whiteListTips"
          maxlength="40"
          :placeholder="$t('form.setting.listInputPromptPopover')"
          show-word-limit
          type="text"
        />
        <p class="white-time">{{ $t("form.setting.listAnswerLimit") }}</p>
        <div class="white-input-time">
          <el-input-number
            @change="saveSettingHandle"
            class="frequency-tip-input"
            v-model="settingData.whiteListUseCount"
            :controls="false"
          />
          <span>{{ $t("form.setting.listAnswerLimitUnit") }}</span>
        </div>
      </div>
      <div class="content-box-header">
        <span class="figure-title">{{ $t("form.setting.listTable") }}</span>
      </div>
      <div class="white-table">
        <div class="table-head">
          <div class="table-head-search">
            <el-input
              v-model="queryParams.value"
              :placeholder="$t('form.setting.searchList')"
              prefix-icon="ele-Search"
              @input="searchList"
            />
          </div>
          <div>
            <el-button
              icon="ele-Upload"
              class="table-head-button"
              @click="handleImport"
            >
              {{ $t("form.setting.importFromExcel") }}
            </el-button>
            <el-button
              icon="ele-CirclePlus"
              class="table-head-button"
              @click="handleAdd"
            >
              {{ $t("form.setting.addList") }}
            </el-button>
            <el-button
              icon="ele-Delete"
              class="table-head-button"
              :disabled="multiple"
              @click="handleDelete"
            >
              {{ $t("form.setting.batchDelete") }}
            </el-button>
            <el-button
              icon="ele-Download"
              class="table-head-button"
              @click="handleExport"
            >
              {{ $t("form.setting.exportList") }}
            </el-button>
          </div>
        </div>

        <el-table
          class="table-content"
          :data="answerWhiteList"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          @filter-change="filterChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          />
          <el-table-column
            v-if="true"
            align="center"
            :label="$t('form.setting.tableNumber')"
            prop="id"
          />
          <el-table-column
            align="center"
            :label="$t('form.setting.tableName')"
            prop="value"
          />
          <el-table-column
            align="center"
            :filters="[
              {
                text: $t('form.setting.completed'),
                value: '0'
              },
              { text: $t('form.setting.notFilledIn'), value: '1' }
            ]"
            prop="status"
            column-key="status"
            :label="$t('form.setting.tableStatus')"
            :filter-multiple="false"
            filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.status === 1"
                type="success"
              >
                {{ $t("form.setting.completed") }}
              </el-tag>
              <el-tag
                v-else
                type="danger"
              >
                {{ $t("form.setting.notFilledIn") }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('form.setting.tableOperations')"
          >
            <template #default="scope">
              <el-tooltip
                :label="$t('formI18n.all.delete')"
                placement="top"
              >
                <el-button
                  link
                  type="danger"
                  icon="ele-Delete"
                  @click="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          v-model:limit="queryParams.size"
          v-model:page="queryParams.current"
          :total="total"
          @pagination="getList"
        />
      </div>
    </div>
    <el-dialog
      v-model="upload.open"
      :title="upload.title"
      append-to-body
      width="500px"
    >
      <el-upload
        v-if="showUpload"
        class="upload-demo"
        :action="url"
        :limit="1"
        accept=".xlsx, .xls"
        :data="uploadParams"
        :headers="headers"
        :on-success="handleImportSuccess"
        drag
      >
        <el-icon class="el-icon--upload">
          <ele-UploadFilled />
        </el-icon>
        <div class="el-upload__text">{{ $t("form.setting.uploadButtonText") }}</div>
        <template #tip>
          <el-button
            text
            @click="importTemplate"
          >
            <el-icon>
              <ele-Download />
            </el-icon>
            {{ $t("form.setting.downloadTemplate") }}
          </el-button>
        </template>
      </el-upload>
      <div
        v-if="showList"
        class="form-text"
      >
        <el-input
          v-model="textArea"
          maxlength="50000"
          :placeholder="$t('form.setting.textAreaPlaceholder')"
          show-word-limit
          type="textarea"
          :rows="10"
        />
        <div
          class="submit-form"
          style="display: flex; justify-content: flex-end; margin-top: 10px"
        >
          <el-button
            size="default"
            @click="upload.open = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            :disabled="textArea.trim() === ''"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  addAnswerWhitelist,
  AnswerWhite,
  deleteAnswerWhitelist,
  exportAnswerWhitelist,
  getAnswerWhiteList,
  importTemplateAnswerWhitelist,
  PageAnswerWhiteParam
} from "@/api/project/answerWhiteList";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { ElMessage, ElMessageBox } from "element-plus";
import { i18n } from "@/i18n";

import { download } from "@/utils/tduck";
import { baseUrl, getToken } from "@/utils/auth";
import { getSettingRequest, saveSettingRequest } from "@/api/project/setting";

const props = defineProps({
  type: {
    type: Number,
    default: 1
  },
  formKey: {
    type: String,
    default: ""
  }
});
const url = ref<any>(baseUrl + "/form/answerWhitelist/import");
const headers = ref<any>({ Authorization: "Bearer " + getToken() });

const settingData = ref({
  formKey: "",
  whiteListTips: i18n.global.t("form.setting.listInputPromptPopover"),
  whiteListUseCount: 1
});

const textArea = ref<string>("");
const total = ref<number>(0);
const queryParams = reactive<PageAnswerWhiteParam>({
  current: 1,
  size: 10,
  value: "",
  status: null,
  type: props.type as number,
  formKey: props.formKey as string
});
const loading = ref<boolean>(true);

interface PageUpload {
  open: boolean;
  title: string;
}

const upload = reactive<PageUpload>({
  open: false,
  title: ""
});
const answerWhiteList = ref<AnswerWhite[]>([]);
const showUpload = ref<boolean>(true);
const showList = ref<boolean>(false);
const uploadParams = reactive<any>({
  type: props.type,
  formKey: props.formKey
});
const multiple = ref(true);
const ids = ref<any>(null);
const exportLoading = ref<boolean>(false);

const filterChange = (filters: any) => {
  queryParams.status = filters["status"][0];
  getList();
};

const handleImportSuccess = () => {
  MessageUtil.success(i18n.global.t("formI18n.all.success"));
  upload.open = false;
};

const submitForm = async () => {
  const lines = textArea.value.split("\n");
  const type = props.type;
  const nonEmptyLines = lines.filter(line => line.trim() !== "");
  const whitelistValues: string[] = [];
  const invalidLines: number[] = [];
  const phoneRegex = /^1[0-9]{10}$/;
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  nonEmptyLines.forEach((line, index) => {
    if (type === 1) {
      if (emailRegex.test(line)) {
        whitelistValues.push(line);
      } else {
        invalidLines.push(index + 1);
      }
    } else if (type === 2) {
      if (phoneRegex.test(line)) {
        whitelistValues.push(line);
      } else {
        invalidLines.push(index + 1);
      }
    } else if (type === 3) {
      whitelistValues.push(line);
    }
  });

  if (invalidLines.length > 0) {
    if (type === 1) {
      ElMessage.error(
        i18n.global.t("form.setting.elmessageEmail")`${invalidLines.join(",")}` + i18n.global.t("form.setting.line")
      );
    } else if (type === 2) {
      ElMessage.error(
        i18n.global.t("form.setting.elmessagePhone")`${invalidLines.join(",")}` + i18n.global.t("form.setting.line")
      );
    } else {
      ElMessage.error(i18n.global.t("form.setting.elmessageText")` ${invalidLines.join(",")}`);
    }
    return;
  }

  await addAnswerWhitelist({
    type: props.type as number,
    formKey: props.formKey as string,
    whitleList: whitelistValues
  });
  upload.open = false;
  upload.title = "";
  await getList();
};

const getList = async () => {
  loading.value = true;
  const res = await getAnswerWhiteList(queryParams);
  answerWhiteList.value = res.data.records;
  total.value = res.data.total;
  queryParams.size = res.data.size;
  queryParams.current = res.data.current;
  loading.value = false;
};
const searchList = async () => {
  queryParams.current = 1;
  await getList();
};
const handleImport = () => {
  upload.open = true;
  showUpload.value = true;
  showList.value = false;
  upload.title = i18n.global.t("form.setting.importFromExcel");
};
const handleAdd = () => {
  upload.open = true;
  showUpload.value = false;
  textArea.value = "";
  showList.value = true;
  upload.title = i18n.global.t("form.setting.addList");
};
const handleSelectionChange = (selection: AnswerWhite[]) => {
  ids.value = selection.map((item: AnswerWhite) => item.id);
  multiple.value = !selection.length;
};
const handleDelete = (row: AnswerWhite) => {
  const caIds: number | number[] = row.id || ids.value;
  MessageBoxUtil.confirm(
    i18n.global.t("form.setting.isDeleteText") + caIds + i18n.global.t("form.setting.isDeleteDataText"),
    () => {
      deleteAnswerWhitelist(caIds as number[]).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        getList();
      });
    }
  );
};
const handleExport = () => {
  ElMessageBox.confirm(i18n.global.t("form.setting.isExportData"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      exportLoading.value = true;
      return exportAnswerWhitelist(queryParams);
    })
    .then(response => {
      download(response, i18n.global.t("form.setting.whiteData"));
      exportLoading.value = false;
    })
    .catch(() => {});
};
const importTemplate = async () => {
  const res = await importTemplateAnswerWhitelist();
  download(res, i18n.global.t("form.setting.whiteListExport"));
};
onMounted(() => {
  getList();
  getSettingRequest(props.formKey as string).then(res => {
    if (res.data) {
      const { whiteListTips, whiteListUseCount } = res.data;
      settingData.value.whiteListTips = whiteListTips || "";
      settingData.value.whiteListUseCount = whiteListUseCount || 1;
    }
  });
});

const saveSettingHandle = () => {
  settingData.value.formKey = props.formKey as string;
  saveSettingRequest(settingData.value).then(() => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
  });
};
</script>

<style lang="scss" scoped>
.container-panel {
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: #f7f8fa;

  .header-bar {
    display: flex;
    position: fixed;
    height: 52px;
    background: #fff;
    width: 100%;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  }

  .arrow-left {
    width: 26px;
    line-height: 18px;
    font-size: 22px;
  }

  .second-nav-title {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .table-content-box {
    margin: 0 28px;
    padding-bottom: 50px;
  }

  .content-box-header {
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 14px;

    .figure-title {
      color: #484848;
    }

    .figure-tips {
      color: #aaa;
    }
  }

  .white-header {
    background: #fff;
    border: 1px solid #f3f3f3;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 24px 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .white-tip {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 10px;
      color: #484848;

      i {
        color: #cccccc;
        cursor: pointer;
        margin-left: 2px;
      }
    }
  }

  .white-popover-content {
    padding: 15px 13px 18px;
    width: 194px;
    box-sizing: border-box;

    .tip {
      font-size: 12px;
      color: #484848;
      line-height: 18px;
    }

    .input {
      border: 1px solid #dde5ed;
      color: #aaa;
      padding-left: 5px;
    }

    .btn {
      background: #f7f8fa;
      border: 1px solid #eaeaea;
      text-align: center;
      color: #b8b8b8;
    }
  }

  .answer-tip-input {
    width: 459px;
    height: 30px;
    box-sizing: border-box;
    margin-top: 10px;

    :deep(.el-input__wrapper) {
      box-shadow: none;
      background-color: var(--el-bg-color-page);
    }

    :deep(.is-focus) {
      box-shadow: 0 0 0 1px var(--el-color-primary);
    }
  }

  .white-time {
    margin: 18px 0 10px 0;
    font-size: 14px;
    line-height: 14px;
    color: #484848;
  }

  .white-input-time {
    display: flex;
    align-items: center;
    height: 30px;

    .frequency-tip-input {
      width: 95px;
      height: 30px;
      box-sizing: border-box;
      margin-top: 10px;

      :deep(.el-input__wrapper) {
        box-shadow: none;
        background-color: var(--el-bg-color-page);
      }

      :deep(.is-focus) {
        box-shadow: 0 0 0 1px var(--el-color-primary);
      }
    }

    span {
      margin-left: 2px;
      margin-top: 5px;
    }
  }

  .white-table {
    background: #fff;
    border: 1px solid #f3f3f3;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    box-sizing: border-box;
    padding: 18px 30px;
  }

  .table-head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .table-head-search {
      width: 190px;

      :deep(.el-input__inner) {
        height: 30px;
      }
    }

    .table-head-button {
      height: 30px;
      border-radius: 2px;
      padding: 7px 12px;
      font-size: 12px;
    }
  }

  .table-content {
    margin-top: 20px;
  }
}
</style>
