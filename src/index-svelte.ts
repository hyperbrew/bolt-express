import "./index.scss";
import App from "./main.svelte";

const mode = import.meta.env.MODE; // "dev" | "production" | "staging"

const devUrl = "http://localhost:5173/";
if (mode === "staging" && location.href !== devUrl) location.href = devUrl;

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
