import addOnSandboxSdk from "add-on-sdk-document-sandbox";

import { editor, colorUtils } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

console.log("Sandbox code is running nowww");

const sandboxApi = {
  createBox: (width: number, height: number) => {
    const insertionParent = editor.context.insertionParent;
    const rectangle = editor.createRectangle();
    rectangle.width = width;
    rectangle.height = height;
    rectangle.translation = { x: 100, y: 20 };
    const rectFill = editor.makeColorFill(
      colorUtils.fromRGB(
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
      ),
    );
    rectangle.fill = rectFill;
    insertionParent.children.append(rectangle);
    return true;
  },
};

export type SandboxRemoteType = typeof sandboxApi;

async function start() {
  runtime.exposeApi(sandboxApi);
}

start();
