<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="40%"
    >
      <el-tabs
        v-model="tabsActiveName"
        tab-position="left"
      >
        <el-tab-pane
          :label="$t('form.formAuthGroup.basicInfo')"
          name="name"
        >
          <el-form
            ref="authFormRef"
            :model="formAuthGroup"
            :rules="rules"
            label-position="top"
            label-width="100px"
          >
            <el-form-item
              :label="$t('form.formAuthGroup.namePlaceholder')"
              prop="name"
            >
              <el-input
                v-model="formAuthGroup.name"
                :placeholder="$t('form.formAuthGroup.namePlaceholder')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('form.formAuthGroup.descriptionPlaceholder')"
              prop="description"
            >
              <el-input
                v-model="formAuthGroup.description"
                :placeholder="$t('form.formAuthGroup.descriptionPlaceholder')"
                type="textarea"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('form.formAuthGroup.buttonPermissions')"
          name="btn"
        >
          <el-tree
            ref="treeRef"
            :check-strictly="true"
            :data="funTreeData"
            :default-checked-keys="formAuthGroup.btnPerms"
            :props="defaultProps"
            default-expand-all
            highlight-current
            node-key="id"
            show-checkbox
            @check="handleCheckChange"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('form.formAuthGroup.fieldPermissions')"
          name="field"
        >
          <el-scrollbar
            v-if="fields.length !== 0"
            height="500px"
          >
            <table class="el-table">
              <tr>
                <td>
                  {{ $t("form.formAuthGroup.fields") }}
                </td>
                <td>
                  {{ $t("form.formAuthGroup.visible") }}
                </td>
                <td>
                  {{ $t("form.formAuthGroup.editable") }}
                </td>
              </tr>
              <tr>
                <td class="text-primary">{{ $t("form.formAuthGroup.selectAllFields") }}</td>
                <td>
                  <el-checkbox
                    size="default"
                    v-model="isAllFieldVisible"
                    @change="fieldVisibleAllCheckedHandle"
                  />
                </td>
                <td>
                  <el-checkbox
                    size="default"
                    v-model="isAllFieldEdit"
                    @change="fieldEditAllCheckedHandle"
                  />
                </td>
              </tr>
              <tr
                v-for="(field, index) in fields"
                :key="index"
              >
                <td>{{ field.label }}</td>
                <td>
                  <el-checkbox
                    size="default"
                    v-model="fieldVisibleChecked[index]"
                    @change="checked => fieldVisibleChangeHandle(index, checked)"
                  />
                </td>
                <td>
                  <el-checkbox
                    size="default"
                    v-model="fieldEditChecked[index]"
                    @change="checked => fieldEditChangeHandle(index, checked)"
                  />
                </td>
              </tr>
            </table>
          </el-scrollbar>
          <el-empty
            v-else
            :description="$t('form.formAuthGroup.noFields')"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('form.formAuthGroup.dataPermissions')"
          name="data"
        >
          <p class="desc-text">{{ $t("form.formAuthGroup.dataPermissionDescription") }}</p>
          <div>
            {{ $t("form.form.formAuthGroup.enableRoleAuth") }}
            <el-switch
              v-model="formAuthGroup.enableRoleDataAuth"
              class="ml-2"
              size="default"
            />
          </div>

          <data-filter
            :key="`data${new Date()}`"
            :fields="fields"
            :form-data-filter="formAuthGroup.dataPerms"
            @filter="
              data => {
                formAuthGroup.dataPerms = data;
              }
            "
          />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            type="primary"
            size="default"
            @click="submitAuthGroupHandle"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script name="AuthGroup" setup>
import DataFilter from "../data/filter.vue";
import _ from "lodash-es";
import { defineExpose, onMounted, ref } from "vue";
import { listFormFieldsRequest } from "@/api/project/form";
import { i18n } from "@/i18n";
import { MessageUtil } from "@/utils/messageUtil";

const tabsActiveName = ref("name");
const fields = ref([]);
const fieldVisibleChecked = ref([]);
const fieldEditChecked = ref([]);
const isAllFieldVisible = ref(false);
const isAllFieldEdit = ref(false);

const funTreeData = ref([
  {
    id: "edit",
    label: i18n.global.t("form.form.edit"),
    children: [
      {
        id: "editor",
        label: i18n.global.t("formgen.topNav.content")
      },
      {
        id: "logic",
        label: i18n.global.t("formgen.topNav.logic")
      },
      {
        id: "theme",
        label: i18n.global.t("formgen.topNav.theme")
      },
      {
        id: "workflow",
        label: i18n.global.t("formgen.topNav.workFlow")
      },
      {
        id: "dimension",
        label: i18n.global.t("formgen.topNav.dimension")
      }
    ]
  },
  {
    id: "setting",
    label: i18n.global.t("formgen.topNav.setting"),
    children: [
      {
        id: "exam",
        label: i18n.global.t("form.setting.examSettingLabel")
      },
      {
        id: "submit",
        label: i18n.global.t("form.setting.submitSettingLabel")
      },
      {
        id: "write",
        label: i18n.global.t("form.setting.recoverySettingLabel")
      },
      {
        id: "notify",
        label: i18n.global.t("form.setting.notificationSettingLabel")
      },
      {
        id: "share",
        label: i18n.global.t("form.setting.sharingSettingLabel")
      },
      {
        id: "reply",
        label: i18n.global.t("form.setting.replySettingLabel")
      },
      {
        id: "teamwork",
        label: i18n.global.t("form.setting.teamworkSettingLabel")
      }
    ]
  },
  {
    id: "publish",
    label: i18n.global.t("form.form.publish"),
    children: [
      {
        id: "publicPublish",
        label: i18n.global.t("form.leftTab.publicRelease")
      },
      {
        id: "publicQuery",
        label: i18n.global.t("form.leftTab.publicQuery")
      },
      {
        id: "targetedPublish",
        label: i18n.global.t("form.leftTab.specifyFill")
      },
      {
        id: "authGroup",
        label: i18n.global.t("form.leftTab.dataView")
      },
      {
        id: "dataPush",
        label: i18n.global.t("form.leftTab.dataPush")
      },
      {
        id: "dataHelper",
        label: i18n.global.t("form.leftTab.dataAssistant")
      },
      {
        id: "printTemplate",
        label: i18n.global.t("form.leftTab.printTemplate")
      },
      {
        id: "certificateGen",
        label: i18n.global.t("form.leftTab.certificateGen")
      }
    ]
  },
  {
    id: "data",
    label: i18n.global.t("form.form.data"),
    children: [
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.detail"), id: "detail" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.add"), id: "add" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.import"), id: "import" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.download"), id: "download" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.export"), id: "export" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.query"), id: "query" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.print"), id: "print" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.custom"), id: "custom" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.update"), id: "update" },
      { label: i18n.global.t("form.formAuthGroup.buttonOptions.delete"), id: "delete" }
    ]
  },
  {
    id: "board",
    label: i18n.global.t("form.form.board"),
    children: [
      {
        id: "chart",
        label: i18n.global.t("form.statistics.statisticsView")
      },
      {
        id: "analysis",
        label: i18n.global.t("form.statistics.dataAnalysis")
      }
    ]
  }
]);

const defaultProps = ref({
  children: "children",
  label: "label",
  isLeaf: "isLeaf"
});

const formAuthGroup = ref({
  formKey: "",
  name: "",
  description: "",
  btnPerms: [],
  fieldVisiblePerms: [],
  fieldEditPerms: [],
  // 启用层级数据权限
  enableRoleDataAuth: false,
  dataPerms: {
    rel: "AND",
    conditionList: []
  }
});

const handleCheckChange = (data, checkedInfo) => {
  const treeNode = treeRef.value.getNode(data.id);
  // 有父节点
  if (treeNode.parent) {
    treeRef.value.setCheckedKeys([...checkedInfo.checkedKeys, treeNode.parent.data.id]);
  }
  if (data.children) {
    if (treeNode.checked) {
      treeRef.value.setCheckedKeys([...checkedInfo.checkedKeys, ...data.children.map(item => item.id)]);
    } else {
      treeRef.value.setCheckedKeys(checkedInfo.checkedKeys.filter(item => !data.children.map(chi => chi.id).includes(item)));
    }
  }
};

const rules = ref({
  name: [{ required: true, message: i18n.global.t("form.formAuthGroup.namePlaceholder"), trigger: "blur" }]
});

const dialogVisible = ref(false);
const dialogTitle = ref(i18n.global.t("form.formAuthGroup.createAuthGroup"));

onMounted(() => {
  if (props.isAuthGroup) {
    // 只保留数据
    funTreeData.value = funTreeData.value.filter(item => item.id === "data");
  }
  // 获取表单字段
  queryFormFields();
});

const props = defineProps({
  formKey: null,
  // 是协作者还是权限组
  isAuthGroup: null
});

const queryFormFields = () => {
  listFormFieldsRequest(props.formKey).then(res => {
    fields.value = res.data;
  });
};

const fieldVisibleChangeHandle = (index, value) => {
  if (!value) {
    fieldEditChecked.value[index] = false;
  }
};

const fieldEditChangeHandle = (index, value) => {
  if (value) {
    fieldVisibleChecked.value[index] = true;
  }
};

const fieldCheckedHandle = () => {
  fields.value.forEach((field, index) => {
    fieldVisibleChecked.value[index] = _.includes(formAuthGroup.value.fieldVisiblePerms, field.value);
    fieldEditChecked.value[index] = _.includes(formAuthGroup.value.fieldEditPerms, field.value);
  });
};

const fieldVisibleAllCheckedHandle = () => {
  fieldVisibleChecked.value = Array(fields.value.length).fill(isAllFieldVisible.value);
};

const fieldEditAllCheckedHandle = () => {
  fieldEditChecked.value = Array(fields.value.length).fill(isAllFieldEdit.value);
};

const authFormRef = ref(null);

const emit = defineEmits(["submit"]);

const treeRef = ref(null);

const submitAuthGroupHandle = () => {
  authFormRef.value.validate(valid => {
    if (valid) {
      formAuthGroup.value.btnPerms = treeRef.value.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys() || []);
      if (formAuthGroup.value.btnPerms.length === 0) {
        MessageUtil.error(i18n.global.t("form.formAuthGroup.selectOperationButtons"));
        tabsActiveName.value = "btn";
        return;
      }

      formAuthGroup.value.fieldVisiblePerms = [];
      formAuthGroup.value.fieldEditPerms = [];

      fields.value.forEach((field, index) => {
        if (fieldVisibleChecked.value[index] == true) {
          formAuthGroup.value.fieldVisiblePerms.push(field.value);
        }
        if (fieldEditChecked.value[index] == true) {
          formAuthGroup.value.fieldEditPerms.push(field.value);
        }
      });

      if (formAuthGroup.value.fieldVisiblePerms.length === 0) {
        MessageUtil.error(i18n.global.t("form.formAuthGroup.selectVisibleFields"));
        tabsActiveName.value = "field";
        return;
      }

      formAuthGroup.value.formKey = props.formKey;

      if (formAuthGroup.value.dataPerms) {
        formAuthGroup.value.dataPerms.conditionList = formAuthGroup.value.dataPerms.conditionList
          .filter(item => {
            return item.formItemId && item.method;
          })
          .map(item => {
            return {
              formItemId: item.formItemId,
              method: item.method,
              value: item.value
            };
          });
      }
      dialogVisible.value = false;
      emit("submit", formAuthGroup.value);
    } else {
      tabsActiveName.value = "name";
      return false;
    }
  });
};

const clearFormAuthGroup = () => {
  fieldVisibleChecked.value = [];
  fieldEditChecked.value = [];
  formAuthGroup.value = {
    formKey: "",
    name: "",
    description: "",
    btnPerms: [],
    fieldVisiblePerms: [],
    fieldEditPerms: [],
    dataPerms: {
      rel: "AND",
      conditionList: []
    }
  };
};

defineExpose({
  clearFormAuthGroup,
  formAuthGroup,
  dialogVisible,
  fieldCheckedHandle,
  dialogTitle
});
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  padding: 0 20px;
}

.desc-text {
  color: #909399;
}

.btn-checkbox {
  display: inline-block;
  width: 27%;
}
</style>
