<template>
  <div>
    <div
      class="overlay"
      v-if="showParticulars"
      @click="hideParticulars"
    ></div>
    <div>
      <div class="content-head">
        <div @click="skipHomepage">
          <el-icon class="content-head-back"><ele-Back /></el-icon>
        </div>
        <div class="content-head-title">{{ $t("form.msgCenter.myMsg") }}</div>
      </div>
      <div class="content-exhibition">
        <div class="content-exhibition-tab">
          <div class="content-exhibition-left">{{ $t("form.msgCenter.systemMsg") }}</div>
          <div class="content-exhibition-rig">
            <i
              class="exhibition-rig-brush"
              :style="{ backgroundImage: `url(${backgroundBrush})` }"
            ></i>
            <span @click="allRead()">
              {{ $t("form.msgCenter.settingRead") }}
            </span>
          </div>
        </div>
        <div class="content-exhibition-body">
          <div class="exhibition-body-tab">
            <span>{{ $t("form.msgCenter.content") }}</span>
            <span>{{ $t("form.msgCenter.time") }}</span>
          </div>
          <div
            class="exhibition-body-content"
            v-for="(item, index) in messageList"
            :key="index"
          >
            <div class="exhibition-body-title">
              <div
                class="red-dot"
                v-if="!item.readFlag"
              ></div>
              <div class="exhibition-body-left">{{ item.title }}</div>
              <div class="exhibition-body-rig">{{ item.sendTime }}</div>
              <div
                class="exhibition-body-check"
                @click="toggleParticulars(item)"
              >
                <el-icon class="icon"><ele-View /></el-icon>
              </div>
            </div>
          </div>
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="queryParams.current"
              v-model:page-size="queryParams.size"
              :page-sizes="[10, 20, 30, 40]"
              background
              layout="sizes,total, prev, pager, next, jumper"
              :total="queryParams.total"
              @current-change="getList"
            />
          </div>
          <div
            class="particulars"
            v-if="showParticulars"
          >
            <div class="particulars-content">
              <div class="particulars-content-header">
                <div class="particulars-content-title">{{ $t("form.msgCenter.detail") }}</div>
                <div
                  class="particulars-content-icn"
                  @click="hideParticulars"
                >
                  <el-icon><ele-Close /></el-icon>
                </div>
              </div>
              <div class="particulars-content-centre">
                <div class="particulars-content-text">
                  <div class="particulars-content-box">
                    <div class="particulars-content-wrp">
                      <span class="content-wrp-top">{{ selectedItem.title }}</span>
                      <div class="content-wrp-bottom">
                        <span>{{ selectedItem.priorityDesc }}</span>
                        <span>{{ selectedItem.sender }}</span>
                        <span>{{ selectedItem.sendTime }}</span>
                      </div>
                    </div>
                    <div
                      class="particulars-content-middle"
                      v-html="selectedItem.msgContent"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                class="particulars-content-floor"
                @click="hideParticulars"
              >
                <el-button plain>{{ $t("form.msgCenter.cancel") }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import backgroundBrush from "@/assets/images/form/brush.png";
import {
  getMyAnnouncementSend,
  Message,
  MessagePageRes,
  readAllAnnouncementSend,
  readAnnouncementSend
} from "@/api/system/announcement";
import { ReqPage, ResultData } from "@/api/baseRequest";
import { useRouter } from "vue-router";

const messageList = ref<Message[]>([]);
const selectedItem = reactive<Message>({
  title: "",
  sender: "",
  priorityDesc: "",
  msgContent: "",
  sendTime: ""
});

const queryParams: ReqPage = reactive({
  size: 10,
  total: 1,
  current: 1
});
const showParticulars = ref<boolean>(false);
const router = useRouter();

const skipHomepage = () => {
  router.push("/");
};

const getList = async () => {
  const res: ResultData<MessagePageRes> = await getMyAnnouncementSend(queryParams);
  messageList.value = res.data.records;
  queryParams.total = res.data.total;
};

const toggleParticulars = async (item: Message) => {
  if (item.anntId != null) {
    await readAnnouncementSend(item.anntId);
  }
  item.readFlag = true;
  selectedItem.title = item.title;
  selectedItem.sender = item.sender;
  selectedItem.priorityDesc = item.priorityDesc;
  selectedItem.msgContent = item.msgContent;
  selectedItem.sendTime = item.sendTime;
  showParticulars.value = true;
};
const allRead = () => {
  readAllAnnouncementSend().then(() => {
    messageList.value.forEach(item => {
      item.readFlag = true;
    });
  });
};

const hideParticulars = () => {
  showParticulars.value = false;
};
onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.content-head {
  width: 100%;
  position: sticky;
  top: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  .content-head-back {
    width: 26px;
    height: 16px;
    cursor: pointer;
    font-size: 25px;
    font-weight: bold;
    color: #707070;
  }
  .content-head-title {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: #484848;
  }
}
.content-exhibition {
  position: relative;
  min-width: 940px;
  width: 940px;
  background: #fff;
  margin: 20px auto 0;
  padding: 0 30px;
  display: flex;
  flex-direction: column;

  .content-exhibition-tab {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 18px;
    flex-shrink: 0;

    .content-exhibition-left {
      font-size: 14px;
      font-weight: bold;
      color: #484848;
    }

    .content-exhibition-rig {
      display: flex;
      align-items: center;
      cursor: pointer;

      span {
        font-size: 14px;
        color: #484848;
      }

      span:hover {
        color: var(--el-color-primary) !important;
      }
    }

    .exhibition-rig-brush {
      height: 25px;
      width: 25px;
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }

  .content-exhibition-body {
    display: flex;
    flex-direction: column;
  }

  .exhibition-body-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    background-color: #f5f6fa;
    padding: 0 200px 0 20px;
    border-radius: 8px;

    span {
      color: #aaa;
      font-weight: 400;
      font-size: 14px;
    }
  }
  .content-exhibition-body {
    flex: 1;
    .exhibition-body-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      color: #aaa;
      font-size: 14px;
      border-bottom: 1px solid #eaeaea;
      .red-dot {
        width: 8px;
        height: 8px;
        background-color: red;
        border-radius: 50%;
        margin-right: 10px;
      }
      .exhibition-body-left {
        width: 50%;
        padding-left: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .exhibition-body-rig {
        margin-left: 160px;
      }
      .exhibition-body-check {
        margin-right: 20px;
        width: 20px;
      }
    }
  }
  .demo-pagination-block {
    height: 26px;
    margin: 18px 0;
    display: flex;
    justify-content: flex-end;
  }
}
.particulars {
  position: absolute;
  top: 0;
  left: 7%;
  width: 800px;
  height: 750px;
  background-color: #fff;
  border-radius: 15px;
  z-index: 9999999;
  .particulars-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .particulars-content-header {
    height: 55px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    .particulars-content-title {
      color: #3d3d3d;
      font-size: 18px;
    }
    .particulars-content-icn {
      font-size: 18px;
      color: #3d3d3d;
      cursor: pointer;
    }
  }
  .particulars-content-centre {
    flex: 1;
    .particulars-content-text {
      height: 95%;
      margin: 15px;
      background-color: #fafafa;
    }
    .particulars-content-box {
      padding: 15px;
    }
    .particulars-content-wrp {
      display: flex;
      flex-direction: column;
      .content-wrp-top {
        font-size: 22px;
      }
      .content-wrp-bottom {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.3);
        margin-top: 10px;
        span:first-child {
          border: 1px solid #d9d9d9;
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          margin-right: 8px;
        }
        span:nth-child(2) {
          margin-right: 8px;
        }
      }
    }
    .particulars-content-middle {
      font-size: 16px;
      margin-top: 20px;
    }
  }
  .particulars-content-floor {
    height: 40px;
    margin: 0 20px 25px 0;
    display: flex;
    flex-direction: row-reverse;
  }
}
.exhibition-body-title:hover {
  background-color: #f9fafc;
}
.exhibition-body-check .icon {
  display: none;
}
.exhibition-body-title:hover .exhibition-body-check .icon {
  display: inline-block;
}
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.3s ease;
}
</style>
