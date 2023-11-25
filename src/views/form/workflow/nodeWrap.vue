<template>
  <div>
    <!--    审批人节点-->
    <div
      v-if="processNode.type != 4 && processNode.type != 10 && processNode.type != 11 && processNode.type != -1"
      class="node-wrap"
    >
      <div class="node-wrap-box">
        <div>
          <div
            :style="'background: rgb(' + ['87, 106, 149', '255, 148, 62', '50, 150, 250'][processNode.type] + ');'"
            class="title"
          >
            <el-icon>
              <ele-User />
            </el-icon>
            <span v-if="processNode.type == 0">{{ processNode.nodeName }}</span>
            <input
              v-if="processNode.type != 0 && isInput"
              v-model="processNode.nodeName"
              v-focus
              :placeholder="placeholderList[processNode.type]"
              class="editable-title-input"
              @blur="blurEvent()"
              @focus="$event.currentTarget.select()"
            />
            <span
              v-if="processNode.type != 0 && !isInput"
              class="editable-title"
              @click="clickEvent()"
            >
              {{ processNode.nodeName }}
            </span>
            <el-icon
              class="icon close"
              @click="delNode()"
            >
              <ele-Close />
            </el-icon>
          </div>
          <div
            class="content"
            @click="setPerson"
          >
            <div
              v-if="processNode.type == 0"
              class="text"
            >
              {{ $t("workflow.flowDesign.allUser") }}
            </div>
            <div
              v-if="processNode.type == 1"
              class="text"
            >
              <span
                v-if="!func.setApproverStr(processNode)"
                class="placeholder"
              >
                {{ $t("workflow.flowDesign.choose") }}{{ placeholderList[processNode.type] }}
              </span>
              {{ func.setApproverStr(processNode) }}
            </div>
            <div
              v-if="processNode.type == 2"
              class="text"
            >
              <span
                v-if="!func.copyerStr(processNode)"
                class="placeholder"
              >
                {{ $t("workflow.flowDesign.choose") }}{{ placeholderList[processNode.type] }}
              </span>
              {{ func.copyerStr(processNode) }}
            </div>
            <el-icon class="arrow">
              <ele-ArrowRight />
            </el-icon>
          </div>
          <div
            v-if="isTried && processNode.error"
            class="error_tip"
          >
            <el-icon
              style="color: rgb(242, 86, 67)"
              @click="delNode()"
            >
              <ele-Close />
            </el-icon>
          </div>
        </div>
      </div>

      <addNode v-model:next-node-p="processNode.nextNode" />
    </div>

    <!--		条件节点-->
    <div
      v-if="processNode.type == 4"
      class="branch-wrap"
    >
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button
            class="add-branch"
            @click="addTerm"
          >
            {{ $t("workflow.flowDesign.addBranch") }}
          </button>
          <div
            v-for="(item, index) in processNode.branchNodes"
            :key="index"
            class="col-box"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div
                  :class="isTried && item.error ? 'error active' : ''"
                  class="auto-judge"
                >
                  <div
                    v-if="index != 0"
                    class="sort-left"
                    @click="arrTransfer(index, -1)"
                  >
                    &lt;
                  </div>
                  <div class="title-wrapper">
                    <input
                      v-if="isInputList[index]"
                      v-model="item.nodeName"
                      v-focus
                      class="editable-title-input"
                      @blur="blurEvent(index)"
                      @focus="$event.currentTarget.select()"
                    />
                    <span
                      v-if="!isInputList[index]"
                      class="editable-title"
                      @click="clickEvent(index)"
                    >
                      {{ item.nodeName }}
                    </span>
                    <span
                      class="priority-title"
                      @click="setPerson(index)"
                    >
                      {{ $t("workflow.flowDesign.branch") }}
                    </span>
                    <el-icon
                      class="icon close"
                      @click="delNode()"
                    >
                      <ele-Close />
                    </el-icon>
                  </div>
                  <div
                    v-if="index != processNode.branchNodes.length - 1"
                    class="sort-right"
                    @click="arrTransfer(index)"
                  >
                    &gt;
                  </div>
                  <div
                    class="content"
                    @click="setPerson(index)"
                  >
                    {{ func.conditionStr(item, index) }}
                  </div>
                  <div
                    v-if="isTried && item.error"
                    class="error_tip"
                  >
                    <i
                      class="anticon anticon-exclamation-circle"
                      style="color: rgb(242, 86, 67)"
                    />
                  </div>
                </div>
                <addNode v-model:next-node-p="item.nextNode" />
              </div>
            </div>
            <nodeWrap
              v-if="item.nextNode && item.nextNode && item.type !== -1"
              :is-tried="isTried"
              v-model:process-node="item.nextNode"
            />
            <div
              v-if="index == 0"
              class="top-left-cover-line"
            />
            <div
              v-if="index == 0"
              class="bottom-left-cover-line"
            />
            <div
              v-if="index == processNode.branchNodes.length - 1"
              class="top-right-cover-line"
            />
            <div
              v-if="index == processNode.branchNodes.length - 1"
              class="bottom-right-cover-line"
            />
          </div>
        </div>
        <addNode v-model:next-node-p="processNode.nextNode" />
      </div>
    </div>

    <nodeWrap
      v-if="processNode.nextNode && processNode.nextNode"
      :is-tried="isTried"
      v-model:process-node="processNode.nextNode"
    />
  </div>
</template>

<script>
import addNode from "./addNode.vue";
import func from "./preload";
import { useFormWorkflow } from "@/stores/formWorkflow";
import { mapActions, mapState } from "pinia";
import { generateId } from "@/utils";
import { i18n } from "@/i18n";

const focus = {
  mounted: el => el.focus()
};

export default {
  name: "NodeWrap",
  components: {
    addNode
  },
  directives: {
    focus
  },
  props: ["processNode", "isTried"],
  data() {
    return {
      nodeId: generateId(),
      func: func,
      placeholderList: [
        i18n.global.t("workflow.flowDesign.originator"),
        i18n.global.t("workflow.flowDesign.reviewed"),
        i18n.global.t("workflow.flowDesign.ccTo")
      ],
      isInputList: [],
      isInput: false
    };
  },
  computed: {
    ...mapState(useFormWorkflow, ["approverConfig", "copyerConfig", "conditionsConfig"]),
    approverConfig1() {
      return this.approverConfig;
    },
    copyerConfig1() {
      return this.copyerConfig;
    },
    conditionsConfig1() {
      return this.conditionsConfig;
    }
  },
  watch: {
    approverConfig1(data) {
      if (data.flag && data.id === this.nodeId) {
        this.$emit("update:processNode", data.value);
      }
    },
    copyerConfig1(data) {
      if (data.flag && data.id === this.nodeId) {
        this.$emit("update:processNode", data.value);
      }
    },
    conditionsConfig1(data) {
      if (data.flag && data.id === this.nodeId) {
        this.$emit("update:processNode", data.value);
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(useFormWorkflow, [
      "updateApprover",
      "updateCopyer",
      "updateCondition",
      "updateApproverConfig",
      "updateCopyerConfig",
      "updateConditionsConfig"
    ]),
    clickEvent(index) {
      if (index || index === 0) {
        this.isInputList[index] = true;
      } else {
        this.isInput = true;
      }
    },
    blurEvent(index) {
      if (index || index === 0) {
        this.isInputList[index] = false;
        this.processNode.branchNodes[index].nodeName = this.processNode.branchNodes[index].nodeName
          ? this.processNode.branchNodes[index].nodeName
          : i18n.global.t("workflow.flowDesign.branch");
      } else {
        this.isInput = false;
        this.processNode.nodeName = this.processNode.nodeName
          ? this.processNode.nodeName
          : this.placeholderList[this.processNode.type];
      }
    },
    delNode() {
      this.$emit("update:processNode", this.processNode.nextNode);
    },
    addTerm() {
      let len = this.processNode.branchNodes.length + 1;
      this.processNode.branchNodes.push({
        nodeName: i18n.global.t("workflow.flowDesign.branch") + len,
        type: 3,
        nextNode: null
      });
      this.$emit("update:processNode", this.processNode);
    },
    delTerm(index) {
      this.processNode.branchNodes.splice(index, 1);
      this.processNode.branchNodes.map((item, index) => {
        item.priorityLevel = index + 1;
        item.nodeName = i18n.global.t("workflow.flowDesign.branch") + `${index + 1}`;
      });
      this.$emit("update:processNode", this.processNode);
      if (this.processNode.branchNodes.length == 1) {
        if (this.processNode.nextNode) {
          if (this.processNode.branchNodes[0].nextNode) {
            this.reData(this.processNode.branchNodes[0].nextNode, this.processNode.nextNode);
          } else {
            this.processNode.branchNodes[0].nextNode = this.processNode.nextNode;
          }
        }
        this.$emit("update:processNode", this.processNode.branchNodes[0].nextNode);
      }
    },
    reData(data, addData) {
      if (!data.nextNode) {
        data.nextNode = addData;
      } else {
        this.reData(data.nextNode, addData);
      }
    },
    setPerson(index) {
      //  每个Vue实例都会有一个递增的id,可以通过this._uid获取
      let { type } = this.processNode;
      // 审核人
      if (type === 1) {
        this.updateApprover();
        this.updateApproverConfig({
          value: {
            ...JSON.parse(JSON.stringify(this.processNode)),
            ...{
              settype: this.processNode.settype ? this.processNode.settype : 1
            }
          },
          flag: false,
          id: this.nodeId
        });
      } else if (type === 2) {
        this.updateCopyer();
        this.updateCopyerConfig({
          value: JSON.parse(JSON.stringify(this.processNode)),
          flag: false,
          id: this.nodeId
        });
      } else if (type === 4) {
        this.updateCondition();
        this.updateConditionsConfig({
          value: JSON.parse(JSON.stringify(this.processNode)),
          index,
          flag: false,
          id: this.nodeId
        });
      }
    },
    arrTransfer(index, type = 1) {
      //向左-1,向右1
      this.processNode.branchNodes[index] = this.processNode.branchNodes.splice(
        index + type,
        1,
        this.processNode.branchNodes[index]
      )[0];
      this.processNode.branchNodes.map((item, index) => {
        item.priorityLevel = index + 1;
      });
      this.$emit("update:processNode", this.processNode);
    }
  },
  emits: ["update:processNode"]
};
</script>

<style scoped>
.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}
</style>
