<script lang="ts">
  import { onMount } from "svelte";
  import { createScene } from "./Scene";

  let el;

  onMount(() => {
    createScene(el);
  });
</script>

<canvas bind:this={el} />
