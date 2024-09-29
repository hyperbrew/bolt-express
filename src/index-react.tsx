import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { App } from "./main.tsx";
import { initBolt } from "./utils/utils";
initBolt();

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
