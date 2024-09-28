// import { getStore, setStore, listenTS, dispatchTS } from "./utils/code-utils";

console.log("Hello World from CODE!");
//

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

async function start() {
  const sandboxApi = {
    createShapes: function () {
      addOnSandboxSdk.instance.runtime.apiProxy.console.log(
        "Creating shapes 6"
      );
      const insertionParent = editor.context.insertionParent;

      const rectangle = editor.createRectangle();
      rectangle.width = 400;
      rectangle.height = 800;
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
  runtime.exposeApi(sandboxApi);
}

start();
