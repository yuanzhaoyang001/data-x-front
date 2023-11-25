<template>
  <div class="app-container">
    <div class="form-container">
      <div class="filter-view">
        <el-form
          ref="form"
          label-width="100px"
        >
          <div>
            <el-row class="form-container-head">
              <el-col :span="5">
                <div class="container-head-search">
                  <el-icon @click="queryProjectPage">
                    <ele-Search />
                  </el-icon>
                  <el-form @submit.prevent>
                    <el-input
                      @keyup.enter="queryProjectPage"
                      v-model="queryParams.name"
                      size="default"
                      :placeholder="$t('client.my.search')"
                    />
                  </el-form>
                </div>
              </el-col>
              <el-col
                :span="3"
                class="form-create"
              >
                <el-button
                  class="ml-20 add-folder-button"
                  size="default"
                  text
                  @click="createFolderVisible = true"
                >
                  <el-icon size="18">
                    <ele-FolderAdd />
                  </el-icon>
                  {{ $t("client.my.newFolder") }}
                </el-button>
                <el-button-group
                  size="default"
                  class="change-button"
                >
                  <el-button
                    :type="dataShowType == 'card' ? 'primary' : 'default'"
                    @click="toggleDataShowType"
                    class="form-sort"
                  >
                    <hamburger-button
                      theme="outline"
                      size="18"
                      :stroke-width="3"
                      stroke-linejoin="bevel"
                      v-if="dataShowType === 'card'"
                    />
                    <all-application
                      theme="outline"
                      size="18"
                      :stroke-width="3"
                      stroke-linejoin="bevel"
                      v-else
                    />
                  </el-button>
                </el-button-group>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="form-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="getFolderForm(0)">{{ $t("client.my.myForm") }}</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="b in breadcrumbList"
            :key="b.id"
          >
            {{ b.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <form-card-list
        v-if="dataShowType == 'card'"
        v-loading="projectListLoading"
        v-model:project-list="projectList"
        @enterFolder="handleEnterFolder"
        @move="handleOpenMoveFolderDialog"
        @refresh="queryProjectPage"
        @renameFolder="handleRenameFolderDialog"
      />
      <my-form-table
        v-if="dataShowType == 'table'"
        v-loading="projectListLoading"
        v-model:project-list="projectList"
        @enterFolder="handleEnterFolder"
        @move="handleOpenMoveFolderDialog"
        @refresh="queryProjectPage"
        @renameFolder="handleRenameFolderDialog"
      />
      <div class="project-page-view">
        <el-pagination
          v-if="total > 10"
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :total="total"
          background
          layout="total, prev, pager, next"
          @current-change="queryProjectPage"
        />
      </div>
    </div>
    <el-dialog
      v-model="createFolderVisible"
      :title="$t('client.my.newFolder')"
      width="30%"
    >
      <el-form
        ref="createFolderRef"
        :model="folderData"
        label-width="100px"
      >
        <el-form-item
          :label="$t('client.my.folderName')"
          :rules="[{ required: true, message: $t('client.my.folderNameRequired') }]"
          prop="name"
        >
          <el-input
            v-model="folderData.name"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createFolderVisible = false">{{ $t("client.my.cancel") }}</el-button>
          <el-button
            type="primary"
            :loading="requestLoading.pushFolderData"
            @click="createFormFolderHandle"
          >
            {{ $t("client.my.yes") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="folderTreeVisible"
      :title="$t('client.my.moveFolder')"
      width="30%"
    >
      <el-tree
        ref="folderTree"
        :data="folderTreeData"
        :props="folderTreeProps"
        check-strictly
        highlight-current
        node-key="id"
        show-checkbox
        default-expand-all
        @check-change="handleFolderTreeChange"
      >
        <template #default="{ node }">
          <span class="custom-tree-node">
            <i class="iconfont icon-wenjianjia" />
            <span class="mp5">{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="folderTreeVisible = false">{{ $t("client.my.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleMoveFolder"
          >
            {{ $t("client.my.yes") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="renameFolderVisible"
      :title="$t('client.my.renameFolder')"
      width="30%"
    >
      <el-form
        ref="renameFolder"
        :model="folderData"
        label-width="100px"
      >
        <el-form-item
          :label="$t('client.my.folderName')"
          :rules="[{ required: true, message: $t('client.my.folderNameRequired') }]"
          prop="name"
        >
          <el-input
            v-model="folderData.name"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="renameFolderVisible = false">{{ $t("client.my.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleRenameFolder"
          >
            {{ $t("client.my.yes") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="MyProject">
import { onMounted, reactive, ref } from "vue";
import { MessageUtil } from "@/utils/messageUtil";
import { createFormRequest, getUserFormFolderTreeRequest, pageFormRequest, updateFormRequest } from "@/api/project/form";
import FormCardList from "./card.vue";
import MyFormTable from "./table.vue";
import _cloneDeep from "lodash-es/cloneDeep";
import { useFormInfo } from "@/stores/formInfo";
import { AllApplication, HamburgerButton } from "@icon-park/vue-next";
import { i18n } from "@/i18n";

const createFolderVisible = ref(false);
const folderTreeVisible = ref(false);
const renameFolderVisible = ref(false);
const dataShowType = ref("card");
const total = ref(0);
const queryParams = reactive({
  current: 1,
  size: 12,
  name: "",
  createUserName: "",
  beginDateTime: null,
  endDateTime: null,
  status: null,
  folderId: 0
});
const formData = reactive({
  description: "",
  name: i18n.global.t("client.my.noNameSurvey"),
  type: null,
  folderId: 0
});
let folderData = ref({
  name: i18n.global.t("client.my.folderName"),
  type: 3,
  folder: true,
  formKey: "",
  folderId: 0
});
const breadcrumbList = ref([]);
const projectList = ref([]);
const projectListLoading = ref(true);
const folderTreeData = ref([]);
const folderTreeProps = ref({
  children: "children",
  label: "name"
});
let pageCurrent = ref("");
const requestLoading = reactive({
  pushFolderData: false
});
const folderTree = ref(null);

const { currentFormFolder, setCurrentFormFolder } = useFormInfo();

const createFolderRef = ref(null);

const createFormFolderHandle = () => {
  createFolderRef.value.validate(valid => {
    if (valid) {
      folderData.value.type = 3;
      folderData.value.folder = true;
      requestLoading.pushFolderData = true;
      createFormRequest(folderData.value)
        .then(res => {
          requestLoading.pushFolderData = false;
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          queryProjectPage();
          createFolderVisible.value = null;
        })
        .catch(() => {
          requestLoading.pushFolderData = false;
          MessageUtil.success(i18n.global.t("formI18n.all.fail"));
        });
    } else {
      return false;
    }
  });
};
const toggleDataShowType = () => {
  dataShowType.value = dataShowType.value === "card" ? "table" : "card";
};

const queryProjectPage = () => {
  pageFormRequest(queryParams).then(res => {
    const { records, size } = res.data;
    projectList.value = records;
    total.value = res.data.total;
    projectListLoading.value = false;
  });
};

const handleOpenMoveFolderDialog = item => {
  folderTreeVisible.value = true;
  folderData.value = item;
  getUserFormFolderTreeRequest().then(res => {
    folderTreeData.value = [{ id: 0, name: i18n.global.t("client.my.rootDirectory"), children: res.data }];
  });
};

const handleRenameFolderDialog = item => {
  renameFolderVisible.value = true;
  folderData.value = _cloneDeep(item);
};

const handleFolderTreeChange = (data, checked, node) => {
  if (checked) {
    folderTree.value.setCheckedNodes([data]);
  }
};
const handleMoveFolder = () => {
  if (!folderTree.value.getCheckedKeys().length > 0) {
    MessageUtil.warning(i18n.global.t("client.my.chooseFolder"));
    return;
  }
  const folderId = folderTree.value.getCheckedKeys()[0];
  folderData.value.folderId = folderId;
  updateFormRequest(folderData.value).then(res => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    folderTreeVisible.value = false;
    queryProjectPage();
  });
};
const handleRenameFolder = () => {
  updateFormRequest(folderData.value).then(res => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    renameFolderVisible.value = null;
    folderData.value = {};
    queryProjectPage();
  });
};
const handleEnterFolder = f => {
  breadcrumbList.value.push(f);
  setCurrentFormFolder(f);
  pageCurrent.value = _cloneDeep(queryParams.current);
  getFolderForm(f.id);
};
const getFolderForm = id => {
  queryParams.folderId = id;
  if (id == 0) {
    breadcrumbList.value = [];
  }
  queryParams.current = pageCurrent.value ? _cloneDeep(pageCurrent) : 1;
  queryProjectPage();
};
onMounted(() => {
  let f = currentFormFolder;
  if (f) {
    handleEnterFolder(f);
  } else {
    queryParams.current = 1;
    queryProjectPage();
  }
});
//
</script>

<style lang="scss" scoped>
.app-container {
  //display: flex;
  width: 100%;
  height: 100%;
  //flex-direction: column;
  //align-items: center;
  //align-content: center;
}

.form-container {
  width: 1280px;
  margin: 0 auto;
}

.project-page-view {
  margin-top: 30px;
  text-align: center;
}

.form-container-head {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.container-head-search {
  border: 1px solid #898989;
  border-radius: 6px;
  width: 163px;
  height: 29px;
  display: flex;
  align-items: center;
  color: var(--el-text-color-secondary);

  :deep(.el-icon) {
    cursor: pointer;
    font-size: 18px;
    width: 24px;
    margin-left: 8px;
  }

  :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: none;
  }
}

.container-head-search {
  border: 1px solid transparent;
  border-radius: 8px;
  width: 193px;
  height: 29px;
  display: flex;
  align-items: center;
  color: #4c4edb;
  transition: all 0.3s; /* 对所有属性添加过渡效果 */
}

.container-head-search:hover {
  border: 1px solid #4c4edb;
  width: 263px;
  color: #4c4edb;
}

.container-head-search .el-icon {
  cursor: pointer;
  font-size: 18px;
  width: 24px;
  margin-left: 8px;
}

.container-head-search .el-input__wrapper {
  background-color: transparent;
  box-shadow: none;
}

.form-create {
  width: 209px;
  height: 38.32px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .form-create-folder {
    background-color: transparent;
    border: none;
  }

  .form-sort {
    background: transparent;
    border: none;
    color: #6a6a6a;
  }
}

.add-folder-button:hover {
  width: 209px;
  height: 38.32px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #4c4edb;
}

.change-button:hover {
  .form-sort {
    color: #4c4edb;
  }
}

.form-breadcrumb {
  margin: 10px 50px 10px 0px;
}

:deep(.el-breadcrumb__inner) {
  cursor: pointer !important;
}
</style>
