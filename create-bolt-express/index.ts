#!/usr/bin/env node

import { main } from "meta-bolt";
import type { BoltInitData, ArgOpt } from "meta-bolt";

export const frameworkOptions: ArgOpt[] = [
  {
    value: "svelte",
    label: "Svelte",
    files: ["src/index-svelte.ts", "src/main.svelte", "package.svelte.jsonc"],
  },
  {
    value: "react",
    label: "React",
    files: ["src/index-react.tsx", "src/main.tsx", "package.react.jsonc"],
  },
  {
    value: "vue",
    label: "Vue",
    files: ["src/index-vue.ts", "src/main.vue", "package.vue.jsonc"],
  },
];

// Currently Express is the only option, but more might be added by Adobe in the future
// export const appOptions: ArgOpt[] = [
//   {
//     value: "express",
//     label: "Express",
//     files: ["src/api/express.ts"],
//   },
// ];

const initData: BoltInitData = {
  intro: {
    name: "create-bolt-express",
    prettyName: "Bolt Express",
  },
  base: {
    module: "bolt-express",
    createDirName: __dirname,
    globalIncludes: [
      "*",
      "src/**/*",
      "src-code/**/*",
      "shared/**/*",
      "public/**/*",
      "public-zip/**/*",
      ".github/**/*",
      ".gitignore",
      ".npmrc",
      ".prettierrc",
      ".env.example",
    ],
    globalExcludes: [".env", "yarn-error.log", "package.json"],
    fileRenames: [
      ["package.svelte.jsonc", "package.json"],
      ["package.react.jsonc", "package.json"],
      ["package.vue.jsonc", "package.json"],
    ],
  },
  argsTemplate: [
    {
      name: "folder",
      type: "folder",
      message: "Where do you want to create your project?",
      initialValue: "./",
      required: true,
      validator: (input: string) => {
        if (input.length < 3) return `Value is required!`;
      },
      describe: "Name of the folder for the new Express addon",
    },
    {
      name: "displayName",
      type: "string",
      message: "Choose a unique Display Name for your addon:",
      initialValue: "Bolt Express",
      required: true,
      validator: (input: string) => {
        if (input.length < 1) return `Value is required!`;
      },
      describe: "Panel's display name",
      alias: "n",
    },
    {
      name: "id",
      type: "string",
      message: "Choose a unique ID for your addon:",
      initialValue: "bolt.express.addon",
      required: true,
      validator: (input: string) => {
        if (input.length < 1) return `Value is required!`;
      },
      describe: "Unique ID for Express Addon (e.g. bolt.express.addon)",
      alias: "i",
    },
    {
      name: "framework",
      type: "select",
      message: "Select framework:",
      alias: "f",
      describe: "Select a Framework for your addon:",
      options: frameworkOptions,
      required: true,
    },
    // {
    //   name: "apps",
    //   type: "multiselect",
    //   message: "Select app:",
    //   alias: "a",
    //   describe: "Select app(s) for your addon:",
    //   options: appOptions,
    //   validator: (input: string[]) => {
    //     if (input.length < 1) return `At Least One value Required!`;
    //   },
    //   required: true,
    // },
    {
      name: "installDeps",
      type: "boolean",
      message: "Install dependencies?",
      initialValue: true,
      required: true,
      alias: "d",
      describe: "Install dependencies (default: false)",
    },
    {
      name: "sampleCode",
      type: "boolean",
      message: "Keep Sample Code Snippets?",
      initialValue: true,
      required: true,
      alias: "s",
      describe: "Keep Sample Code (default: true)",
    },
  ],
};

//* if not using as a module, run immediately
console.log("BOLT_MODULEONLY", process.env.BOLT_MODULEONLY);
if (!process.env.BOLT_MODULEONLY) main(initData);
