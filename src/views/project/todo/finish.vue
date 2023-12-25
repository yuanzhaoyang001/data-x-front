<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      label-width="98px"
    >
      <el-form-item
        :label="$t('project.finish.formName')"
        prop="formName"
      >
        <el-input
          style="width: 250px"
          v-model="queryParams.formName"
          clearable
          :placeholder="$t('project.finish.formNameText')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label-width="128px"
        :label="$t('project.finish.writeTime')"
      >
        <el-date-picker
          v-model="queryParams.beginDateTime"
          :placeholder="$t('project.finish.aTimeBegin')"
          style="width: 45%"
          type="datetime"
          class="mr6"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        -
        <el-date-picker
          :default-time="new Date(0, 0, 0, 0, 23, 59, 59)"
          v-model="queryParams.endDateTime"
          :placeholder="$t('project.finish.aTimeLast')"
          style="width: 45%"
          type="datetime"
          class="ml6"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          {{ $t("project.finish.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("project.finish.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="finishList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('project.finish.formName')"
        prop="textName"
      />
      <el-table-column
        align="center"
        :label="$t('project.finish.type')"
        prop="status"
      >
        <template #default="scope">
          {{ scope.row.typeDesc }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('project.finish.writeTime')"
        prop="createTime"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('project.finish.operate')"
      >
        <template #default="scope">
          <el-button
            icon="ele-View"
            link
            type="primary"
            @click="handleToView(scope.row)"
          >
            {{ $t("project.finish.detail") }}
          </el-button>
          <el-button
            icon="ele-Edit"
            link
            type="primary"
            @click="handleToWrite(scope.row)"
          >
            {{ $t("project.finish.writeAgain") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="FinishForm">
import { listMyFillFormRequest } from "@/api/project/data";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { resetFormRef } from "@/utils/tduck";

const finishList = ref([]);
const total = ref(0);
const loading = ref(true);

const queryParams = reactive({
  current: 1,
  size: 10,
  formName: "",
  beginDateTime: null,
  endDateTime: null
});

const getList = async () => {
  loading.value = true;
  const res = await listMyFillFormRequest(queryParams);
  finishList.value = res.data.records;
  total.value = res.data.total;
  loading.value = false;
};

const showSearch = ref(true);

onMounted(() => {
  getList();
});

const handleQuery = () => {
  queryParams.current = 1;
  getList();
};

const queryFormRef = ref(null);

const resetQuery = () => {
  resetFormRef(queryFormRef);
  queryParams.formName = "";
  queryParams.beginDateTime = null;
  queryParams.endDateTime = null;
  handleQuery();
};

const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

const handleSelectionChange = selection => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};
const router = useRouter();

const handleToWrite = row => {
  const routeData = router.resolve({
    path: `/s/${row.formKey}`
  });
  window.open(routeData.href, "_blank");
};

const handleToView = row => {
  const routeData = router.resolve({
    path: `/project/form/data/view`,
    query: { dataId: row.id }
  });
  window.open(routeData.href, "_blank");
};
</script>
