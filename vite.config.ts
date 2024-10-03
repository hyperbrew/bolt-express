import { defineConfig, PluginOption } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte"; // BOLT_SVELTE_ONLY
import sveltePreprocess from "svelte-preprocess"; // BOLT_SVELTE_ONLY
import react from "@vitejs/plugin-react"; // BOLT_REACT_ONLY
import vue from "@vitejs/plugin-vue"; // BOLT_VUE_ONLY
import {
  expressPlugin,
  expressPluginInit,
  runAction,
} from "vite-express-plugin";

import mkcert from 'vite-plugin-mkcert';

import { config } from "./express.config";

const action = process.env.ACTION;
const mode = process.env.MODE || "";

if (action) runAction(config, action);
expressPluginInit(mode);

export default defineConfig({
  define: {
    "process.env.HMR_PORT": JSON.stringify(config.hmrPort),
  },
  plugins: [
    react(), // BOLT_REACT_ONLY
    vue(), // BOLT_VUE_ONLY
    svelte({ preprocess: sveltePreprocess({ typescript: true }) }), // BOLT_SVELTE_ONLY
    //@ts-ignore
    expressPlugin(config, mode),
    mkcert()
  ],
  base: "./",
  build: {
    outDir: ".tmp",
    emptyOutDir: false,
  },

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: "modern",
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  server: {

    port: config.hmrPort,
  },
});
