import { onMounted, ref, useAttrs, watch } from "vue";
import { getRequest } from "@/api/baseRequest";
import { useRouter } from "vue-router";

export function useVoteHook(props: any) {
  /**
   * // 总投票数
   *       totalVote: 0, // 投票详情
   *       //旧的投票详情
   *       oldVoteList: [{}],
   *       //计算后的投票详情
   *       voteList: []
   */
  const totalVote = ref(0);
  const oldVoteList = ref([]);
  const voteList = ref([]);

  watch(
    voteList,
    newVal => {
      totalVote.value = newVal.reduce((total: number, item: any) => {
        return total + item.quantity;
      }, 0);
    },
    {
      deep: true
    }
  );

  const attrs = useAttrs();

  const router = useRouter();

  const getVoteList = () => {
    getRequest("/form/ext/getVoteCount", {
      formKey: router.currentRoute.value.params.key,
      formItemId: props.item.config.formId
    }).then(res => {
      oldVoteList.value = res.data;
      voteList.value = oldVoteList.value;
    });
  };

  /**
   * 单选
   * @param value
   */
  const handleVote = (value: any) => {
    let voteList = JSON.parse(JSON.stringify(oldVoteList.value));
    // 查找
    let index = oldVoteList.value.findIndex((item: any) => value == item.value);
    if (index === -1) {
      if (value !== "") {
        voteList.push({
          value,
          quantity: 1
        });
      }
    } else {
      voteList[index].quantity++;
    }
    voteList.value = voteList;
  };

  const handleArrayVote = (value: any) => {
    let voteList = JSON.parse(JSON.stringify(oldVoteList.value));
    // 查找
    value.forEach((v: any) => {
      let index = oldVoteList.value.findIndex((item: any) => v == item.value);
      if (index === -1) {
        voteList.push({
          value: v,
          quantity: 1
        });
      } else {
        voteList[index].quantity++;
      }
      voteList.value = voteList;
    });
  };

  onMounted(() => {
    // 查询投票详情 设计模式下不查询
    if (attrs.mode === "design") return;
    if (props.item.config.showVoteResult) {
      getVoteList();
    }
  });

  return {
    handleVote,
    handleArrayVote,
    voteList,
    totalVote
  };
}
