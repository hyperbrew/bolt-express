import fs from "fs";
import path from "path";
import https from "https";
import * as mkcert from "@mkcert/node";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { ExpressConfig } from "./types";
import { randomUUID } from "crypto";
import os from "os";
import pc = require("picocolors");

/**
 * The Addon Server can serve a static or HMR version of the Express Addon
 * to be attached in Express > Add-ons > Add-on testing
 * This server also listens for hot reload messages from the code instance of vite
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

  console.log(pc.blue('[addon-server]'),"Make and install cert");
  if(os.platform() === 'darwin'){
    console.log(pc.yellow("[addon-server] [cert install]"), `If prompted, enter admin password below and accept certificate popup prompts to install cert for addon server`)
  }else{
    console.log(pc.yellow("[addon-server] [cert install]"), `If prompted, accept certificate popup prompts to install cert for addon server`)
  }
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
  // server.on("upgrade", (req) => {
  //   console.log("Server Upgrade request", req.url);
  // });
  wss.on("connection", function connection(ws) {
    // console.log(pc.blue('[addon-server]'),"connection made");
    ws.on("error", console.error);
    ws.on("message", function message(data) {
      // console.log(pc.blue('[addon-server]'),"received: %s", data.toString());
      if (data)
        try {
          const dat = JSON.parse(data.toString());
          if (dat.action === "hot-reload") {
            updater();
          }
        } catch (e) {
          //
        }
    });
    ws.send("something");
  });

  const updater = () => {
    console.log(pc.blue('[addon-server]'),`Updating all clients`);
    const msg = {
      messageVersion: 1,
      id: config.manifest.testId!,
      action: "SourceCodeChanged",
      payload: {
        changedFiles: ["src\\code.js"],
        isBuildSuccessful: true,
        isManifestChanged: false,
        manifest: undefined,
      },
    };
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(msg));
    });
  };
  const listener = () => {
    server.listen(port, () => {
      console.log(pc.blue('[addon-server]'),`Hosting Addon on https://localhost:${port}`);
    });
  };
  return { updater, listener };
};
