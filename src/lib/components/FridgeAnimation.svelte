<script lang="ts">
  import { db } from '$lib/store.svelte';
  import FridgeInterior from './FridgeInterior.svelte';

  let { oncomplete = () => {} } = $props<{ oncomplete?: () => void }>();

  // Animation phases
  type Phase = 'idle' | 'reveal' | 'open' | 'morph' | 'done';
  let phase = $state<Phase>('idle');

  // Get fridge items for the interior display
  let fridgeItems = $derived(db.inventory.filter((i) => i.status === 'in_fridge'));

  // Respect prefers-reduced-motion
  let prefersReducedMotion = $state(false);

  $effect(() => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      phase = 'done';
      oncomplete();
    } else {
      phase = 'reveal';
    }
  });

  function handleRevealEnd(e: AnimationEvent) {
    // Only react to the fridge-reveal animation, not child animations
    if (e.animationName === 'fridge-reveal') {
      phase = 'open';
    }
  }

  function handleDoorEnd(e: AnimationEvent) {
    if (e.animationName === 'door-swing-left' || e.animationName === 'door-swing-right') {
      // Only trigger morph once (from left door)
      if (e.animationName === 'door-swing-left') {
        phase = 'morph';
      }
    }
  }

  function handleMorphEnd(e: AnimationEvent) {
    if (e.animationName === 'glow-expand' || e.animationName === 'morph-out') {
      if (e.animationName === 'morph-out') {
        phase = 'done';
        oncomplete();
      }
    }
  }

  function skip() {
    phase = 'done';
    oncomplete();
  }
</script>

{#if phase !== 'done'}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
    <!-- Skip button -->
    <button
      onclick={skip}
      class="absolute top-6 right-6 z-[60] rounded-full bg-surface/80 px-4 py-2 text-sm font-medium text-text-muted backdrop-blur-sm transition-all duration-150 hover:bg-surface hover:text-text-espresso hover:scale-105 active:scale-95"
    >
      Skip →
    </button>

    <!-- Fridge Container -->
    <div
      class="relative {phase === 'reveal' || phase === 'open' ? 'animate-fridge-reveal' : ''} {phase === 'morph' ? 'animate-morph-out' : ''}"
      onanimationend={phase === 'reveal' ? handleRevealEnd : phase === 'morph' ? handleMorphEnd : undefined}
    >
      <!-- Fridge Body -->
      <div
        class="relative mx-auto"
        style="width: 280px; height: 420px; perspective: 1200px;"
      >
        <!-- Back panel (interior) -->
        <div
          class="absolute inset-[6px] rounded-lg overflow-hidden"
          style="background-color: var(--color-fridge-interior);"
        >
          <FridgeInterior items={fridgeItems} />
        </div>

        <!-- Glow effect -->
        <div
          class="absolute inset-0 pointer-events-none z-10 {phase === 'open' ? 'animate-glow-pulse' : ''} {phase === 'morph' ? 'animate-glow-expand' : ''}"
          style="
            opacity: 0;
            background: radial-gradient(
              circle at center,
              var(--color-glow-core) 0%,
              var(--color-glow-frost) 35%,
              var(--color-glow-edge) 70%
            );
            mix-blend-mode: normal;
          "
          onanimationend={phase === 'morph' ? handleMorphEnd : undefined}
        ></div>

        <!-- Left Door -->
        <div
          class="absolute top-0 left-0 z-20 h-full w-1/2 {phase === 'open' || phase === 'morph' ? 'animate-door-left' : ''}"
          style="transform-style: preserve-3d;"
          onanimationend={phase === 'open' ? handleDoorEnd : undefined}
        >
          <div
            class="h-full w-full rounded-l-2xl border-2 border-white/20"
            style="background: linear-gradient(135deg, var(--color-fridge-body) 0%, var(--color-fridge-body-dark) 100%); backface-visibility: hidden;"
          >
            <!-- Left door handle -->
            <div
              class="absolute top-1/2 right-3 h-16 w-[5px] -translate-y-1/2 rounded-full"
              style="background-color: var(--color-fridge-handle); box-shadow: 1px 1px 4px rgba(0,0,0,0.1);"
            ></div>
            <!-- Brand badge -->
            <div class="absolute top-6 left-1/2 -translate-x-1/2 text-center">
              <div class="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Kitchen</div>
            </div>
          </div>
        </div>

        <!-- Right Door -->
        <div
          class="absolute top-0 right-0 z-20 h-full w-1/2 {phase === 'open' || phase === 'morph' ? 'animate-door-right' : ''}"
          style="transform-style: preserve-3d;"
        >
          <div
            class="h-full w-full rounded-r-2xl border-2 border-white/20"
            style="background: linear-gradient(225deg, var(--color-fridge-body) 0%, var(--color-fridge-body-dark) 100%); backface-visibility: hidden;"
          >
            <!-- Right door handle -->
            <div
              class="absolute top-1/2 left-3 h-16 w-[5px] -translate-y-1/2 rounded-full"
              style="background-color: var(--color-fridge-handle); box-shadow: -1px 1px 4px rgba(0,0,0,0.1);"
            ></div>
          </div>
        </div>

        <!-- Fridge shadow -->
        <div
          class="absolute -bottom-4 left-[10%] right-[10%] h-6 rounded-full opacity-20"
          style="background: radial-gradient(ellipse, rgba(30,22,17,0.4) 0%, transparent 70%);"
        ></div>
      </div>
    </div>
  </div>
{/if}
