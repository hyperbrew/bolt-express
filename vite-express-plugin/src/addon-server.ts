import fs from "fs";
import path from "path";
import https from "https";
import * as mkcert from "@mkcert/node";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { ExpressConfig } from "./types";

/**
 * The Addon Server can serve a static or HMR version of the Express Addon
 * to be attached in Express > Add-ons > Add-on testing
 */
export const addonServer = async (config: ExpressConfig) => {
  const port = config.servePort;
  const addOnResponse = {
    addOns: [
      {
        addonId: config.manifest.testId,
        versionString: config.manifest.version,
        supportedLanguages: ["en-US"],
        supportedApps: config.manifest.requirements.apps.map((app) => app.name),
        downloadUrl: `https://localhost:${port}/${config.manifest.testId}/manifest.json`,
        addon: { localizedMetadata: { name: config.manifest.name } },
        entryPoints: config.manifest.entryPoints.map((entryPoint) => {
          return { ...entryPoint, discoverable: true };
        }),
      },
    ],
  };

  console.log("[addon-server] Make and install cert");
  const certFile = path.join(__dirname, "cert.pem");
  const keyFile = path.join(__dirname, "key.pem");
  await mkcert.generate({
    install: true,
    hosts: ["localhost"],
    certFile,
    keyFile,
  });
  const cert = fs.readFileSync(certFile);
  const key = fs.readFileSync(keyFile);

  // Cleanup temp cert files
  fs.unlink(certFile, () => null);
  fs.unlink(keyFile, () => null);

  const app = express();
  app.use(cors());
  app.use((req, res, next) => {
    // Express requires these headers for addon servers
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

  // Send Express-specific addon JSON reply for root
  app.get("/", (req, res) => res.send(addOnResponse));

  // All other HTTPS requests serve up the folder
  app.use(`/${config.manifest.testId}`, express.static("dist"));

  const server = https.createServer(
    {
      key,
      cert,
      requestCert: false,
      rejectUnauthorized: false,
    },
    app,
  );
  const wss = new WebSocketServer({ server });

  wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
      console.log("[addon-server] received: %s", data);
    });
    ws.send("something");
  });

  const updater = () => {
    console.log(`[addon-server] Updating all clients`);
    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          addOnId: config.manifest.testId!,
          changedFiles: ["*"],
          isBuildSuccessful: true,
          hasManifestChanged: false,
          addOnManifest: config.manifest,
        }),
      );
    });
  };
  const listener = () => {
    server.listen(port, () => {
      console.log(`[addon-server] Hosting Addon on https://localhost:${port}`);
    });
  };
  return { updater, listener };
};
