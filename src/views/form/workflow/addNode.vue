<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover
        placement="right-start"
        width="290px"
        v-model:visible="visible"
      >
        <div class="add-node-popover-body">
          <a
            class="add-node-popover-item approver"
            @click="addType(1)"
          >
            <div class="item-wrapper">
              <i class="iconfont icon-shenpi" />
            </div>
            <p>{{ $t("workflow.flowDesign.originator") }}</p>
          </a>
          <a
            class="add-node-popover-item notifier"
            @click="addType(2)"
          >
            <div class="item-wrapper">
              <i class="iconfont icon-chaosong" />
            </div>
            <p>{{ $t("workflow.flowDesign.ccTo") }}</p>
          </a>
          <a
            class="add-node-popover-item condition"
            @click="addType(4)"
          >
            <div class="item-wrapper">
              <i class="iconfont icon-liucheng1" />
            </div>
            <p>{{ $t("workflow.flowDesign.addBranch") }}</p>
          </a>
        </div>
        <template #reference>
          <button
            class="btn"
            type="button"
          >
            <el-icon color="#FFFFFF">
              <ele-Plus />
            </el-icon>
          </button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { generateId } from "@/utils";
import { i18n } from "@/i18n";

export default {
  props: ["nextNodeP"],
  emits: ["update:nextNodeP"],
  data() {
    return {
      visible: false
    };
  },
  methods: {
    addType(type) {
      let id = generateId();
      this.visible = false;
      if (type != 4) {
        let data;
        if (type == 1) {
          data = {
            nodeName: i18n.global.t("workflow.flowDesign.reviewed"),
            jobType: "user-" + id,
            type: 1,
            nodeUserList: [],
            nodeRoleList: [],
            nodePostList: [],
            taskEvents: {
              agree: false,
              agreeNotifyUrl: "",
              reject: false,
              rejectNotifyUrl: ""
            },
            nodeType: "userTask",
            nextNode: this.nextNodeP
          };
        } else if (type == 2) {
          data = {
            id: "copyer-" + id,
            nodeName: i18n.global.t("workflow.flowDesign.ccTo"),
            nodeType: "serviceTask",
            type: 2,
            bizType: "1",
            nodeUserList: [],
            nextNode: this.nextNodeP
          };
        } else {
          data = {
            nodeName: "",
            type: 10,
            id: "parallel-" + id,
            nodeType: "parallelGateway",
            branchNodes: [
              {
                nodeName: i18n.global.t("workflow.flowDesign.branch1"),
                type: 7,
                conditionList: [],
                nextNode: this.nextNodeP
              },
              {
                nodeName: i18n.global.t("workflow.flowDesign.offshoot"),
                type: 7,
                conditionList: [],
                nextNode: null
              }
            ],
            nextNode: {
              nodeName: "",
              type: -1,
              nodeType: "parallelGateway",
              nextNode: this.nextNodeP
            }
          };
        }
        this.$emit("update:nextNodeP", data);
      } else {
        this.$emit("update:nextNodeP", {
          nodeName: "",
          type: 4,
          nodeType: "exclusiveGateway",
          nextNode: this.nextNodeP,
          branchNodes: [
            {
              nodeName: i18n.global.t("workflow.flowDesign.branch1"),
              type: 7,
              conditionList: [], // 条件表达式
              nextNode: null
            },
            {
              nodeName: i18n.global.t("workflow.flowDesign.branch2"),
              type: 7,
              conditionList: [],
              nextNode: null
            }
          ]
        });
      }
    }
  }
};
</script>
