<template>
  <el-drawer
    :title="$t('form.replyDrawer.title')"
    size="100%"
    v-model="drawer"
    direction="btt"
  >
    <el-scrollbar class="scrollbar">
      <div
        v-for="(re, index) in replyList"
        :key="re.id"
      >
        <div class="message-card">
          <div>
            <el-tag effect="plain">
              {{ re.nickName }}
            </el-tag>
            <el-tag
              v-if="'匿名用户' == re.nickName"
              effect="plain"
              type="info"
            >
              {{ re.nickName }}
            </el-tag>
            <el-tag
              v-if="0 == index"
              effect="plain"
              type="success"
              style="margin-left: 5px"
            >
              {{ $t("form.replyDrawer.newestReply") }}
            </el-tag>
          </div>
          <span class="time">{{ $t("form.replyDrawer.time") }}：{{ re.createTime }}</span>
          <el-divider />
          <div class="content">
            {{ re.content }}
          </div>
        </div>
      </div>
      <el-empty
        v-if="replyList.length == 0"
        :description="$t('formI18n.all.nodata')"
      ></el-empty>
    </el-scrollbar>
    <el-row
      :gutter="20"
      type="flex"
      class="row-bg"
      justify="center"
    >
      <el-col
        :xs="14"
        :sm="14"
        :md="14"
        :lg="12"
        :xl="14"
      >
        <el-input v-model="content" />
      </el-col>
      <el-col
        :xs="6"
        :sm="6"
        :md="6"
        :lg="4"
        :xl="4"
      >
        <el-button
          type="primary"
          @click="saveReply"
          class="button"
        >
          {{ $t("form.replyDrawer.replyButton") }}
        </el-button>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import { listReplyRequest, saveReplyRequest } from "../../../api/project/data";
import { i18n } from "@/i18n";

export default {
  name: "ReplyDrawer",
  props: {
    formKey: {
      type: String,
      default: ""
    },
    dataId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      replyList: [],
      content: "",
      drawer: false
    };
  },
  methods: {
    open() {
      this.drawer = true;
      this.getReplyList();
    },
    getReplyList() {
      listReplyRequest({ formKey: this.formKey, dataId: this.dataId }).then(res => {
        this.replyList = res.data;
      });
    },
    saveReply() {
      if (!this.content) {
        this.msgError(i18n.global.t("form.replyDrawer.enterReplyContent"));
        return;
      }
      let data = {
        formKey: this.formKey,
        dataId: this.dataId,
        content: this.content
      };
      saveReplyRequest(data).then(res => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.content = "";
        this.getReplyList();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.reply-row:first-child {
  margin-top: 10px;
}

.message-card {
  margin: 20px 200px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}

.button {
  width: 100%;
}

.row-bg {
  margin-top: 20px;
}

.time {
  color: #828999;
  display: inline-block;
  margin-top: 10px;
}

.scrollbar {
  background-color: #f2f6fc;
  height: 85%;
}

.reply-row {
  font-size: 14px;

  .name {
    padding-left: 20px;
  }

  .content {
    margin-top: 10px;
    line-height: 20px;
    padding-left: 20px;
  }
}

@media only screen and (max-width: 600px) {
  .message-card {
    margin: 20px;
  }
}
</style>
