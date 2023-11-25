<template>
  <matrix-option :active-data="activeData" />
</template>

<script>
import MatrixOption from "./matrix.vue";

import draggable from "vuedraggable";

export default {
  name: "ConfigItemMatrixInput",
  components: {
    MatrixOption,
    draggable
  },
  props: ["activeData"],
  data() {
    return {};
  }
};
</script>
