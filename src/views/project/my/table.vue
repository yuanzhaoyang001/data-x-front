<template>
  <div class="project-table-view">
    <el-table
      :data="projectList"
      border
      :empty-text="$t('client.table.noData')"
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick"
    >
      <el-table-column
        align="center"
        width="300"
        :label="$t('client.table.title')"
        prop="name"
      >
        <template #default="scope">
          <i
            v-if="scope.row.type == '3'"
            class="iconfont icon-wenjianjia"
            style="margin-left: 30px"
          />
          <span class="pl10 one-text-overflow">
            {{ scope.row.textName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        :label="$t('client.table.status')"
      >
        <template #default="scope">
          <span v-if="scope.row.type == '3'" />
          <span
            v-for="status in projectStatusList"
            :key="status.code"
            v-else
          >
            <span v-if="status.code == scope.row.status">
              {{ status.name }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('client.table.formType')"
        width="100"
      >
        <template #default="scope">
          <span v-if="scope.row.type == '3'">{{ $t("client.table.folder") }}</span>
          <span v-else>
            <span>
              {{ getType(scope.row.type).name }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('client.table.createTime')"
        prop="createTime"
      />
      <el-table-column
        align="center"
        :label="$t('client.table.updateTime')"
        prop="updateTime"
      />
      <el-table-column
        align="center"
        v-if="type"
        :label="$t('client.table.createUser')"
        prop="createUserName"
      />
      <el-table-column
        width="200"
        align="center"
        :label="$t('client.table.operate')"
      >
        <template #default="scope">
          <div v-if="scope.row.type == '3'">
            <el-button
              link
              type="primary"
              @click.stop="$emit('renameFolder', scope.row)"
            >
              <el-icon>
                <ele-Edit />
              </el-icon>
              {{ $t("client.table.reName") }}
            </el-button>
            <span
              @click="
                e => {
                  e.stopPropagation();
                }
              "
            >
              <el-popconfirm
                :title="$t('client.table.delFolderText')"
                @confirm="deleteForm(scope.row.formKey)"
              >
                <template #reference>
                  <el-button
                    class="text-danger"
                    link
                    type="primary"
                  >
                    <el-icon>
                      <ele-Delete />
                    </el-icon>
                    {{ $t("client.table.delete") }}
                  </el-button>
                </template>
              </el-popconfirm>
            </span>
          </div>
          <div
            v-else
            class="op-btns"
          >
            <el-button
              link
              type="primary"
              @click="toProjectHandle(scope.row, 'editor/index')"
            >
              {{ $t("client.table.edit") }}
            </el-button>
            <span />
            <el-popconfirm
              v-if="scope.row.status == 2"
              :title="$t('client.table.stopText')"
              @confirm="stopProject(scope.row.formKey)"
            >
              <template #reference>
                <el-button
                  class="text-danger"
                  style="margin-left: 5px"
                  link
                  type="primary"
                >
                  {{ $t("client.table.stop") }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="scope.row.status != 2"
              :title="$t('client.table.delForm')"
              @confirm="logicDeleteForm(scope.row.formKey)"
            >
              <template #reference>
                <el-button
                  style="margin-left: 5px"
                  link
                  type="danger"
                >
                  {{ $t("client.table.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-dropdown
              trigger="click"
              placement="top"
            >
              <el-button
                link
                type="primary"
              >
                <el-icon class="el-icon--right">
                  <ele-ArrowDown />
                </el-icon>
                {{ $t("client.table.more") }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="scope.row.status != 1"
                    icon="ele-DataAnalysis"
                    @click="toProjectHandle(scope.row, 'statistics')"
                  >
                    {{ $t("client.table.statistics") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="!type"
                    icon="ele-Position"
                    @click="
                      () => {
                        $emit('move', scope.row);
                      }
                    "
                  >
                    {{ $t("client.table.move") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="!type"
                    icon="ele-DocumentCopy"
                    @click="handleCopyForm(scope.row)"
                  >
                    {{ $t("client.table.copy") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="MyFormTable">
import { useForm } from "@/views/project/my/useFormHook";

const emit = defineEmits(["enterFolder", "renameFolder", "move", "refresh"]);
const { projectStatusList, getType, logicDeleteForm, toProjectHandle, handleCopyForm, stopProject, deleteForm } = useForm(emit);

defineProps({
  projectList: {
    type: Array,
    default: () => {
      return [];
    }
  },
  // 我的表单页还是协作页区分 默认为表单页 协作页某些内容不显示
  type: {
    type: String,
    default: ""
  }
});

const handleRowClick = (row: any) => {
  if (row.type == 3) {
    emit("enterFolder", row);
  }
};
</script>

<style scoped>
.project-table-view {
  margin-top: 20px;
  width: 100%;
}

.icon-wenjianjia {
  color: var(--el-color-primary);
}

.el-table tr {
  cursor: pointer;
}

.op-btns {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
}
</style>
