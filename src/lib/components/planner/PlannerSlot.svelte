<script lang="ts">
	import { Plus, X, Search, UtensilsCrossed } from 'lucide-svelte';
	import { db, plannerActions, type DayPlan } from '$lib/store.svelte';

	let { day, mealType } = $props<{
		day: string;
		mealType: 'breakfast' | 'lunch' | 'dinner';
	}>();

	// Convert lowercase 'breakfast' to 'Breakfast' for tag matching
	let capitalizedMealType = $derived(mealType.charAt(0).toUpperCase() + mealType.slice(1));

	let currentDayPlan = $derived(db.weeklyPlan.find((p) => p.day === day) as DayPlan);
	let assignedRecipeId = $derived(
		currentDayPlan
			? mealType === 'breakfast'
				? currentDayPlan.breakfast
				: mealType === 'lunch'
					? currentDayPlan.lunch
					: currentDayPlan.dinner
			: null
	);
	let assignedRecipe = $derived(db.recipes.find((r) => r.id === assignedRecipeId));

	// Filter recipes that have the exact mealType tag
	let availableRecipes = $derived(db.recipes.filter((r) => r.tags.includes(capitalizedMealType)));

	let isDropdownOpen = $state(false);
	let searchQuery = $state('');

	let filteredDropdownRecipes = $derived(
		availableRecipes.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
		if (isDropdownOpen) searchQuery = '';
	}

	function selectRecipe(recipeId: string) {
		plannerActions.setRecipeForMeal(day, mealType, recipeId);
		isDropdownOpen = false;
	}

	function removeRecipe() {
		plannerActions.setRecipeForMeal(day, mealType, null);
	}

	// Close dropdown when clicking outside
	function handleOutsideClick(e: MouseEvent) {
		if (isDropdownOpen) {
			const target = e.target as HTMLElement;
			if (!target.closest('.planner-slot-dropdown')) {
				isDropdownOpen = false;
			}
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div
	class="planner-slot-dropdown relative h-full min-h-[120px] w-full rounded-2xl border-2 border-dashed border-border-warm bg-surface transition-colors"
>
	{#if assignedRecipe}
		<!-- Occupied State -->
		<div
			class="group relative h-full w-full overflow-hidden rounded-xl border border-border-warm bg-white shadow-sm"
		>
			{#if assignedRecipe.image}
				<div class="h-16 w-full overflow-hidden">
					<img
						src={assignedRecipe.image}
						alt={assignedRecipe.title}
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>
			{:else}
				<div class="flex h-16 w-full items-center justify-center bg-surface-warm text-text-muted">
					<UtensilsCrossed size={20} />
				</div>
			{/if}
			<div class="p-3">
				<h4 class="line-clamp-2 text-sm leading-tight font-bold text-text-espresso">
					{assignedRecipe.title}
				</h4>
				<div class="mt-1 flex gap-2 text-xs font-semibold text-text-muted">
					<span>{assignedRecipe.calories} kcal</span>
					<span>•</span>
					<span>{assignedRecipe.prepTime}</span>
				</div>
			</div>

			<button
				onclick={removeRecipe}
				class="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-text-muted opacity-0 shadow-sm backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-paprika hover:text-white"
				title="Remove"
			>
				<X size={14} />
			</button>
		</div>
	{:else}
		<!-- Empty State / Add Button -->
		<button
			onclick={toggleDropdown}
			class="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl text-text-muted transition-colors hover:bg-hearth-100/50 hover:text-hearth-600"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-warm">
				<Plus size={20} />
			</div>
			<span class="text-xs font-semibold">Add {capitalizedMealType}</span>
		</button>
	{/if}

	<!-- Dropdown Menu -->
	{#if isDropdownOpen}
		<div
			class="absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border-warm bg-white p-2 shadow-cozy"
		>
			<div class="relative mb-2">
				<Search size={14} class="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search recipes..."
					class="w-full rounded-lg bg-surface-warm py-1.5 pr-3 pl-8 text-sm focus:ring-2 focus:ring-hearth-400 focus:outline-none"
				/>
			</div>

			<div class="custom-scrollbar max-h-60 space-y-1 overflow-y-auto pr-1">
				{#if filteredDropdownRecipes.length === 0}
					<div class="py-4 text-center text-sm text-text-muted">No recipes found.</div>
				{:else}
					{#each filteredDropdownRecipes as recipe}
						<button
							onclick={() => selectRecipe(recipe.id)}
							class="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-warm"
						>
							{#if recipe.image}
								<img src={recipe.image} alt="" class="h-10 w-10 rounded-md object-cover" />
							{:else}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-md bg-hearth-100 text-hearth-600"
								>
									<UtensilsCrossed size={16} />
								</div>
							{/if}
							<div class="flex-1 overflow-hidden">
								<div class="truncate text-sm font-bold text-text-espresso">{recipe.title}</div>
								<div class="text-xs font-semibold text-text-subtle">{recipe.calories} kcal</div>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #e2dfd9; /* border-warm */
		border-radius: 4px;
	}
</style>
