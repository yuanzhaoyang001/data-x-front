<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
    >
      <el-form-item
        :label="$t('system.deptManagement.departmentName')"
        prop="deptName"
      >
        <el-input
          style="width: 200px"
          v-model="queryParams.deptName"
          clearable
          :placeholder="$t('system.deptManagement.enterDepartmentName')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.deptManagement.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.deptManagement.departmentStatus')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['system:dept:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("system.deptManagement.addDepartment") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="deptList"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      row-key="id"
    >
      <el-table-column
        :label="$t('system.deptManagement.departmentName')"
        prop="deptName"
        width="260"
      />
      <el-table-column
        :label="$t('system.deptManagement.departmentId')"
        prop="id"
        width="260"
      />
      <el-table-column
        :label="$t('system.deptManagement.order')"
        prop="orderNum"
        width="200"
      />
      <el-table-column
        :formatter="statusFormat"
        :label="$t('system.deptManagement.status')"
        prop="status"
        width="100"
      />
      <el-table-column
        align="center"
        :label="$t('system.deptManagement.createTime')"
        prop="createTime"
        width="200"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('formI18n.all.operate')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.deptManagement.position')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-UserFilled"
              @click="handlePost(scope.row)"
              v-hasPermi="['system:deptpost:list']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.deptManagement.editDepartment')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:dept:edit']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.deptManagement.addDepartment')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:dept:edit']"
            ></el-button>
          </el-tooltip>
          <template v-if="scope.row.parentId != 0">
            <el-tooltip
              :content="$t('formI18n.all.delete')"
              placement="top"
            >
              <el-button
                link
                type="danger"
                icon="ele-Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:dept:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
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
        label-width="150px"
      >
        <el-row>
          <el-col
            v-if="form.parentId !== 0"
            :span="24"
          >
            <el-form-item
              :label="$t('system.deptManagement.parentDepartment')"
              prop="parentId"
            >
              <el-tree-select
                style="width: 310px !important"
                v-model="form.parentId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'deptName', children: 'children' }"
                value-key="id"
                :placeholder="$t('system.deptManagement.selectParentDepartment')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.deptManagement.departmentName')"
              prop="deptName"
            >
              <el-input
                v-model="form.deptName"
                :placeholder="$t('system.deptManagement.enterDepartmentName')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.deptManagement.showOrder')"
              prop="orderNum"
            >
              <el-input-number
                v-model="form.orderNum"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.deptManagement.leader')"
              prop="leader"
            >
              <el-input
                v-model="form.leader"
                maxlength="20"
                :placeholder="$t('system.deptManagement.enterLeader')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.deptManagement.contactPhone')"
              prop="phone"
            >
              <el-input
                v-model="form.phone"
                maxlength="11"
                :placeholder="$t('system.deptManagement.enterContactPhone')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.deptManagement.email')"
              prop="email"
            >
              <el-input
                v-model="form.email"
                maxlength="50"
                :placeholder="$t('system.deptManagement.enterEmail')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.deptManagement.departmentState')">
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
  </div>
</template>

<script>
import { addDept, delDept, getDept, listDeptExcludeChild, pageDept, updateDept } from "@/api/system/dept";
import { i18n } from "@/i18n";

export default {
  name: "Dept",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          {
            required: true,
            message: i18n.global.t("system.deptManagement.parentDepartmentNotEmpty"),
            trigger: "blur"
          }
        ],
        deptName: [
          {
            required: true,
            message: i18n.global.t("system.deptManagement.departmentNameNotEmpty"),
            trigger: "blur"
          }
        ],
        orderNum: [
          {
            required: true,
            message: i18n.global.t("system.deptManagement.showOrderNotEmpty"),
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: i18n.global.t("system.deptManagement.enterEmail"),
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: i18n.global.t("system.deptManagement.enterCorrectPhoneNumber"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      pageDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data);
        this.loading = false;
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = i18n.global.t("system.deptManagement.addDepartment");
      pageDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "id");
      });
    },
    handlePost(row) {
      this.$router.push({
        path: "/dept/post",
        query: {
          id: row.id
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("system.deptManagement.editDepartment");
      });
      listDeptExcludeChild(row.id).then(response => {
        this.deptOptions = this.handleTree(response.data, "id");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDept(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
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
      this.$confirm(
        i18n.global.t("system.deptManagement.confirmDeleteData", { deptName: row.deptName }),
        i18n.global.t("formI18n.all.waring"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          type: "warning"
        }
      )
        .then(() => delDept(row.id))
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    }
  }
};
</script>
