<template>
  <div
    :class="{ hidden: hidden }"
    class="pagination-container"
  >
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="size"
      :layout="layout"
      :page-sizes="sizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { scrollTo } from "@/utils/scrollTo";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    sizes: {
      type: Array,
      default() {
        return [5, 10, 20, 30, 50];
      }
    },
    pagerCount: {
      type: Number,
      default: () => (document.body.clientWidth < 992 ? 5 : 7)
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:page", "update:limit", "pagination"],
  setup(props, { emit }) {
    const currentPage = ref(props.page);
    const size = ref(props.limit);

    const handleSizeChange = val => {
      emit("update:limit", val);
      emit("pagination", { page: currentPage.value, limit: val });
      if (props.autoScroll) {
        scrollTo(0, 800);
      }
    };

    const handleCurrentChange = val => {
      currentPage.value = val;
      emit("update:page", val);
      emit("pagination", { page: val, limit: size.value });
      if (props.autoScroll) {
        scrollTo(0, 800);
      }
    };

    const hidden = computed(() => props.hidden);

    onMounted(() => {
      nextTick(() => {
        if (props.autoScroll) {
          scrollTo(0, 800);
        }
      });
    });

    return {
      currentPage,
      size,
      handleSizeChange,
      handleCurrentChange,
      hidden
    };
  }
});
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
