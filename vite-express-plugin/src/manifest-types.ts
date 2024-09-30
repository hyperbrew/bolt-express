import type { AddOnManifestV2 } from "@adobe/ccweb-add-on-manifest";

export type PluginManifest = AddOnManifestV2;
export interface PluginManifestManual {
  testId: string;
  name: string;
  version: string;
  manifestVersion: number;
  requirements: {
    apps: {
      name: string;
      apiVersion: number;
    }[];
  };
  entryPoints: {
    type: string;
    id: string;
    main: string;
    documentSandbox: string;
    permissions: {
      sandbox: string[];
      oauth: string[];
    };
  }[];
}
