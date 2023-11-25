<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.public.assignedUsers") }}</span>
        <span class="desc-text ml10">{{ $t("form.public.assignedUsersDescText") }}</span>
      </div>
    </template>
    <div class="publish-content">
      <el-row :gutter="15">
        <el-col :span="1.5">
          <el-button
            plain
            type="primary"
            size="default"
            @click="handleAssignUser"
          >
            {{ $t("form.public.assignUser") }}
          </el-button>
          <el-button
            plain
            size="default"
            type="success"
            @click="handleAssignDept"
          >
            {{ $t("form.public.assignDept") }}
          </el-button>
          <el-button
            plain
            size="default"
            type="info"
            @click="handleAssignRole"
          >
            {{ $t("form.public.assignRole") }}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            plain
            size="default"
            type="danger"
            @click="handleDeleteAssignUser()"
          >
            {{ $t("formI18n.all.delete") }}
          </el-button>
        </el-col>
      </el-row>
      <el-divider />
      <el-table
        v-loading="loading"
        :data="todoList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          :label="$t('form.public.nickName')"
          prop="userName"
        />
        <el-table-column
          align="center"
          :label="$t('form.public.status')"
          prop="status"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.status === 0"
              type="danger"
            >
              {{ $t("form.public.unfinished") }}
            </el-tag>
            <el-tag
              v-else
              type="success"
            >
              {{ $t("form.public.finished") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('form.public.completeTime')"
          prop="updateTime"
        />
        <el-table-column
          align="center"
          :label="$t('form.public.assignTime')"
          prop="createTime"
        />
        <el-table-column
          align="center"
          class-name="small-padding fixed-width"
          :label="$t('form.public.assignedUsersOperation')"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleDeleteAssignUser(scope.row)"
            >
              {{ $t("formI18n.all.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        v-model:limit="queryParams.size"
        v-model:page="queryParams.current"
        :total="total"
        @pagination="queryTodoFormList"
      />
    </div>
    <user-choose-table
      ref="userChooseTable"
      :no-record="true"
      @submit="handleSubmitAssignUser"
    />
    <role-choose-table
      ref="roleChooseTable"
      @submit="handleSubmitAssignRole"
    />
    <dept-choose-tree
      ref="deptChooseTree"
      @submit="handleSubmitAssignDept"
    />
  </el-card>
</template>

<script>
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import { assignTodo, delTodo, listAllTodo } from "@/api/project/todo";
import RoleChooseTable from "@/views/system/role/chooseTable.vue";
import DeptChooseTree from "@/views/system/dept/chooseTree.vue";
import { i18n } from "@/i18n";

export default {
  name: "TargetedPublish",
  components: {
    DeptChooseTree,
    RoleChooseTable,
    UserChooseTable
  },
  data() {
    return {
      formKey: "",
      loading: false,
      // 总条数
      total: 0,
      // 待填写表单表格数据
      todoList: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        formKey: ""
      },
      ids: []
    };
  },
  created() {
    this.formKey = this.$route.query.key;
    this.queryTodoFormList();
  },
  methods: {
    queryTodoFormList() {
      this.loading = true;
      // 查询
      this.queryParams.formKey = this.formKey;
      listAllTodo(this.queryParams).then(response => {
        this.todoList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    handleAssignUser() {
      this.$refs.userChooseTable.showDialog([]);
    },
    handleAssignDept() {
      this.$refs.deptChooseTree.showDialog([]);
    },
    handleAssignRole() {
      this.$refs.roleChooseTable.showDialog([]);
    },
    handleSubmitAssignUser(val) {
      const userIdList = val.map(item => item.id);
      assignTodo({
        formKey: this.formKey,
        userIdList: userIdList
      }).then(() => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.queryTodoFormList();
      });
    },
    handleSubmitAssignDept(val) {
      let tempDeptList = [];
      // 递归获取 如果val里面得item里面有children 就递归获取
      const getDeptList = val => {
        val.forEach(item => {
          if (item.children) {
            tempDeptList.push({ id: item.id, label: item.label });
            getDeptList(item.children);
          } else {
            tempDeptList.push(item);
          }
        });
      };
      getDeptList(val);
      const deptIdList = val.map(item => item.id);
      assignTodo({
        formKey: this.formKey,
        deptIdList: deptIdList
      }).then(response => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.queryTodoFormList();
      });
    },
    handleSubmitAssignRole(val) {
      const roleIdList = val.map(item => item.id);
      assignTodo({
        formKey: this.formKey,
        roleIdList: roleIdList
      }).then(response => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.queryTodoFormList();
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
    },
    handleDeleteAssignUser(row) {
      const ids = row ? [row.id] : this.ids;
      this.$confirm(i18n.global.t("formI18n.all.deleteConfirmation"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          delTodo({ dataIdList: ids, formKey: this.formKey }).then(response => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.queryTodoFormList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.publish-content {
  padding: 20px;
}

.auth-obj-tag {
  margin: 2px;
}
</style>
