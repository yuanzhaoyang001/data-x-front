import { App } from "vue";
import RightToolbar from "./RightToolbar/index.vue";
import Pagination from "./Pagination/index.vue";
import ImageUpload from "./ImageUpload/index.vue";
import Tinymce from "./tinymce/index.vue";
import DictTag from "./DictTag/index.vue";
import Crontab from "./Crontab/index.vue";

export function install(app: App) {
  app.component("RightToolbar", RightToolbar);
  app.component("Pagination", Pagination);
  app.component("ImageUpload", ImageUpload);
  app.component("Tinymce", Tinymce);
  app.component("DictTag", DictTag);
  app.component("Crontab", Crontab);
}
