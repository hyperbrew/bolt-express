import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import https from "https";

const app = express();
const cwd = process.cwd();

// Enable CORS for all routes
app.use(cors());

const PORT = 3000;

const sslOptions = {
  key: fs.readFileSync(path.join(cwd, "ssl", "key.pem")),
  cert: fs.readFileSync(path.join(cwd, "ssl", "cert.pem")),
};

// Middleware to rewrite "/" to "/index.json"
app.use((req, res, next) => {
  if (req.path === "/") {
    req.url = "/index.json";
  }
  next();
});

// Serve the static files from the "dist" directory
app.use(express.static(path.join(cwd, "dist")));

// For any other routes, serve the index.html file from "dist"
app.get("*", (req, res) => {
  res.sendFile(path.join(cwd, "dist", "index.html"));
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// Create an HTTPS server with the SSL options
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
