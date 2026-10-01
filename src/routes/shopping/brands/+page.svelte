<script lang="ts">
	import {
		ArrowLeft,
		ChevronDown,
		ChevronRight,
		Search,
		Trophy,
		ShieldCheck
	} from '@lucide/svelte';
	import { db, inventoryActions, type MasterInventoryItem } from '$lib/store.svelte';
	import {
		searchBrands,
		nutriScoreColor,
		novaGroupColor,
		type BrandResult
	} from '$lib/openfoodfacts';

	// The user requested a vertical drop-down for the region filter.
	let regionFilter = $state<'Global' | 'Morocco'>('Global');

	// Track the expanded item accordion
	let expandedItemId = $state<string | null>(null);
	let itemResults = $state<Record<string, BrandResult[]>>({});
	let isLoading = $state(false);

	// Exclude fresh produce which doesn't typically need brands
	const applicableCategories = ['Proteins', 'Spices', 'Supermarket', 'Grains', 'Pantry'];

	async function toggleExpand(item: MasterInventoryItem) {
		if (expandedItemId === item.id) {
			expandedItemId = null;
			return;
		}

		expandedItemId = item.id;

		// Fetch from API if we haven't already loaded results for this item
		if (!itemResults[item.id]) {
			isLoading = true;
			try {
				const results = await searchBrands(item);
				itemResults[item.id] = results;
			} catch (e) {
				console.error(e);
			}
			isLoading = false;
		}
	}

	function setAsDefault(item: MasterInventoryItem, brand: BrandResult) {
		inventoryActions.setBrand(
			item.id,
			brand.name,
			brand.country,
			brand.nutriScore,
			brand.novaGroup ?? undefined
		);
		expandedItemId = null; // collapse after selection
	}

	// Filter helper for the template
	function getFilteredResults(itemId: string, region: 'Global' | 'Morocco') {
		const results = itemResults[itemId] || [];
		if (region === 'Global') return results;
		return results.filter((b) => b.country === '🇲🇦');
	}
</script>

<div class="mx-auto max-w-4xl space-y-6 pb-24">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<a
				href="/shopping"
				class="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-hearth-600"
			>
				<ArrowLeft size={16} /> Back to Shopping List
			</a>
			<h1 class="flex items-center gap-3 text-3xl font-bold text-text-espresso">
				<Trophy size={32} class="text-hearth-500" />
				Healthy Brands
			</h1>
			<p class="mt-1 text-text-muted">Set your default healthy choices for your global items.</p>
		</div>

		<!-- Vertical Dropdown for Region Filter -->
		<div class="flex w-full flex-col gap-1 sm:w-auto">
			<label for="region" class="pl-1 text-xs font-bold tracking-wider text-text-muted uppercase"
				>Filter Availability</label
			>
			<select
				id="region"
				bind:value={regionFilter}
				class="cursor-pointer rounded-xl border border-border-warm bg-surface-warm px-4 py-2.5 text-sm font-bold text-text-espresso focus:border-hearth-500 focus:ring-1 focus:ring-hearth-500 focus:outline-none"
			>
				<option value="Global">🌍 Global (All Brands)</option>
				<option value="Morocco">🇲🇦 Morocco Only</option>
			</select>
		</div>
	</div>

	<!-- Categories -->
	<div class="mt-8 space-y-8">
		{#each applicableCategories as category}
			{@const categoryItems = db.inventory.filter((i) => i.category === category)}
			{#if categoryItems.length > 0}
				<div class="animate-in fade-in slide-in-from-bottom-2 duration-500">
					<!-- Category Header -->
					<h3 class="mb-4 border-l-4 border-hearth-400 pl-2 text-xl font-bold text-hearth-700">
						{category}
					</h3>

					<!-- Items List -->
					<div class="space-y-4">
						{#each categoryItems as item}
							<div
								class="overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm"
							>
								<!-- Item Header (Clickable Accordion) -->
								<button
									class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-hearth-50/50"
									onclick={() => toggleExpand(item)}
								>
									<div class="flex items-center gap-4">
										<span class="text-3xl">{item.icon}</span>
										<div>
											<span class="block font-bold text-text-espresso">
												{item.name}
												{#if item.englishName && item.name !== item.englishName}
													<span class="ml-1 text-sm font-normal text-text-muted"
														>({item.englishName})</span
													>
												{/if}
											</span>
											{#if item.brand}
												<span class="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
													Default: <strong class="text-hearth-700">{item.brand}</strong>
													{item.brandCountry || ''}
													{#if item.nutriScore}
														<span
															class="ml-1 inline-flex h-4 items-center justify-center rounded px-1.5 text-[10px] font-bold text-white {nutriScoreColor(
																item.nutriScore
															)}"
														>
															{item.nutriScore.toUpperCase()}
														</span>
													{/if}
												</span>
											{:else}
												<span class="mt-0.5 block text-xs text-text-muted italic"
													>No default brand set</span
												>
											{/if}
										</div>
									</div>
									<div class="flex items-center gap-3 text-text-muted">
										{#if expandedItemId !== item.id && !item.brand}
											<span
												class="hidden rounded-md bg-hearth-50 px-2 py-1 text-xs font-bold text-hearth-500 sm:block"
												>Find brand</span
											>
										{/if}
										{#if expandedItemId === item.id}
											<ChevronDown size={20} class="text-hearth-500" />
										{:else}
											<ChevronRight size={20} />
										{/if}
									</div>
								</button>

								<!-- Accordion Content (Top Brands) -->
								{#if expandedItemId === item.id}
									<div
										class="animate-in slide-in-from-top-1 border-t border-border-warm bg-surface-warm/30 p-4 duration-200"
									>
										<h4
											class="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-text-muted uppercase"
										>
											<ShieldCheck size={14} class="text-hearth-400" />
											Top Alternatives
										</h4>

										{#if isLoading}
											<div
												class="animate-pulse py-6 text-center text-sm font-medium text-text-muted"
											>
												Searching Open Food Facts...
											</div>
										{:else}
											{@const results = getFilteredResults(item.id, regionFilter)}

											{#if results.length === 0}
												<div
													class="rounded-xl border border-border-warm bg-surface py-8 text-center shadow-sm"
												>
													<Search size={32} class="mx-auto mb-3 text-text-muted opacity-50" />
													<p class="text-sm font-medium text-text-muted">
														No healthy brands found for "{item.name}" {regionFilter === 'Morocco'
															? 'in Morocco'
															: ''}.
													</p>
												</div>
											{:else}
												<div class="space-y-2">
													{#each results as result}
														<div
															class="flex items-center justify-between rounded-xl border border-border-warm bg-surface p-3 shadow-sm transition-colors hover:border-hearth-300"
														>
															<div class="flex flex-col">
																<span
																	class="flex items-center gap-1.5 text-sm font-bold text-text-espresso"
																>
																	{result.name} <span class="text-xs">{result.country}</span>
																</span>
																<div class="mt-1.5 flex items-center gap-1.5">
																	{#if result.nutriScore}
																		<span
																			class="inline-flex h-5 items-center justify-center rounded px-2 text-[10px] font-bold text-white shadow-sm {nutriScoreColor(
																				result.nutriScore
																			)}"
																			title="Nutri-Score"
																		>
																			{result.nutriScore.toUpperCase()}
																		</span>
																	{/if}
																	{#if result.novaGroup}
																		<span
																			class="inline-flex h-5 items-center justify-center rounded px-2 text-[10px] font-bold text-white shadow-sm {novaGroupColor(
																				result.novaGroup
																			)}"
																			title="NOVA Group"
																		>
																			NOVA {result.novaGroup}
																		</span>
																	{/if}
																</div>
															</div>
															<button
																class="rounded-lg border border-border-warm bg-surface-warm px-4 py-2 text-xs font-bold text-text-espresso transition-all hover:border-hearth-200 hover:bg-hearth-50 hover:text-hearth-700 active:scale-95"
																onclick={() => setAsDefault(item, result)}
															>
																Set Default
															</button>
														</div>
													{/each}
												</div>
											{/if}
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
