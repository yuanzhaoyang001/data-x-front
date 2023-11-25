import * as Vue from "vue";
import process from "./index.vue"; // 引入刚才的 toast 组件

let processConstructor = process;
let instance;

const Process = function (options = {}) {
  instance = new processConstructor({
    data: options // 这里的 data 会传到 message.vue 组件中的 data 中，当然也可以写在 props 里
  });
  document.body.appendChild(instance.$mount().$el); // 挂载到 body 下
  Vue.nextTick(() => {
    instance.visible = true;
  });
};
export default Process;
