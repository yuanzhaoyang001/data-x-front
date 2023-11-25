<template>
  <div class="app-container">
    <div class="form-container">
      <div class="filter-view">
        <el-form
          ref="form"
          label-width="100px"
        >
          <el-form-item :label="$t('project.share.formName')">
            <el-input
              v-model="queryParams.name"
              :placeholder="$t('project.share.formNameText')"
              style="width: 310px"
            />
            <el-button
              class="ml20"
              icon="ele-Search"
              type="primary"
              @click="queryProjectPage"
            >
              {{ $t("project.share.search") }}
            </el-button>
          </el-form-item>
          <el-row>
            <el-col :span="16">
              <el-form-item
                label-width="101px"
                :label="$t('project.share.status')"
              >
                <el-radio-group
                  v-model="queryParams.status"
                  @change="
                    () => {
                      queryParams.current = 0;
                      queryProjectPage();
                    }
                  "
                >
                  <el-radio-button
                    v-for="status in projectStatusList"
                    :key="status.code"
                    :label="status.code"
                  >
                    {{ status.name }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button-group>
                  <el-button
                    :type="dataShowType == 'card' ? 'primary' : 'default'"
                    @click="dataShowType = 'card'"
                  >
                    <grid-nine
                      theme="outline"
                      size="18"
                      :stroke-width="3"
                      stroke-linejoin="bevel"
                    />
                  </el-button>
                  <el-button
                    :type="dataShowType == 'table' ? 'primary' : 'default'"
                    @click="dataShowType = 'table'"
                  >
                    <hamburger-button
                      theme="outline"
                      size="18"
                      :stroke-width="3"
                      stroke-linejoin="bevel"
                    />
                  </el-button>
                </el-button-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <form-card-list
        v-if="dataShowType == 'card'"
        v-loading="projectListLoading"
        type="share"
        v-model:project-list="projectList"
      />
      <my-form-table
        v-if="dataShowType == 'table'"
        v-loading="projectListLoading"
        type="share"
        v-model:project-list="projectList"
        @refresh="queryProjectPage"
      />
      <div class="project-page-view">
        <el-pagination
          v-if="total > 10"
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :total="total"
          background
          layout="total, prev, pager, next"
          @current-change="queryProjectPage"
        />
      </div>
    </div>
  </div>
</template>
<script setup name="ShareForm" lang="ts">
import { onMounted, reactive, ref } from "vue";
import { FormRey, getMyCooperationFormsRequest } from "@/api/project/form";
import FormCardList from "../my/card.vue";
import MyFormTable from "../my/table.vue";
import { GridNine, HamburgerButton } from "@icon-park/vue-next";
import { useForm } from "@/views/project/my/useFormHook";

const dataShowType = ref<string>("card");
const total = ref<number>(0);
const queryParams = reactive<FormRey>({
  current: 1,
  size: 12,
  name: "",
  beginDateTime: "",
  endDateTime: "",
  status: [],
  folderId: 0
});
const { projectStatusList } = useForm();
const projectListLoading = ref<boolean>(true);
const projectList = ref<FormRey[]>([]);
const queryProjectPage = async () => {
  const res = await getMyCooperationFormsRequest(queryParams);
  projectList.value = res.data.records;
  total.value = res.data.total;
  queryParams.size = res.data.size;
  projectListLoading.value = false;
};

onMounted(() => {
  queryProjectPage();
});
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}

.form-container {
  width: 1280px;
  margin: 0 auto;
}

.project-page-view {
  margin-top: 30px;
  text-align: center;
}

.form-breadcrumb {
  margin: 10px 50px 10px 0px;
}

:deep(.el-breadcrumb__inner) {
  cursor: pointer !important;
}
</style>
