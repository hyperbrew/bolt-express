<img src="src/assets/bolt-express-darkmode.svg" alt="Bolt Express" title="Bolt Express" width="400" />

A lightning-fast boilerplate for building Express Addons in Svelte, React, or Vue built on Vite + TypeScript + Sass

![npm](https://img.shields.io/npm/v/bolt-express)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/hyperbrew/bolt-express/blob/master/LICENSE)
[![Chat](https://img.shields.io/badge/chat-discord-7289da.svg)](https://discord.gg/PC3EvvuRbc)

## Features

- Lightning Fast Hot Reloading on changes
- Setup with TypeScript Definitions for Express in Frontend, Backend, and Manifest
- Optimized Build Size
- Easy Smart Bundling in Frontend UI and Backend Code contexts
- Spin a up a new project in Svete, React, or Vue
- Easily configure in express.config.ts
- Easy Package to Zip archive with sidecar assets
- GitHub Actions ready-to-go for Zip Releases

## Backers

Huge thanks to our backers who have made this project possible!

### Founding Backers

_Founding backers have made substantial contribution to the project at the start which has made this project possible._

<a href="https://express.com/" target="_blank">
<img src="https://cdn.sanity.io/images/g3so7nt7/production/6cb43009e94a67554c68fb50b9363a0aa68f3d23-418x200.png?w=1000&h=1000&fit=max" alt="Express" title="Express" width="300" /></a>

...

### Feature Backers

_Feature backers have sponsored individual features that have made this project better for the whole community._

<a href="https://battleaxe.co/" target="_blank">
<img src="https://battleaxe.dev/servile/logotype_lightgrey.png" alt="Battle Axe" title="Battle Axe" width="150" /></a>

...

If you're interested in supporting this open-source project, please [contact the Hyper Brew team](https://hyperbrew.co/contact/).

## Support

### Free Support

If you have questions with getting started using Bolt Express, feel free to ask and discuss in our free Discord community [Discord Community](https://discord.gg/PC3EvvuRbc).

### Paid Support

If your team is interested in paid consulting or development with Bolt Express, please [contact the Hyper Brew team](https://hyperbrew.co/contact/). More info on our [Custom Addon Development & Consulting Services](https://hyperbrew.co/landings/boost-development)

## Can I use Bolt Express in my free or commercial project?

Yes! Bolt Express is **100% free and open source**, being released under the MIT license with no attribution required. This means you are free to use it in your free or commercial projects.

We would greatly appreciate it if you could provide a link back to this tool's info page in your product's site or about page:

Bolt Express Info Page Link: https://hyperbrew.co/resources/bolt-express

**Built with Bolt Express** button graphics:

**PNG Files**

<div style="display:flex;gap:1rem;">
<a href="./src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_White_V01.png" target="_blank">
<img src="./src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_White_V01.png" width="200" /></a>

<a href="./src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_Black_V01.png" target="_blank">
<img src="./src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_Black_V01.png" width="200" /></a>

</div>

**SVG Files**

<div style="display:flex;gap:1rem;">
<a href="src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_White_V01.svg" target="_blank">
<img src="src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_White_V01.svg" width="200" /></a>

<a href="src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_Black_V01.svg" target="_blank">
<img src="src/assets/built-with-bolt-express/Built_With_BOLT_Express_Logo_Black_V01.svg" width="200" /></a>

</div>

## Prerequisites

- [Node.js 18](https://nodejs.org/en/) or later
- Package manager either
  - NPM (comes with Node.js)
  - [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) ( ensure by running `yarn set version classic` )
  - [PNPM](https://pnpm.io/installation) ( ensure by running `pnpm --version` )
- Express Desktop App

## Quick Start

Create your new Bolt Express project (follow CLI prompts)

- yarn - `yarn create bolt-express`
- npm - `npx create-bolt-express`
- pnpm - `pnpm create-bolt-express`

Change directory to the new project

- `cd project`

Install Dependencies (if not already done by create command)

- yarn - `yarn`
- npm - `npm i`
- pnpm - `pnpm i`

Build the addon (must run before `dev`, can also run after for panel to work statically without the process)

- yarn `yarn build`
- npm `npm run build`
- pnpm `pnpm build`

Run the addon in hot reload mode for development

_Note: Ensure "Hot reload addon" is checked in Express Addon Development menu_

- yarn `yarn dev`
- npm `npm run dev`
- pnpm `pnpm dev`

Bundles your addon and specified assets from `copyZipAssets` to a zip archive in the `./zip` folder

- yarn `yarn zip`
- npm `npm run zip`
- pnpm `pnpm zip`

Write frontend UI code in `src/main.svelte`

Write backend express code in `src-code/code.ts`

### Add Addon to Express

1. Open Express
2. Select Express Menu > Addons > Development > Import Addon from Manifest
3. Select the `manifest.json` file in the `dist` folder
4. Your addon can now be launched from the menu or managed under "Manage Addons"

### Load and Debug Addon

1. Launch your addon by going to `Express Menu > Addons > Development > "Your Addon"`
2. Ensure Hot Reloading is checked under `Express Menu > Addons > Development > Hot Reloading Addon`
3. Open the Dev Tools console with `Express Menu > Addons > Development > Show/Hide Console`

---

## Sending Messages between the Frontend and Backend

Bolt Express makes messaging between the frontend UI and backend code layers simple and type-safe. This can be done with `listenTS()` and `dispatchTS()`.

Using this method accounts for:

- Setting up a scoped event listener in the listening context
- Removing the listener when the event is called (if `once` is set to true)
- Ensuring End-to-End Type-Safety for the event

### 1. Declare the Event Type in EventTS in shared/universals.ts

```js
export type EventTS = {
  myCustomEvent: {
    oneValue: string,
    anotherValue: number,
  },
  // [... other events]
};
```

### 2a. Send a Message from the Frontend to the Backend

**Backend Listener:** `src-code/code.ts`

```js
import { listenTS } from "./utils/code-utils";

listenTS("myCustomEvent", (data) => {
  console.log("oneValue is", data.oneValue);
  console.log("anotherValue is", data.anotherValue);
});
```

**Frontend Dispatcher:** `index.svelte` or `index.tsx` or `index.vue`

```js
import { dispatchTS } from "./utils/utils";

dispatchTS("myCustomEvent", { oneValue: "name", anotherValue: 20 });
```

### 2b. Send a Message from the Backend to the Frontend

**Frontend Listener:** `index.svelte` or `index.tsx` or `index.vue`

```js
import { listenTS } from "./utils/utils";

listenTS(
  "myCustomEvent",
  (data) => {
    console.log("oneValue is", data.oneValue);
    console.log("anotherValue is", data.anotherValue);
  },
  true
);
```

_Note: `true` is passed as the 3rd argument which means the listener will only listen once and then be removed. Set this to true to avoid duplicate events if you only intend to recieve one reponse per function._

**Backend Dispatcher:** `src-code/code.ts`

```js
import { dispatchTS } from "./utils/code-utils";

dispatchTS("myCustomEvent", { oneValue: "name", anotherValue: 20 });
```

---

### Info on Build Process

Frontend code is built to the `.tmp` directory temporarily and then copied to the `dist` folder for final. This is done to avoid Express throwing addon errors with editing files directly in the `dist` folder.

The frontend code (JS, CSS, HTML) is bundled into a single `index.html` file and all assets are inlined.

The backend code is bundled into a single `code.js` file.

Finally the `manifest.json` is generated from the `express.config.ts` file with type-safety. This is configured when running `yarn create bolt-express`, but you can make additional modifications to the `express.config.ts` file after initialization.

### Read if Dev or Production Mode

Use the built-in Vite env var MODE to determine this:

```js
const mode = import.meta.env.MODE; // 'dev' or 'production'
```

### Troubleshooting Assets

Express requires the entire frontend code to be wrapped into a single HTML file. For this reason, bundling external images, svgs, and other assets is not possible.

The solution to this is to inline all assets. Vite is already setup to inline most asset types it understands such as JPG, PNG, SVG, and more, however if the file type you're trying to inline doesn't work, you may need to add it to the assetsInclude array in the vite config:

More Info: https://vitejs.dev/config/shared-options.html#assetsinclude

Additionally, you may be able to import the file as a raw string, and then use that data inline in your component using the `?raw` suffix.

For example:

```ts
import icon from "./assets/icon.svg?raw";
```

and then use that data inline in your component:

```js
// Svelte
{@html icon}

// React
<div dangerouslySetInnerHTML={{ __html: icon }}></div>

// Vue
<div v-html="icon"></div>
```
