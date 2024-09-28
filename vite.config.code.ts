import { defineConfig } from "vite";
import { expressCodePlugin } from "vite-express-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [expressCodePlugin()],
  build: {
    emptyOutDir: false,
    // outDir: ".tmp",
    outDir: "dist",
    target: "chrome58",
    rollupOptions: {
      output: {
        manualChunks: {},
        entryFileNames: `code.js`,
      },
      input: "./src-code/code.ts",
    },
  },
});
