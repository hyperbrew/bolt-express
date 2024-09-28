import { execSync, exec } from "child_process";

export const triggerExpressRefresh = (file: string) => {
  // TODO: remove if not needed
};

const buildCode = (runner: string) => {
  console.log("Building code.ts ...");
  const res = execSync(`${runner} run buildcode`, {
    encoding: "utf-8",
  });
  console.log(res.toString());
};

const serveExpress = (runner: string) => {
  console.log(`starting SERVE EXPRESS`);
  console.log(process.cwd());
  exec(
    `${runner} ccweb-add-on-scripts start --use \\"vite build\\" --src=dummy`,
    { cwd: process.cwd() },
    (err, stdout, stderr) => {
      if (err) return console.error(err);
      console.log(stdout);
    }
  );
};
const devMain = (runner: string) => {
  console.log(`starting devMain`);
  exec(`${runner} run devmain`, (err, stdout, stderr) => {
    if (err) return console.error(err);
    console.log(stdout);
  });
};
const devCode = (runner: string) => {
  console.log(`starting devCode`);
  exec(`${runner} run devcode`, (err, stdout, stderr) => {
    if (err) return console.error(err);
    console.log(stdout);
  });
};

export const startCodeWatcher = (mode: string) => {
  console.log(`in code watcher MODE: ${mode}`);
  const exe = process.argv[1];
  const scriptMode = process.argv[3];
  const isDevMode = mode === "dev";
  const npmUserAgent = process.env.npm_config_user_agent || "";
  const runner = npmUserAgent.split("/")[0];
  const supportedRunners = ["npm", "yarn", "pnpm"];
  if (supportedRunners.indexOf(runner) === -1) {
    console.warn(`⚠️ Unsupported runner. May encounter issues: ${runner}`);
  }
  try {
    buildCode(runner);
    if (isDevMode) {
      devCode(runner);
      // devMain(runner);
      // serveExpress(runner);
    }
  } catch (e) {
    console.log(e);
  }
};
