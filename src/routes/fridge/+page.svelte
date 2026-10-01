<script lang="ts">
	import {
		Refrigerator,
		Package,
		Search,
		ChevronDown,
		ChevronRight,
		ArchiveRestore,
		CheckCircle2
	} from '@lucide/svelte';
	import { db, inventoryActions, type Category, type MasterInventoryItem } from '$lib/store.svelte';
	import FreshnessRing from '$lib/components/FreshnessRing.svelte';
	import FridgeAnimation from '$lib/components/FridgeAnimation.svelte';
	import ConsumeModal from '$lib/components/ConsumeModal.svelte';
	import { flip } from 'svelte/animate';
	import { fly, fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// Animation state
	let animationDone = $state(false);

	function handleAnimationComplete() {
		animationDone = true;
	}

	// Constants
	const categories: Category[] = [
		'Vegetables',
		'Fruits',
		'Proteins',
		'Dairy',
		'Breakfast',
		'Snacks',
		'Beverages',
		'Canned Goods',
		'Condiments',
		'Pantry',
		'Grains',
		'Spices',
		'Supermarket'
	];

	const categoryEmojis: Record<Category, string> = {
		Vegetables: '🥦',
		Fruits: '🍎',
		Proteins: '🍗',
		Dairy: '🧀',
		Breakfast: '🥣',
		Snacks: '🍪',
		Beverages: '🧃',
		'Canned Goods': '🥫',
		Condiments: '🧂',
		Pantry: '📦',
		Grains: '🌾',
		Spices: '🌶️',
		Supermarket: '🛍️'
	};

	const availableUnits = ['units', 'kg', 'g', 'L', 'ml', '%'];

	// State
	let searchQuery = $state('');
	let collapsedCategories = $state<Record<string, boolean>>({});
	
	let showConsumeModal = $state(false);
	let selectedItemForConsume = $state<MasterInventoryItem | null>(null);

	// Derived grouped items
	let groupedItems = $derived.by(() => {
		const result = {} as Record<Category, MasterInventoryItem[]>;
		categories.forEach((c) => (result[c] = []));

		db.inventory.forEach((item) => {
			if (item.status === 'in_fridge') {
				if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return;
				result[item.category].push(item);
			}
		});
		return result;
	});

	function toggleCategory(category: string) {
		collapsedCategories[category] = !collapsedCategories[category];
	}

	function handleConsumeClick(item: MasterInventoryItem) {
		selectedItemForConsume = item;
		showConsumeModal = true;
	}

	function handleUnitChange(e: Event, item: MasterInventoryItem) {
		const select = e.target as HTMLSelectElement;
		inventoryActions.updateQuantity(item.id, item.quantityAmount || 1, select.value);
	}
	
	function adjustQuantity(item: MasterInventoryItem, delta: number) {
		const current = item.quantityAmount || 0;
		inventoryActions.updateQuantity(item.id, current + delta, item.quantityUnit);
	}
</script>

<ConsumeModal
	bind:isOpen={showConsumeModal}
	item={selectedItemForConsume}
/>

<!-- Cinematic Fridge Opening Animation -->
{#if !animationDone}
	<FridgeAnimation oncomplete={handleAnimationComplete} />
{/if}

<!-- Main Page Content (revealed after animation) -->
{#if animationDone}
	<div class="space-y-6 animate-table-in pb-24">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="flex items-center gap-3 text-3xl font-bold text-text-espresso">
					<Refrigerator size={32} class="text-hearth-500" />
					Fridge & Inventory
				</h1>
				<p class="mt-1 text-text-muted">Manage your prepared batches and exact quantities.</p>
			</div>
			<button
				class="glow-amber flex items-center gap-2 rounded-xl bg-hearth-500 px-4 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-hearth-600"
			>
				<Package size={20} /> Log New Item
			</button>
		</div>

		<!-- Search Bar -->
		<div class="relative">
			<Search size={20} class="absolute top-1/2 left-4 -translate-y-1/2 text-text-muted" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search fridge..."
				class="w-full rounded-2xl border border-border-warm bg-surface py-3.5 pr-4 pl-12 text-text-espresso placeholder-text-subtle shadow-sm focus:border-transparent focus:ring-2 focus:ring-hearth-400 focus:outline-none"
			/>
		</div>

		<!-- Empty State Check -->
		{#if Object.values(groupedItems).every(arr => arr.length === 0)}
			<div class="rounded-3xl border border-border-warm bg-surface py-16 text-center shadow-sm">
				<CheckCircle2 size={48} class="mx-auto mb-4 text-hearth-300" />
				<h3 class="mb-1 text-2xl font-bold text-text-espresso">Fridge is Empty!</h3>
				<p class="text-text-muted">Nothing found in the fridge.</p>
			</div>
		{:else}
			<!-- Categorized Inventory -->
			<div class="space-y-6">
				{#each categories as category}
					{#if groupedItems[category].length > 0}
						<div class="animate-in fade-in slide-in-from-bottom-2 duration-500">
							<!-- Collapsible Header -->
							<button
								class="group mb-4 flex w-full cursor-pointer items-center justify-between text-left focus:outline-none"
								onclick={() => toggleCategory(category)}
							>
								<h3
									class="border-l-4 border-hearth-400 pl-2 text-xl font-bold text-hearth-700 transition-colors group-hover:text-hearth-600"
								>
									{categoryEmojis[category]}
									{category}
								</h3>
								<div class="text-text-muted transition-colors group-hover:text-hearth-500">
									{#if collapsedCategories[category]}
										<ChevronRight size={20} />
									{:else}
										<ChevronDown size={20} />
									{/if}
								</div>
							</button>

							{#if !collapsedCategories[category]}
								<div
									transition:slide={{ duration: 300, easing: quintOut }}
									class="overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm"
								>
									<div class="overflow-x-auto">
										<table class="w-full border-collapse text-left">
											<thead>
												<tr
													class="border-b border-border-warm bg-surface-warm/30 text-xs tracking-wider text-text-muted uppercase"
												>
													<th class="p-4 font-semibold">Item</th>
													<th class="p-4 font-semibold">Quantity</th>
													<th class="p-4 font-semibold hidden sm:table-cell">Freshness</th>
													<th class="p-4 text-right font-semibold">Actions</th>
												</tr>
											</thead>
											<tbody class="divide-y divide-border-warm">
												{#each groupedItems[category] as item (item.id)}
													<tr
														animate:flip={{ duration: 300, easing: quintOut }}
														in:fly={{ y: -20, duration: 300 }}
														out:fly={{ x: 50, duration: 250 }}
														class="transition-colors hover:bg-hearth-50/50"
													>
														<td class="p-4">
															<div class="flex items-center gap-2 font-bold text-text-espresso">
																<span>{item.icon}</span> 
																<span>{item.name}</span>
															</div>
														</td>
														<td class="p-4">
															<div class="flex items-center gap-1 rounded-lg border border-border-warm bg-canvas p-1 w-max">
																<button 
																	class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-surface text-hearth-600 shadow-sm transition-colors hover:bg-hearth-100"
																	onclick={() => adjustQuantity(item, -(item.quantityUnit === 'g' || item.quantityUnit === 'ml' ? 10 : 1))}
																>
																	-
																</button>
																<input 
																	type="number"
																	step="any"
																	class="w-14 bg-transparent text-center font-mono text-sm font-bold text-text-espresso outline-none"
																	bind:value={item.quantityAmount}
																/>
																<button 
																	class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-surface text-hearth-600 shadow-sm transition-colors hover:bg-hearth-100"
																	onclick={() => adjustQuantity(item, item.quantityUnit === 'g' || item.quantityUnit === 'ml' ? 10 : 1)}
																>
																	+
																</button>
																<div class="relative ml-1">
																	<select
																		class="appearance-none rounded bg-surface px-2 py-0.5 text-xs font-bold tracking-wider text-hearth-700 shadow-sm outline-none cursor-pointer hover:bg-hearth-100 focus:ring-2 focus:ring-hearth-400"
																		onchange={(e) => handleUnitChange(e, item)}
																	>
																		{#each availableUnits as unit}
																			<option value={unit} selected={item.quantityUnit === unit}>{unit}</option>
																		{/each}
																	</select>
																</div>
															</div>
														</td>
														<td class="p-4 hidden sm:table-cell">
															<FreshnessRing expiresIn={item.expiresIn} />
														</td>
														<td class="p-4 text-right">
															<button
																class="rounded-lg bg-text-espresso px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-hearth-500"
																onclick={() => handleConsumeClick(item)}
															>
																Consume
															</button>
														</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}
