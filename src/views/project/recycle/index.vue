<template>
  <div class="rc-bin-container">
    <div
      v-if="projectList && projectList.length > 0"
      class="width-full"
    >
      <el-table
        :data="projectList"
        border
        :empty-text="$t('project.recycle.noData')"
        highlight-current-row
        stripe
        style="width: 100%"
      >
        <el-table-column
          align="center"
          :label="$t('project.recycle.title')"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          :label="$t('project.recycle.count')"
          prop="resultCount"
        />
        <el-table-column
          align="center"
          :label="$t('project.recycle.createTime')"
          prop="createTime"
        />
        <el-table-column
          align="center"
          :label="$t('project.recycle.deleteTime')"
          prop="updateTime"
        />
        <el-table-column
          align="center"
          :label="$t('project.recycle.operate')"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="restoreProject(scope.row.key, 1)"
            >
              {{ $t("project.recycle.reload") }}
            </el-button>
            <el-popconfirm
              :title="$t('project.recycle.delText')"
              @confirm="deleteProject(scope.row.key)"
            >
              <template #reference>
                <el-button
                  link
                  type="danger"
                >
                  {{ $t("project.recycle.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="project-page-view">
        <el-pagination
          v-if="total > 10"
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :total="total"
          background
          layout="total, prev, pager, next"
          @current-change="queryRecycleProjectPage"
        />
      </div>
    </div>
    <el-empty
      v-else
      :description="$t('formI18n.all.nodata')"
    />
  </div>
</template>

<script>
import { deleteRecycleFormRequest, listRecycleFormRequest, restoreRecycleFormRequest } from "../../../api/project/form";

export default {
  name: "RecycleBin",
  data() {
    return {
      total: 0,
      queryParams: {
        current: 1,
        size: 10,
        name: "",
        beginDateTime: null,
        endDateTime: null,
        status: null
      },
      projectList: [],
      projectListLoading: true
    };
  },
  computed: {},
  created() {
    this.queryRecycleProjectPage();
  },
  methods: {
    restoreProject(key) {
      restoreRecycleFormRequest({ formKey: key }).then(res => {
        if (res.data) {
          this.msgSuccess("恢复成功");
          this.queryRecycleProjectPage();
        }
      });
    },
    deleteProject(key) {
      deleteRecycleFormRequest({ formKey: key }).then(res => {
        if (res.data) {
          this.msgSuccess("刪除成功");
          this.queryRecycleProjectPage();
        }
      });
    },
    queryRecycleProjectPage() {
      listRecycleFormRequest(this.queryParams).then(res => {
        let { records, total, size } = res.data;
        this.projectList = records;
        this.total = total;
        this.queryParams.size = size;
        this.projectListLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rc-bin-container {
  //display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  //flex-direction: column;
  //align-items: center;
  //align-content: center;
}

.back-view {
  display: flex;
  width: 80%;
  align-content: flex-start;
  margin: 10px;
}

.project-page-view {
  margin-top: 30px;
}
</style>
