import "./app.css";
import App from "./app.svelte";

const mode = import.meta.env.MODE; // "development" or "production"

const devUrl = "http://localhost:5173/";
if (mode === "dev" && location.href !== devUrl) location.href = devUrl;

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
