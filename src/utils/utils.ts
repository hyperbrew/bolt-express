import { RuntimeType } from "@adobe/ccweb-add-on-sdk-types/add-on-sdk-document-sandbox";
import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import type { SandboxRemoteType } from "../../src-code/code";
export type { SandboxRemoteType };

export type SandboxProxyPromise =
  typeof AddOnSdk.instance.runtime.apiProxy<SandboxRemoteType>;
export type SandboxProxy = Awaited<
  ReturnType<NonNullable<SandboxProxyPromise>>
>;

export const getRuntime = (): Promise<SandboxProxy> => {
  return new Promise((resolve, reject) => {
    AddOnSdk.ready.then(async () => {
      const { runtime } = AddOnSdk.instance;
      if (!runtime) return console.error("Runtime not found");
      const sandboxProxy = await runtime.apiProxy<SandboxRemoteType>(
        "documentSandbox" as RuntimeType
      );
      return resolve(sandboxProxy);
    });
  });
};
