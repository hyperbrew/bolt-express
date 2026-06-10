import { execSync, exec, spawn } from "child_process";
import pc = require("picocolors");

const spawnProcess = async (
  label: string,
  runner: string,
  args: string[],
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const ls = spawn(runner, args, {
      cwd: process.cwd(),
      shell: true, // Use shell to ensure the command works on all platforms
    });
    ls.stdout.on("data", (data) => {
      const msg = data.toString().trim();
      if (msg) console.log(pc.cyan(`\n[${label}]`), msg);
    });
    ls.stderr.on("data", (data) => {
      const msg = data.toString().trim();
      if (msg) console.log(pc.cyan(`\n[${label}]`), pc.red("error"), msg);
    });
    ls.on("close", (code) => {
      if (code !== 0) {
        console.log(
          pc.cyan(`\n[${label}]`),
          pc.red("error"),
          `process exited with code ${code}`,
        );
        reject();
      } else {
        console.log(pc.cyan(`\n[${label}]`), `process completed successfully`);
        resolve(true);
      }
    });
    ls.on("error", (code) => {
      console.log(
        pc.cyan(`\n[${label}]`),
        pc.red("error"),
        `process errored with code ${code}`,
      );
      reject();
    });
  });
};

const buildCode = async (runner: string) => {
  return await spawnProcess("buildCode", runner, ["run", "buildcode"]);
};

const devCode = async (runner: string) => {
  return await spawnProcess("devCode", runner, ["run", "devcode"]);
};

export const startCodeWatcher = async (mode: string) => {
  // console.log(`in code watcher MODE: ${mode}`);
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
    await buildCode(runner);
    if (isDevMode) {
      devCode(runner); // don't wait for devcode completion
    }
  } catch (e) {
    console.log(e);
  }
};
