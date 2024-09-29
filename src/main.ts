import "./app.css";
import App from "./main.svelte";
import { initBolt } from "./utils/utils";

const mode = import.meta.env.MODE; // "dev" | "production" | "staging"

const devUrl = "http://localhost:5173/";
if (mode === "staging" && location.href !== devUrl) location.href = devUrl;

initBolt();
const app = new App({
  target: document.getElementById("app")!,
});

export default app;
