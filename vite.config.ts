import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte"; // BOLT_SVELTE_ONLY
import sveltePreprocess from "svelte-preprocess"; // BOLT_SVELTE_ONLY
import react from "@vitejs/plugin-react"; // BOLT_REACT_ONLY
import vue from "@vitejs/plugin-vue"; // BOLT_VUE_ONLY
import {
  expressPlugin,
  expressPluginInit,
  runAction,
} from "vite-express-plugin";

import { cpSync, rmSync, readdirSync } from "fs";
import { join } from "path";
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
  readdirSync(process.cwd()).forEach((file) => {
    if (file.includes("config.ts.timestamp-")) {
      rmSync(join(process.cwd(), file));
    }
  });

  process.exit();
}

expressPluginInit(mode);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.HMR_PORT": JSON.stringify(config.hmrPort),
  },
  plugins: [
    react(), // BOLT_REACT_ONLY
    vue(), // BOLT_VUE_ONLY
    svelte({ preprocess: sveltePreprocess({ typescript: true }) }), // BOLT_SVELTE_ONLY
    expressPlugin(config, mode),
  ],
  base: "./",
  build: {
    outDir: ".tmp",
    emptyOutDir: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  server: {
    port: config.hmrPort,
  },
});
