<template>
  <div class="pl10 pt10">
    <el-form label-position="top">
      <el-form-item label="启用TabBar">
        <el-checkbox-group
          v-model="checkList"
          @change="handleTabbarChange"
        >
          <el-checkbox
            :label="item.pagePath"
            v-for="item in allTabBarList"
          >
            {{ item.text }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { allTabBarList, portalConfigStore } from "@/views/uniapp/portal/config";

const { portalConfig } = portalConfigStore;

const checkList = ref(portalConfig.value.tabBarList.map(item => item.pagePath));

const handleTabbarChange = (val: string[]) => {
  console.log(val);
  portalConfig.value.tabBarList = allTabBarList.filter(item => val.includes(item.pagePath));
};
</script>

<style scoped lang="scss"></style>
