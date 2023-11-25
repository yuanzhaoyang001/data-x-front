<template>
  <div class="ranking-container">
    <div class="container-wrap-head">
      <h2>{{ rankingList?.examName }}</h2>
      <span>共{{ rankingList?.totalNum }}人参加</span>
      <el-popover
        :width="180"
        placement="right"
      >
        <template #reference>
          <div class="container-wrap-mark">{{ rankingList?.currentRank }}</div>
        </template>
        <template #default>
          <div
            class="demo-rich-conent"
            style="display: flex; flex-direction: column"
          >
            <div>
              <p
                class="demo-rich-content__name"
                style="margin: 0; font-weight: 500"
              >
                用时：{{ myRank?.answerTime }}
              </p>
              <p
                class="demo-rich-content__mention"
                style="margin: 0; font-size: 14px; color: var(--el-color-info)"
              >
                日期：{{ myRank?.createTime }}
              </p>
            </div>
          </div>
        </template>
      </el-popover>
      <div class="container-wrap-rank">{{ $t("form.exam.currentRanking") }}</div>
    </div>
    <div class="container-wrap-central">
      <div class="container-wrap-title">
        <span class="wrap-title">{{ $t("form.exam.myRanking") }}</span>
        <span class="wrap-rate">
          恭喜您！战胜
          <i>{{ rankingList?.winPercent }}%</i>
          {{ $t("form.exam.participants") }}
        </span>
      </div>
      <div class="container-wrap-content">
        <div class="content-item">
          <div class="content-title">排名</div>
          <div class="content-text">{{ myRank?.rankNum }}</div>
        </div>
        <div class="content-item">
          <div class="content-title">{{ $t("form.exam.points") }}</div>
          <div class="content-text">{{ myRank?.score }}</div>
        </div>

        <div class="content-item">
          <div class="content-title">{{ $t("form.exam.answerTime") }}</div>
          <div class="content-text">{{ myRank && formatTime(myRank.answerTime) }}</div>
        </div>
        <div class="content-item">
          <div class="content-title">{{ $t("form.exam.participationTime") }}</div>
          <div class="content-text">{{ myRank?.createTime }}</div>
        </div>
      </div>
    </div>
    <div class="container-wrap-template">
      <div class="total-rank">{{ $t("form.exam.leaderboard") }}</div>
      <el-table
        class="table-wrap"
        :data="rankList"
      >
        <el-table-column
          label="排名"
          align="center"
        >
          <template #default="scope">
            <img
              v-if="scope.$index === 0"
              :src="first"
            />
            <img
              v-else-if="scope.$index === 1"
              :src="second"
            />
            <img
              v-else-if="scope.$index === 2"
              :src="third"
            />
            <span v-else>
              {{ scope.row.rankNum }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('form.exam.points')"
          prop="score"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="answerTime"
          :label="$t('form.exam.answerTime')"
          align="center"
        >
          <template #default="scope">
            {{ formatTime(scope.row.answerTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('form.exam.participationTime')"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import first from "@/assets/images/form/first.svg";
import third from "@/assets/images/form/third.svg";
import second from "@/assets/images/form/second.svg";
import { onMounted, ref } from "vue";
import { FormExamRankList, getExamRankList, RankList } from "@/api/exam/ranking";
import { useRoute } from "vue-router";

const route = useRoute();

const rankingList = ref<FormExamRankList | null>(null);
const rankList = ref<RankList | null>(null);
const myRank = ref<RankList | null>(null);
const getList = async () => {
  const id = route.query.uniqueId;
  const res = await getExamRankList(id);
  rankingList.value = res.data;
  myRank.value = res.data.myRank;
  rankList.value = res.data.rankList;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}分${seconds}秒`;
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 500px) {
  .container-wrap-central {
    width: 450px !important;
    margin: 10px auto 0 !important;
  }
  .container-wrap-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .wrap-rate {
      font-size: 14px !important;
      color: #707070 !important;
      line-height: 14px !important;
      i {
        font-size: 14px !important;
        color: #2672ff !important;
        line-height: 14px !important;
      }
    }
  }
  .container-wrap-template {
    width: 450px !important;
    margin: 10px auto 0 !important;
  }
}

.ranking-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow-y: auto;
  .container-wrap-head {
    width: 100%;
    height: 310px;
    background-image: url("@/assets/images/form/ranking.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      margin-top: 50px;
      font-size: 24px;
      color: #ffffff;
      font-weight: 500;
    }

    span {
      margin-top: 10px;
      font-size: 14px;
      color: #ffffff;
    }

    .container-wrap-mark {
      margin-top: 80px;
      font-size: 36px;
      font-weight: bold;
      color: #ffffff;
    }
    .container-wrap-rank {
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .container-wrap-central {
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 900px;
    height: 138px;
    border-radius: 10px;
    margin: -35px auto 0;
    display: flex;
    flex-direction: column;
    padding: 25px;
  }

  .wrap-title {
    font-size: 14px;
    color: #484848;
  }

  .wrap-rate {
    font-size: 12px;
    color: #484848;
    margin-left: 5px;

    i {
      font-size: 12px;
      color: #ff6d56;
      line-height: 14px;
      margin: 0 4px;
    }
  }

  .container-wrap-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 22px;
  }
  .content-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .content-title {
      font-size: 12px;
      color: #3d3d3d;
    }
    .content-text {
      font-size: 18px;
      font-weight: bold;
      color: #3d3d3d;
      margin-top: 10px;
    }
  }
  .container-wrap-template {
    width: 100%;
    max-width: 900px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    box-sizing: border-box;
    margin: 18px auto;
    background: #ffffff;
    padding: 25px 25px 18px;
    display: flex;
    flex-direction: column;
  }

  .total-rank {
    font-size: 14px;
    font-weight: bold;
    line-height: normal;
    color: #3d3d3d;
  }
  .table-wrap {
    width: 85%;
    margin: 30px auto 0;
    :deep(.el-table__inner-wrapper::before) {
      height: 0;
    }
    :deep(.el-table__cell) {
      border-bottom: none;
    }
  }
}
</style>
