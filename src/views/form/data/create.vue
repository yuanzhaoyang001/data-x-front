<template>
  <div class="create-container">
    <div v-if="authGroupOptions.length === 0 && !loading">
      <el-result
        icon="error"
        title="无权限访问"
        sub-title="无权限进行操作，请联系管理员"
      />
    </div>
    <div v-else>
      <el-row
        class="header"
        type="flex"
        justify="center"
        align="middle"
      >
        <el-col
          :span="18"
          :offset="2"
        >
          <el-select
            v-model="currentAuthGroup"
            value-key="value"
            placeholder="请选择权限组"
            @change="dataTableKey = new Date().getTime()"
          >
            <el-option
              v-for="item in authGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button
            circle
            icon="ele-HomeFilled"
            size="default"
            type="primary"
            @click="$router.push('/')"
          />
        </el-col>
      </el-row>
      <div v-if="currentAuthGroup && currentAuthGroup.value === 'submit'">
        <write-page :write-type="2" />
      </div>
      <div v-else>
        <DataTable
          v-if="currentAuthGroup"
          :mode="2"
          :key="dataTableKey"
          :auth-group="currentAuthGroup.auth"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WritePage from "../write/index.vue";
import { getFormUserAuthRequest } from "@/api/project/publish";
import { defineAsyncComponent } from "vue";

export default {
  name: "DataCreate",
  data() {
    return {
      noAuthority: false,
      currentAuthGroup: null,
      authGroupOptions: [],
      formKey: "",
      loading: true,
      // 选中Id
      selectId: null,
      // 刷新table
      dataTableKey: 100
    };
  },
  components: {
    DataTable: defineAsyncComponent(() => import("./index.vue")),
    WritePage
  },
  props: {},
  async created() {
    this.formKey = this.$route.query.key || this.$route.params.key;
    this.selectId = this.$route.query.gid || this.$route.params.gid;
    getFormUserAuthRequest(this.formKey).then(res => {
      // 检查是否有新增的权限 无权限则进入
      if (!res.data) {
        this.loading = false;
        return;
      }
      // 是否有填写权限
      let isAdd = res.data.some(item => item.btnPerms.includes("add"));
      let defaultOptions = [];
      if (isAdd) {
        defaultOptions = [
          {
            value: "submit",
            label: "提交"
          }
        ];
      }
      this.authGroupOptions = defaultOptions.concat(
        res.data.map(item => {
          return { value: item.id, label: item.name, auth: item };
        })
      );
      // 默认选中第一个
      if (this.authGroupOptions.length > 0) {
        this.currentAuthGroup = this.authGroupOptions[0];
      }
      // 默认选中权限组
      if (this.selectId) {
        this.currentAuthGroup = this.authGroupOptions.find(item => item.value + "" === this.selectId);
      }
      this.loading = false;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.create-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

  .header {
    height: 50px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);
  }
}
</style>
