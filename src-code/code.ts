// import { getStore, setStore, listenTS, dispatchTS } from "./utils/code-utils";

console.log("CODE A!");

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
console.log("CODE B!");
import { editor, colorUtils } from "express-document-sdk";
console.log("CODE C!");

const { runtime } = addOnSandboxSdk.instance;
console.log("CODE D!");

async function start() {
  console.log("CODE E!");
  const sandboxApi = {
    createShapes: function () {
      console.log("CODE F!");
      console.log("Creating shapes 6");
      const insertionParent = editor.context.insertionParent;

      const rectangle = editor.createRectangle();
      rectangle.width = 400;
      rectangle.height = 400;
      rectangle.translation = { x: 100, y: 20 };
      const rectFill = editor.makeColorFill(
        colorUtils.fromRGB(
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random()
        )
      );
      rectangle.fill = rectFill;
      insertionParent.children.append(rectangle);
      return "New Rect";
    },
  };

  // Expose `sandboxApi` to the UI runtime.
  console.log("CODE g!");
  runtime.exposeApi(sandboxApi);
  console.log("CODE H!");
}

start();
console.log("CODE j!");
