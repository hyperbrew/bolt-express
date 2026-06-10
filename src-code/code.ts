import addOnSandboxSdk, { RuntimeType } from "add-on-sdk-document-sandbox";

import { editor, colorUtils, constants } from "express-document-sdk";

import type { UIAPIs } from "../src/utils/ui-apis";

const { runtime } = addOnSandboxSdk.instance;
let uiApis: UIAPIs;
runtime.apiProxy(RuntimeType.panel).then((res) => (uiApis = res as UIAPIs));

console.log("Sandbox code is running nowww");

const sandboxApi = {
  createBox: (width: number, height: number) => {
    const insertionParent = editor.context.insertionParent;
    const rectangle = editor.createRectangle();
    rectangle.width = width;
    rectangle.width = 850;
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
  //* Trigger Custom UI API functions with the uiAPis object
  editor.context.on(constants.EditorEvent.selectionChange, () => {
    uiApis.selectionChanged();
  });
  runtime.exposeApi(sandboxApi);
}

start();
