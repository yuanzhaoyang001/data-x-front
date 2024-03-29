<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item
        :label="$t('uniapp.portal.name')"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          :placeholder="$t('uniapp.portal.inputName')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="ele-Search"
          @click="handleQuery"
        >
          {{ $t("common.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("common.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleAdd"
          v-hasPermi="['uniapp:portal:add']"
        >
          {{ $t("common.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['uniapp:portal:edit']"
        >
          {{ $t("common.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['uniapp:portal:delete']"
        >
          {{ $t("common.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="portalList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="Id"
        align="center"
        prop="id"
        v-if="true"
      />
      <el-table-column
        :label="$t('uniapp.portal.name')"
        align="center"
        prop="name"
      />
      <el-table-column
        :label="$t('uniapp.portal.operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="ele-Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['uniapp:portal:edit']"
          >
            {{ $t("common.update") }}
          </el-button>
          <el-button
            link
            type="danger"
            icon="ele-Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['uniapp:portal:remove']"
          >
            {{ $t("common.delete") }}
          </el-button>
          <el-button
            link
            type="primary"
            icon="ele-MagicStick"
            @click="$router.push({ path: '/uniapp/portal/design/' + scope.row.id })"
            v-hasPermi="['uniapp:portal:design']"
          >
            {{ $t("uniapp.portal.design") }}
          </el-button>
          <el-button
            link
            type="primary"
            icon="ele-Connection"
            @click="handleAssign(scope.row)"
            v-hasPermi="['uniapp:portal:assign']"
          >
            {{ $t("uniapp.portal.assign") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改门户配置对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="portalRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          :label="$t('uniapp.portal.name')"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('uniapp.portal.inputName')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            :loading="buttonLoading"
            type="primary"
            @click="submitForm"
          >
            {{ $t("uniapp.portal.confirm") }}
          </el-button>
          <el-button @click="cancel">{{ $t("uniapp.portal.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
    <RbacFunctionality
      :title="$t('uniapp.portal.assignPortal')"
      :func-id="portalId"
      func-type="MobilePortal"
      ref="functionalityRef"
    ></RbacFunctionality>
  </div>
</template>

<script setup name="Portal">
import { listPortal, getPortal, delPortal, addPortal, updatePortal } from "@/api/uniapp/portal";
import { getCurrentInstance, ref, reactive, toRefs } from "vue";
import { MessageUtil } from "@/utils/messageUtil";
import { ElMessageBox } from "element-plus";
import RbacFunctionality from "@/views/components/RbacFunctionality/index.vue";
import { i18n } from "@/i18n";

const { proxy } = getCurrentInstance();

const portalList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const portalId = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    current: 1,
    size: 10,
    name: undefined,
    configValue: undefined
  },
  rules: {
    id: [{ required: true, message: i18n.global.t("uniapp.portal.parameterKeyRequired"), trigger: "blur" }],
    name: [{ required: true, message: i18n.global.t("uniapp.portal.nameRequired"), trigger: "blur" }],
    configValue: [
      {
        required: true,
        message: i18n.global.t("uniapp.portal.configurationValueRequired"),
        trigger: "blur"
      }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询门户配置列表 */
const getList = () => {
  loading.value = true;
  listPortal(queryParams.value).then(response => {
    portalList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
};

// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};

// 表单重置
const reset = () => {
  form.value = {
    id: null,
    name: null,
    configValue: null,
    updateTime: null,
    createTime: null
  };
  proxy.resetForm("portalRef");
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.current = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  proxy.resetForm("queryRef");
  handleQuery();
};

// 多选框选中数据
const handleSelectionChange = selection => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

const functionalityRef = ref(null);

const handleAssign = row => {
  portalId.value = row.id;
  functionalityRef.value.handleOpen(row.id);
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = i18n.global.t("uniapp.portal.addPortalConfiguration");
};

/** 修改按钮操作 */
const handleUpdate = row => {
  loading.value = true;
  reset();
  const _id = row.id || ids.value;
  getPortal(_id).then(response => {
    loading.value = false;
    form.value = response.data;
    open.value = true;
    title.value = i18n.global.t("uniapp.portal.modifyPortalConfiguration");
  });
};

/** 提交按钮 */
const submitForm = () => {
  proxy.$refs["portalRef"].validate(valid => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id != null) {
        updatePortal(form.value)
          .then(response => {
            MessageUtil.success(i18n.global.t("uniapp.portal.modifySuccess"));
            open.value = false;
            getList();
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        addPortal(form.value)
          .then(response => {
            MessageUtil.success(i18n.global.t("uniapp.portal.addSuccess"));
            open.value = false;
            getList();
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      }
    }
  });
};

/** 删除按钮操作 */
const handleDelete = row => {
  const _ids = row.id || ids.value;
  ElMessageBox.confirm(
    i18n.global.t("uniapp.portal.confirmDeletePortalConfiguration") + _ids + i18n.global.t("uniapp.portal.dataItem")
  )
    .then(function () {
      loading.value = true;
      return delPortal(_ids);
    })
    .then(() => {
      loading.value = true;
      getList();
      MessageUtil.success(i18n.global.t("uniapp.portal.deleteSuccess"));
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};

getList();
</script>
