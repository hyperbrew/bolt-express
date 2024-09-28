import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte"; // BOLT_SVELTE_ONLY
import sveltePreprocess from "svelte-preprocess"; // BOLT_SVELTE_ONLY
import {
  expressPlugin,
  expressPluginInit,
  runAction,
} from "vite-express-plugin";

import { cpSync } from "fs";
import { config } from "./express.config";

const action = process.env.ACTION;
const mode = process.env.MODE || process.argv[4] || "";
console.log("ACTION", action);
console.log("MODE", mode);

if (action)
  runAction(
    {},
    // config,
    action
  );

if (mode === "copy") {
  console.log("COPY ONLY");
  cpSync(".tmp", "dist", { recursive: true });
  process.exit(0);
}

expressPluginInit(mode);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess({ typescript: true }) }), // BOLT_SVELTE_ONLY
    expressPlugin(config, mode),
  ],
  base: "./",
  build: {
    outDir: ".tmp",
    emptyOutDir: false,
  },
});
