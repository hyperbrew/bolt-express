import { RuntimeType, Runtime } from "@adobe/ccweb-add-on-sdk-types/iframe-ui";
import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import type { SandboxRemoteType } from "../../src-code/code";
export type { SandboxRemoteType };

import * as apis from "./ui-apis";

export type SandboxProxyPromise =
  typeof AddOnSdk.instance.runtime.apiProxy<SandboxRemoteType>;
export type SandboxProxy = Awaited<
  ReturnType<NonNullable<SandboxProxyPromise>>
>;

export const getRuntime = (): Promise<{
  runtime: Runtime;
  sandbox: SandboxProxy;
}> => {
  return new Promise((resolve, reject) => {
    AddOnSdk.ready
      .then(async () => {
        const { runtime } = AddOnSdk.instance;
        if (!runtime) return console.error("Runtime not found");
        const sandboxProxy = await runtime.apiProxy!<SandboxRemoteType>(
          "documentSandbox" as RuntimeType,
        );
        return resolve({
          sandbox: sandboxProxy,
          runtime: runtime,
        });
      })
      .catch((err) => {
        console.error("Sandbox SDK Error:", err);
      });
  });
};

//@ts-ignore
export let sandbox: SandboxProxy = {};
export let runtime: Runtime | {} = {};
console.log("sandbox", sandbox);

const mode = import.meta.env.MODE;
const port = import.meta.env.HMR_PORT || process.env.HMR_PORT || "";

export const initBolt = async () => {
  console.log(`initBolt [mode: ${mode}]`);
  const devUrl = `https://localhost:${port}/`;
  if (mode === "staging" && location.href !== devUrl) {
    console.log("Redirecting to dev server: ", devUrl);
    location.href = devUrl;
  }
  getRuntime().then((res) => {
    sandbox = res.sandbox;
    runtime = res.runtime;
    res.runtime.exposeApi!(apis);
    console.log("sandbox", sandbox);
  });
};
