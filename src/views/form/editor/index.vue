<template>
  <TopNav :form-key="formKey" />
  <router-view />
</template>

<script>
import TopNav from "@/views/formgen/components/FormDesign/TopNav.vue";

export default {
  name: "FormEditor",
  components: {
    TopNav
  },
  data() {
    return {
      formKey: ""
    };
  },
  computed: {},
  created() {
    this.formKey = this.$route.query.key;
  },
  methods: {}
};
</script>
