<template>
  <div class="workflow-container">
    <el-row
      class="tool-bar"
      align="middle"
    >
      <el-col
        :span="10"
        :offset="2"
      >
        <el-icon class="el-alert__icon text-warning">
          <ele-WarningFilled />
        </el-icon>
        <span class="text-warning">{{ $t("workflow.flowDesign.savingProcessNote") }}</span>
      </el-col>
      <el-col :span="4">
        <el-dropdown class="flex">
          <span class="el-dropdown-link">
            {{ $t("workflow.flowDesign.processVersion") }}
            <span class="text-warning">V{{ selectedDesignProcess.version }}</span>
            <el-tag :type="selectedDesignProcess.status == '2' ? 'success' : 'warning'">
              {{ selectedDesignProcess.status == "2" ? $t("workflow.flowDesign.enabled") : $t("workflow.flowDesign.design") }}
            </el-tag>
            <el-icon class="el-icon--right">
              <ele-ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="d in designList"
                :key="d.id"
                :command="d.id"
                class="m4"
              >
                {{ $t("workflow.flowDesign.processVersion") }}
                <span class="text-warning mr5">V{{ d.version }}</span>
                <el-tag :type="d.status == '2' ? 'success' : 'warning'">
                  {{ d.status == "2" ? $t("workflow.flowDesign.enabled") : $t("workflow.flowDesign.design") }}
                </el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="7">
        <el-button
          size="default"
          @click="saveBusinessDesign"
        >
          {{ $t("workflow.flowDesign.save") }}
        </el-button>
        <el-button
          size="default"
          type="success"
          @click="downloadBpmnFile"
        >
          {{ $t("workflow.flowDesign.downloadBpmn") }}
        </el-button>
        <el-button
          size="default"
          type="danger"
          @click="publishProcess"
        >
          {{ $t("workflow.flowDesign.enable") }}
        </el-button>
      </el-col>
    </el-row>
    <el-scrollbar :height="`${wdHeight - 100}px`">
      <div class="fd-nav-content">
        <section class="dingflow-design">
          <div class="zoom">
            <div
              :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')"
              @click="zoomSize(1)"
            />
            <span>{{ nowVal }}%</span>
            <div
              :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')"
              @click="zoomSize(2)"
            />
          </div>
          <div
            id="box-scale"
            :style="'transform: scale(' + nowVal / 100 + '); transform-origin: 50% 0px 0px;'"
            class="box-scale"
          >
            <nodeWrap
              v-model:is-tried="isTried"
              v-model:process-node="processNode"
            />
            <div class="end-node">
              <div class="end-node-circle" />
              <div class="end-node-text">{{ $t("workflow.flowDesign.endOfProcess") }}</div>
            </div>
          </div>
        </section>
      </div>
    </el-scrollbar>
    <div class="workflow-drawer">
      <approverDrawer :form-key="formKey" />
      <copyerDrawer :form-key="formKey" />
      <conditionDrawer :form-key="formKey" />
    </div>
  </div>
</template>

<script>
import { defaultProcessData } from "./defaultProcess";
import { i18n } from "@/i18n";

import {
  convertBpmnRequest,
  getBusinessDesignListRequest,
  publishBusinessDesignRequest,
  saveBusinessDesignRequest
} from "@/api/workflow/workflow";
import nodeWrap from "./nodeWrap.vue";
import approverDrawer from "./drawer/approverDrawer.vue";
import conditionDrawer from "./drawer/conditionDrawer.vue";
import copyerDrawer from "./drawer/copyerDrawer.vue";
import { getProjectRequest } from "@/api/project/form";
import { jsonSimpleClone } from "@/views/formgen/utils";
import { useWindowSize } from "@vueuse/core";

export default {
  name: "FormWorkFLow",
  components: {
    nodeWrap,
    approverDrawer,
    conditionDrawer,
    copyerDrawer
  },
  setup() {
    const { width, height } = useWindowSize();
    return {
      wdHeight: height
    };
  },
  data() {
    return {
      // 流程设计列表
      designList: [],
      // 选中设计列表
      selectedDesignProcess: {
        version: 1,
        status: 1
      },
      isTried: false,
      nowVal: 100,
      processConfig: {},
      processNode: {},
      process: {},
      directorMaxLevel: 0,
      formKey: ""
    };
  },
  created() {
    this.formKey = this.$route.query.key;
    this.getBusinessDesignList();
  },
  methods: {
    /**
     * 大小缩放
     * @param type
     */
    zoomSize(type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return;
        }
        this.nowVal -= 10;
      } else {
        if (this.nowVal == 300) {
          return;
        }
        this.nowVal += 10;
      }
    },
    getBusinessDesignList() {
      getBusinessDesignListRequest(this.formKey).then(res => {
        this.designList = res.data;
        let processData = JSON.parse(JSON.stringify(defaultProcessData));
        if (res.data && res.data[0]) {
          this.selectedDesignProcess = res.data[0];
          processData = this.selectedDesignProcess.scheme;
        }
        this.processConfig = processData;
        let { processNode, directorMaxLevel, process } = processData;
        getProjectRequest(this.formKey).then(res => {
          process.name = res.data.name;
        });
        process.processId = "process" + this.formKey;
        this.processNode = processNode;
        this.directorMaxLevel = directorMaxLevel;
        this.process = process;
      });
    },
    saveBusinessDesign() {
      let data = {
        ...JSON.parse(JSON.stringify(this.selectedDesignProcess)),
        name: this.process.name,
        scheme: this.processConfig,
        formKey: this.formKey
      };
      saveBusinessDesignRequest(data).then(res => {
        if (res.data) {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.getBusinessDesignList();
        }
      });
    },
    downloadBpmnFile() {
      let workflow = jsonSimpleClone(this.processConfig);
      // workflow.processNode = workflow.processNode
      convertBpmnRequest(JSON.stringify(workflow)).then(res => {
        const content = res.data;
        const blob = new Blob([content]);
        const elink = document.createElement("a");
        elink.download = workflow.process.name + ".bpmn";
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // Release the URL object
        document.body.removeChild(elink);
      });
    },
    publishProcess() {
      let data = {
        ...JSON.parse(JSON.stringify(this.selectedDesignProcess)),
        scheme: this.processConfig,
        name: this.process.name,
        formKey: this.formKey
      };
      publishBusinessDesignRequest(data).then(res => {
        if (res.data) {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.getBusinessDesignList();
        }
      });
    }
  }
};
</script>

<style>
@import "./workflow.css";

.error-modal-list {
  width: 455px;
}

.workflow-container {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkFGQUZBIiBkPSJNMCAwaDIydjIySDB6Ii8+PGNpcmNsZSBmaWxsPSIjOTE5QkFFIiBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9zdmc+")
    repeat;
}

.tool-bar {
  background-color: rgba(250, 250, 250, 0.8);
  border-bottom: 1px dashed #e8e8e8;
}
</style>
