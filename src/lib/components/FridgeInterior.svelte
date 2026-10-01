<script lang="ts">
  import type { MasterInventoryItem } from '$lib/store.svelte';

  let { items = [] } = $props<{ items: MasterInventoryItem[] }>();

  // Take up to 9 items for display
  let displayItems = $derived(items.slice(0, 9));

  // Predefined positions for organic scatter across 3 shelves
  // Each shelf is roughly 33% of the height
  const positions = [
    // Top shelf
    { top: '8%', left: '15%', size: '1.4rem', delay: '0.1s' },
    { top: '10%', left: '50%', size: '1.6rem', delay: '0.15s' },
    { top: '6%', left: '78%', size: '1.3rem', delay: '0.2s' },
    // Middle shelf
    { top: '38%', left: '20%', size: '1.5rem', delay: '0.25s' },
    { top: '40%', left: '55%', size: '1.7rem', delay: '0.3s' },
    { top: '36%', left: '82%', size: '1.4rem', delay: '0.35s' },
    // Bottom shelf
    { top: '68%', left: '12%', size: '1.6rem', delay: '0.4s' },
    { top: '70%', left: '48%', size: '1.5rem', delay: '0.45s' },
    { top: '66%', left: '75%', size: '1.7rem', delay: '0.5s' },
  ];
</script>

<div class="absolute inset-0 overflow-hidden rounded-lg">
  <!-- Interior background -->
  <div class="absolute inset-0 bg-[#e8f4f8]">
    <!-- Shelf lines -->
    <div class="absolute left-[8%] right-[8%] top-[30%] h-[2px] bg-white/60 rounded-full shadow-sm"></div>
    <div class="absolute left-[8%] right-[8%] top-[60%] h-[2px] bg-white/60 rounded-full shadow-sm"></div>
    <div class="absolute left-[8%] right-[8%] top-[90%] h-[2px] bg-white/60 rounded-full shadow-sm"></div>
  </div>

  <!-- Food emoji on shelves -->
  {#each displayItems as item, i (item.id)}
    {@const pos = positions[i]}
    <span
      class="absolute select-none opacity-0"
      style="top: {pos.top}; left: {pos.left}; font-size: {pos.size}; animation: fridge-item-appear 400ms var(--ease-spring) {pos.delay} forwards;"
    >
      {item.icon}
    </span>
  {/each}

  <!-- Interior glow overlay -->
  <div
    class="absolute inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse at center 40%, rgba(255,255,255,0.5) 0%, rgba(235,244,252,0.2) 50%, transparent 80%);"
  ></div>
</div>

<style>
  @keyframes fridge-item-appear {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 0.85; transform: scale(1); }
  }
</style>
