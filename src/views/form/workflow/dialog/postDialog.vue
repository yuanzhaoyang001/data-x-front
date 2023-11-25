<template>
  <el-dialog
    v-model="visibleDialog"
    append-to-body
    class="promoter_person"
    :title="$t('workflow.flowDesign.choosePostDialog')"
    width="620px"
  >
    <div class="person_body clear">
      <div class="person_tree float-left">
        <el-input
          v-model="searchVal"
          :placeholder="$t('workflow.flowDesign.searchPostPlaceholder')"
          prefix-icon="ele-Search"
          class="mb10"
          @input="getPostList(searchVal)"
        />
        <ul>
          <li
            v-for="(item, index) in posts"
            :key="index + 'p'"
            class="check_box"
          >
            <a
              :title="item.roleName"
              :class="func.toggleClass(checkedPostList, item) && 'active'"
              @click="func.toChecked(checkedPostList, item)"
            >
              <i class="iconfont icon-yonghutouxiang" />
              {{ item.postName }}
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
            v-for="(item, index) in checkedPostList"
            :key="index + 'ps'"
          >
            <i class="iconfont icon-yonghutouxiang" />
            <span>{{ item.postName }}</span>
            <el-icon @click="checkedPostList.splice(index, 1)">
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
      checkedPostList: []
    };
  },
  computed: {
    total() {
      return this.checkedPostList.length;
    }
  },
  watch: {
    visible(val) {
      this.visibleDialog = this.visible;
      if (val) {
        this.getPostList();
        this.searchVal = "";
        this.checkedPostList = this.data.map(({ name, postCode, id }) => ({
          postName: name,
          postCode: postCode,
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
      let checkedList = this.checkedPostList.map(item => ({
        id: item.id,
        postCode: item.postCode,
        postName: item.postName
      }));
      this.$emit("change", checkedList);
    },
    delList() {
      this.checkedPostList = [];
    }
  }
};
</script>

<style scoped>
@import "./dialog.css";
</style>
