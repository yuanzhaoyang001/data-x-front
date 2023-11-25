import { i18n } from "@/i18n";

function All() {}

All.prototype = {
  timer: "",
  debounce(fn, delay = 500) {
    let _this = this;
    return function (arg) {
      //获取函数的作用域和变量
      let that = this;
      let args = arg;
      clearTimeout(_this.timer); // 清除定时器
      _this.timer = setTimeout(function () {
        fn.call(that, args);
      }, delay);
    };
  },
  arrToStr(arr) {
    if (arr) {
      return arr
        .map(item => {
          return item.name;
        })
        .toString();
    }
  },
  toggleClass(arr, elem, key = "id") {
    return arr.some(item => {
      return item[key] == elem[key];
    });
  },
  toChecked(arr, elem, key = "id") {
    let isIncludes = this.toggleClass(arr, elem, key);
    !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
  },
  removeEle(arr, elem, key = "id") {
    let includesIndex;
    arr.map((item, index) => {
      if (item[key] == elem[key]) {
        includesIndex = index;
      }
    });
    arr.splice(includesIndex, 1);
  }, // 审批人显示文案
  setApproverStr(nodeConfig) {
    if (nodeConfig.settype === 1) {
      if (nodeConfig.nodeUserList.length > 0) {
        return nodeConfig.nodeUserList[0].nickName;
      } else if (nodeConfig.nodeRoleList.length > 0) {
        return nodeConfig.nodeRoleList[0].roleName;
      } else if (nodeConfig.nodePostList.length > 0) {
        return nodeConfig.nodePostList[0].postName;
      }
    } else if (nodeConfig.settype === 2) {
      return i18n.global.t("workflow.flowDesign.departmentManager");
    } else if (nodeConfig.settype === 3) {
      return i18n.global.t("workflow.flowDesign.sponsoring");
    } else if (nodeConfig.settype === 4) {
      return i18n.global.t("workflow.flowDesign.formField");
    }
  },
  dealStr(str, obj) {
    let arr = [];
    let list = str.split(",");
    for (let elem in obj) {
      list.map(item => {
        if (item == elem) {
          arr.push(obj[elem].value);
        }
      });
    }
    return arr.join(i18n.global.t("workflow.flowDesign.or"));
  },
  conditionStr(nodeConfig, index) {
    if (!nodeConfig || !nodeConfig.conditionList) {
      return i18n.global.t("workflow.flowDesign.addBranch");
    }
    let { conditionList } = nodeConfig;
    if (conditionList.length == 0) {
      return i18n.global.t("workflow.flowDesign.addBranch");
    }
    return i18n.global.t("workflow.flowDesign.viewBranch");
  },
  copyerStr(nodeConfig) {
    if (nodeConfig.nodeUserList.length != 0) {
      return nodeConfig.nodeUserList[0].nickName;
      // return this.arrToStr(nodeConfig.nodeUserList)
    } else {
      if (nodeConfig.ccSelfSelectFlag == 1) {
        return i18n.global.t("workflow.flowDesign.himselfSelect");
      }
    }
  },
  toggleStrClass(item, key) {
    let a = item.zdy1 ? item.zdy1.split(",") : [];
    return a.some(item => {
      return item == key;
    });
  }
};

export default new All();
