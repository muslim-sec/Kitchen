<script lang="ts">
	import { Plus, Search, Settings2, X, Edit2, Trash2, Grid, List, UtensilsCrossed, Calendar, Flame } from 'lucide-svelte';
	import { db, tagActions } from '$lib/store.svelte';
	import WeeklyGrid from '$lib/components/planner/WeeklyGrid.svelte';
	import { Spring } from 'svelte/motion';
	import { fade, fly, crossfade } from 'svelte/transition';
	import { cubicOut, backOut } from 'svelte/easing';

	const [sendTab, receiveTab] = crossfade({
		duration: 300,
		easing: cubicOut
	});

	const [sendSub, receiveSub] = crossfade({
		duration: 300,
		easing: cubicOut
	});

	let searchQuery = $state('');

	// 'meal' | 'category' | 'weekly'
	let activeView = $state<'meal' | 'category' | 'weekly'>('meal');

	// Active sub-tab based on main view
	let activeMealTab = $state('Breakfast');
	let activeCategoryTab = $state('All');

	const mealTabs = ['Breakfast', 'Lunch', 'Dinner'];
	let categoryTabs = $derived(['All', ...db.tags.filter(t => !['Breakfast', 'Lunch', 'Dinner'].includes(t.name)).map(t => t.name)]);
	let isManageTagsOpen = $state(false);
	let tagEditState = $state<{old: string, newName: string, newEmoji: string, newColor: string} | null>(null);

	let filteredRecipes = $derived.by(() => {
		let recipes = db.recipes.filter(
			(recipe) =>
				recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(recipe.description || '').toLowerCase().includes(searchQuery.toLowerCase())
		);

		if (activeView === 'meal') {
			recipes = recipes.filter((r) => r.tags.includes(activeMealTab));
		} else if (activeView === 'category' && activeCategoryTab !== 'All') {
			recipes = recipes.filter((r) => r.tags.includes(activeCategoryTab));
		}

		return recipes;
	});
</script>

<div class="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-700">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-text-espresso">Recipes & Planner</h1>
			<p class="mt-1 text-text-muted">Manage your recipes and schedule your weekly meals.</p>
		</div>
		<a
			href="/recipes/new"
			class="inline-flex items-center gap-2 rounded-xl bg-basil px-4 py-2.5 font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
		>
			<Plus size={20} />
			New Recipe
		</a>
	</div>

	<!-- Controls Bar -->
	<div
		class="flex flex-col gap-4 rounded-2xl border border-border-warm bg-surface p-2 shadow-sm md:flex-row md:items-center md:justify-between"
	>
		<!-- View Toggles (Meal / Category / Weekly) -->
		<div class="custom-scrollbar flex shrink-0 overflow-x-auto rounded-xl bg-surface-warm p-1">
			<button
				onclick={() => (activeView = 'meal')}
				class="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 {activeView ===
				'meal'
					? 'text-hearth-700'
					: 'text-text-muted hover:text-text-espresso'}"
			>
				{#if activeView === 'meal'}
					<div
						class="absolute inset-0 rounded-lg bg-white shadow-sm"
						in:receiveTab={{ key: 'view-pill' }}
						out:sendTab={{ key: 'view-pill' }}
					></div>
				{/if}
				<UtensilsCrossed size={16} class="relative z-10" />
				<span class="relative z-10">By Meal Type</span>
			</button>
			<button
				onclick={() => (activeView = 'category')}
				class="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-150 {activeView ===
				'category'
					? 'text-hearth-700'
					: 'text-text-muted hover:text-text-espresso'}"
			>
				{#if activeView === 'category'}
					<div
						class="absolute inset-0 rounded-lg bg-white shadow-sm"
						in:receiveTab={{ key: 'view-pill' }}
						out:sendTab={{ key: 'view-pill' }}
					></div>
				{/if}
				<Grid size={16} class="relative z-10" /> <span class="relative z-10">By Category</span>
			</button>
			<button
				onclick={() => (activeView = 'weekly')}
				class="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-150 {activeView ===
				'weekly'
					? 'text-hearth-700'
					: 'text-text-muted hover:text-text-espresso'}"
			>
				{#if activeView === 'weekly'}
					<div
						class="absolute inset-0 rounded-lg bg-hearth-100 shadow-sm"
						in:receiveTab={{ key: 'view-pill' }}
						out:sendTab={{ key: 'view-pill' }}
					></div>
				{/if}
				<Calendar
					size={16}
					class="relative z-10 {activeView === 'weekly' ? 'text-hearth-600' : ''}"
				/> <span class="relative z-10">Weekly Plan</span>
			</button>
		</div>

		<!-- Search -->
		{#if activeView !== 'weekly'}
			<div class="relative w-full shrink-0 md:max-w-xs" transition:fade={{ duration: 150 }}>
				<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search recipes..."
					class="w-full rounded-xl border border-border-warm bg-canvas py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-hearth-400 focus:outline-none"
				/>
			</div>
		{/if}
	</div>

	{#if activeView === 'weekly'}
		<div class="animate-in fade-in duration-500">
			<WeeklyGrid />
		</div>
	{:else}
		<!-- Sub-navigation Tabs -->
		<div class="custom-scrollbar flex gap-2 overflow-x-auto pb-2">
				{#if activeView === 'category'}
					<button
						onclick={() => (isManageTagsOpen = true)}
						class="flex shrink-0 items-center gap-1 rounded-full bg-surface-warm px-4 py-1.5 text-sm font-semibold text-hearth-600 transition-colors hover:bg-hearth-100"
					>
						<Settings2 size={16} /> Manage Tags
					</button>
					<div class="w-px shrink-0 bg-border-warm mx-1"></div>
				{/if}
			{#if activeView === 'meal'}
				{#each mealTabs as tab}
					<button
						onclick={() => (activeMealTab = tab)}
						class="relative rounded-full px-5 py-1.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 {activeMealTab ===
						tab
							? 'text-hearth-700'
							: 'text-text-muted hover:bg-surface-warm'}"
					>
						{#if activeMealTab === tab}
							<div
								class="absolute inset-0 rounded-full bg-hearth-100"
								in:receiveSub={{ key: 'sub-pill' }}
								out:sendSub={{ key: 'sub-pill' }}
							></div>
						{/if}
						<span class="relative z-10">{tab}</span>
					</button>
				{/each}
			{:else}
				{#each categoryTabs as tab}
					<button
						onclick={() => (activeCategoryTab = tab)}
						class="relative rounded-full px-5 py-1.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 {activeCategoryTab ===
						tab
							? 'text-hearth-700'
							: 'text-text-muted hover:bg-surface-warm'}"
					>
						{#if activeCategoryTab === tab}
							<div
								class="absolute inset-0 rounded-full bg-hearth-100"
								in:receiveSub={{ key: 'sub-pill' }}
								out:sendSub={{ key: 'sub-pill' }}
							></div>
						{/if}
						<span class="relative z-10">{tab}</span>
					</button>
				{/each}
			{/if}
		</div>

		<!-- Recipe Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredRecipes as recipe, index (recipe.id)}
				{@const scale = new Spring(1, { stiffness: 0.1, damping: 0.4 })}
				<div in:fly={{ y: 30, duration: 400, delay: index * 50, easing: backOut }}>
					<a
						href="/recipes/{recipe.id}"
						onpointerdown={() => scale.set(0.96)}
						onpointerup={() => scale.set(1)}
						onpointerleave={() => scale.set(1)}
						style="transform: scale({scale.current}); transform-origin: center;"
						class="group block flex h-full flex-col overflow-hidden rounded-3xl border border-border-warm bg-surface shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="relative h-48 w-full overflow-hidden bg-surface-warm">
							{#if recipe.image}
								<img
									src={recipe.image}
									alt={recipe.title}
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-text-muted">
									<UtensilsCrossed size={48} class="opacity-20" />
								</div>
							{/if}
							<div
								class="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-hearth-600 shadow-sm backdrop-blur-sm"
							>
								<Flame size={12} />
								{recipe.calories}
							</div>
						</div>

						<div class="flex flex-1 flex-col p-5">
							<div class="mb-2 flex flex-wrap gap-1">
								{#each recipe.tags.slice(0, 2) as tag}
									<span
										class="rounded-md bg-canvas px-2 py-0.5 text-xs font-semibold text-text-muted"
										>{tag}</span
									>
								{/each}
							</div>
							<h3 class="mb-2 text-xl leading-tight font-bold text-text-espresso">
								{recipe.title}
							</h3>
							<p class="mb-4 line-clamp-2 flex-1 text-sm text-text-subtle">{recipe.description}</p>

							<div
								class="flex items-center justify-between border-t border-border-warm pt-4 text-sm font-semibold text-text-muted"
							>
								<span>{recipe.prepTime} prep</span>
								<span>{recipe.protein} protein</span>
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>

		{#if filteredRecipes.length === 0}
			<div class="flex flex-col items-center justify-center py-20 text-text-muted">
				<UtensilsCrossed size={48} class="mb-4 opacity-20" />
				<h3 class="text-lg font-bold text-text-espresso">No recipes found</h3>
				<p>Try adjusting your search or category filters.</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #e2dfd9; /* border-warm */
		border-radius: 4px;
	}
</style>

{#if isManageTagsOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" transition:fade={{duration: 200}}>
		<div class="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl" transition:fly={{y: 20, duration: 300, easing: cubicOut}}>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-text-espresso">Manage Tags</h3>
				<button onclick={() => isManageTagsOpen = false} class="rounded-full p-2 text-text-muted hover:bg-surface-warm hover:text-text-espresso">
					<X size={20} />
				</button>
			</div>
			
			<div class="max-h-[60vh] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
				{#each db.tags as tag}
					<div class="flex items-center justify-between rounded-xl border border-border-warm bg-surface-warm/50 p-3">
						{#if tagEditState?.old === tag.name}
							<div class="flex w-full gap-2">
								<input 
									type="text" 
									bind:value={tagEditState.newEmoji} 
									class="w-12 rounded-lg border border-hearth-300 bg-white px-2 text-center outline-none focus:ring-2 focus:ring-hearth-400"
								/>
								<input 
									type="text" 
									bind:value={tagEditState.newName} 
									class="flex-1 rounded-lg border border-hearth-300 px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-hearth-400"
								/>
								<button 
									onclick={() => { 
										tagActions.updateTag(tagEditState!.old, tagEditState!.newName, tagEditState!.newEmoji, tagEditState!.newColor);
										tagEditState = null;
									}} 
									class="rounded-lg bg-hearth-500 px-3 py-1 text-sm font-bold text-white hover:bg-hearth-600"
								>Save</button>
								<button 
									onclick={() => tagEditState = null} 
									class="rounded-lg bg-border-warm px-3 py-1 text-sm font-bold text-text-espresso hover:bg-border-strong"
								>Cancel</button>
							</div>
						{:else}
							<div class="flex items-center gap-2">
								<span class="rounded-md px-1.5 py-0.5 text-xs {tag.color}">{tag.emoji}</span>
								<span class="font-semibold text-text-espresso">{tag.name}</span>
							</div>
							<div class="flex items-center gap-1">
								<button 
									onclick={() => tagEditState = {old: tag.name, newName: tag.name, newEmoji: tag.emoji, newColor: tag.color}}
									class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-hearth-100 hover:text-hearth-600"
								><Edit2 size={16} /></button>
								<button 
									onclick={() => tagActions.deleteTag(tag.name)}
									class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-flame/10 hover:text-flame"
								><Trash2 size={16} /></button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

