import addOnSandboxSdk, { RuntimeType } from "add-on-sdk-document-sandbox";

import { editor, colorUtils, constants } from "express-document-sdk";

// import type * as UIApisType from '../src/utils/apis'

const { runtime } = addOnSandboxSdk.instance;
let uiApis: any;
runtime.apiProxy(RuntimeType.panel).then((res) => (uiApis = res));

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
  // Trigger UI function on event update
  editor.context.on(constants.EditorEvent.selectionChange, async () => {
    console.log("[sandbox] Selection Changed!");
    console.log({ uiApis });
    //@ts-ignore
    uiApis.selectionChanged();
  });
  runtime.exposeApi(sandboxApi);
}

start();
