import "./index.scss";
import App from "./main.svelte";
import { initBolt } from "./utils/utils";
initBolt();

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
