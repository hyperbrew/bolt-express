import { createApp } from "vue";
import App from "./main.vue";
import "./index.scss";

const mode = import.meta.env.MODE; // "dev" | "production" | "staging"

const devUrl = "http://localhost:5173/";
if (mode === "staging" && location.href !== devUrl) location.href = devUrl;

createApp(App).mount("#app");
