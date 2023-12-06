<template>
  <div class="app-container">
    <div class="form-container">
      <div class="filter-view">
        <el-form
          ref="form"
          :model="queryParams"
          size="default"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('project.mangeform.projectUpdateTime')">
                <el-date-picker
                  v-model="queryParams.beginDateTime"
                  :placeholder="$t('project.mangeform.selectStartDate')"
                  style="width: 40%"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />

                <el-date-picker
                  v-model="queryParams.endDateTime"
                  :default-time="new Date(0, 0, 0, 23, 59, 59)"
                  :placeholder="$t('project.mangeform.selectEndDate')"
                  style="width: 40%"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="queryParams.name"
                :placeholder="$t('project.mangeform.inputProjectName')"
                class="project_my_input_search mr20"
                style="width: 40%"
              />
              <el-input
                v-model="queryParams.userName"
                :placeholder="$t('project.mangeform.inputUserNameName')"
                class="project_my_input_search"
                style="width: 40%"
              />
              <el-button
                class="ml10"
                icon="ele-Search"
                type="primary"
                @click="queryProjectPage"
              >
                {{ $t("project.mangeform.query") }}
              </el-button>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('project.mangeform.projectStatus')">
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
            <el-col :span="7">
              <el-form-item :label="$t('project.mangeform.projectType')">
                <el-radio-group
                  v-model="queryParams.type"
                  @change="
                    () => {
                      queryParams.current = 0;
                      queryProjectPage();
                    }
                  "
                >
                  <el-radio-button
                    v-for="status in projectTypeList"
                    :key="status.code"
                    :label="status.code"
                  >
                    {{ status.name }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
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
        :project-list="projectList"
        @refresh="queryProjectPage"
      />
      <my-form-table
        v-if="dataShowType == 'table'"
        v-loading="projectListLoading"
        :project-list="projectList"
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

<script setup name="ManageForm" lang="ts">
import { onMounted, reactive, ref } from "vue";
import { FormRey, pageMangeFormRequest } from "@/api/project/form";
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
  userName: "",
  beginDateTime: "",
  endDateTime: "",
  status: [],
  type: null
});

const { projectStatusList, projectTypeList } = useForm();
const projectList = ref<FormRey[]>([]);
const projectListLoading = ref<boolean>(true);

const queryProjectPage = async () => {
  const res = await pageMangeFormRequest(queryParams);
  projectList.value = res.data.records;
  total.value = res.data.total;
  queryParams.size = res.data.size;
  projectListLoading.value = false;
};

onMounted(() => {
  queryParams.current = 1;
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
</style>
