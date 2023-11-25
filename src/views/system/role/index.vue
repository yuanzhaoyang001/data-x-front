<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
    >
      <el-form-item
        :label="$t('system.roleManagement.roleName')"
        prop="roleName"
      >
        <el-input
          v-model="queryParams.roleName"
          clearable
          :placeholder="$t('system.roleManagement.enterRoleName')"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.roleManagement.permissionCode')"
        prop="roleKey"
      >
        <el-input
          v-model="queryParams.roleKey"
          clearable
          :placeholder="$t('system.roleManagement.enterPermissionCode')"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.roleManagement.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.roleManagement.roleStatus')"
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
      <el-form-item :label="$t('system.roleManagement.createTime')">
        <el-date-picker
          v-model="dateRange"
          :end-placeholder="$t('system.roleManagement.endDate')"
          range-separator="-"
          :start-placeholder="$t('system.roleManagement.startDate')"
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
          {{ $t("system.roleManagement.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.roleManagement.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("system.roleManagement.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:edit']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("system.roleManagement.edit") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:remove']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("system.roleManagement.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:export']"
          :loading="exportLoading"
          icon="ele-Download"
          plain
          type="warning"
          @click="handleExport"
        >
          {{ $t("system.roleManagement.export") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        :label="$t('system.roleManagement.roleNumber')"
        prop="id"
        width="120"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('system.roleManagement.roleName')"
        prop="roleName"
        width="190"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('system.roleManagement.permissionCode')"
        prop="roleKey"
        width="150"
      />
      <el-table-column
        :label="$t('system.roleManagement.displayOrder')"
        prop="roleSort"
        width="130"
      />
      <el-table-column
        align="center"
        :label="$t('system.roleManagement.status')"
        width="100"
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
        align="center"
        :label="$t('system.roleManagement.createTime')"
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
        :label="$t('system.roleManagement.operation')"
      >
        <template #default="scope">
          <template v-if="scope.row.id !== 1">
            <el-tooltip
              content="修改"
              placement="top"
            >
              <el-button
                link
                type="primary"
                icon="ele-Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:role:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :content="$t('system.roleManagement.edit')"
              placement="top"
            >
              <el-button
                link
                type="primary"
                icon="ele-CircleCheck"
                @click="handleDataScope(scope.row)"
                v-hasPermi="['system:role:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :content="$t('system.roleManagement.dataPermission')"
              placement="top"
            >
              <el-button
                link
                type="danger"
                icon="ele-Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:role:remove']"
              ></el-button>
            </el-tooltip>
          </template>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :title="$t('system.roleManagement.editRole')"
      v-model="open"
      append-to-body
      width="50%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item
          :label="$t('system.roleManagement.roleName')"
          prop="roleName"
        >
          <el-input
            v-model="form.roleName"
            :placeholder="$t('system.roleManagement.enterRoleName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.roleManagement.permissionCode')"
          prop="roleKey"
        >
          <el-input
            v-model="form.roleKey"
            :placeholder="$t('system.roleManagement.enterPermissionCode')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.roleManagement.roleOrder')"
          prop="roleSort"
        >
          <el-input-number
            size="default"
            v-model="form.roleSort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="$t('system.roleManagement.status')">
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
        <el-form-item :label="$t('system.roleManagement.menuPermission')">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
          >
            {{ $t("system.roleManagement.expand") }}/{{ $t("system.roleManagement.collapse") }}
          </el-checkbox>
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
          >
            {{ $t("system.roleManagement.selectAll") }}/{{ $t("system.roleManagement.deselectAll") }}
          </el-checkbox>
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
          >
            {{ $t("system.roleManagement.parentChildLinkage") }}
          </el-checkbox>
          <el-scrollbar
            height="250px"
            class="w100"
          >
            <el-tree
              ref="menu"
              :check-strictly="!form.menuCheckStrictly"
              :data="menuOptions"
              :props="defaultProps"
              class="tree-border"
              :empty-text="$t('system.roleManagement.loading')"
              node-key="id"
              show-checkbox
            />
          </el-scrollbar>
        </el-form-item>
        <el-form-item :label="$t('system.roleManagement.remark')">
          <el-input
            v-model="form.remark"
            :placeholder="$t('system.roleManagement.enterRemark')"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="submitForm"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
        <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :title="$t('system.roleManagement.assignDataPermission')"
      v-model="openDataScope"
      append-to-body
      width="40%"
    >
      <el-form
        :model="form"
        label-width="130px"
      >
        <el-form-item :label="$t('system.roleManagement.roleName')">
          <el-input
            v-model="form.roleName"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="$t('system.roleManagement.permissionCode')">
          <el-input
            v-model="form.roleKey"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="$t('system.roleManagement.permissionScope')">
          <el-select
            style="width: 350px"
            v-model="form.dataScope"
            @change="dataScopeSelectChange"
          >
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="form.dataScope == 2"
          :label="$t('system.roleManagement.dataPermission')"
        >
          <el-checkbox
            v-model="deptExpand"
            @change="handleCheckedTreeExpand($event, 'dept')"
          >
            {{ $t("system.roleManagement.expand") }}/{{ $t("system.roleManagement.collapse") }}
          </el-checkbox>
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
          >
            {{ $t("system.roleManagement.selectAll") }}/{{ $t("system.roleManagement.deselectAll") }}
          </el-checkbox>
          <el-checkbox
            v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
          >
            {{ $t("system.roleManagement.parentChildLinkage") }}
          </el-checkbox>
          <el-tree
            ref="dept"
            :check-strictly="!form.deptCheckStrictly"
            :data="deptOptions"
            :props="defaultProps"
            class="tree-border w100"
            default-expand-all
            :empty-text="$t('system.roleManagement.loading')"
            node-key="id"
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="submitDataScope"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
        <el-button @click="cancelDataScope">{{ $t("formI18n.all.cancel") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, changeRoleStatus, dataScope, delRole, exportRole, getRole, pageRole, updateRole } from "@/api/system/role";
import { roleMenuTreeselect, treeselect as menuTreeselect } from "@/api/system/menu";
import { roleDeptTreeselect, treeselect as deptTreeselect } from "@/api/system/dept";
import { i18n } from "@/i18n";

export default {
  name: "Role",
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: i18n.global.t("system.roleManagement.allDataPermission")
        },
        {
          value: "2",
          label: i18n.global.t("system.roleManagement.customDataPermission")
        },
        {
          value: "3",
          label: i18n.global.t("system.roleManagement.deptDataPermission")
        },
        {
          value: "4",
          label: i18n.global.t("system.roleManagement.deptAndSubDataPermission")
        },
        {
          value: "5",
          label: i18n.global.t("system.roleManagement.personalDataPermission")
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          {
            required: true,
            message: i18n.global.t("system.roleManagement.roleNameNotNull"),
            trigger: "blur"
          }
        ],
        roleKey: [
          {
            required: true,
            message: i18n.global.t("system.roleManagement.permissionCodeNotNull"),
            trigger: "blur"
          }
        ],
        roleSort: [
          {
            required: true,
            message: i18n.global.t("system.roleManagement.roleOrderNotNull"),
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
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      pageRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.roleList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.data.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.data.depts;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text =
        row.status === "0" ? i18n.global.t("system.roleManagement.enable") : i18n.global.t("system.roleManagement.disable");
      this.$confirm(
        i18n.global.t("system.roleManagement.confirmRoleAction") +
          text +
          row.roleName +
          i18n.global.t("system.roleManagement.confirmRole"),
        i18n.global.t("formI18n.all.waring"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          type: "warning"
        }
      )
        .then(function () {
          return changeRoleStatus(row.id, row.status);
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
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      (this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.deptExpand = true),
        (this.deptNodeAll = false),
        (this.form = {
          id: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined
        });
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
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == "menu") {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == "dept") {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.form.menuCheckStrictly = !!value;
      } else if (type == "dept") {
        this.form.deptCheckStrictly = !!value;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = i18n.global.t("system.roleManagement.addRole");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      const roleMenu = this.getRoleMenuTreeselect(id);
      getRole(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            let checkedKeys = res.data.checkedKeys;
            checkedKeys.forEach(v => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              });
            });
          });
        });
        this.title = i18n.global.t("system.roleManagement.editRole");
      });
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== "2") {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      console.log(this.$refs.dept);
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.id);
      getRole(row.id).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = i18n.global.t("system.roleManagement.assignDataPermission");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function () {
      if (this.form.id != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(i18n.global.t("system.roleManagement.isDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return delRole(ids);
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
      this.$confirm(i18n.global.t("system.roleManagement.isDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportRole(queryParams);
        })
        .then(response => {
          this.download(response, i18n.global.t("system.roleManagement.roleData"));
          this.exportLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
