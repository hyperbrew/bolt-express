import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { App } from "./main";

const mode = import.meta.env.MODE; // "dev" | "production" | "staging"

const devUrl = "http://localhost:5173/";
if (mode === "staging" && location.href !== devUrl) location.href = devUrl;

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
