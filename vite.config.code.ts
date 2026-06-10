import { defineConfig } from "vite";
import { expressCodePlugin } from "vite-express-plugin";
import { config } from "./express.config";

export default defineConfig({
  plugins: [
    //@ts-ignore
    expressCodePlugin(config),
  ],
  build: {
    emptyOutDir: false,
    outDir: "dist",
    target: "chrome58",
    rollupOptions: {
      external: ["add-on-sdk-document-sandbox", "express-document-sdk"],
      output: {
        manualChunks: {},
        entryFileNames: `code.js`,
      },
      input: "./src-code/code.ts",
    },
  },
});
