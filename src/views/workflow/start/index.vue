<template>
  <div class="process-wrap">
    <div class="process-wrap-parcel">
      <div class="process-wrap-head">
        <el-input
          v-model="name"
          :placeholder="$t('workflow.start.inputText')"
          size="large"
        />
        <el-button
          icon="ele-Search"
          style="width: 101px"
          type="primary"
          @click="handleSearch"
        >
          {{ $t("formI18n.all.search") }}
        </el-button>
      </div>
      <div
        v-for="item in initiator"
        :key="item"
        class="process-wrap-main"
      >
        <h4>{{ item.cateName }}</h4>
        <div class="process-wrap-package">
          <div
            v-for="data in item.extensionInfoList"
            :key="data"
            class="process-wrap-box"
            @click="handleStartProcess(data)"
          >
            <div
              :style="{ backgroundColor: getHoverColorAmount(data.color, 60) }"
              class="process-wrap-icon"
            >
              <el-icon class="process-wrap-inside">
                <component
                  :is="data.icon"
                  :color="data.color"
                ></component>
              </el-icon>
            </div>
            <span>{{ data.name }}</span>
          </div>
        </div>
      </div>
      <el-empty v-if="!initiator" />
    </div>
  </div>
</template>

<script lang="ts" name="StartFlow" setup>
import { onMounted, ref, UnwrapRef } from "vue";
import { AllowedInitiator, FlowExtensionInfo, getAllowedInitiatorList } from "@/api/workflow/flowExtension";
import { getHoverColorAmount } from "@/views/formgen/utils/theme";
import { ResultData } from "@/api/types";
import { useRouter } from "vue-router";

const name = ref<UnwrapRef<string>>("");
const initiator = ref<ResultData | null>(null);
const handleSearch = () => {
  getList();
};

const getList = async () => {
  const res = await getAllowedInitiatorList(name.value);
  if (name.value) {
    initiator.value = res.data.filter((item: AllowedInitiator) => {
      return item.extensionInfoList.some((data: FlowExtensionInfo) => data.name?.includes(name.value));
    });
  } else {
    initiator.value = res.data;
  }
};

const router = useRouter();

const handleStartProcess = (row: any) => {
  router.push({
    path: "/workflow/task/record/start",
    query: {
      deployId: row.deploymentId as string,
      procDefId: row.id as string
    }
  });
};

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.process-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  .process-wrap-parcel {
    width: 70%;
    margin: 0 auto;
  }

  .process-wrap-head {
    display: flex;
    :deep(.el-input) {
      width: 35%;
      margin-right: 10px;
    }
  }
  .process-wrap-main {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    h4 {
      margin-bottom: 20px;
    }
  }
  .process-wrap-package {
    display: flex;
    flex-wrap: wrap;
  }
  .process-wrap-box {
    display: flex;
    align-items: center;
    width: 221px;
    height: 76px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.05);
    padding: 7px;
    margin: 5px;
    cursor: pointer;
    .process-wrap-icon {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      font-size: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    span {
      margin-left: 20px;
      width: 123px;
      font-size: 18px;
      font-weight: 500;
      line-height: normal;
      color: #3d3d3d;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .process-wrap-box:hover {
    cursor: pointer;
  }
}
</style>
