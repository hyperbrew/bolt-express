import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import { startCodeWatcher, triggerExpressRefresh } from "./utils";
import {
  packageSync,
  emptyFolder,
  copyFilesRecursively,
  zipPackage,
} from "meta-bolt/dist/plugin-utils";
import { ExpressConfig } from "./types";
import { addonServer } from "./addon-server";
import { listeners } from "process";
import { WebSocket } from "ws";

const dist = "./dist";
const index = "./index.html";
const code = "./code.js";

// ccweb module added this code, might reuse...
const consoleOverride = (name: string) => `
    const prefixString = "[Add-on: " + "${name}" + "]";
    const originalConsole = window.console;
    window.console = {
        ...originalConsole,
        log: (...args) => originalConsole.log(prefixString, ...args),
        info: (...args) => originalConsole.info(prefixString, ...args),
        warn: (...args) => originalConsole.warn(prefixString, ...args),
        error: (...args) => originalConsole.error(prefixString, ...args),
        debug: (...args) => originalConsole.debug(prefixString, ...args),
    };
    window.addEventListener("error", event => {
        event.preventDefault();
        console.error("Uncaught Exception:", event.error);
    });
    window.addEventListener("unhandledrejection", event => {
        event.preventDefault();
        console.error("Unhandled Promise Rejection:", event.reason);
    });
`;

let serverUpdate: Function = () => {};
const hmrUpdate = () => {
  console.log("HMR UPDATE");
  serverUpdate();
};

export const expressPluginInit = (config: ExpressConfig, mode: string) => {
  // fs.mkdirSync(tmp, { recursive: true });
  fs.mkdirSync(dist, { recursive: true });
  if (mode === "build" || mode === "zip") {
    emptyFolder(dist);
  }
  startCodeWatcher(mode);
  if (mode === "dev" || mode === "serve") {
    addonServer(config).then(({ updater, listener }) => {
      serverUpdate = updater;
      listener();
    });
  }
};

export const expressPlugin: (config: ExpressConfig, mode?: string) => Plugin = (
  config: ExpressConfig,
  mode?: string,
) => ({
  name: "vite-express-plugin",
  hotUpdate({ modules }) {
    console.log("hot update");
    if (mode === "dev") {
      hmrUpdate();
    }
    // return modules.filter(condition);
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // Express requires these headers for addon servers
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  },
  transformIndexHtml(html) {
    return html
      .replace('<script type="module" crossorigin', '<script type="module"')
      .replace('<link rel="stylesheet" crossorigin', '<link rel="stylesheet"');
  },
  writeBundle() {
    // setTimeout(() => {
    // if (fs.existsSync(dist)) {
    //   emptyFolder(dist);
    // } else {
    //   fs.mkdirSync(dist, { recursive: true });
    // }
    //* write manifest
    fs.writeFileSync(
      path.join(dist, "manifest.json"),
      JSON.stringify(config.manifest, null, 2),
    );
    //#
    if (mode === "build" || mode === "zip") {
      emptyFolder(dist);
      fs.cpSync(dist, dist, { recursive: true });
      // copyFilesRecursively(tmp, dist, () => {
      //   console.log("Files Copied");
      //   triggerExpressRefresh(path.join(dist, index));
      // });
      // }, 100);
    }
  },
  async closeBundle() {
    if (mode === "zip") {
      const zipDir = path.join(process.cwd(), "zip");
      const srcDir = path.join(process.cwd(), "dist");
      const name = `${config.manifest.name}_${config.version}`;
      await zipPackage(name, zipDir, srcDir, config.copyZipAssets, false);
    }
  },
});

let i = 0;
export const expressCodePlugin: (config: ExpressConfig) => Plugin = (
  config: ExpressConfig,
) => ({
  name: "trigger-hmr",
  closeBundle() {
    const isDevMode = process.argv[3] === "--watch";
    if (isDevMode && i > 0) {
      const port = config.servePort;
      const target = `wss://localhost:${port}`;
      const ws = new WebSocket(target, { rejectUnauthorized: false });
      ws.addEventListener("open", () => {
        console.log("sending hot reload message");
        ws.send(JSON.stringify({ action: "hot-reload" }));
      });
      ws.addEventListener("message", (event) => {
        console.log("Message from server: ", event.data);
      });
      ws.addEventListener("close", (event) => {
        console.log("WS connection closed:", event.code, event.reason);
      });
      ws.addEventListener("error", (error) => {
        console.error("WS error:", error);
      });
    }
    i++;
  },
});

export const runAction = (config: ExpressConfig, action: string) => {
  if (action === "dependencyCheck") {
    console.log("Checking Dependencies");
    packageSync();
  }
  process.exit();
};
