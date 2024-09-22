import type { PluginManifest } from "./manifest-types";

export type { PluginManifest };

export type ExpressConfig = {
  manifest: PluginManifest;
  version: string;
  copyZipAssets: string[];
};
