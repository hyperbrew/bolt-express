<script lang="ts">
  import { onMount } from "svelte";
  import { sandbox } from "./utils/utils";

  // BOLT_SAMPLECODE_START
  import boltIconLight from "./assets/bolt-express-lightmode.svg";
  import viteIcon from "./assets/vite.svg";
  import svelteIcon from "./assets/svelte.svg";
  import typescriptIcon from "./assets/typescript.svg";
  import sassIcon from "./assets/sass.svg";

  let count: number = 0;
  const increment = () => (count += 1);

  const helloWorld = async () => {
    let result = await sandbox.createBox(400, 400);
    console.log(result);
  };
  // BOLT_SAMPLECODE_END

  onMount(() => {});
</script>

<main>
  <!-- BOLT_SAMPLECODE_START -->
  <a
    class="bolt-icon"
    href="https://hyperbrew.co/resources/bolt-express/"
    target="_blank"
  >
    <img src={boltIconLight} alt="" />
  </a>
  <div class="stack-icons">
    <a href="https://vitejs.dev" target="_blank">
      <img src={viteIcon} alt="" />
      <span>Vite</span>
    </a>
    +
    <a href="https://svelte.dev" target="_blank">
      <img src={svelteIcon} alt="" />
      <span> Svelte </span>
    </a>
    +
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src={typescriptIcon} alt="" />
      <span> TypeScript </span>
    </a>
    +
    <a href="https://sass-lang.com/" target="_blank">
      <img src={sassIcon} alt="" />
      <span> Sass </span>
    </a>
  </div>

  <div class="card">
    <button on:click={increment}>
      Count {count}
    </button>
    <button on:click={helloWorld}>Hello World</button>
  </div>
  <p>
    Edit
    <code>main.svelte</code> and save to use Hot Reloading.
  </p>
  <!-- BOLT_SAMPLECODE_END -->
</main>

<style lang="scss">
  @import "./variables.scss";
</style>
