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

const devCode = (runner: string) => {
  exec(`${runner} run devcode`, (err, stdout, stderr) => {
    if (err) return console.error(err);
    console.log(stdout);
  });
};

export const startCodeWatcher = () => {
  const exe = process.argv[1];
  const scriptMode = process.argv[3];
  const isDevMode = scriptMode === "--watch";
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
    }
  } catch (e) {
    console.log(e);
  }
};
