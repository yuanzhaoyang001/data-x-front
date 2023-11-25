import func from "../preload";
import {
  getDepartmentListRequest,
  getEmployeeListRequest,
  getRoleListRequest,
  getPostListRequest
} from "@/api/system/organization";

export default {
  data() {
    return {
      func: func,
      visibleDialog: false,
      searchVal: "",
      activeName: "1",
      firstDept: {},
      departments: {},
      roles: [],
      posts: []
    };
  },
  methods: {
    getRoleList(searchName = "") {
      getRoleListRequest({ searchName: searchName }).then(res => {
        this.roles = res.data;
      });
    },
    getPostList(searchName = "") {
      getPostListRequest({ searchName: searchName }).then(res => {
        this.posts = res.data;
      });
    },
    getDepartmentList(parentId = 0) {
      getDepartmentListRequest({ parentId: parentId }).then(res => {
        if (parentId == 0) {
          let { childDepartments } = res.data;
          if (childDepartments && childDepartments[0]) {
            this.firstDept = childDepartments[0];
            this.getDepartmentList(this.firstDept.id);
          }
        } else {
          this.departments = res.data;
        }
      });
    },
    getDebounceData(value, type = 1) {
      this.func.debounce(
        function () {
          if (value) {
            if (type == 1) {
              this.departments.childDepartments = [];
              getEmployeeListRequest({ searchName: value }).then(res => {
                this.departments.employees = res.data;
              });
            } else {
              this.getRoleList(value);
            }
          } else {
            type == 1 ? this.getDepartmentList() : this.getRoleList();
          }
        }.bind(this)
      )();
    }
  }
};
