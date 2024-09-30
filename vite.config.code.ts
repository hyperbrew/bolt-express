import { defineConfig } from "vite";
import { expressCodePlugin } from "vite-express-plugin";

export default defineConfig({
  plugins: [
    //@ts-ignore
    expressCodePlugin(),
  ],
  build: {
    emptyOutDir: false,
    outDir: ".tmp",
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
