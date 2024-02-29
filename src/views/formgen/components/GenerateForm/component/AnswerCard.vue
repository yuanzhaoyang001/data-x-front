<template>
  <div
    class="answer-card"
    v-if="showAnswerCard"
  >
    <div
      class="answer-card-pc"
      v-if="!isMobile()"
    >
      <div class="answer-card__header">
        <div class="answer-card__header__title">答题卡</div>
      </div>
      <div class="answer-card__body">
        <div
          v-for="(filed, index) in tempAnswerList"
          :key="index"
          class="answer-card__body__item"
          @click="emit('item-click', filed.config.formId)"
          :class="[
            answeredStatusMap[filed.config.formId] ? 'answered' : '',
            markedQuestionList.includes(filed.config.formId) ? 'dot' : ''
          ]"
        >
          {{ fieldIdIndex[filed.config.formId] + 1 }}
        </div>
      </div>
      <div class="answer-card__footer">
        <div
          class="answer-card__footer__item"
          @click="handleAnswered"
        >
          <span
            class="answered"
            :class="[answeredStatus ? 'answered-active' : '']"
          />
          已答
        </div>
        <div
          class="answer-card__footer__item"
          @click="handleNotAnswered"
        >
          <span
            class="not-answered"
            :class="[notAnsweredStatus ? 'not-answered-active' : '']"
          />
          未答
        </div>
        <div
          class="answer-card__footer__item"
          @click="handleFlagAnswered"
        >
          <el-icon><ele-Flag /></el-icon>
          标记
        </div>
      </div>
    </div>
    <div
      v-else
      class="answer-card-mobile"
    >
      <div
        class="answer-sheet-switch"
        @click="popupShow = true"
      >
        <enter-the-keyboard
          theme="outline"
          size="18"
          fill="#333"
          :strokeWidth="3"
          strokeLinejoin="bevel"
          class="flex-icon"
        />
        答题卡
      </div>
      <van-popup
        v-model:show="popupShow"
        round
        position="bottom"
        :style="{ height: '50%', padding: '20px' }"
      >
        <div class="answer-card__header">
          <div class="answer-card__header__title">答题卡</div>
        </div>
        <div class="answer-card__footer">
          <div
            class="answer-card__footer__item"
            @click="handleAnswered"
          >
            <span
              class="answered"
              :class="[answeredStatus ? 'answered-active' : '']"
            />
            已答
          </div>
          <div
            class="answer-card__footer__item"
            @click="handleNotAnswered"
          >
            <span
              class="not-answered"
              :class="[notAnsweredStatus ? 'not-answered-active' : '']"
            />
            未答
          </div>
          <div
            class="answer-card__footer__item"
            @click="handleFlagAnswered"
          >
            <el-icon><ele-Flag /></el-icon>
            标记
          </div>
        </div>
        <div class="answer-card__body">
          <div
            v-for="(filed, index) in tempAnswerList"
            :key="index"
            class="answer-card__body__item"
            @click="emit('item-click', filed.config.formId)"
            :class="[
              answeredStatusMap[filed.config.formId] ? 'answered' : '',
              markedQuestionList.includes(filed.config.formId) ? 'dot' : ''
            ]"
          >
            {{ fieldIdIndex[filed.config.formId] + 1 }}
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup lang="ts" name="AnswerCard">
import { PropType, ref, watch } from "vue";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { EnterTheKeyboard } from "@icon-park/vue-next";
import { useUserForm } from "@/stores/userForm";
import { useExamForm } from "@/views/formgen/components/GenerateForm/hooks/useExamHook";
import { isMobile } from "@/utils/other";

const props = defineProps({
  fieldList: {
    type: Array as PropType<BasicComponent[]>,
    default: () => []
  },
  models: {
    type: Object as PropType<any>,
    default: () => {}
  }
});

const examFormHook = useExamForm();

const { showAnswerCard } = examFormHook;

// 记录题目id和编号
interface FieldIdIndex {
  [key: string]: number;
}

const popupShow = ref<boolean>(false);

// 临时显示的答题卡列表
const tempAnswerList = ref<BasicComponent[]>([]);

const fieldIdIndex = ref<FieldIdIndex>({});

// 监听fieldList
watch(
  () => props.fieldList,
  () => {
    const { fieldList } = props;
    fieldList.forEach((item: BasicComponent, index: number) => {
      fieldIdIndex.value[item.config.formId] = index;
    });
    tempAnswerList.value = fieldList;
  },
  {
    deep: true,
    immediate: true
  }
);

//  维护是否填写状态

// 记录题目id和编号
interface AnsweredStatusMap {
  [key: string]: boolean;
}
const answeredStatusMap = ref<AnsweredStatusMap>({});

watch(
  () => props.models,
  () => {
    for (let key of Object.keys(props.models)) {
      const status = props.models[key];
      if (status === null || status === undefined) {
        continue;
      }
      // 如果是数组
      if (Array.isArray(status)) {
        answeredStatusMap.value[key] = (status.length && status.length > 0) as boolean;
      } else if (typeof status === "object") {
        answeredStatusMap.value[key] = Object.keys(status).length > 0;
      } else {
        answeredStatusMap.value[key] = !!status;
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
);

const answeredStatus = ref<boolean>(false);
const notAnsweredStatus = ref<boolean>(false);
const flagStatus = ref<boolean>(false);

const handleAnswered = () => {
  if (!answeredStatus.value) {
    tempAnswerList.value = props.fieldList?.filter((item: BasicComponent) => answeredStatusMap.value[item.config.formId]);
  } else {
    tempAnswerList.value = props.fieldList;
  }
  answeredStatus.value = !answeredStatus.value;
};

const handleNotAnswered = () => {
  if (!answeredStatus.value) {
    tempAnswerList.value = props.fieldList?.filter((item: BasicComponent) => !answeredStatusMap.value[item.config.formId]);
  } else {
    tempAnswerList.value = props.fieldList;
  }
  notAnsweredStatus.value = !notAnsweredStatus.value;
};

const userFormStore = useUserForm();

const { markedQuestionList } = userFormStore;

const handleFlagAnswered = () => {
  if (!flagStatus.value) {
    tempAnswerList.value = props.fieldList?.filter((item: BasicComponent) => markedQuestionList.includes(item.config.formId));
  } else {
    tempAnswerList.value = props.fieldList;
  }
  flagStatus.value = !flagStatus.value;
};

const emit = defineEmits(["item-click"]);
</script>

<style scoped lang="scss">
.answer-card-pc {
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 70px;
  transition: all 0.3s linear;
  padding: 12px;
  //box-shadow: var(--el-box-shadow);
  max-height: 400px;
  width: 230px;
  z-index: 10000;
  margin-left: -250px;
}

.answer-card-mobile {
  height: 30px;
  line-height: 30px;
  position: relative;
  box-shadow: var(--el-box-shadow-light);

  .answer-sheet-switch {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;
  }

  .i-icon {
    margin-right: 5px;
  }

  .answer-card__body {
    margin-top: 0;
  }
}

.answer-card__header {
  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 36px;
  }
  border-bottom: var(--el-border);
}

.answer-card__body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15px;

  &__item {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--form-theme-hover-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333;
    margin: 5px;
    cursor: pointer;
  }

  // 右上角增加红点
  .dot {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--el-color-danger);
    }
  }

  .answered {
    background-color: var(--form-theme-color);
    color: #ffffff;
  }

  &__item:hover {
    background-color: var(--form-theme-color);
    color: #ffffff;
  }
}
.answer-card__footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5px;
  margin-top: 5px;
  &__item {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #333;
    margin: 5px;
    cursor: pointer;

    .el-icon {
      font-size: 16px;
      color: var(--el-color-danger);
    }
  }

  .answered-active {
    background-color: var(--form-theme-color);
    color: #ffffff;
  }

  .answered-active {
    background-color: var(--form-theme-color);
    color: #ffffff;
  }

  span {
    width: 14px;
    height: 14px;
    display: inline-block;
    border-radius: 3px;
    background-color: var(--form-theme-hover-color);
    margin-right: 2px;
    cursor: pointer;
  }

  .not-answered {
    background-color: var(--el-color-warning-light-8);
  }

  .not-answered-active {
    background-color: var(--el-color-warning);
  }
}

@media screen and (max-width: 1288px) {
  .answer-card-pc {
    visibility: hidden;
  }
}
</style>
