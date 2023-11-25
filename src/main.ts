import { createApp } from "vue";
import pinia from "@/stores/index";
import App from "@/App.vue";
import router from "@/router";
import { directive } from "@/directive";
import { setupI18n } from "@/i18n";
import other from "@/utils/other";
import ElementPlus from "element-plus";
import { business } from "@/utils/business";
import { install } from "@/components";
import "element-plus/dist/index.css";
import "@/theme/index.scss";
// svg icons
import "virtual:svg-icons-register";

const app = createApp(App);

directive(app);
business(app);
install(app);
other.elSvg(app);
await setupI18n(app);
app.use(pinia).use(router).use(ElementPlus).mount("#app");

export default app;
