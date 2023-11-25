<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
    >
      <el-form-item
        :label="$t('system.menu.menuName')"
        prop="menuName"
      >
        <el-input
          v-model="queryParams.menuName"
          clearable
          :placeholder="$t('system.menu.enterMenuName')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.menu.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.menu.menuStatus')"
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
          v-hasPermi="['system:menu:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("system.menu.handleAdd") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('system.menu.menuName')"
        prop="menuName"
        width="160"
      />
      <el-table-column
        align="center"
        :label="$t('system.menu.icon')"
        prop="icon"
        width="100"
      >
        <template #default="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.menu.sortOrder')"
        prop="orderNum"
        width="100"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('system.menu.permission')"
        prop="perms"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :label="$t('system.menu.component')"
        prop="component"
      />
      <el-table-column
        :formatter="statusFormat"
        :label="$t('system.menu.status')"
        prop="status"
        width="80"
      />
      <el-table-column
        align="center"
        :label="$t('system.menu.position')"
        prop="createTime"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.location === '2'">{{ $t("system.menu.frontendMenu") }}</el-tag>
          <el-tag
            v-else
            type="info"
          >
            {{ $t("system.menu.backendMenu") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('system.menu.createTime')"
        prop="createTime"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('system.menu.updateTime')"
        prop="updateTime"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('formI18n.all.operate')"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="ele-Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          ></el-button>
          <el-button
            link
            type="primary"
            icon="ele-Plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          ></el-button>
          <el-button
            link
            type="primary"
            icon="ele-Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('system.menu.parentMenu')">
              <el-tree-select
                v-model="form.parentId"
                :data="menuOptions"
                @change="handleTreeSelect"
                :props="{ value: 'id', label: 'menuName', children: 'children' }"
                value-key="id"
                :placeholder="$t('system.menu.selectParentMenu')"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('system.menu.menuType')"
              prop="menuType"
            >
              <el-radio-group v-model="form.menuType">
                <el-radio
                  label="M"
                  v-if="!['M', 'C', 'F'].includes(parentType)"
                >
                  {{ $t("system.menu.catalog") }}
                </el-radio>
                <el-radio
                  label="C"
                  v-if="!['C', 'F'].includes(parentType)"
                >
                  {{ $t("system.menu.menu") }}
                </el-radio>
                <el-radio
                  label="F"
                  v-if="!['M', 'F'].includes(parentType)"
                >
                  {{ $t("system.menu.button") }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('system.menu.menuIcon')">
              <el-popover
                placement="bottom-start"
                trigger="click"
                width="460"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect
                  ref="iconSelect"
                  @selected="selected"
                />
                <template #reference>
                  <el-input
                    v-model="form.icon"
                    :placeholder="$t('system.menu.clickSelectIcon')"
                    readonly
                  >
                    <template #prefix>
                      <i
                        v-if="form.icon"
                        :class="form.icon"
                        style="height: 32px; width: 16px"
                      />
                    </template>
                  </el-input>
                </template>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.menu.menuName')"
              prop="menuName"
            >
              <el-input
                v-model="form.menuName"
                :placeholder="$t('system.menu.enterMenuName')"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="form.menuType != 'F'"
          >
            <el-form-item
              :label="$t('system.menu.langKey')"
              prop="langKey"
            >
              <el-input
                v-model="form.langKey"
                :placeholder="$t('system.menu.enterLangKey')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.menu.sortOrder')"
              prop="orderNum"
            >
              <el-input-number
                v-model="form.orderNum"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="form.menuType == 'C'"
          >
            <el-form-item :label="$t('system.menu.externalLink')">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">{{ $t("system.menu.yes") }}</el-radio>
                <el-radio label="1">{{ $t("system.menu.no") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="form.menuType !== 'F'"
          >
            <el-form-item
              :label="$t('system.menu.routePath')"
              prop="path"
            >
              <el-input
                v-model="form.path"
                :placeholder="$t('system.menu.enterRouteAddress')"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="form.menuType == 'C'"
          >
            <el-form-item
              label-width="150px"
              :label="$t('system.menu.component')"
              prop="component"
            >
              <el-input
                v-model="form.component"
                :placeholder="$t('system.menu.enterComponent')"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="form.menuType != 'M'"
          >
            <el-form-item
              label-width="130px"
              :label="$t('system.menu.permission')"
            >
              <el-input
                v-model="form.perms"
                maxlength="100"
                :placeholder="$t('system.menu.enterPermissionIdentifier')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.menu.visible')"
              v-if="form.menuType != 'F'"
            >
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.menu.menuStatus')"
              v-if="form.menuType != 'F'"
            >
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
          <el-col
            :span="12"
            v-if="form.menuType == 'C'"
          >
            <el-form-item :label="$t('system.menu.cache')">
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">{{ $t("system.menu.cache") }}</el-radio>
                <el-radio label="1">{{ $t("system.menu.noCache") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('system.menu.menuPosition')"
              v-if="form.menuType == 'M'"
            >
              <el-radio-group v-model="form.location">
                <el-radio label="1">{{ $t("system.menu.backendMenu") }}</el-radio>
                <el-radio label="2">{{ $t("system.menu.frontendMenu") }}</el-radio>
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
import { addMenu, delMenu, getMenu, listMenu, updateMenu } from "@/api/system/menu";
import IconSelect from "./IconfontSelect.vue";
import { i18n } from "@/i18n";

export default {
  name: "Menu",
  components: {
    IconSelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 父级菜单类型
      parentType: "",
      // 表单校验
      rules: {
        menuName: [{ required: true, message: i18n.global.t("system.menu.menuNameRequied"), trigger: "blur" }],
        orderNum: [{ required: true, message: i18n.global.t("system.menu.menuOrderRequied"), trigger: "blur" }],
        path: [{ required: true, message: i18n.global.t("system.menu.routeRequied"), trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "id");
        this.loading = false;
      });
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { id: 0, menuName: i18n.global.t("system.menu.topMenu"), children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.menuOptions.push(menu);
      });
    },
    handleTreeSelect(id) {
      console.log(id);
      getMenu(id).then(res => {
        if (res.data) {
          this.parentType = res.data.menuType;
        } else {
          this.parentType = "";
        }
        this.form.menuType = "";
      });
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
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
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0",
        location: "1",
        langKey: ""
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
      this.parentType = "";
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = i18n.global.t("system.menu.addMenu");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("system.menu.modifyMenu");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMenu(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
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
      this.$confirm(i18n.global.t("system.menu.isDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return delMenu(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    }
  }
};
</script>
