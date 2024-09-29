<script lang="ts">
  import { onMount } from "svelte";
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "./assets/vite.svg";
  import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

  let sandboxProxy: any;

  const shapes = async () => {
    console.log("Shapes");
    try {
      let result = await sandboxProxy.createShapes();
      console.log(result);
    } catch (exc) {
      //@ts-ignore
      console.error(exc.message, exc.stack);
    }
  };

  onMount(() => {
    AddOnSdk.ready.then(async () => {
      console.log("AddOnSdk is ready for use.");
      const { runtime } = AddOnSdk.instance;
      if (!runtime) {
        return console.error("Runtime not found");
      }
      sandboxProxy = await runtime.apiProxy("documentSandbox");
      console.log("sandboxProxy", sandboxProxy);
    });
  });
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>
  <button on:click={() => shapes()}>Make Shapes!!</button>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
