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

const tmp = "./.tmp";
const dist = "./dist";
const index = "./index.html";

export const expressPluginInit = (mode: string) => {
  fs.mkdirSync(tmp, { recursive: true });
  fs.mkdirSync(dist, { recursive: true });
  if (mode === "build" || mode === "zip") {
    emptyFolder(tmp);
  }
  startCodeWatcher(mode);
};

export const expressPlugin: (config: ExpressConfig, mode?: string) => Plugin = (
  config: ExpressConfig,
  mode?: string,
) => ({
  name: "vite-express-plugin",
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
      path.join(tmp, "manifest.json"),
      JSON.stringify(config.manifest, null, 2),
    );
    //#
    if (mode === "build" || mode === "zip") {
      emptyFolder(dist);
      fs.cpSync(tmp, dist, { recursive: true });
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

const triggerHMR = () => {
  // No built-in way to trigger Vite's HMR reload from outside the root folder
  // Workaround will read and save index.html file for each panel to triggger reload
  console.log("Code Change");
  const txt = fs.readFileSync(index, { encoding: "utf-8" });
  fs.writeFileSync(index, txt, { encoding: "utf-8" });
};

let i = 0;
export const expressCodePlugin: () => Plugin = () => ({
  name: "trigger-hmr",
  closeBundle() {
    const isDevMode = process.argv[3] === "--watch";
    if (isDevMode && i > 0) triggerHMR();
    i++;
  },
});

export const runAction = (config: ExpressConfig, action: string) => {
  if (action === "dependencyCheck") {
    console.log("Checking Dependencies");
    packageSync();
  } else if (action === "copy") {
    console.log("COPY ONLY from: ", process.cwd());
    fs.readdirSync(process.cwd()).forEach((file) => {
      if (file.includes("config.ts.timestamp-")) {
        fs.rmSync(path.join(process.cwd(), file));
      }
    });
    fs.cpSync(
      path.join(process.cwd(), ".tmp"),
      path.join(process.cwd(), "dist"),
      { recursive: true },
    );
  }
  process.exit();
};
