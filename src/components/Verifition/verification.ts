// src/components/Confirm/index.js
import { createApp } from "vue";
import Verification from "./verification.vue";

function VerificationBox(options = {}) {
  return new Promise((resolve, reject) => {
    // 实例化组件，createApp第二个参数是props
    const confirmInstance = createApp(Verification, {
      ...options,
      verifySuccess: (code: string) => {
        unmount();
        resolve(code);
      },
      onCancel: () => {
        unmount();
        reject(new Error());
      }
    });
    // 卸载组件
    const unmount = () => {
      confirmInstance.unmount();
      document.body.removeChild(parentNode);
    };
    // 创建一个挂载容器
    const parentNode = document.createElement("div");
    document.body.appendChild(parentNode);
    // 挂载组件
    confirmInstance.mount(parentNode);
  });
}

export default VerificationBox;
