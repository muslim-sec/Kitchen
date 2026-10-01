<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly, scale, slide } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import {
		ShoppingCart,
		ChevronDown,
		ChevronRight,
		Trophy,
		PlusSquare,
		CheckCircle2,
		EyeOff,
			Eye,
			Trash2,
			RotateCcw,
			RefreshCw,
			Edit2
	} from '@lucide/svelte';
	import { db, inventoryActions, type Category } from '$lib/store.svelte';
	import BrandPicker from '$lib/components/BrandPicker.svelte';
	import { translateText } from '$lib/translation';

	// Toggle state for "To Buy" vs "Global List"
	let viewMode = $state<'to_buy' | 'all'>('all');
	let cycleFilter = $state<'all' | 'weekly' | 'biweekly' | 'monthly'>('all');
	let showHidden = $state(false);
	
	let isHiddenMenuOpen = $state(false);
	let isCycleMenuOpen = $state(false);
	let newTemplateName = $state('');
	
	let confirmDeleteModal = $state({ show: false, itemId: '', itemName: '' });
	
	let activeHideTemplate = $state<string | null>(null);
	let configTemplateModal = $state({ show: false, templateId: '', templateName: '', selectedNames: [] as string[], confirmSave: false });
	
	let hiddenCount = $derived(db.inventory.filter(i => i.isHidden).length);

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

	// Map of category -> boolean (true = collapsed)
	let collapsedCategories = $state<Record<string, boolean>>({});

	// Draft state for new items per category
	let newItemsDrafts = $state<Record<string, { icon: string; name: string; quantityAmount: number; quantityUnit: string }>>({});

	// Context Menu State
	let contextMenu = $state({
		show: false,
		x: 0,
		y: 0,
		itemId: '',
		isHidden: false
	});

	function handleContextMenu(e: MouseEvent, item: any) {
		e.preventDefault();
		contextMenu = {
			show: true,
			x: e.clientX,
			y: e.clientY,
			itemId: item.id,
			isHidden: !!item.isHidden
		};
	}

	function closeContextMenu() {
		contextMenu.show = false;
	}

	function hideSelectedItem() {
		inventoryActions.toggleHidden(contextMenu.itemId);
		closeContextMenu();
	}

	function deleteSelectedItem() {
		const item = db.inventory.find(i => i.id === contextMenu.itemId);
		confirmDeleteModal = { show: true, itemId: contextMenu.itemId, itemName: item?.name || 'this item' };
		closeContextMenu();
	}

	// Initialize drafts for all categories
	for (const cat of categories) {
		newItemsDrafts[cat] = { icon: '', name: '', quantityAmount: 1, quantityUnit: 'units' };
	}

	async function handleAddCategoryItem(category: string) {
		const draft = newItemsDrafts[category];
		if (!draft?.name?.trim()) return;

		const name = draft.name.trim();
		const icon = draft.icon?.trim() || '📌';

		// Translate to English for better API matching
		const englishName = await translateText(name, 'en');

		inventoryActions.addItem(
			{
				name,
				englishName,
				icon,
				category: category as Category,
				price: 0
			},
			viewMode === 'all' ? 'in_fridge' : 'to_buy'
		);

		// Reset the draft for this category
		newItemsDrafts[category] = { icon: '', name: '', quantityAmount: 1, quantityUnit: 'units' };
	}

	// Derive grouped items
	let groupedItems = $derived.by(() => {
		const result = {} as Record<Category, typeof db.inventory>;
		categories.forEach((c) => (result[c] = []));

		db.inventory.forEach((item) => {
			if (item.isHidden && !showHidden) return;
				if (cycleFilter !== 'all' && item.cycle !== cycleFilter) return;
			if (viewMode === 'all' || item.status === 'to_buy') {
				result[item.category].push(item);
			}
		});
		return result;
	});

	// Visible Total Calculation
	let visibleTotal = $derived(
		Object.values(groupedItems).flat().filter(i => !i.isHidden).reduce((sum, item) => sum + (item.price || 0), 0)
	);

	function toggleCategory(category: string) {
		collapsedCategories[category] = !collapsedCategories[category];
	}

	function handleCheck(id: string, currentStatus: string) {
		if (currentStatus === 'to_buy') {
			inventoryActions.updateStatus(id, 'purchased');
		} else {
			inventoryActions.updateStatus(id, 'to_buy');
		}
	}
</script>

<svelte:window onclick={closeContextMenu} />

<div class="relative min-h-screen space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="flex items-center gap-3 text-3xl font-bold text-text-espresso">
				<ShoppingCart size={32} class="text-hearth-500" />
				Shopping List
			</h1>
			<p class="mt-1 text-text-muted">Smart, connected inventory grouped by category.</p>
		</div>

		<!-- View Toggle & Actions -->
		<div class="flex flex-wrap items-center gap-3">
			<!-- Hidden & Templates Dropdown -->
			<div class="relative">
				<button
					class="flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 text-sm font-bold transition-all hover:bg-surface-warm {hiddenCount > 0 || activeHideTemplate ? 'text-text-espresso' : 'text-text-muted'} {activeHideTemplate === 'eco-mode' ? 'bg-hearth-50 border-hearth-200' : ''}"
					onclick={() => isHiddenMenuOpen = !isHiddenMenuOpen}
				>
					{#if activeHideTemplate === 'eco-mode'}
						<span>💰</span>
						<span class="hidden sm:inline text-hearth-700">Economic Mode ({hiddenCount})</span>
					{:else if activeHideTemplate}
						<EyeOff size={18} class="text-hearth-600" />
						<span class="hidden sm:inline text-hearth-700">Template Active ({hiddenCount})</span>
					{:else}
						<EyeOff size={18} />
						<span class="hidden sm:inline">Hidden ({hiddenCount})</span>
					{/if}
					<ChevronDown size={14} class="ml-1 transition-transform {isHiddenMenuOpen ? 'rotate-180' : ''}" />
				</button>

				{#if isHiddenMenuOpen}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="fixed inset-0 z-40" onclick={() => isHiddenMenuOpen = false}></div>
					<div class="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-xl">
						<div class="border-b border-border-warm bg-surface-warm/30 px-4 py-2 text-xs font-bold tracking-wider text-text-muted uppercase">
							Visibility
						</div>
						<div class="p-2">
							<button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {showHidden ? 'text-hearth-600' : 'text-text-espresso'}" onclick={() => { showHidden = !showHidden; isHiddenMenuOpen = false; }}>
								{#if showHidden}<Eye size={16} /> Hide from list{:else}<EyeOff size={16} /> Show in list{/if}
							</button>
							
						</div>
						
						<div class="border-y border-border-warm bg-surface-warm/30 px-4 py-2 text-xs font-bold tracking-wider text-text-muted uppercase">
							Templates
						</div>
						<div class="p-2">
							<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {!activeHideTemplate ? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'}" 
								onclick={() => { inventoryActions.unhideAll(); activeHideTemplate = null; isHiddenMenuOpen = false; }}
							>
								<div class="flex items-center gap-2">
									<span>🛒 Full List (Default)</span>
								</div>
							</button>
							{#each db.hideTemplates as template}
								<div class="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-surface-warm {activeHideTemplate === template.id ? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'}">
									<button class="flex-1 text-left flex items-center gap-2 py-1 outline-none" onclick={() => { inventoryActions.applyHideTemplate(template.hiddenNames); activeHideTemplate = template.id; isHiddenMenuOpen = false; }}>
										<span class="truncate">{template.name}</span>
									</button>
									<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 pl-2">
										<button class="text-text-muted hover:text-hearth-600 outline-none" title="Edit Template" onclick={(e) => { e.stopPropagation(); configTemplateModal = { show: true, templateId: template.id, templateName: template.name, selectedNames: [...template.hiddenNames], confirmSave: false }; isHiddenMenuOpen = false; }}>
											<Edit2 size={14} />
										</button>
										{#if template.id !== 'eco-mode'}
											<button class="hover:text-flame outline-none" title="Delete Template" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); if (activeHideTemplate === template.id) activeHideTemplate = null; }}>
												<Trash2 size={14} />
											</button>
										{/if}
									</div>
								</div>
							{/each}
						</div>
						
						<div class="border-t border-border-warm p-2">
							<div class="flex gap-2">
								<input type="text" bind:value={newTemplateName} placeholder="Save as..." class="w-full flex-1 rounded-lg border border-border-warm bg-canvas px-2 py-1.5 text-sm outline-none focus:border-hearth-400" />
								<button class="rounded-lg bg-hearth-500 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-hearth-600 disabled:opacity-50" disabled={!newTemplateName.trim()} onclick={() => { 
									const hiddenNames = db.inventory.filter(i => i.isHidden).map(i => i.name);
									inventoryActions.saveHideTemplate(newTemplateName.trim(), hiddenNames);
									newTemplateName = ''; 
								}}>
									Save
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<a
				href="/shopping/brands"
				class="group flex items-center gap-2 rounded-xl border border-hearth-400/30 bg-gradient-to-r from-hearth-500/10 to-transparent px-4 py-2 text-sm font-bold text-hearth-700 transition-all hover:bg-hearth-500/20 hover:shadow-sm"
			>
				<Trophy size={18} class="text-hearth-500 transition-transform group-hover:scale-110" />
				Healthy Brands
			</a>
			<!-- Cycle Filter Dropdown -->
				<div class="relative">
					<button
						class="flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm"
						onclick={() => isCycleMenuOpen = !isCycleMenuOpen}
					>
						📅 {cycleFilter === 'all' ? 'All Cycles' : cycleFilter === 'weekly' ? 'Weekly 🛒' : cycleFilter === 'biweekly' ? 'Bi-weekly 📅' : 'Monthly 📦'}
						<ChevronDown size={14} class="ml-1 transition-transform {isCycleMenuOpen ? 'rotate-180' : ''}" />
					</button>
					{#if isCycleMenuOpen}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="fixed inset-0 z-40" onclick={() => isCycleMenuOpen = false}></div>
						<div class="absolute right-0 top-[calc(100%+8px)] z-50 w-48 overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-xl">
							<div class="p-2 flex flex-col gap-1">
								{#each ['all', 'weekly', 'biweekly', 'monthly'] as cycle}
									<button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {cycleFilter === cycle ? 'text-hearth-600 bg-hearth-50' : 'text-text-espresso'}" onclick={() => { cycleFilter = cycle as 'all'|'weekly'|'biweekly'|'monthly'; isCycleMenuOpen = false; }}>
										{cycle === 'all' ? 'All Cycles' : cycle === 'weekly' ? 'Weekly 🛒' : cycle === 'biweekly' ? 'Bi-weekly 📅' : 'Monthly 📦'}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			<!-- View Toggle -->
			<div class="flex rounded-xl border border-border-warm bg-surface-warm p-1">
				<button
					class="rounded-lg px-4 py-2 text-sm font-bold transition-all {viewMode === 'to_buy'
						? 'bg-surface text-text-espresso shadow-sm'
						: 'text-text-muted hover:text-text-espresso'}"
					onclick={() => (viewMode = 'to_buy')}
				>
					To Buy Only
				</button>
				<button
					class="rounded-lg px-4 py-2 text-sm font-bold transition-all {viewMode === 'all'
						? 'bg-surface text-text-espresso shadow-sm'
						: 'text-text-muted hover:text-text-espresso'}"
					onclick={() => (viewMode = 'all')}
				>
					Global List
				</button>
			</div>
		</div>
	</div>

	<!-- Render Grouped Tables -->
	<div class="space-y-6 pb-24">
		{#each categories as category}
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
						<table class="w-full border-collapse text-left">
							<thead>
								<tr
									class="border-b border-border-warm bg-surface-warm/30 text-xs tracking-wider text-text-muted uppercase"
								>
									<th class="w-12 p-3 text-center">Buy</th>
									<th class="p-3">Item</th>
									<th class="p-3 w-32">Qty</th>
									<th class="hidden p-3 sm:table-cell">Brand (Healthy)</th>
									<th class="hidden p-3 md:table-cell">Eco Alternative</th>
									<th class="p-3 text-right">Price</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-border-warm">
								{#each groupedItems[category] as item (item.id)}
									<tr
										animate:flip={{ duration: 300, easing: quintOut }}
										in:fly={{ y: -20, duration: 300 }}
										out:fly={{ x: 50, duration: 250 }}
										oncontextmenu={(e) => handleContextMenu(e, item)}
										class="transition-colors hover:bg-hearth-50/50 {item.isHidden ? 'opacity-40' : ''}"
									>
										<td class="p-3 text-center">
											<button
												class="flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-110 active:scale-95"
												onclick={() => handleCheck(item.id, item.status)}
												title={item.status === 'to_buy' ? 'Add to Cart' : 'In Fridge'}
											>
												{#if item.status === 'to_buy'}
													<span class="text-2xl drop-shadow-sm">🛒</span>
												{:else}
													<span class="text-2xl drop-shadow-sm">🧊</span>
												{/if}
											</button>
										</td>
										<td class="p-3">
											<div class="flex items-center gap-2">
												<input
													type="text"
													bind:value={item.icon}
													class="w-8 border-b border-transparent bg-transparent text-center text-xl hover:border-border-warm focus:border-hearth-400 focus:outline-none"
													maxlength="2"
												/>
												<div class="flex flex-col">
													<input
														type="text"
														bind:value={item.name}
														class="w-full border-b border-transparent bg-transparent font-medium text-text-espresso hover:border-border-warm focus:border-hearth-400 focus:outline-none"
														placeholder="Item name"
													/>
													{#if item.englishName && item.englishName !== item.name}
														<span
															class="mt-0.5 text-[10px] tracking-wider text-text-muted uppercase"
															>{item.englishName}</span
														>
													{/if}
												</div>
												{#if item.status === 'in_fridge' && viewMode === 'all'}
													<span
														class="ml-2 inline-flex shrink-0 items-center gap-1 rounded bg-basil/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-basil uppercase"
													>
														In Fridge
													</span>
												{/if}
											</div>
										</td>
										<td class="p-3">
											<div class="flex items-center gap-1">
												<input
													type="number"
													step="any"
													min="0.1"
													bind:value={item.quantityAmount}
													class="w-16 rounded border-none bg-transparent px-1 py-0.5 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
												/>
												<select
													bind:value={item.quantityUnit}
													class="w-20 rounded border-none bg-transparent px-1 py-0.5 text-xs text-text-muted transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
												>
													{#each ['kg', 'g', 'L', 'ml', 'units', 'pcs', 'cans', 'bunch', 'packs', 'jar', 'bottle', 'box', 'tube', 'loaves', 'heads', 'cups', 'bars'] as unit}
														<option value={unit}>{unit}</option>
													{/each}
												</select>
											</div>
										</td>
										<td class="hidden p-3 text-sm sm:table-cell">
											<BrandPicker {item} />
										</td>
										<td class="hidden p-3 text-sm text-text-muted md:table-cell">
											<input
												type="text"
												bind:value={item.ecoAlternative}
												placeholder="-"
												class="w-full rounded border-none bg-transparent px-1 py-0.5 text-sm transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
											/>
										</td>
										<td class="p-3 text-right">
											<input
												type="number"
												step="0.01"
												min="0"
												bind:value={item.price}
												class="w-20 rounded border-none bg-transparent px-1 py-0.5 text-right font-mono text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
											/>
										</td>
									</tr>
								{/each}

								<!-- NEW INLINE ADD ROW -->
								<tr class="bg-surface-warm/20 transition-colors hover:bg-surface-warm/40">
									<td class="p-3 text-center">
										<button
											class="text-hearth-500 transition-colors hover:text-hearth-700 disabled:opacity-50"
											onclick={() => handleAddCategoryItem(category)}
											disabled={!newItemsDrafts[category]?.name}
										>
											<PlusSquare size={24} />
										</button>
									</td>
									<td class="p-3">
										<div class="flex items-center gap-2">
											<input
												type="text"
												bind:value={newItemsDrafts[category].icon}
												placeholder="📌"
												class="w-8 rounded border-b border-transparent bg-surface-warm/50 text-center text-xl hover:border-border-warm focus:border-hearth-400 focus:outline-none"
												maxlength="2"
												onkeydown={(e) => e.key === 'Enter' && handleAddCategoryItem(category)}
											/>
											<input
												type="text"
												bind:value={newItemsDrafts[category].name}
												placeholder="Add new {category.toLowerCase()} item..."
												class="w-full border-b border-transparent bg-transparent font-medium text-text-espresso placeholder-text-muted hover:border-border-warm focus:border-hearth-400 focus:outline-none"
												onkeydown={(e) => e.key === 'Enter' && handleAddCategoryItem(category)}
											/>
										</div>
									</td>
									<td class="p-3">
										<div class="flex items-center gap-1">
											<input
												type="number"
												step="any"
												min="0.1"
												bind:value={newItemsDrafts[category].quantityAmount}
												class="w-16 rounded border-none bg-transparent px-1 py-0.5 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
											/>
											<select
												bind:value={newItemsDrafts[category].quantityUnit}
												class="w-20 rounded border-none bg-transparent px-1 py-0.5 text-xs text-text-muted transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
											>
												{#each ['kg', 'g', 'L', 'ml', 'units', 'pcs', 'cans', 'bunch', 'packs', 'jar', 'bottle', 'box', 'tube', 'loaves', 'heads', 'cups', 'bars'] as unit}
													<option value={unit}>{unit}</option>
												{/each}
											</select>
										</div>
									</td>
									<td class="hidden p-3 sm:table-cell" colspan="2"></td>
								</tr>
							</tbody>
							{#if groupedItems[category].length > 0}
								<tfoot
									class="border-t border-border-warm text-xs font-semibold tracking-wider text-text-muted"
								>
									<tr>
										<td class="p-3" colspan="3">
											<span class="ml-2">COUNT {groupedItems[category].length}</span>
										</td>
										<td class="hidden p-3 sm:table-cell"></td>
										<td class="hidden p-3 md:table-cell"></td>
										<td class="p-3 text-right font-mono">
											SUM {groupedItems[category]
												.filter(i => !i.isHidden)
												.filter(i => !i.isHidden)
												.reduce((sum, item) => sum + (item.price || 0), 0)
												.toFixed(2)}
										</td>
									</tr>
								</tfoot>
							{/if}
						</table>
					</div>
				{/if}
			</div>
		{/each}

		<!-- Empty State when fully bought -->
		{#if Object.values(groupedItems).flat().length === 0}
			<div
				in:scale={{ start: 0.8, duration: 600, easing: elasticOut }}
				class="rounded-3xl border border-border-warm bg-surface py-16 text-center shadow-sm"
			>
				<CheckCircle2 size={48} class="mx-auto mb-4 text-basil" />
				<h3 class="mb-1 text-2xl font-bold text-text-espresso">All Caught Up!</h3>
				<p class="text-text-muted">Your shopping list is empty. Everything is in the fridge.</p>
			</div>
		{/if}

		<!-- Grand Total (End of Page) -->
		{#if Object.values(groupedItems).flat().length > 0}
			<div class="animate-in fade-in mt-8 flex justify-end duration-500">
				<div
					class="flex items-center gap-8 rounded-2xl border border-hearth-200 bg-hearth-50 px-8 py-4 shadow-sm"
				>
					<span class="text-sm font-bold tracking-wider text-hearth-700 uppercase"
						>Global Total</span
					>
					<span class="font-mono text-2xl font-bold text-hearth-900">
						{visibleTotal.toFixed(2)}
					</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Custom Context Menu -->
	{#if contextMenu.show}
		<div
			class="fixed z-50 min-w-40 overflow-hidden rounded-xl border border-border-warm bg-surface py-1 shadow-lg"
			style="top: {contextMenu.y}px; left: {contextMenu.x}px;"
		>
			<button
				class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-espresso hover:bg-surface-warm"
				onclick={hideSelectedItem}
			>
				{#if contextMenu.isHidden}
					<Eye size={16} /> Unhide Item
				{:else}
					<EyeOff size={16} /> Hide Item
				{/if}
			</button>
			<button
				class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-flame hover:bg-red-50"
				onclick={deleteSelectedItem}
			>
				<Trash2 size={16} /> Delete Item
			</button>
		</div>
	{/if}
</div>
