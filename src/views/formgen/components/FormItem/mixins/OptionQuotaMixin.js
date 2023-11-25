import { getRequest } from "@/api/baseRequest";

export default {
  props: {},
  data() {
    return {
      // 使用名额 key 为选项的value 值是为使用了的名额
      usedQuotaMap: {}
    };
  },
  watch: {},
  created() {
    // 查询投票详情 设计模式下不查询
    if (this.$attrs.mode === "design") return;
    // 设置了名额的选项
    const arr = this.item.config.options.filter(e => {
      return typeof e.quotaSetting === "number";
    });
    if (arr.length) {
      this.getOptionUsedQuota();
    }
  },
  methods: {
    getOptionUsedQuota() {
      console.log(this.item);
      getRequest("/form/ext/getOptionUsedQuota", {
        formKey: this.$route.params.key || this.$route.query.key,
        formItemId: this.item.formItemId
      }).then(res => {
        this.usedQuotaMap = res.data;
      });
    }, // 获取剩余名额
    getSurplusQuota(option) {
      let usedQuota = this.usedQuotaMap[option.value] || 0;
      return option.quotaSetting > usedQuota ? option.quotaSetting - usedQuota : 0;
    }, // 是否显示名额
    isHideQuota(option) {
      return this.item.config.hideQuota && this.getSurplusQuota(option) <= 0;
    },
    // 显示名额
    showQuota(option) {
      return !this.item.config.hideChoiceWhenQuotaEmpty && typeof option.quotaSetting === "number";
    }
  }
};
