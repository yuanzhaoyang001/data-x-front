<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :title="$t('form.setting.chooseUserDialogTitle')"
    width="90%"
  >
    <div class="app-container">
      <el-row :gutter="10">
        <el-col :span="15">
          <!--用户数据-->
          <el-form
            v-show="showSearch"
            ref="queryForm"
            :inline="true"
            :model="queryParams"
            label-width="88px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="$t('form.setting.userNameLabel')"
                  prop="userName"
                >
                  <el-input
                    size="default"
                    v-model="queryParams.userName"
                    clearable
                    :placeholder="$t('form.setting.userNameLabel')"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('form.setting.nickNameLabel')"
                  prop="nickName"
                  label-width="88px"
                >
                  <el-input
                    v-model="queryParams.nickName"
                    clearable
                    size="default"
                    :placeholder="$t('form.setting.nickNameLabel')"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('form.setting.phoneNumberLabel')"
                  prop="phonenumber"
                  label-width="115px"
                >
                  <el-input
                    v-model="queryParams.phonenumber"
                    clearable
                    size="default"
                    :placeholder="$t('form.setting.phoneNumberLabel')"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <el-button
                    size="default"
                    icon="ele-Search"
                    type="primary"
                    @click="handleQuery"
                  >
                    {{ $t("formI18n.all.search") }}
                  </el-button>
                  <el-button
                    size="default"
                    icon="ele-Refresh"
                    @click="resetQuery"
                  >
                    {{ $t("formI18n.all.reset") }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            ref="userTableRef"
            v-loading="loading"
            :data="userList"
            row-key="id"
            @select="handleSelectionChange"
            @select-all="handleSelectionChange"
          >
            <el-table-column
              v-if="multiple"
              align="center"
              type="selection"
              width="50"
              :reserve-selection="true"
            />
            <el-table-column
              v-else
              label
              width="45"
            >
              <template #default="scope">
                <el-radio
                  v-model="radioId"
                  :label="scope.row.id"
                  @change="handleSingleUser(scope.row)"
                >
                  &nbsp;
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              key="userId"
              align="center"
              :label="$t('form.setting.userTableUserId')"
              prop="id"
              width="100"
            />
            <el-table-column
              key="userName"
              :show-overflow-tooltip="true"
              align="center"
              :label="$t('form.setting.userTableUserName')"
              prop="userName"
            />
            <el-table-column
              key="nickName"
              :show-overflow-tooltip="true"
              align="center"
              :label="$t('form.setting.userTableNickName')"
              prop="nickName"
            />
            <el-table-column
              key="deptName"
              :show-overflow-tooltip="true"
              align="center"
              :label="$t('form.setting.userTableDeptName')"
              prop="dept.deptName"
            />
            <el-table-column
              key="phonenumber"
              align="center"
              :label="$t('form.setting.userTablePhoneNumber')"
              prop="phonenumber"
              width="130"
            />
            <el-table-column
              align="center"
              :label="$t('form.setting.userTableCreateTime')"
              prop="createTime"
              width="180"
            >
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
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
        </el-col>
        <el-col :span="9">
          <p class="title-text pl5">{{ $t("form.setting.selectUserTitle") }}</p>
          <el-table
            border
            :data="selectedUserList"
            max-height="500"
          >
            <template #empty>
              <el-empty :description="$t('client.table.noData')" />
            </template>
            <el-table-column
              key="userId"
              align="center"
              :label="$t('form.setting.userTableUserId')"
              prop="id"
            />
            <el-table-column
              key="userName"
              :show-overflow-tooltip="true"
              align="center"
              :label="$t('form.setting.userTableUserName')"
              prop="userName"
            />
            <el-table-column
              key="nickName"
              :show-overflow-tooltip="true"
              align="center"
              :label="$t('form.setting.userTableNickName')"
              prop="nickName"
            />
            <el-table-column
              align="center"
              class-name="small-padding fixed-width"
              :label="$t('form.setting.selectUserTableOperation')"
              width="160"
            >
              <template #default="scope">
                <el-button
                  icon="ele-Delete"
                  link
                  type="primary"
                  @click="deleteSelectedUserHandle(scope.row)"
                >
                  {{ $t("formI18n.all.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
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
          @click="submitSelectedUserHandle"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { pageUser } from "@/api/system/user";
import _ from "lodash-es";
import { parseTime, resetForm } from "@/utils/tduck";

const props = defineProps({
  // 多选
  multiple: {
    type: Boolean,
    default: true
  },
  // 不记录已选用户
  noRecord: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["submit"]);

const radioId = ref(null);
const loading = ref(true);
const dialogVisible = ref(false);
const showSearch = ref(true);
const total = ref(0);
const userList = ref([]);
const selectedUserList = ref([]);
const defaultSelectRows = ref([]);
const removedSelectRows = ref([]);

const queryParams = reactive({
  current: 1,
  size: 5,
  userName: undefined,
  nickName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: undefined
});

onMounted(() => {
  getList();
});

const userTableRef = ref(null);

const showDialog = userList => {
  dialogVisible.value = true;
  if (props.noRecord) {
    nextTick(() => {
      userTableRef.value.clearSelection();
    });
    selectedUserList.value = [];
  } else {
    removedSelectRows.value = _.difference(selectedUserList.value, userList).map(item => item.id);
    selectedUserList.value = userList;
    defaultSelectRows.value = userList.map(item => item.id);
    nextTick(() => {
      handleDefaultRowSelection();
    });
  }
};

defineExpose({
  showDialog
});

const getList = () => {
  loading.value = true;
  pageUser(queryParams).then(response => {
    userList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
    handleDefaultRowSelection();
  });
};

const handleQuery = () => {
  queryParams.current = 1;
  getList();
};

const resetQuery = () => {
  resetForm("queryForm");
  handleQuery();
};

const handleSelectionChange = selection => {
  selectedUserList.value = _.uniqBy(selection, "id");
};

const deleteSelectedUserHandle = row => {
  const index = _.findIndex(selectedUserList.value, ["id", row.id]);
  selectedUserList.value.splice(index, 1);
  const user = userList.value.find(item => item.id == row.id);
  userTableRef.value.toggleRowSelection(user, false);
  removedSelectRows.value.push(row.id);
};

const handleDefaultRowSelection = () => {
  if (defaultSelectRows.value.length === 0 && removedSelectRows.value.length === 0) {
    return;
  }

  userList.value.forEach(user => {
    const index = defaultSelectRows.value.findIndex(item => user.id == item);
    if (index !== -1) {
      userTableRef.value.toggleRowSelection(user, true);
      defaultSelectRows.value.splice(index, 1);
    }

    const index1 = removedSelectRows.value.findIndex(item => user.id == item);
    if (index1 !== -1) {
      nextTick(() => {
        userTableRef.value.toggleRowSelection(user, false);
      });
      removedSelectRows.value.splice(index, 1);
    }
  });
};

const handleSingleUser = user => {
  selectedUserList.value = [user];
};

const submitSelectedUserHandle = () => {
  dialogVisible.value = false;
  emit("submit", selectedUserList.value);
};
</script>
