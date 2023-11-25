<template>
  <div class="app-container">
    <el-tabs
      type="card"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="$t('project.todo.watiWrite')"
        name="todo"
      >
        <todo-form />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('project.todo.writed')"
        name="finish"
      >
        <finish-form />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TodoForm from "@/views/project/todo/todo.vue";
import FinishForm from "@/views/project/todo/finish.vue";

export default {
  name: "TodoIndex",
  components: { TodoForm, FinishForm },
  data() {
    return {
      activeName: "todo"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
