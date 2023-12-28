<template>
  <div>
    <el-table
      :data="tableData"
      style="height: 70vh"
    >
      <el-table-column
        :label="$t('form.lottery.prizeName')"
        prop="prizeName"
        width="150"
      />
      <el-table-column
        :label="$t('form.lottery.username')"
        prop="name"
      />
      <el-table-column
        :label="$t('form.lottery.phoneNumber')"
        prop="phone"
      />
      <el-table-column
        :label="$t('form.lottery.address')"
        prop="address"
      />
      <el-table-column
        :label="$t('form.lottery.couponCode')"
        prop="code"
      />
      <el-table-column
        :label="$t('form.lottery.isSent')"
        prop="isSend"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.isSend"
            type="success"
          >
            {{ $t("form.lottery.sent") }}
          </el-tag>
          <el-button
            v-else
            link
            type="primary"
            @click="handleMarkSendStatus(scope.row.id)"
          >
            {{ $t("form.lottery.markAsSent") }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.lottery.winningTime')"
        prop="crateTime"
      />
    </el-table>
  </div>
</template>

<script lang="ts" name="WinningRecord" setup>
import { onMounted, ref } from "vue";
import { FORM_LOTTERY, getDrawPrizesList, markSendStatus } from "@/api/project/lottery";
import { useRoute } from "vue-router";

const tableData = ref<any[]>([]);

const route = useRoute();

onMounted(() => {
  console.log(route);
  queryData();
});

const queryData = () => {
  getDrawPrizesList(FORM_LOTTERY, route.query.key as string).then(res => {
    tableData.value = res.data;
  });
};

const handleMarkSendStatus = (id: number) => {
  markSendStatus(id).then(() => {
    queryData();
  });
};
</script>
