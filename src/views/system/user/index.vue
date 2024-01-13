<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col
        :span="4"
        :xs="24"
      >
        <div class="head-container">
          <el-input
            v-model="deptName"
            clearable
            :placeholder="$t('system.userManagement.deptNamePlaceholder')"
            prefix-icon="ele-Search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col
        :span="20"
        :xs="24"
      >
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :inline="true"
          :model="queryParams"
          label-width="68px"
        >
          <el-form-item
            :label="$t('system.userManagement.userName')"
            prop="userName"
          >
            <el-input
              v-model="queryParams.userName"
              clearable
              :placeholder="$t('system.userManagement.userNamePlaceholder')"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.userManagement.nickName')"
            prop="nickName"
          >
            <el-input
              v-model="queryParams.nickName"
              :placeholder="$t('system.userManagement.nickNamePlaceholder')"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label-width="110px"
            :label="$t('system.userManagement.phoneNumber')"
            prop="phonenumber"
          >
            <el-input
              v-model="queryParams.phonenumber"
              clearable
              :placeholder="$t('system.userManagement.phoneNumberPlaceholder')"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.userManagement.status')"
            prop="status"
          >
            <el-select
              v-model="queryParams.status"
              clearable
              :placeholder="$t('system.userManagement.statusPlaceholder')"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="110px"
            :label="$t('system.userManagement.createTime')"
          >
            <el-date-picker
              v-model="dateRange"
              :end-placeholder="$t('system.userManagement.endTimePlaceholder')"
              range-separator="-"
              :start-placeholder="$t('system.userManagement.startTimePlaceholder')"
              style="width: 240px"
              type="daterange"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="ele-Search"
              type="primary"
              @click="handleQuery"
            >
              {{ $t("formI18n.all.search") }}
            </el-button>
            <el-button
              icon="ele-Refresh"
              @click="resetQuery"
            >
              {{ $t("formI18n.all.reset") }}
            </el-button>
          </el-form-item>
        </el-form>

        <el-row
          :gutter="10"
          class="mb8"
        >
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['system:user:add']"
              icon="ele-Plus"
              plain
              type="primary"
              @click="handleAdd"
            >
              {{ $t("formI18n.all.add") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['system:user:edit']"
              :disabled="single"
              icon="ele-Edit"
              plain
              type="success"
              @click="handleUpdate"
            >
              {{ $t("formI18n.all.modify") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['system:user:remove']"
              :disabled="multiple"
              icon="ele-Delete"
              plain
              type="danger"
              @click="handleDelete"
            >
              {{ $t("formI18n.all.delete") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['system:user:import']"
              icon="ele-Upload"
              plain
              type="info"
              @click="handleImport"
            >
              {{ $t("formI18n.all.import") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['system:user:export']"
              :loading="exportLoading"
              icon="ele-Download"
              plain
              type="warning"
              @click="handleExport"
            >
              {{ $t("system.userManagement.export") }}
            </el-button>
          </el-col>
          <right-toolbar
            :columns="columns"
            v-model:show-search="showSearch"
            @queryTable="getList"
          />
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="50"
          />
          <el-table-column
            v-if="columns[0].visible"
            align="center"
            :label="$t('system.userManagement.userNumber')"
            prop="id"
          />
          <el-table-column
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
            align="center"
            :label="$t('system.userManagement.userName')"
            prop="userName"
          />
          <el-table-column
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
            align="center"
            :label="$t('system.userManagement.nickName')"
            prop="nickName"
          />
          <el-table-column
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
            align="center"
            :label="$t('system.userManagement.dept')"
            prop="dept.deptName"
          />
          <el-table-column
            v-if="columns[4].visible"
            align="center"
            :label="$t('system.userManagement.phoneNumber')"
            prop="phonenumber"
            width="120"
          />
          <el-table-column
            v-if="columns[5].visible"
            align="center"
            :label="$t('system.userManagement.status')"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns[6].visible"
            align="center"
            :label="$t('system.userManagement.createTime')"
            prop="createTime"
            width="180"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            class-name="small-padding fixed-width"
            :label="$t('system.userManagement.operation')"
            width="170"
          >
            <template #default="scope">
              <el-tooltip
                :content="$t('formI18n.all.modify')"
                placement="top"
                v-if="scope.row.id !== 1"
              >
                <el-button
                  link
                  type="primary"
                  icon="ele-Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :content="$t('formI18n.all.delete')"
                placement="top"
                v-if="scope.row.userId !== 1"
              >
                <el-button
                  link
                  type="danger"
                  icon="ele-Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :content="$t('system.userManagement.resetPassword')"
                placement="top"
                v-if="scope.row.userId !== 1"
              >
                <el-button
                  link
                  type="primary"
                  icon="ele-Key"
                  @click="handleResetPwd(scope.row)"
                  v-hasPermi="['system:user:resetPwd']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :content="$t('system.userManagement.divideDept')"
                placement="top"
                v-if="scope.row.userId !== 1"
              >
                <el-button
                  link
                  type="primary"
                  icon="ele-CircleCheck"
                  @click="handleAuthRole(scope.row)"
                  v-hasPermi="['system:user:roleauth']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      width="50%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.userManagement.nickName')"
              prop="nickName"
            >
              <el-input
                v-model="form.nickName"
                maxlength="30"
                :placeholder="$t('system.userManagement.nickNamePlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="110px"
              :label="$t('system.userManagement.belongingDept')"
              prop="deptId"
            >
              <el-tree-select
                @change="getPostList"
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                :placeholder="$t('system.userManagement.belongingDeptPlaceholder')"
                default-expand-all
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.userManagement.phoneNumber')"
              prop="phonenumber"
            >
              <el-input
                v-model="form.phonenumber"
                maxlength="11"
                :placeholder="$t('system.userManagement.phoneNumberPlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.userManagement.email')"
              prop="email"
            >
              <el-input
                v-model="form.email"
                maxlength="50"
                :placeholder="$t('system.userManagement.emailPlaceholder')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              :label="$t('system.userManagement.userName')"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                maxlength="30"
                :placeholder="$t('system.userManagement.userNamePlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              :label="$t('system.userManagement.password')"
              prop="password"
            >
              <el-input
                v-model="form.password"
                maxlength="20"
                :placeholder="$t('system.userManagement.passwordPlaceholder')"
                type="password"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManagement.userSex')">
              <el-select
                v-model="form.sex"
                :placeholder="$t('formI18n.all.pleaseEnter')"
              >
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManagement.status')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManagement.post')">
              <el-select
                v-model="form.postIds"
                multiple
                :placeholder="$t('formI18n.all.pleaseEnter')"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.postShowName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManagement.userRoles')">
              <el-select
                v-model="form.roleIds"
                multiple
                :placeholder="$t('formI18n.all.pleaseEnter')"
                @change="
                  () => {
                    $forceUpdate();
                  }
                "
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :disabled="item.status == 1"
                  :label="item.roleName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('system.userManagement.remark')">
              <el-input
                v-model="form.remark"
                :placeholder="$t('formI18n.all.pleaseEnter')"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      append-to-body
      width="400px"
    >
      <el-upload
        ref="upload"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :auto-upload="false"
        :disabled="upload.isUploading"
        :headers="upload.headers"
        :limit="1"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        accept=".xlsx, .xls"
        drag
      >
        <el-icon :size="30">
          <ele-Upload />
        </el-icon>
        <div class="el-upload__text">{{ $t("system.userManagement.importText") }}</div>
        <template #tip>
          <div class="el-upload__tip">
            <el-checkbox v-model="upload.updateSupport" />
            {{ $t("system.userManagement.updateData") }}
            <el-link
              style="font-size: 12px"
              type="info"
              @click="importTemplate"
            >
              {{ $t("system.userManagement.downloadTemplate") }}
            </el-link>
          </div>
          <div
            class="el-upload__tip"
            style="color: red"
          >
            {{ $t("system.userManagement.uploadTip") }}
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitFileForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="upload.open = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUser,
  changeUserStatus,
  delUser,
  exportUser,
  getUser,
  importTemplate,
  pageUser,
  resetUserPwd,
  updateUser
} from "@/api/system/user";
import { baseUrl, getToken } from "@/utils/auth";
import { queryDeptInPost, treeselect } from "@/api/system/dept";
import { i18n } from "@/i18n";

export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: baseUrl + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: i18n.global.t("system.userManagement.userNumber"), visible: true },
        { key: 1, label: i18n.global.t("system.userManagement.userName"), visible: true },
        { key: 2, label: i18n.global.t("system.userManagement.nickName"), visible: true },
        { key: 3, label: i18n.global.t("system.userManagement.dept"), visible: true },
        { key: 4, label: i18n.global.t("system.userManagement.phoneNumber"), visible: true },
        { key: 5, label: i18n.global.t("system.userManagement.status"), visible: true },
        { key: 6, label: i18n.global.t("system.userManagement.createTime"), visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          {
            required: true,
            message: i18n.global.t("system.userManagement.userNameNotNull"),
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: i18n.global.t("system.userManagement.nickNameNotNull"),
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: i18n.global.t("system.userManagement.passwordPlaceholder"), trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: i18n.global.t("system.userManagement.passwordRequired"),
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: i18n.global.t("system.userManagement.emailAddress"),
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: i18n.global.t("system.userManagement.phoneNumberRequired"),
            trigger: "blur"
          }
        ]
      }
    };
  },

  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigValue("sys.user.initPassword").then(response => {
      this.initPassword = response.data;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      pageUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text =
        row.status === "0" ? i18n.global.t("system.userManagement.enable") : i18n.global.t("system.userManagement.disable");
      this.$confirm(
        i18n.global.t("system.userManagement.confirmUserAction") +
          text +
          '""' +
          row.userName +
          i18n.global.t("system.userManagement.confirmUser"),
        i18n.global.t("formI18n.all.waring"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          type: "warning"
        }
      )
        .then(function () {
          return changeUserStatus(row.id, row.status);
        })
        .then(() => {
          this.msgSuccess(text + i18n.global.t("formI18n.all.success"));
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDelete":
          this.handleDelete(row);
          break;
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getUser().then(response => {
        this.roleOptions = response.data.roles;
        this.open = true;
        this.title = i18n.global.t("system.userManagement.addUser");
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();

      const userId = row.id || this.ids;
      getUser(userId).then(async response => {
        this.form = response.data.user;
        await this.getPostList();
        this.roleOptions = response.data.roles;
        this.form.postIds = response.data.postIds;
        this.form.roleIds = response.data.roleIds;
        this.open = true;
        this.title = i18n.global.t("system.userManagement.updateUser");
        this.form.password = null;
      });
    },
    handleDeptInput(val) {
      // 如果是修改 切换了部门 则清空岗位
      if (this.form.id) {
        this.form.postIds = [];
      }
      this.getPostList();
    },
    // 获取部门下岗位
    async getPostList() {
      let response = await queryDeptInPost({ deptId: this.form.deptId });
      this.postOptions = response.data;
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt(
        i18n.global.t("formI18n.all.pleaseEnter") + row.userName + i18n.global.t("system.userManagement.newPassword"),
        i18n.global.t("formI18n.all.waring"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          closeOnClickModal: false,
          inputPattern: /^.{5,20}$/,
          inputErrorMessage: i18n.global.t("system.userManagement.passwordRequired")
        }
      )
        .then(({ value }) => {
          resetUserPwd(row.id, value).then(response => {
            this.msgSuccess(i18n.global.t("system.userManagement.resetPasswordSuccess") + value);
          });
        })
        .catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.id;
      this.$router.push("/auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id || this.ids;
      this.$confirm(i18n.global.t("system.userManagement.confirmDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(i18n.global.t("system.userManagement.confirmExport"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportUser(queryParams);
        })
        .then(response => {
          console.log(response);
          this.download(response, i18n.global.t("system.userManagement.userData"));

          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = i18n.global.t("system.userManagement.importUser");
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        console.log(response);
        this.download(response, i18n.global.t("system.userManagement.importUserTemplate"));
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();

      this.$alert(response.msg, i18n.global.t("system.userManagement.importResult"), { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
