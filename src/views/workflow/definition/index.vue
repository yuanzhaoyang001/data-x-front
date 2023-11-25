<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="88px"
    >
      <el-form-item
        label="流程KEY"
        prop="key"
      >
        <el-input
          v-model="queryParams.key"
          clearable
          placeholder="请输入流程KEY"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          clearable
          placeholder="请输入名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:modeler']"
          icon="ele-Plus"
          type="primary"
          @click="handleImport"
        >
          部署流程
        </el-button>
      </el-col>

      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
    >
      <el-table-column
        align="center"
        label="流程ID"
        prop="id"
      />
      <el-table-column
        align="center"
        label="流程KEY"
        prop="key"
      />
      <el-table-column
        align="center"
        label="流程名称"
        prop="name"
      />
      <el-table-column
        label="流程版本"
        align="center"
      >
        <template #default="scope">
          <el-tag>v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="部署时间"
        prop="deploymentTime"
      />
      <el-table-column
        align="center"
        label="部署ID"
        prop="deploymentId"
      />

      <el-table-column
        label="状态"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.suspendState === 1"
            type="success"
          >
            激活
          </el-tag>
          <el-tag
            v-if="scope.row.suspendState === 2"
            type="warning"
          >
            挂起
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
      >
        <template #default="scope">
          <el-button
            v-hasPermi="['workflow:modeler']"
            icon="ele-Edit"
            link
            type="primary"
            @click="onlineModificationProcess(scope.row)"
          >
            查看
          </el-button>
          <el-button
            v-hasPermi="['workflow:modeler']"
            icon="ele-Edit"
            link
            type="primary"
            @click="suspendOrActiveApply(scope.row)"
          >
            {{ scope.row.suspendState == 1 ? "挂起" : "激活" }}
          </el-button>

          <el-button
            v-hasPermi="['workflow:modeler']"
            icon="ele-Delete"
            link
            type="primary"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      :total="total"
      @pagination="getList"
    />

    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      append-to-body
      width="400px"
    >
      <el-upload
        ref="upload"
        :action="upload.url"
        :auto-upload="false"
        :disabled="upload.isUploading"
        :headers="upload.headers"
        :limit="1"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        accept=".bpmn, .bar, .zip"
        drag
      >
        <el-icon>
          <ele-Upload />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div
            class="el-upload__tip"
            style="color: red"
          >
            提示：仅允许导入“bpmn”、“bar”或“zip”格式文件！
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitFileForm"
          >
            确 定
          </el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { delDefinition, listDefinition, suspendOrActiveApply } from "@/api/workflow/definition";
import { baseUrl, getToken } from "@/utils/auth";

export default {
  name: "ProcessDefinition",
  components: {},
  data() {
    return {
      modelVisible: false,
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // VIEW表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      src: "",
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        id: null,
        rev: null,
        name: null,
        type: null
      },
      deployId: null,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: baseUrl + "/process/definition/deployment"
      }
    };
  },
  created() {
    this.getList();
    //开放一个窗口控制函数
    window["setModelVisible"] = val => {
      this.modelVisible = val;
      if (this.modelVisible === false) {
        this.handleQuery();
      }
    };
  },
  methods: {
    /** 查询Definition列表 */
    getList() {
      this.loading = true;
      listDefinition(this.queryParams).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    suspendOrActiveApply(row) {
      let suspendOrActive = row.suspendState === "2" ? "激活" : "挂起";
      this.$confirm("确认要" + suspendOrActive + "流程定义吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          let data = { id: row.id, suspendState: row.suspendState };
          return suspendOrActiveApply(data);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("转换成功");
        })
        .catch(function () {});
    },
    handleImport() {
      this.upload.title = "上传模型图";
      this.upload.open = true;
    },
    onlineDrawingProcess() {
      this.modelVisible = true;
    },
    onlineModificationProcess(data) {
      this.modelVisible = true;
      this.deployId = data.deploymentId;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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
      this.msgSuccess("部署成功");
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除编号为"' + row.key + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delDefinition(row.deploymentId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    modelCancel() {
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  height: 100%;
  max-height: 100% !important;
}
</style>
