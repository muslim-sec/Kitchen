<script lang="ts">
	import {
		Clock,
		Flame,
		ChefHat,
		CheckCircle2,
		ShoppingCart,
		PlayCircle,
		Droplets,
		Leaf,
		Info,
		ChevronLeft,
		Edit,
		Save,
		Plus,
		Trash,
		Tag,
		Video,
		Snowflake,
		Thermometer
	} from '@lucide/svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import { db, recipeActions, type Recipe } from '$lib/store.svelte';

	let { data } = $props<{ data: { id: string } }>();
	let recipe = $derived(db.recipes.find((r) => r.id === data.id) as Recipe);
	let isEditing = $state(false);

	let editTitle = $state('');
	let editDesc = $state('');
	let editVideoUrl = $state('');
	let editTags = $state<string[]>([]);
	let editIngredients = $state<Recipe['ingredients']>([]);
	let editSteps = $state<string[]>([]);
	let editStorage = $state<Recipe['storage']>(recipe?.storage);
	let editNutrition = $state<Recipe['nutrition']>(recipe?.nutrition);

	function startEditing() {
		editTitle = recipe.title;
		editDesc = recipe.description;
		editVideoUrl = recipe.videoUrl || '';
		editTags = [...recipe.tags];
		editIngredients = JSON.parse(JSON.stringify(recipe.ingredients));
		editSteps = [...recipe.steps];
		editStorage = JSON.parse(JSON.stringify(recipe.storage));
		editNutrition = JSON.parse(JSON.stringify(recipe.nutrition));
		isEditing = true;
	}

	function saveChanges() {
		recipeActions.updateRecipe(recipe.id, {
			title: editTitle,
			description: editDesc,
			videoUrl: editVideoUrl,
			tags: editTags,
			ingredients: editIngredients,
			steps: editSteps,
			storage: editStorage,
			nutrition: editNutrition
		});
		isEditing = false;
	}

	function addIngredient() {
		editIngredients.push({ name: '', quantity: '', status: 'to_buy' });
	}
	function removeIngredient(index: number) {
		editIngredients.splice(index, 1);
	}
	function addStep() {
		editSteps.push('');
	}
	function removeStep(index: number) {
		editSteps.splice(index, 1);
	}

	// Storage Arrays
	function addWeeklyItem() {
		editStorage.weeklyTable.push({
			mealType: '',
			storageMethod: '',
			temperature: '',
			maxDuration: '',
			reheatMethod: '',
			extraNotes: ''
		});
	}
	function removeWeeklyItem(index: number) {
		editStorage.weeklyTable.splice(index, 1);
	}
	function addGeneralTip() {
		editStorage.generalTips.push('');
	}
	function removeGeneralTip(index: number) {
		editStorage.generalTips.splice(index, 1);
	}
	function addAdditionalNote() {
		editStorage.additionalNotes.push('');
	}
	function removeAdditionalNote(index: number) {
		editStorage.additionalNotes.splice(index, 1);
	}

	// Tags
	let newTag = $state('');
	function addTag() {
		if (newTag.trim() && !editTags.includes(newTag.trim())) {
			editTags.push(newTag.trim());
			newTag = '';
		}
	}
	function removeTag(index: number) {
		editTags.splice(index, 1);
	}

	function getYoutubeId(url: string) {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	}

	import { Tween, Spring } from 'svelte/motion';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';
	import { onMount } from 'svelte';

	let scrollY = $state(0);
	let completedSteps = $state<Record<number, boolean>>({});
	let completedIngredients = $state<Record<number, boolean>>({});

	// Macro Tweens setup in {#key} below since recipe can change or macros can be undefined initially.
</script>

<svelte:window bind:scrollY />

{#if !recipe}
	<div class="p-8 text-center text-text-muted">Recipe not found.</div>
{:else}
	<div class="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-700">
		<div class="flex items-center justify-between">
			<a
				href="/recipes"
				class="inline-flex items-center gap-2 font-medium text-text-muted transition-colors hover:text-text-espresso"
			>
				<ChevronLeft size={20} /> Back to Gallery
			</a>
			{#if isEditing}
				<button
					onclick={saveChanges}
					class="flex items-center gap-2 rounded-xl bg-basil px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-basil/90"
				>
					<Save size={18} /> Save Changes
				</button>
			{:else}
				<button
					onclick={startEditing}
					class="flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 font-semibold text-text-espresso shadow-sm transition-colors hover:bg-surface-warm"
				>
					<Edit size={18} /> Edit Recipe
				</button>
			{/if}
		</div>

		<!-- Hero Section -->
		<div class="group relative h-[400px] w-full overflow-hidden rounded-3xl bg-black shadow-cozy">
			{#if recipe.videoUrl && !isEditing}
				<iframe
					title="Embedded Video"
					class="h-full w-full"
					src="https://www.youtube.com/embed/{getYoutubeId(
						recipe.videoUrl
					)}?autoplay=1&mute=1&loop=1&playlist={getYoutubeId(recipe.videoUrl)}"
					frameborder="0"
					allow="autoplay; encrypted-media"
					allowfullscreen
				></iframe>
			{:else}
				<img
					src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
					alt={recipe.title}
					style="transform: translateY({scrollY * 0.4}px) scale(1.1);"
					class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-75 ease-out"
				/>
			{/if}

			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
			></div>

			<div class="pointer-events-auto absolute right-6 bottom-6 left-6">
				{#if isEditing}
					<div class="space-y-2">
						<input
							type="text"
							bind:value={editTitle}
							class="w-full rounded-xl border border-white/30 bg-black/50 px-4 py-2 text-3xl font-bold text-white placeholder-white/50 shadow-sm backdrop-blur-md focus:border-white focus:ring-2 focus:ring-white/50 focus:outline-none md:text-4xl"
							placeholder="Recipe Title"
						/>
						<div class="flex gap-2">
							<Video class="mt-2 shrink-0 text-white" />
							<input
								type="text"
								bind:value={editVideoUrl}
								class="w-full rounded-xl border border-white/30 bg-black/50 px-4 py-2 text-white placeholder-white/50 shadow-sm backdrop-blur-md focus:border-white focus:ring-2 focus:ring-white/50 focus:outline-none"
								placeholder="YouTube Video URL (Optional)"
							/>
						</div>
					</div>
				{:else}
					<h1 class="mb-2 text-3xl font-bold text-white md:text-4xl">{recipe.title}</h1>
				{/if}
			</div>
		</div>

		<!-- Core Metrics & Tags Horizontal Layout -->
		<div class="flex flex-col gap-6 lg:flex-row">
			<!-- Metrics Grid -->
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:w-1/2">
				<div
					class="glass-panel flex flex-col items-center justify-center rounded-2xl p-4 text-center"
				>
					<Clock size={24} class="mb-2 text-text-muted" />
					<div class="text-sm font-semibold">Prep</div>
					<div class="text-lg font-bold text-hearth-600">{recipe.prepTime}</div>
				</div>
				<div
					class="glass-panel flex flex-col items-center justify-center rounded-2xl p-4 text-center"
				>
					<ChefHat size={24} class="mb-2 text-text-muted" />
					<div class="text-sm font-semibold">Cook</div>
					<div class="text-lg font-bold text-hearth-600">{recipe.cookTime}</div>
				</div>

				<div
					class="glass-panel flex flex-col items-center justify-center rounded-2xl p-4 text-center"
				>
					<Flame size={24} class="mb-2 text-paprika" />
					<div class="text-sm font-semibold">Calories</div>
					<div class="text-lg font-bold text-paprika">{recipe.calories || 0} kcal</div>
				</div>
				<div
					class="glass-panel flex flex-col items-center justify-center rounded-2xl p-4 text-center"
				>
					<Droplets size={24} class="mb-2 text-flame" />
					<div class="text-sm font-semibold">Protein</div>
					<div class="text-lg font-bold text-flame">{parseFloat(recipe.protein) || 0}g</div>
				</div>
			</div>

			<!-- Tags / Categories -->
			<div class="glass-panel flex flex-col justify-center rounded-2xl p-6 lg:w-1/2">
				<h3 class="mb-3 flex items-center gap-2 text-lg font-bold text-hearth-700">
					<Tag size={18} /> Categories & Tags
				</h3>
				<div class="flex flex-wrap gap-2">
					{#if isEditing}
						{#each editTags as tag, i}
							<div
								class="flex items-center gap-1 rounded-full bg-hearth-100 px-3 py-1 text-sm font-semibold text-hearth-700"
							>
								{tag}
								<button onclick={() => removeTag(i)} class="ml-1 text-hearth-500 hover:text-paprika"
									><Trash size={14} /></button
								>
							</div>
						{/each}
						<div class="flex items-center gap-2">
							<input
								type="text"
								bind:value={newTag}
								placeholder="Add tag..."
								class="w-32 rounded-full border border-border-warm px-3 py-1 text-sm focus:ring-1 focus:ring-hearth-400 focus:outline-none"
								onkeydown={(e) => e.key === 'Enter' && addTag()}
							/>
							<button
								onclick={addTag}
								class="rounded-full bg-hearth-500 p-1 text-white hover:bg-hearth-600"
								><Plus size={16} /></button
							>
						</div>
					{:else}
						{#each recipe.tags as tag}
							<span
								class="rounded-full bg-hearth-100 px-3 py-1 text-sm font-semibold text-hearth-700"
							>
								{tag}
							</span>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Description -->
		<div class="rounded-3xl border border-border-warm bg-surface p-6 shadow-sm">
			<h3 class="mb-3 flex items-center gap-2 text-xl font-bold text-hearth-700">
				<Info size={20} /> Description
			</h3>
			{#if isEditing}
				<textarea
					bind:value={editDesc}
					rows="3"
					class="w-full rounded-xl border border-border-warm bg-canvas px-4 py-3 text-text-espresso shadow-sm focus:border-transparent focus:ring-2 focus:ring-hearth-400 focus:outline-none"
				></textarea>
			{:else}
				<p class="leading-relaxed text-text-espresso">{recipe.description}</p>
			{/if}
		</div>

		<!-- Ingredients -->
		<div class="rounded-3xl border border-border-warm bg-surface p-6 shadow-sm">
			<div class="mb-6 flex items-center justify-between">
				<h3 class="flex items-center gap-2 text-xl font-bold text-hearth-700">
					<ShoppingCart size={20} /> Ingredients
				</h3>
				{#if isEditing}
					<button
						onclick={addIngredient}
						class="flex items-center gap-1 rounded-xl bg-hearth-100 px-3 py-1.5 text-sm font-semibold text-hearth-700 transition-colors hover:bg-hearth-200"
						><Plus size={16} /> Add</button
					>
				{/if}
			</div>

			<div class="space-y-3">
				{#if isEditing}
					{#each editIngredients as item, i}
						<div class="flex items-center gap-3">
							<input
								type="text"
								bind:value={item.name}
								placeholder="Name"
								class="flex-1 rounded-lg border border-border-warm bg-canvas px-3 py-2 text-text-espresso focus:ring-2 focus:ring-hearth-400 focus:outline-none"
							/>
							<input
								type="text"
								bind:value={item.quantity}
								placeholder="Qty"
								class="w-24 rounded-lg border border-border-warm bg-canvas px-3 py-2 text-text-espresso focus:ring-2 focus:ring-hearth-400 focus:outline-none"
							/>
							<button
								onclick={() => removeIngredient(i)}
								class="p-2 text-text-subtle hover:text-paprika"><Trash size={18} /></button
							>
						</div>
					{/each}
				{:else}
					{#each recipe.ingredients as item}
						<div
							class="flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-border-warm hover:bg-surface-warm"
						>
							<div class="flex items-center gap-3">
								<CheckCircle2 size={20} class="text-basil" />
								<span class="font-medium text-text-espresso">{item.name}</span>
							</div>
							<span class="rounded-lg bg-canvas px-3 py-1 font-mono text-sm text-text-muted"
								>{item.quantity}</span
							>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Steps -->
		<div class="rounded-3xl border border-border-warm bg-surface p-6 shadow-sm">
			<div class="mb-6 flex items-center justify-between">
				<h3 class="flex items-center gap-2 text-xl font-bold text-hearth-700">
					<ChefHat size={20} /> Instructions
				</h3>
				{#if isEditing}
					<button
						onclick={addStep}
						class="flex items-center gap-1 rounded-xl bg-hearth-100 px-3 py-1.5 text-sm font-semibold text-hearth-700 transition-colors hover:bg-hearth-200"
						><Plus size={16} /> Add Step</button
					>
				{/if}
			</div>

			<div class="space-y-4">
				{#if isEditing}
					{#each editSteps as step, i}
						<div class="flex items-start gap-3">
							<div
								class="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hearth-100 font-bold text-hearth-700"
							>
								{i + 1}
							</div>
							<textarea
								bind:value={editSteps[i]}
								rows="2"
								class="flex-1 rounded-xl border border-border-warm bg-canvas px-4 py-2 text-text-espresso focus:ring-2 focus:ring-hearth-400 focus:outline-none"
							></textarea>
							<button
								onclick={() => removeStep(i)}
								class="mt-2 p-2 text-text-subtle hover:text-paprika"><Trash size={18} /></button
							>
						</div>
					{/each}
				{:else}
					{#each recipe.steps as step, i}
						<button
							onclick={() => (completedSteps[i] = !completedSteps[i])}
							class="group flex w-full items-start gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-surface-warm {completedSteps[
								i
							]
								? 'opacity-60'
								: ''}"
						>
							<div
								class="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors {completedSteps[
									i
								]
									? 'bg-basil'
									: 'bg-hearth-100 group-hover:bg-hearth-200'}"
							>
								{#if completedSteps[i]}
									<svg
										class="h-5 w-5 text-white"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path in:draw={{ duration: 400, easing: cubicOut }} d="M20 6L9 17l-5-5" />
									</svg>
								{:else}
									<span class="font-bold text-hearth-700">{i + 1}</span>
								{/if}
							</div>
							<p
								class="pt-1 leading-relaxed text-text-espresso transition-all {completedSteps[i]
									? 'line-through'
									: ''}"
							>
								{step}
							</p>
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Advanced Storage English Template -->
		<div class="rounded-3xl border border-border-warm bg-surface p-6 shadow-sm">
			<h3 class="mb-6 flex items-center gap-2 text-xl font-bold text-hearth-700">
				<Snowflake size={20} /> Storage & Prep Guide
			</h3>

			{#if isEditing}
				<div class="space-y-6">
					<div>
						<h4 class="mb-2 font-bold">🧊 Storage Method</h4>
						<div class="grid grid-cols-2 gap-4">
							<input
								type="text"
								bind:value={editStorage.container}
								placeholder="Container (e.g. Glass)"
								class="w-full rounded-lg border border-border-warm px-3 py-2"
							/>
							<input
								type="text"
								bind:value={editStorage.location}
								placeholder="Location (e.g. Fridge)"
								class="w-full rounded-lg border border-border-warm px-3 py-2"
							/>
							<input
								type="text"
								bind:value={editStorage.temperature}
								placeholder="Temperature (e.g. 4°C)"
								class="w-full rounded-lg border border-border-warm px-3 py-2"
							/>
							<input
								type="text"
								bind:value={editStorage.duration}
								placeholder="Duration (e.g. 3 Days)"
								class="w-full rounded-lg border border-border-warm px-3 py-2"
							/>
							<input
								type="text"
								bind:value={editStorage.storageTip}
								placeholder="Storage Tip"
								class="col-span-2 w-full rounded-lg border border-border-warm px-3 py-2"
							/>
						</div>
						<div class="mt-4 grid grid-cols-3 gap-4 border-b pb-2 text-sm font-bold">
							<div>Location</div>
							<div>Temperature</div>
							<div>Duration</div>
						</div>
						<div class="mt-2 grid grid-cols-3 gap-4">
							<div class="font-bold">Fridge</div>
							<input
								type="text"
								bind:value={editStorage.fridgeTemp}
								placeholder="4°C"
								class="rounded-lg border border-border-warm px-2 py-1"
							/>
							<input
								type="text"
								bind:value={editStorage.fridgeDuration}
								placeholder="3 Days"
								class="rounded-lg border border-border-warm px-2 py-1"
							/>
						</div>
						<div class="mt-2 grid grid-cols-3 gap-4">
							<div class="font-bold text-paprika">Freezer</div>
							<input
								type="text"
								bind:value={editStorage.freezerTemp}
								placeholder="Not Recommended"
								class="rounded-lg border border-border-warm px-2 py-1 text-paprika"
							/>
							<input
								type="text"
								bind:value={editStorage.freezerDuration}
								placeholder="Not Recommended"
								class="rounded-lg border border-border-warm px-2 py-1 text-paprika"
							/>
						</div>
					</div>

					<!-- Weekly Table Editor -->
					<div>
						<h4 class="mb-2 flex items-center justify-between font-bold">
							📦 Weekly Storage Table <button onclick={addWeeklyItem} class="text-hearth-600"
								><Plus size={16} /></button
							>
						</h4>
						<div class="space-y-2">
							{#each editStorage.weeklyTable as row, i}
								<div class="flex gap-2 text-sm">
									<input
										bind:value={row.mealType}
										placeholder="Meal"
										class="w-1/6 rounded border border-border-warm p-1"
									/>
									<input
										bind:value={row.storageMethod}
										placeholder="Method"
										class="w-1/6 rounded border border-border-warm p-1"
									/>
									<input
										bind:value={row.temperature}
										placeholder="Temp"
										class="w-1/6 rounded border border-border-warm p-1"
									/>
									<input
										bind:value={row.maxDuration}
										placeholder="Duration"
										class="w-1/6 rounded border border-border-warm p-1"
									/>
									<input
										bind:value={row.reheatMethod}
										placeholder="Reheat"
										class="w-1/6 rounded border border-border-warm p-1"
									/>
									<input
										bind:value={row.extraNotes}
										placeholder="Notes"
										class="w-1/6 rounded border border-border-warm p-1"
									/>
									<button onclick={() => removeWeeklyItem(i)}
										><Trash size={14} class="text-paprika" /></button
									>
								</div>
							{/each}
						</div>
					</div>

					<div>
						<h4 class="mb-2 flex items-center justify-between font-bold">
							🔒 General Tips <button onclick={addGeneralTip} class="text-hearth-600"
								><Plus size={16} /></button
							>
						</h4>
						{#each editStorage.generalTips as tip, i}
							<div class="mb-2 flex gap-2">
								<input
									bind:value={editStorage.generalTips[i]}
									class="flex-1 rounded border border-border-warm p-1"
								/>
								<button onclick={() => removeGeneralTip(i)}><Trash size={14} /></button>
							</div>
						{/each}
					</div>

					<div>
						<h4 class="mb-2 flex items-center justify-between font-bold">
							🗂️ Additional Notes <button onclick={addAdditionalNote} class="text-hearth-600"
								><Plus size={16} /></button
							>
						</h4>
						{#each editStorage.additionalNotes as note, i}
							<div class="mb-2 flex gap-2">
								<input
									bind:value={editStorage.additionalNotes[i]}
									class="flex-1 rounded border border-border-warm p-1"
								/>
								<button onclick={() => removeAdditionalNote(i)}><Trash size={14} /></button>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="space-y-6">
					<div class="rounded-xl bg-surface-warm p-4">
						<h4 class="mb-3 text-lg font-bold">🧊 Storage Method</h4>
						<ul class="space-y-2 text-text-espresso">
							<li><span class="font-bold">Container:</span> {recipe.storage.container}</li>
							<li><span class="font-bold">Location:</span> {recipe.storage.location}</li>
							<li><span class="font-bold">Temperature:</span> {recipe.storage.temperature}</li>
							<li><span class="font-bold">Duration:</span> {recipe.storage.duration}</li>
							<li><span class="font-bold">Storage Tip:</span> {recipe.storage.storageTip}</li>
						</ul>

						<table class="mt-4 w-full border-collapse text-left text-sm">
							<thead>
								<tr class="border-b-2 border-border-warm"
									><th class="py-2">Location</th><th class="py-2">Temperature</th><th class="py-2"
										>Max Duration</th
									></tr
								>
							</thead>
							<tbody>
								<tr class="border-b border-border-warm/50"
									><td class="py-2">Fridge</td><td class="py-2">{recipe.storage.fridgeTemp}</td><td
										class="py-2">{recipe.storage.fridgeDuration}</td
									></tr
								>
								<tr
									><td class="py-2 text-paprika">Freezer</td><td class="py-2 text-paprika"
										>{recipe.storage.freezerTemp}</td
									><td class="py-2 text-paprika">{recipe.storage.freezerDuration}</td></tr
								>
							</tbody>
						</table>
					</div>

					<div class="overflow-x-auto rounded-xl bg-surface-warm p-4">
						<h4 class="mb-3 text-lg font-bold">📦 Weekly Storage Table</h4>
						<table class="w-full min-w-[600px] border-collapse text-left text-sm">
							<thead>
								<tr class="border-b-2 border-border-warm bg-white/50">
									<th class="p-2">Meal</th><th class="p-2">Method</th><th class="p-2">Temp</th><th
										class="p-2">Duration</th
									><th class="p-2">🔁 Reheat</th><th class="p-2">Notes</th>
								</tr>
							</thead>
							<tbody>
								{#each recipe.storage.weeklyTable as row}
									<tr class="border-b border-border-warm/50">
										<td class="p-2 font-bold">{row.mealType}</td>
										<td class="p-2">{row.storageMethod}</td>
										<td class="p-2">{row.temperature}</td>
										<td class="p-2 font-bold text-hearth-600">{row.maxDuration}</td>
										<td class="p-2">{row.reheatMethod}</td>
										<td class="p-2 text-text-muted">{row.extraNotes}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					{#if recipe.storage.generalTips.length > 0}
						<div class="rounded-xl bg-surface-warm p-4">
							<h4 class="mb-3 text-lg font-bold">🔒 General Tips</h4>
							<ul class="list-inside list-disc space-y-1 text-text-espresso">
								{#each recipe.storage.generalTips as tip}
									<li>{tip}</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if recipe.storage.additionalNotes.length > 0}
						<div class="rounded-xl bg-surface-warm p-4">
							<h4 class="mb-3 text-lg font-bold">🗂️ Additional Notes</h4>
							<ul class="list-inside list-disc space-y-1 text-text-espresso">
								{#each recipe.storage.additionalNotes as note}
									<li>{note}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Exhaustive Nutrition -->
		<div class="rounded-3xl border border-border-warm bg-surface p-6 shadow-sm">
			<h3 class="mb-6 flex items-center gap-2 text-xl font-bold text-hearth-700">
				<Leaf size={20} /> Comprehensive Nutrition
			</h3>

			{#if isEditing}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					{#each [['macros', 'Macros'], ['micros', 'Vitamins & Minerals'], ['aminoAcids', 'Amino Acids'], ['fattyAcids', 'Fatty Acids']] as [key, label]}
						<div>
							<h4 class="mb-2 font-bold">{label}</h4>
							{#each editNutrition[key as keyof typeof editNutrition] as item}
								<div class="mb-2 flex gap-2">
									<input
										type="text"
										bind:value={item.name}
										class="w-1/2 rounded border border-border-warm px-2 py-1"
									/>
									<input
										type="text"
										bind:value={item.value}
										placeholder="Value (e.g. 10g, 0)"
										class="w-1/2 rounded border border-border-warm px-2 py-1"
									/>
								</div>
							{/each}
							<button
								onclick={() =>
									editNutrition[key as keyof typeof editNutrition].push({
										name: '',
										value: '',
										color: 'bg-hearth-500'
									} as any)}
								class="flex items-center text-sm font-bold text-hearth-600"
								><Plus size={14} /> Add</button
							>
						</div>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
					<!-- Colored Macros Chart Style -->
					<div class="space-y-4 lg:col-span-5">
						<h4 class="mb-4 border-b border-border-warm pb-2 font-bold text-text-muted">Macros</h4>
						<div class="grid grid-cols-2 gap-4">
							{#each recipe.nutrition.macros as macro}
								<div
									class="flex flex-col rounded-2xl border border-border-warm/50 bg-surface-warm p-4 shadow-sm transition-all hover:shadow-md"
								>
									<span class="text-sm font-semibold text-text-muted">{macro.name}</span>
									<span class="mt-1 text-2xl font-bold text-text-espresso"
										>{macro.value || '0'}</span
									>
									<div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border-warm/50">
										<div
											class="h-full {macro.color || 'bg-hearth-500'} rounded-full"
											style="width: 70%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Other Metrics -->
					<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-7">
						<div class="space-y-3">
							<h4 class="mb-4 border-b border-border-warm pb-2 font-bold text-text-muted">
								Vitamins & Minerals
							</h4>
							{#each recipe.nutrition.micros as micro}
								<div
									class="flex items-center justify-between rounded-lg border border-transparent bg-surface-warm p-2 text-sm hover:border-border-warm"
								>
									<span class="font-semibold text-text-espresso">{micro.name}</span>
									<span class="font-mono text-hearth-600">{micro.value || '0'}</span>
								</div>
							{/each}
						</div>

						<div class="space-y-3">
							<h4 class="mb-4 border-b border-border-warm pb-2 font-bold text-text-muted">
								Amino Acids
							</h4>
							{#each recipe.nutrition.aminoAcids as amino}
								<div
									class="flex items-center justify-between rounded-lg border border-transparent bg-surface-warm p-2 text-sm hover:border-border-warm"
								>
									<span class="font-semibold text-text-espresso">{amino.name}</span>
									<span class="font-mono text-hearth-600">{amino.value || '0'}</span>
								</div>
							{/each}
						</div>

						<div class="space-y-3">
							<h4 class="mb-4 border-b border-border-warm pb-2 font-bold text-text-muted">
								Fatty Acids
							</h4>
							{#each recipe.nutrition.fattyAcids as fatty}
								<div
									class="flex items-center justify-between rounded-lg border border-transparent bg-surface-warm p-2 text-sm hover:border-border-warm"
								>
									<span class="font-semibold text-text-espresso">{fatty.name}</span>
									<span class="font-mono text-hearth-600">{fatty.value || '0'}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
