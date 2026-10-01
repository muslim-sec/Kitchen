<script lang="ts">
	import { ShieldCheck, Plus, Loader2, WifiOff } from '@lucide/svelte';
	import {
		searchBrands,
		nutriScoreColor,
		novaGroupColor,
		type BrandResult
	} from '$lib/openfoodfacts';
	import { db, inventoryActions, type MasterInventoryItem } from '$lib/store.svelte';

	interface Props {
		item: MasterInventoryItem;
	}

	let { item }: Props = $props();

	let isOpen = $state(false);
	let isLoading = $state(false);
	let isOffline = $state(false);
	let results = $state<BrandResult[]>([]);
	let showAddCustom = $state(false);
	let customName = $state('');

	let debounceTimer: ReturnType<typeof setTimeout>;

	async function openDropdown() {
		if (isOpen) {
			isOpen = false;
			return;
		}
		isOpen = true;
		isLoading = true;
		isOffline = false;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			try {
				results = await searchBrands(item);
				if (results.length === 0) {
					// might be offline or no results
				}
			} catch {
				isOffline = true;
				results = [];
			} finally {
				isLoading = false;
			}
		}, 300);
	}

	function selectBrand(brand: BrandResult) {
		inventoryActions.setBrand(
			item.id,
			brand.name,
			brand.country,
			brand.nutriScore,
			brand.novaGroup ?? undefined
		);
		isOpen = false;
	}

	function selectCustomBrand(name: string, country: string) {
		inventoryActions.setBrand(item.id, name, country);
		isOpen = false;
	}

	function addCustom() {
		if (!customName.trim()) return;
		inventoryActions.addCustomBrand(customName.trim());
		selectCustomBrand(customName.trim(), '🇲🇦');
		customName = '';
		showAddCustom = false;
	}
</script>

<div class="relative inline-block">
	<!-- Trigger Button -->
	<button
		class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all
			{item.brand
			? 'bg-basil/10 text-basil hover:bg-basil/20'
			: 'bg-surface-warm text-text-muted hover:bg-hearth-100 hover:text-text-espresso'}"
		onclick={openDropdown}
	>
		<ShieldCheck size={14} class="shrink-0" />
		{#if item.brand}
			{item.brandCountry || ''}
			{item.brand}
			{#if item.nutriScore}
				<span
					class="ml-1 rounded px-1 py-0.5 text-[10px] font-bold uppercase {nutriScoreColor(
						item.nutriScore
					)}"
				>
					{item.nutriScore.toUpperCase()}
				</span>
			{/if}
		{:else}
			<span class="text-xs">Choose brand...</span>
		{/if}
	</button>

	<!-- Dropdown -->
	{#if isOpen}
		<!-- Backdrop -->
		<button
			class="fixed inset-0 z-40 bg-transparent"
			aria-label="Close brand picker"
			onclick={() => (isOpen = false)}
		></button>

		<div
			class="animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 mt-1 w-72 overflow-hidden rounded-xl border border-border-warm bg-surface shadow-xl duration-200"
		>
			<!-- Header -->
			<div class="border-b border-border-warm bg-surface-warm/50 px-3 py-2">
				<p class="text-[11px] font-bold tracking-wider text-text-muted uppercase">
					Brands for "{item.name}"
				</p>
			</div>

			<div class="max-h-64 overflow-y-auto">
				<!-- Loading State -->
				{#if isLoading}
					<div class="flex items-center justify-center gap-2 py-6 text-text-muted">
						<Loader2 size={16} class="animate-spin" />
						<span class="text-sm">Searching Open Food Facts...</span>
					</div>
				{:else}
					<!-- Offline Warning -->
					{#if isOffline}
						<div class="flex items-center gap-2 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
							<WifiOff size={12} />
							Offline — showing saved brands only
						</div>
					{/if}

					<!-- API Results -->
					{#if results.length > 0}
						{#each results as brand}
							<button
								class="flex w-full cursor-pointer items-start gap-2 border-b border-border-warm/50 px-3 py-2.5 text-left transition-colors hover:bg-hearth-50"
								onclick={() => selectBrand(brand)}
							>
								<span class="shrink-0 text-sm">{brand.country}</span>
								<div class="min-w-0 flex-1">
									<div class="truncate text-sm font-semibold text-text-espresso">{brand.name}</div>
									{#if brand.productName}
										<div class="truncate text-[11px] text-text-muted">{brand.productName}</div>
									{/if}
								</div>
								<div class="flex shrink-0 items-center gap-1">
									{#if brand.nutriScore}
										<span
											class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase {nutriScoreColor(
												brand.nutriScore
											)}"
										>
											{brand.nutriScore.toUpperCase()}
										</span>
									{/if}
									{#if brand.novaGroup}
										<span
											class="rounded px-1.5 py-0.5 text-[10px] font-bold {novaGroupColor(
												brand.novaGroup
											)}"
										>
											N{brand.novaGroup}
										</span>
									{/if}
								</div>
							</button>
						{/each}
					{:else if !isOffline}
						<div class="px-3 py-4 text-center text-sm text-text-muted">
							No brands found for "{item.name}"
						</div>
					{/if}

					<!-- Custom Brands from DB -->
					{#if db.customBrands.length > 0}
						<div class="border-t border-border-warm bg-surface-warm/30 px-3 py-1.5">
							<p class="text-[10px] font-bold tracking-wider text-text-muted uppercase">
								Your Custom Brands
							</p>
						</div>
						{#each db.customBrands as cb}
							<button
								class="flex w-full cursor-pointer items-center gap-2 border-b border-border-warm/50 px-3 py-2 text-left transition-colors hover:bg-hearth-50"
								onclick={() => selectCustomBrand(cb.name, cb.country)}
							>
								<span class="text-sm">{cb.country}</span>
								<span class="text-sm font-semibold text-text-espresso">{cb.name}</span>
								<span
									class="ml-auto rounded bg-hearth-100 px-1.5 py-0.5 text-[10px] font-bold text-hearth-600"
									>Custom</span
								>
							</button>
						{/each}
					{/if}
				{/if}
			</div>

			<!-- Add Custom Brand Footer -->
			<div class="border-t border-border-warm bg-surface-warm/30 p-2">
				{#if showAddCustom}
					<div class="flex gap-1.5">
						<input
							type="text"
							bind:value={customName}
							placeholder="Brand name..."
							class="flex-1 rounded-lg border border-border-warm bg-surface px-2 py-1.5 text-sm focus:ring-1 focus:ring-hearth-400 focus:outline-none"
							onkeydown={(e) => e.key === 'Enter' && addCustom()}
						/>
						<button
							class="rounded-lg bg-text-espresso px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black"
							onclick={addCustom}
						>
							Save
						</button>
					</div>
				{:else}
					<button
						class="flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-hearth-600 transition-colors hover:bg-hearth-100"
						onclick={() => (showAddCustom = true)}
					>
						<Plus size={14} />
						Add Custom Brand
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
