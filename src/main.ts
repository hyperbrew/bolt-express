import "./app.css";
import App from "./app.svelte";

// DEV ONLY
if (location.href !== "http://localhost:5173/") {
  location.href = "http://localhost:5173/";
}

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
