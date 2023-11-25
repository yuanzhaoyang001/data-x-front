<template>
  <div class="left-menu-wrap">
    <el-button
      v-if="topNavBarActive === '/project'"
      class="ml-20 mt20 create-form"
      @click="handleOpenCreateForm"
      v-hasPermi="['form:my:create']"
    >
      ＋ {{ $t("form.formLayout.newProject") }}
    </el-button>
    <el-menu
      :class="topNavBarActive !== '/project' ? 'mt20' : ''"
      :default-active="leftNavBarActive"
      router
    >
      <el-menu-item
        v-for="nav in currentLeftNavBarList"
        :key="nav.path"
        :index="nav.path"
        @click="handleLeftNabBarSelect(nav)"
      >
        <div
          :class="[nav.path === leftNavBarActive ? 'active' : '']"
          class="item-content"
        >
          <i :class="nav.meta.icon" />
          <span>{{ $t(`${nav.meta.title}`) }}</span>
        </div>
      </el-menu-item>
    </el-menu>
    <div
      class="logout"
      @click="logoutList"
    >
      <logout
        :stroke-width="8"
        class="mr5 mt3"
        fill="#333"
        size="14"
        stroke-linejoin="bevel"
        theme="outline"
      />
      <span>{{ $t("form.formLayout.logOut") }}</span>
    </div>
    <CreateForm
      ref="createFormRef"
      :folder-id="currentFormFolder?.id"
    />
  </div>
</template>

<script lang="ts" name="HomeLayoutLeftMenu" setup>
import { storeToRefs } from "pinia";
import CreateForm from "@/views/project/my/CreateForm.vue";
import { useFormInfo } from "@/stores/formInfo";
import { Logout } from "@icon-park/vue-next";
import { Session } from "@/utils/storage";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

defineProps({
  topNavBarActive: {
    type: String,
    default: ""
  },
  leftNavBarActive: {
    type: String,
    default: ""
  },
  currentLeftNavBarList: {
    type: Array,
    default: () => []
  }
});

const logoutList = () => {
  Session.clear();
  router.push("/login");
};

const emit = defineEmits(["select"]);

const handleLeftNabBarSelect = (nav: any) => {
  emit("select", nav);
};

const createFormRef = ref(null);

const formInfoStore = useFormInfo();

const { currentFormFolder } = storeToRefs(formInfoStore);

const handleOpenCreateForm = async () => {
  await createFormRef.value?.showForm();
};
</script>

<style lang="scss" scoped>
.left-menu-wrap {
}

.el-menu-item {
  margin-top: 4px;
}

.item-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  padding-left: 35px;
  color: var(--el-text-color-primary);
  width: 100%;
  border-radius: var(--el-border-radius-base);

  i {
    padding-right: 5px;
  }
}

.item-content:hover {
  background-color: #f2f3f8;
  color: var(--el-color-primary);
}

.active {
  font-weight: bold;
  background-color: #f2f3f8;
  color: var(--el-color-primary);
}

.create-form {
  color: #ffffff;
  width: 80%;
  height: 39px;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: rgba(94, 96, 211, 0.94);
}

.create-form:hover {
  background-color: #4c4edb;
}

.logout {
  position: absolute;
  top: 95%;
  margin-left: 65px;
  cursor: pointer;
  display: flex;

  .i-icon:hover {
    transform: scale(1.1);
  }
}

.logout:hover {
  color: #4c4edb;
}
</style>
