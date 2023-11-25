<template>
  <el-dialog
    v-model="visibleDialog"
    append-to-body
    class="promoter_person"
    :title="$t('workflow.flowDesign.chooseRoleDialog')"
    width="620px"
  >
    <div class="person_body clear">
      <div class="person_tree float-left">
        <el-input
          v-model="searchVal"
          :placeholder="$t('workflow.flowDesign.searchRolePlaceholder')"
          prefix-icon="ele-Search"
          class="mb10"
          @input="getDebounceData(searchVal, 2)"
        />
        <ul>
          <li
            v-for="(item, index) in roles"
            :key="index + 'b'"
            class="check_box"
          >
            <a
              :title="item.roleName"
              :class="func.toggleClass(checkedRoleList, item) && 'active'"
              @click="func.toChecked(checkedRoleList, item)"
            >
              <i class="iconfont icon-yonghutouxiang" />
              {{ item.roleName }}
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
            v-for="(item, index) in checkedRoleList"
            :key="index + 'e'"
          >
            <i class="iconfont icon-yonghutouxiang" />
            <span>{{ item.roleName }}</span>
            <el-icon @click="checkedRoleList.splice(index, 1)">
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
          {{ $t("formI18n.all.confirm") }}
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
  mixins: [mixins],
  props: ["visible", "data"],
  emits: ["update:visible", "change"],
  data() {
    return {
      checkedRoleList: []
    };
  },
  computed: {
    total() {
      return this.checkedRoleList.length;
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = this.visible;
      if (val) {
        this.getRoleList();
        this.searchVal = "";
        this.checkedRoleList = this.data.map(({ name, roleKey, id }) => ({
          roleName: name,
          roleKey: roleKey,
          id: id
        }));
      }
    },
    visibleDialog(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    saveDialog() {
      let checkedList = this.checkedRoleList.map(item => ({
        id: item.id,
        roleKey: item.roleKey,
        roleName: item.roleName
      }));
      this.$emit("change", checkedList);
    },
    delList() {
      this.checkedRoleList = [];
    }
  }
};
</script>

<style scoped>
@import "./dialog.css";
</style>
