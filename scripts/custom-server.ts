import fs from "fs";
import path from "path";
import https from "https";
import mkcert from "@mkcert/node";
import handler from "serve-handler";

const PORT = 5242;

//TODO: make dynamic
const addOnResponse = {
  addOns: [
    {
      addonId: "bolt-express",
      versionString: "0.0.20",
      supportedLanguages: ["en-US"],
      supportedApps: ["Express"],
      downloadUrl: "https://localhost:5241/bolt-express/manifest.json",
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
  https
    .createServer(
      {
        key: fs.readFileSync("./scripts/key.pem"),
        cert: fs.readFileSync("./scripts/cert.pem"),
      },
      (req, res) => {
        res.writeHead(200);
        res.end(JSON.stringify(addOnResponse));
      },
    )
    .listen(PORT);
}
main();
