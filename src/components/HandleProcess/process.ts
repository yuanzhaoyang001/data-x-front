import { render, createVNode } from "vue";

import HandleProcess from "./index.vue";

export const getInstance = (options = {}) => {
  const mountNode = document.createElement("div");

  const app = createVNode(HandleProcess, options);

  render(app, mountNode);

  document.body.appendChild(mountNode);
};

const TProcess = (opts: any) => {
  return getInstance(opts);
};

export default TProcess;
