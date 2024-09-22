import type {
  ExpressConfig,
  PluginManifest,
} from "vite-express-plugin/lib/types";
import { version } from "./package.json";

export const manifest: PluginManifest = {
  testId: "63ca98b1-9551-4eb7-aa4f-dc494c79f23d",
  name: "Gradients",
  version: "1.0.3",
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
