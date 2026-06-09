import fs from "fs";
import https from "https";
import mkcert from "@mkcert/node";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

import { config } from "../express.config";

const PORT = 5242;

const addOnResponse = {
  addOns: [
    {
      addonId: config.manifest.testId,
      versionString: config.manifest.version,
      supportedLanguages: ["en-US"],
      supportedApps: config.manifest.requirements.apps.map((app) => app.name),
      downloadUrl: `https://localhost:${PORT}/${config.manifest.testId}/manifest.json`,
      addon: { localizedMetadata: { name: config.manifest.name } },
      entryPoints: config.manifest.entryPoints.map((entryPoint) => {
        return { ...entryPoint, discoverable: true };
      }),
    },
  ],
};

async function main() {
  console.log("Make and install cert");
  await mkcert.generate({
    install: true,
    hosts: ["localhost"],
    certFile: "./scripts/cert.pem",
    keyFile: "./scripts/key.pem",
  });
  mkcert.installSync();

  console.log(`Starting Custom Server on https://localhost:${PORT}`);

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
      console.log("received: %s", data);
    });
    ws.send("something");
  });

  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });
}
main();
