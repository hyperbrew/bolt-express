import fs from "fs";
import path from "path";
import https from "https";
import mkcert from "@mkcert/node";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";

import { config } from "../express.config";

const PORT = 5242;

//TODO: make dynamic
const addOnResponse = {
  addOns: [
    {
      addonId: "bolt-express",
      versionString: "0.0.20",
      supportedLanguages: ["en-US"],
      supportedApps: ["Express"],
      downloadUrl: `https://localhost:${PORT}/${config.manifest.testId}/manifest.json`,
      addon: {
        localizedMetadata: {
          name: "Bolt Express",
        },
      },
      entryPoints: [
        {
          type: "panel",
          id: "panel1",
          main: "index.html",
          documentSandbox: "code.js",
          permissions: {
            sandbox: [
              "allow-popups",
              "allow-popups-to-escape-sandbox",
              "allow-presentation",
              "allow-downloads",
            ],
            oauth: ["*"],
          },
          discoverable: true,
        },
      ],
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
  app.get("/", (req, res) => {
    res.send(addOnResponse);
  });
  app.use(`/${config.manifest.testId}`, express.static("dist"));

  const server = https.createServer(
    {
      key: fs.readFileSync("./scripts/key.pem"),
      cert: fs.readFileSync("./scripts/cert.pem"),
      requestCert: false,
      rejectUnauthorized: false,
    },
    app,
    //   (req, res) => {
    //     res.writeHead(200);
    //     res.end(JSON.stringify(addOnResponse));
    //   },
  );
  // socket io route
  //   const io = new Server(server);

  //   io.on("connection", (client) => {
  //     console.log("WS Connect");
  //     client.on("event", (data) => {
  //       console.log("WS Event");
  //       /* … */
  //     });
  //     client.on("disconnect", () => {
  //       console.log("WS Disconnect");
  //       /* … */
  //     });
  //   });

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
