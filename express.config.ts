import type {
  ExpressConfig,
  PluginManifest,
} from "vite-express-plugin/lib/types";
import { version } from "./package.json";

export const manifest: PluginManifest = {
  testId: "bolt-express",
  name: "Bolt Express",
  version: "1.0.0",
  manifestVersion: 2,
  requirements: {
    apps: [
      {
        name: "Express",
        apiVersion: 1,
      },
    ],
  },
  entryPoints: [
    {
      type: "panel",
      id: "panel1",
      main: "index.html",
      documentSandbox: "code.js",
    },
  ],
};

const extraPrefs = {
  copyZipAssets: ["public-zip/*"],
};

export const config: ExpressConfig = {
  manifest,
  version,
  ...extraPrefs,
};
