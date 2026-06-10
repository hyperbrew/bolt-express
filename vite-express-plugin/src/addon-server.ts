import fs from "fs";
import https from "https";
import * as mkcert from "@mkcert/node";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { ExpressConfig } from "./types";

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
  await mkcert.generate({
    install: true,
    hosts: ["localhost"],
    certFile: "./scripts/cert.pem",
    keyFile: "./scripts/key.pem",
  });
  mkcert.installSync();

  const app = express();
  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });
  app.get("/", (req, res) => {
    res.send(addOnResponse);
  });
  app.use(`/${config.manifest.testId}`, express.static(".tmp"));

  const server = https.createServer(
    {
      key: fs.readFileSync("./scripts/key.pem"),
      cert: fs.readFileSync("./scripts/cert.pem"),
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

  server.listen(port, () => {
    console.log(`[addon-server] Hosting Addon on https://localhost:${port}`);
  });
};
