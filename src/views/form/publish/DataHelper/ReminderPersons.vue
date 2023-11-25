<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      append-to-body
      class="t-dialog"
      :title="$t('form.chooseUser.selectPersonnel')"
    >
      <el-form label-position="top">
        <el-form-item :label="$t('form.chooseUser.systemPersonnel')">
          <el-tag
            size="default"
            :disable-transitions="true"
            v-for="(user, index) in selectPersons.userList"
            :key="user.id"
            class="ml5"
            closable
            @close="handleUserListClose(index)"
          >
            {{ user.nickName }}
          </el-tag>
          <el-button
            class="select-sys-user"
            size="small"
            @click="handleAssignUser"
          >
            {{ $t("form.chooseUser.chooseSystemPersonnel") }}
          </el-button>
          <p class="desc-text ml5">{{ $t("form.chooseUser.defaultSystemData") }}</p>
        </el-form-item>
        <el-form-item :label="$t('form.chooseUser.dynamicInput')">
          <template #label>{{ $t("form.chooseUser.dynamicInput") }}</template>
          <el-select
            size="default"
            v-model="selectPersons.dynamicField"
            clearable
          >
            <el-option
              v-for="item in fields"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <p class="desc-text ml5">{{ $t("form.chooseUser.getValueFromFormComponent") }}</p>
        </el-form-item>
        <el-form-item :label="$t('form.chooseUser.manualInput')">
          <el-input
            size="default"
            v-model="inputVal"
            :placeholder="$t('form.chooseUser.enterNotifyAccount')"
            style="width: 50%; margin-top: 3px"
          >
            <template #append>
              <el-button
                size="default"
                type="primary"
                @click="handleInputAccount"
              >
                {{ $t("formI18n.all.confirm") }}
              </el-button>
            </template>
          </el-input>
          <p>
            <el-tag
              size="default"
              :disable-transitions="true"
              v-for="(input, index) in selectPersons.inputList"
              :key="index"
              class="ml5"
              closable
              @close="handleUserListClose(index)"
            >
              {{ input }}
            </el-tag>
          </p>
          <p class="desc-text">
            {{ $t("form.chooseUser.supportSeparateInput") }}
          </p>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            @click="handleSubmit"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <user-choose-table
      ref="userChooseTable"
      :no-record="true"
      @submit="val => handleSubmitAssignUser(val)"
    />
  </div>
</template>

<script>
import UserChooseTable from "@/views/system/user/chooseTable.vue";

export default {
  name: "ReminderPersons",
  components: { UserChooseTable },
  props: {
    // 表单字段列表
    fields: {
      type: Array,
      default: () => []
    }
  },
  emits: ["submit"],
  data() {
    return {
      inputVal: "",
      selectPersons: {
        userList: [],
        inputList: [],
        // 动态字段
        dynamicField: null
      },
      dialogVisible: false
    };
  },
  created() {},
  methods: {
    show(params) {
      if (!params || Object.keys(params).length < 3) {
        params = {
          userList: [],
          inputList: [],
          // 动态字段
          dynamicField: null
        };
      }
      this.selectPersons = params;
      this.dialogVisible = true;
    },
    handleSubmit() {
      this.dialogVisible = false;
      this.$emit("submit", this.selectPersons);
    },
    handleAssignUser() {
      this.$refs.userChooseTable.showDialog([]);
    },
    handleSubmitAssignUser(val) {
      this.selectPersons.userList = val;
    },
    handleInputAccount() {
      if (!this.inputVal) {
        return;
      }
      this.selectPersons.inputList.push(this.inputVal);
      this.inputVal = "";
    },
    handleUserListClose(index) {
      this.selectPersons.inputList.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-sys-user {
  margin-left: 10px;
}
</style>
