<template>
  <div class="project-card-container">
    <div v-if="projectList.length">
      <el-row :gutter="50">
        <el-col
          v-for="p in projectList"
          :key="p.id"
          :span="4.5"
        >
          <!--    文件夹-->
          <el-card
            v-if="p.type == '3'"
            :body-style="{ padding: '0px', position: 'relative' }"
          >
            <div
              class="body"
              @click="$emit('enterFolder', p)"
            >
              <el-row
                align="middle"
                justify="center"
                type="flex"
                class="body-file"
              >
                <div class="body-file-picture">
                  <img
                    src="~@/assets/images/form/icon3.png"
                    class="folder-img"
                  />
                </div>
                <el-col
                  :span="12"
                  class="body-file-name"
                >
                  <el-tooltip
                    :content="p.textName"
                    placement="top"
                  >
                    <span class="body-file-title">
                      {{ p.textName }}
                    </span>
                  </el-tooltip>
                  <div class="card-time-div">
                    <span class="card-time">{{ $t("client.card.updateTime") }}：{{ formatDateFilter(p.createTime) }}</span>
                  </div>
                </el-col>
              </el-row>
              <div class="btns">
                <el-button
                  link
                  type="primary"
                  class="text"
                  @click.stop="$emit('renameFolder', p)"
                >
                  {{ $t("client.card.reName") }}
                </el-button>
                <el-popconfirm
                  :title="$t('client.card.delFolderText')"
                  @confirm="deleteForm(p.formKey)"
                >
                  <template #reference>
                    <el-button
                      class="text"
                      link
                      type="primary"
                      @click.stop="() => {}"
                    >
                      {{ $t("client.card.delete") }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-card>
          <!--		普通表单			-->
          <el-card
            v-else
            :body-style="{ padding: '0px', position: 'static' }"
            class="move"
          >
            <div class="body">
              <div class="body-form">
                <div class="body-form-picture">
                  <img
                    :src="getFormImageSrc(p)"
                    class="form-img"
                  />
                </div>
                <el-row
                  align="middle"
                  justify="center"
                  type="flex"
                  class="body-form-card"
                >
                  <el-col class="">
                    <span
                      @click="toProjectHandle(p, 'editor/index')"
                      class="title form-card-title"
                    >
                      {{ p.textName }}
                    </span>
                  </el-col>
                  <div
                    @click="toProjectHandle(p, 'editor/index')"
                    class="card-time-div"
                  >
                    <span class="card-time">{{ $t("client.card.createTime") }}：{{ formatDateFilter(p.createTime) }}</span>
                  </div>
                  <div
                    class="card-time-div"
                    @click="toProjectHandle(p, 'editor/index')"
                  >
                    <span class="card-time">{{ $t("client.card.createBy") }}：{{ p.createUserName }}</span>
                  </div>
                </el-row>
                <div class="status">
                  <span
                    class="status-name"
                    :style="tagStyleMap[p.status]"
                  >
                    {{ getFormStatusName(p.status).statusName }}
                  </span>
                  <span
                    @click="toProjectHandle(p, 'data')"
                    v-if="p.collectionCount"
                    class="count-to-data"
                  >
                    {{ p.collectionCount }} {{ $t("client.card.numText") }}
                  </span>
                </div>
              </div>
              <div class="btns">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="toProjectHandle(p, 'editor/index')"
                >
                  {{ $t("client.card.edit") }}
                </el-button>
                <el-button
                  link
                  type="success"
                  size="small"
                  @click="publishForm(p)"
                  v-if="p.status != 2"
                >
                  {{ $t("client.card.publish") }}
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  v-if="p.status == 2"
                  @click="stopProject(p.formKey)"
                >
                  {{ $t("client.card.stop") }}
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="toProjectHandle(p, 'data')"
                >
                  {{ $t("client.card.data") }}
                </el-button>
                <el-dropdown
                  trigger="hover"
                  :teleported="false"
                  @visible-change="
                    val => {
                      handleBtnShowIcon(p, val);
                    }
                  "
                >
                  <el-button
                    class="btns-more"
                    link
                    type="danger"
                    size="small"
                  >
                    <ele-ArrowDown
                      v-if="p.showBtn"
                      style="width: 1em; height: 1em"
                    />
                    <ele-MoreFilled
                      v-else
                      style="width: 1em; height: 1em"
                    />
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu class="btns-more-down">
                      <el-dropdown-item
                        v-if="p.status != 2"
                        @click="deleteFrom(p.formKey)"
                      >
                        {{ $t("client.card.delete") }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="toProjectHandle(p, 'statistics')">
                        {{ $t("client.card.statistics") }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="!type"
                        @click="
                          e => {
                            emit('move', p);
                          }
                        "
                      >
                        {{ $t("client.card.move") }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="handleCopyForm(p)"
                        size="small"
                      >
                        {{ $t("client.card.copy") }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <template v-else>
      <el-empty
        :image="EmptyPng"
        :description="$t('client.card.noData')"
      />
    </template>
  </div>
</template>

<script setup name="FormCardList">
import { useForm } from "./useFormHook";
import { ElMessageBox } from "element-plus";
import ordinary from "@/assets/images/form/ordinary.png";
import exam from "@/assets/images/form/exam.png";
import flow from "@/assets/images/form/flow.png";
// import EmptyPng from "@/assets/images/form/empty.png";
import { i18n } from "@/i18n";

const emit = defineEmits(["enterFolder", "renameFolder", "move", "refresh"]);
const {
  projectStatusList,
  logicDeleteForm,
  formatDateFilter,
  toProjectHandle,
  handleCopyForm,
  stopProject,
  publishForm,
  deleteForm
} = useForm(emit);

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

const getFormImageSrc = p => {
  const Picturesque = p.type;
  if (Picturesque === 1) {
    return ordinary;
  } else if (Picturesque === 4) {
    return exam;
  } else if (Picturesque === 2) {
    return flow;
  }
};

const handleBtnShowIcon = (p, show) => {
  p.showBtn = show;
};

const getFormStatusName = code => {
  let name = projectStatusList.find(item => item.code == code).name;
  let statusColor = projectStatusList.find(item => item.code == code).color;
  return {
    statusName: name,
    color: statusColor
  };
};

const tagStyleMap = {
  1: {
    color: "#2754F5",
    backgroundColor: "#EEF3FE"
  },
  2: {
    color: "#439769",
    backgroundColor: "#EDF8F4"
  },
  3: {
    color: "#79808B",
    backgroundColor: "#F2F3F8"
  }
};

const deleteFrom = key => {
  ElMessageBox.confirm(i18n.global.t("client.card.isDelete"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    cancelButtonText: i18n.global.t("formI18n.all.cancel"),
    type: "warning"
  })
    .then(() => {
      logicDeleteForm(key);
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
.project-card-container {
  margin: 20px auto;

  .el-card {
    border-radius: 4px;
    width: 270px;
    height: 170px;
    box-shadow: none;
    border: none;
    .body {
      width: 305px;
      height: 170px;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }

    .body-file {
      display: flex;
    }

    .body-form {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }

  .body-form:hover {
    .form-card-title {
      color: var(--el-color-primary);
    }
    .card-time {
      color: var(--el-color-primary);
    }
    .body-form-picture {
      width: 53px;
      height: 53px;
      border-radius: 15px;
      background: #f2f3f8;
      display: flex;
      justify-content: center;
      align-items: center;

      .form-img {
        transition: all 0.1s ease-out;
        width: 38px;
        height: 38px;
        display: inline-block;
      }
    }
  }

  .body-file:hover {
    cursor: pointer;
    .body-file-title {
      color: var(--el-color-primary);
    }
    .card-time {
      color: var(--el-color-primary);
    }
    .folder-img {
      transition: all 0.1s ease-out;
      width: 58px;
      height: 58px;
    }
  }

  .el-col {
    margin-bottom: 10px;
    text-align: left;

    .form-type {
      color: white;
      font-size: 11px;
      padding: 3px 5px;
      border-radius: 5px;
    }

    .status {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .status-name {
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0em;
      text-align: center;
      padding: 2px;
      width: 55px;
      height: 18px;
      background-color: #ccc;
      border-radius: 9px;
      margin-bottom: 5px;
      line-height: 14px;
    }

    .title {
      color: rgb(68, 66, 66);
      font-size: 16px;
      text-align: left;
      font-weight: 500;
      margin-left: 10px;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      max-width: 100%;
      line-height: 27px;
      vertical-align: bottom;
    }

    .card-time {
      color: rgba(144, 147, 153, 100);
      text-align: center;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      color: #848484;
    }

    .time {
      color: rgba(144, 147, 153, 100);
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      margin: 0;
    }

    img {
      width: 143px;
      height: 121px;
    }

    .body-file-picture {
      width: 55px;
      height: 55px;
      background: #f8f8f8;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .folder-img {
      width: 62px;
      height: 53px;
      display: inline-block;
    }

    .body-form-picture {
      width: 53px;
      height: 53px;
      border-radius: 15px;
      background: #f2f3f8;
      display: flex;
      justify-content: center;
      align-items: center;

      .form-img {
        width: 35px;
        height: 35px;
        display: inline-block;
      }
    }

    .body-form-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .form-card-title {
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0em;
      color: #3d3d3d;
      margin-left: 0;
      width: 115px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .form-card-title:hover {
      color: var(--el-color-primary);
    }

    .count-to-data:hover {
      color: var(--el-color-primary);
    }

    .body-file-name {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
    }

    .body-file-title {
      font-size: 16px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0em;
      color: #3d3d3d;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .folder-img + .time {
      margin-top: 20px;
    }

    .el-button--medium {
      margin-left: 5px !important;
    }

    .split-div {
      width: 100%;
      height: 1px;
      border-top: 1px var(--el-border-color) var(--el-border-style);
      margin: 10px 0;
    }

    .btns {
      color: rgba(144, 147, 153, 100);
      text-align: center;
      display: flex;
      justify-content: space-around;

      .el-button {
        width: 52px;
        height: 35px;
        border-radius: 8px;
        background: #f2f3f8;
        font-size: 12px;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0em;
        color: #79808b;
      }
    }

    .btns:hover {
      text-align: center;
      display: flex;
      justify-content: space-around;
    }

    .el-button:hover {
      cursor: pointer;
      width: 52px;
      height: 35px;
      border-radius: 13px;
      background: #f2f3f8;
      font-size: 12px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0em;
      color: #4c4edb;
      background-color: #eef3fe;
      transition-duration: 0.3s;
    }

    .btns-more-down {
      :deep(.el-dropdown-menu__item) {
        font-size: 12px;
      }
    }

    :deep(.el-card) {
      border-radius: 10px !important;
      overflow: visible !important;
    }

    :deep(.el-button + .el-button) {
      margin-left: 5px !important;
    }
  }
}
</style>
