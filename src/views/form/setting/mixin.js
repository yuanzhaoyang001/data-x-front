import { baseUrl, getToken } from "@/utils/auth";
import { mapState } from "pinia";
import { useUserInfo } from "@/stores/userInfo";

export default {
  data() {
    return {
      formKey: null
    };
  },
  computed: {
    ...mapState(useUserInfo, ["userInfos"]),
    getUploadHeader() {
      return {
        Authorization: "Bearer " + getToken()
      };
    },
    getUploadUrl() {
      return `${baseUrl}/user/file/upload`;
    },
    getUserInfo() {
      return this.userInfos;
    }
  },
  created() {
    this.formKey = this.$route.query.key;
  },
  mounted() {},
  methods: {}
};
