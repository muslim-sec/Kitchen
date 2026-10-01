<script lang="ts">
	import { X, Minus, Cookie } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { MasterInventoryItem } from '$lib/store.svelte';
	import { inventoryActions } from '$lib/store.svelte';

	let {
		item,
		isOpen = $bindable(false),
		onclose
	} = $props<{
		item: MasterInventoryItem | null;
		isOpen: boolean;
		onclose?: () => void;
	}>();

	let deductAmount = $state(1);

	$effect(() => {
		if (isOpen && item) {
			// Suggest a smart default deduction based on unit
			if (item.quantityUnit === 'g' || item.quantityUnit === 'ml') deductAmount = 100;
			else if (item.quantityUnit === '%') deductAmount = 25;
			else deductAmount = 1;
		}
	});

	function handleClose() {
		isOpen = false;
		if (onclose) onclose();
	}

	function consumePartial() {
		if (!item || deductAmount <= 0) return;
		inventoryActions.consumePartial(item.id, deductAmount);
		handleClose();
	}

	function consumeAll() {
		if (!item) return;
		// Deduct exactly the remaining amount to trigger "to_buy" state
		inventoryActions.consumePartial(item.id, item.quantityAmount || 1);
		handleClose();
	}
</script>

{#if isOpen && item}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-text-espresso/20 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleClose}
		role="dialog"
	>
		<!-- Modal Content -->
		<div
			class="w-full max-w-sm overflow-hidden rounded-3xl border border-border-warm bg-surface shadow-hover"
			transition:scale={{ duration: 300, start: 0.95, easing: quintOut }}
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-border-warm bg-surface-warm/50 px-5 py-4">
				<h3 class="flex items-center gap-2 text-lg font-bold text-text-espresso">
					<Cookie size={20} class="text-hearth-500" />
					Consume Item
				</h3>
				<button
					class="rounded-full p-1 text-text-muted transition-colors hover:bg-border-warm hover:text-text-espresso"
					onclick={handleClose}
				>
					<X size={20} />
				</button>
			</div>

			<!-- Body -->
			<div class="p-6">
				<div class="mb-6 flex items-center gap-4 rounded-xl border border-border-warm bg-canvas p-4 text-center">
					<span class="text-4xl">{item.icon}</span>
					<div class="flex-1 text-left">
						<h4 class="font-bold text-text-espresso">{item.name}</h4>
						<p class="text-sm font-medium text-text-muted">
							Current: <span class="text-hearth-600">{item.quantityAmount} {item.quantityUnit}</span>
						</p>
					</div>
				</div>

				<div class="mb-6 text-center">
					<label class="mb-2 block text-sm font-bold text-text-espresso">
						How much did you use?
					</label>
					<div class="mx-auto flex w-48 items-center gap-2 rounded-xl border border-hearth-200 bg-hearth-50 p-1">
						<button
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-hearth-600 transition-colors hover:bg-hearth-100 disabled:opacity-50"
							onclick={() => (deductAmount = Math.max(0.1, deductAmount - (item?.quantityUnit === 'g' || item?.quantityUnit === 'ml' ? 10 : 1)))}
						>
							<Minus size={20} />
						</button>
						<input
							type="number"
							step="any"
							min="0.1"
							bind:value={deductAmount}
							class="w-full bg-transparent text-center text-xl font-bold text-hearth-900 outline-none"
						/>
						<span class="pr-2 text-sm font-bold text-hearth-600/50">{item.quantityUnit}</span>
					</div>
				</div>

				<div class="flex flex-col gap-3">
					<button
						class="w-full rounded-xl bg-hearth-500 py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
						onclick={consumePartial}
					>
						Consume {deductAmount} {item.quantityUnit}
					</button>
					<button
						class="w-full rounded-xl border-2 border-border-warm bg-transparent py-3 font-bold text-text-muted transition-colors hover:border-hearth-300 hover:text-hearth-600"
						onclick={consumeAll}
					>
						Consume All (To Shopping List)
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
