import { createApp } from "vue";
import App from "./main.vue";
import "./index.scss";
import { initBolt } from "./utils/utils";
initBolt();

createApp(App).mount("#app");
