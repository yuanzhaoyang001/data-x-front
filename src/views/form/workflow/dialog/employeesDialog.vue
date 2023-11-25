<template>
  <el-dialog
    v-model="visibleDialog"
    append-to-body
    class="promoter_person"
    :title="$t('workflow.flowDesign.chooseDialogTitle')"
    width="620px"
  >
    <div class="person_body clear">
      <div class="person_tree float-left">
        <el-input
          v-model="searchVal"
          :placeholder="$t('workflow.flowDesign.searchPlaceholder')"
          prefix-icon="ele-Search"
          class="mb10"
          @input="getDebounceData(searchVal)"
        />
        <p
          v-if="!searchVal"
          class="ellipsis tree_nav ml5"
        >
          <span
            class="ellipsis"
            @click="getDepartmentList(firstDept.id)"
          >
            {{ firstDept.label }}
          </span>
          <span
            v-for="(item, index) in departments.titleDepartments"
            :key="index + 'a'"
            class="ellipsis"
            @click="getDepartmentList(item.id)"
          >
            <el-icon>
              <el-icon><ele-ArrowRight /></el-icon>
            </el-icon>
            {{ item.label }}
          </span>
        </p>
        <ul>
          <li
            v-for="(item, index) in departments.childDepartments"
            :key="index + 'b'"
            class="check_box not"
          >
            <a>
              <i class="icon-wenjianjia iconfont" />
              {{ item.label }}
            </a>
            <i
              class="icon-xiaji_line iconfont"
              @click="getDepartmentList(item.id)"
            >
              {{ $t("workflow.flowDesign.nextLevel") }}
            </i>
          </li>
          <li
            v-for="(item, index) in departments.employees"
            :key="index + 'c'"
            class="check_box"
          >
            <a
              :class="func.toggleClass(checkedEmployessList, item) && 'active'"
              :title="item.label"
              @click="func.toChecked(checkedEmployessList, item)"
            >
              <i class="iconfont icon-yonghutouxiang" />
              {{ item.nickName }} （{{ item.userName }}）
            </a>
          </li>
        </ul>
      </div>
      <div class="has_selected float-left">
        <p class="clear">
          {{ $t("workflow.flowDesign.selectedCount") }}（{{ total }}）
          <a @click="delList">{{ $t("workflow.flowDesign.clearSelection") }}</a>
        </p>
        <ul>
          <li
            v-for="(item, index) in checkedEmployessList"
            :key="index + 'e'"
          >
            <i class="iconfont icon-yonghutouxiang" />
            <span>{{ item.nickName }}</span>
            <el-icon @click="checkedEmployessList.splice(index, 1)">
              <ele-Close />
            </el-icon>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          size="default"
          @click="$emit('update:visible', false)"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
        <el-button
          size="default"
          type="primary"
          @click="saveDialog"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import mixins from "./mixins";

export default {
  components: {},
  mixins: [mixins],
  props: ["visible", "data"],
  emits: ["update:visible", "change"],
  data() {
    return {
      checkedEmployessList: []
    };
  },
  computed: {
    total() {
      return this.checkedEmployessList.length;
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = this.visible;
      if (val) {
        this.getDepartmentList();
        this.searchVal = "";
        this.checkedEmployessList = this.data.map(({ nickName, userName, id }) => ({
          nickName: nickName,
          userName: userName,
          id: id
        }));
      }
    },
    visibleDialog(val) {
      this.$emit("update:visible", val);
    }
  },
  created() {},
  methods: {
    saveDialog() {
      let checkedList = this.checkedEmployessList.map(item => ({
        id: item.id,
        userName: item.userName,
        nickName: item.nickName
      }));
      this.$emit("change", checkedList);
    },
    delList() {
      this.checkedEmployessList = [];
    }
  }
};
</script>

<style scoped>
@import "./dialog.css";
</style>
