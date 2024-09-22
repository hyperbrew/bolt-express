import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte"; // BOLT_SVELTE_ONLY
import sveltePreprocess from "svelte-preprocess"; // BOLT_SVELTE_ONLY

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess({ typescript: true }) }), // BOLT_SVELTE_ONLY
  ],
  base: "./",
  build: {
    outDir: "dist",
  },
});
