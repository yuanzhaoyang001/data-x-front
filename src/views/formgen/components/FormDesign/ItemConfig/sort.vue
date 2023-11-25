<template>
  <div>
    <draggable
      v-model="activeData.sortList"
      item-key="value"
      group="selectItem"
      handle=".option-drag"
    >
      <template #item="{ element, index }">
        <div class="select-item">
          <div class="select-line-icon option-drag">
            <el-icon>
              <ele-Operation />
            </el-icon>
          </div>
          <el-input
            v-model="element.label"
            :placeholder="$t('formgen.sort.optionName')"
          />
          <div
            class="close-btn select-line-icon"
            @click="activeData.sortList.splice(index, 1)"
          >
            <el-icon>
              <ele-Remove />
            </el-icon>
          </div>
        </div>
      </template>
    </draggable>
    <div style="margin-left: 20px; margin-bottom: 10px">
      <el-button
        icon="ele-CirclePlus"
        style="padding-bottom: 0"
        link
        type="primary"
        @click="addSelectItem"
      >
        {{ $t("formgen.sort.addOption") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash-es";
import draggable from "vuedraggable";

export default {
  name: "ConfigItemSort",
  components: {
    draggable
  },
  props: ["activeData"],
  methods: {
    addSelectItem() {
      const lastItem = _.last(this.activeData.sortList);
      const value =
        lastItem.value === 0 ? _.max(_.values(this.activeData.sortList.map(item => item.value))) + 1 : lastItem.value + 1;
      this.activeData.sortList.push({
        label: "",
        value: lastItem ? value : 1
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
