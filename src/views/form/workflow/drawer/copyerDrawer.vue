<template>
  <el-drawer
    :append-to-body="true"
    title="抄送人设置"
    v-model="copyerDrawer"
    direction="rtl"
    class="set_copyer"
    size="550px"
    :before-close="saveCopyer"
  >
    <div class="demo-drawer__content">
      <div class="copyer_content drawer_content">
        <el-button
          type="primary"
          @click="addCopyer"
        >
          添加成员
        </el-button>
        <p class="selected_list">
          <span
            v-for="(item, index) in copyerConfig.nodeUserList"
            :key="index"
          >
            {{ item.nickName }}
            <el-icon><ele-Close /></el-icon>
          </span>
          <a
            v-if="copyerConfig.nodeUserList && copyerConfig.nodeUserList.length != 0"
            @click="copyerConfig.nodeUserList = []"
          >
            清除
          </a>
        </p>
        <!--        <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">-->
        <!--          <el-checkbox :label="1">-->
        <!--            允许发起人自选抄送人-->
        <!--          </el-checkbox>-->
        <!--        </el-checkbox-group>-->
      </div>
      <div class="demo-drawer__footer clear">
        <el-button
          type="primary"
          @click="saveCopyer"
        >
          确 定
        </el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
      <employees-dialog
        v-model:data="checkedList"
        v-model:visible="copyerVisible"
        @change="sureCopyer"
      />
    </div>
  </el-drawer>
</template>

<script>
import employeesDialog from "../dialog/employeesDialog.vue";
import func from "../preload";
import { mapActions, mapState, mapStores } from "pinia";
import { useFormWorkflow } from "@/stores/formWorkflow";

export default {
  name: "CopyerDrawer",
  components: {
    employeesDialog
  },
  data() {
    return {
      func: func,
      copyerConfig: {},
      ccSelfSelectFlag: [],
      copyerVisible: false,
      checkedList: []
    };
  },
  computed: {
    ...mapStores(useFormWorkflow),
    ...mapState(useFormWorkflow, ["copyerDrawer"]),
    copyerConfig1() {
      return this.formWorkflowStore.copyerConfig;
    }
  },
  watch: {
    copyerConfig1(val) {
      this.copyerConfig = val.value;
      this.ccSelfSelectFlag = this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag];
    }
  },
  methods: {
    ...mapActions(useFormWorkflow, ["updateCopyer", "updateCopyerConfig"]),
    addCopyer() {
      this.copyerVisible = true;
      this.checkedList = this.copyerConfig.nodeUserList || [];
    },
    sureCopyer(data) {
      this.copyerConfig.nodeUserList = data;
      this.copyerVisible = false;
    },
    saveCopyer() {
      this.copyerConfig.ccSelfSelectFlag = this.ccSelfSelectFlag.length == 0 ? 0 : 1;
      this.copyerConfig.error = !func.copyerStr(this.copyerConfig);
      this.updateCopyerConfig({
        value: this.copyerConfig,
        flag: true,
        id: this.copyerConfig1.id
      });
      this.closeDrawer();
    },
    closeDrawer() {
      this.updateCopyer();
    }
  }
};
</script>

<style lang="scss">
.set_copyer {
  .copyer_content {
    padding: 20px 20px 0;

    .el-button {
      margin-bottom: 20px;
    }

    .el-checkbox {
      margin-bottom: 20px;
    }
  }
}
</style>
