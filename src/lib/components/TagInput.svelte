<script lang="ts">
	import { db, tagActions, type Tag } from '$lib/store.svelte';
	import { Plus, X, Palette, Smile } from 'lucide-svelte';

	let { selectedTags = $bindable<string[]>([]) } = $props<{
		selectedTags: string[];
	}>();

	let inputValue = $state('');
	let isFocused = $state(false);
	
	// Create Mode State
	let isCreating = $state(false);
	let newTagName = $state('');
	let newTagEmoji = $state('🏷️');
	let newTagColor = $state('bg-gray-100 text-gray-700');
	let isEmojiPickerOpen = $state(false);

	const COLORS = [
		'bg-hearth-100 text-hearth-700',
		'bg-orange-100 text-paprika',
		'bg-red-100 text-flame',
		'bg-pink-100 text-pink-700',
		'bg-green-100 text-basil',
		'bg-blue-100 text-blue-700',
		'bg-purple-100 text-purple-700',
		'bg-gray-100 text-gray-700'
	];
	
	const EMOJIS = ['🏷️', '🍳', '🍱', '🍽️', '🍮', '🔪', '💪', '🍗', '🥤', '🥞', '🥗', '🍎', '🌶️', '🧀'];

	let availableTags = $derived(
		db.tags.filter(
			(tag) =>
				!selectedTags.includes(tag.name) &&
				tag.name.toLowerCase().includes(inputValue.toLowerCase())
		)
	);

	let exactMatchExists = $derived(
		db.tags.some((tag: Tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase()) ||
		selectedTags.some((tag: string) => tag.toLowerCase() === inputValue.trim().toLowerCase())
	);

	function addExistingTag(tagName: string) {
		if (selectedTags.includes(tagName)) return;
		selectedTags.push(tagName);
		inputValue = '';
	}

	function startCreation(name: string) {
		newTagName = name.trim();
		newTagEmoji = '🏷️';
		newTagColor = COLORS[Math.floor(Math.random() * COLORS.length)];
		isCreating = true;
	}

	function saveNewTag() {
		const trimmed = newTagName.trim();
		if (!trimmed) return;
		
		tagActions.addTag(trimmed, newTagEmoji, newTagColor);
		if (!selectedTags.includes(trimmed)) {
			selectedTags.push(trimmed);
		}
		
		isCreating = false;
		inputValue = '';
		newTagName = '';
	}
	
	function getTagObj(name: string): Tag {
		return db.tags.find(t => t.name === name) || { name, emoji: '🏷️', color: 'bg-gray-100 text-gray-700' };
	}

	function removeTag(index: number) {
		selectedTags.splice(index, 1);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (isCreating) return;
		
		if (e.key === 'Enter') {
			e.preventDefault();
			if (inputValue.trim()) {
				const exact = availableTags.find(t => t.name.toLowerCase() === inputValue.trim().toLowerCase());
				if (exact) {
					addExistingTag(exact.name);
				} else if (!exactMatchExists) {
					startCreation(inputValue);
				} else if (availableTags.length > 0) {
					addExistingTag(availableTags[0].name); 
				}
			}
		} else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
			removeTag(selectedTags.length - 1);
		}
	}
</script>

<div class="relative w-full">
	<div 
		class="flex min-h-[42px] flex-wrap items-center gap-2 rounded-xl border border-border-warm bg-surface p-1.5 focus-within:ring-2 focus-within:ring-hearth-400"
	>
		{#each selectedTags as tagName, i}
			{@const tag = getTagObj(tagName)}
			<span
				class="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold {tag.color}"
			>
				<span>{tag.emoji}</span>
				{tag.name}
				<button
					type="button"
					onclick={() => removeTag(i)}
					class="ml-1 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
				>
					<X size={14} />
				</button>
			</span>
		{/each}
		
		<input
			type="text"
			bind:value={inputValue}
			onkeydown={handleKeyDown}
			onfocus={() => (isFocused = true)}
			onblur={() => setTimeout(() => { isFocused = false; isCreating = false; }, 200)}
			placeholder={selectedTags.length === 0 ? "Select or create tags..." : "Add more..."}
			class="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-text-muted"
		/>
	</div>

	{#if isFocused && !isCreating && (availableTags.length > 0 || (inputValue.trim() && !exactMatchExists))}
		<div
			class="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-xl border border-border-warm bg-surface shadow-cozy"
		>
			<div class="max-h-60 overflow-y-auto p-1 custom-scrollbar">
				{#each availableTags as tag}
					<button
						type="button"
						onmousedown={(e) => { e.preventDefault(); addExistingTag(tag.name); }}
						class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-hearth-50 hover:text-hearth-600 rounded-lg"
					>
						<span class="rounded-md px-1.5 py-0.5 text-xs {tag.color}">{tag.emoji}</span>
						{tag.name}
					</button>
				{/each}
				
				{#if inputValue.trim() && !exactMatchExists}
					<button
						type="button"
						onmousedown={(e) => { e.preventDefault(); startCreation(inputValue); }}
						class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-hearth-600 transition-colors hover:bg-hearth-50 rounded-lg"
					>
						<Plus size={16} />
						Create "{inputValue.trim()}"
					</button>
				{/if}
			</div>
		</div>
	{/if}
	
	{#if isCreating}
		<div
			onmousedown={(e) => e.preventDefault()}
			class="absolute left-0 top-[calc(100%+4px)] z-50 w-full md:w-80 overflow-hidden rounded-xl border border-border-warm bg-surface p-4 shadow-hover"
		>
			<h4 class="mb-3 text-sm font-bold text-text-espresso">Create New Tag</h4>
			
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<div class="relative">
						<button 
							type="button"
							onclick={() => isEmojiPickerOpen = !isEmojiPickerOpen}
							class="flex h-10 w-10 items-center justify-center rounded-lg border border-border-warm bg-surface-warm text-xl transition-colors hover:bg-hearth-100"
						>
							{newTagEmoji}
						</button>
						{#if isEmojiPickerOpen}
							<div class="absolute left-0 top-[calc(100%+4px)] z-50 grid w-48 grid-cols-5 gap-1 rounded-xl border border-border-warm bg-white p-2 shadow-cozy">
								{#each EMOJIS as emoji}
									<button 
										type="button"
										onclick={() => { newTagEmoji = emoji; isEmojiPickerOpen = false; }}
										class="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-hearth-50"
									>
										{emoji}
									</button>
								{/each}
							</div>
						{/if}
					</div>
					
					<input 
						type="text" 
						bind:value={newTagName} 
						class="flex-1 rounded-lg border border-border-warm bg-canvas px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hearth-400"
					/>
				</div>
				
				<div>
					<label class="mb-2 block text-xs font-semibold text-text-muted">Color</label>
					<div class="flex flex-wrap gap-2">
						{#each COLORS as color}
							<button 
								type="button"
								onclick={() => newTagColor = color}
								class="flex h-6 w-6 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 {color} {newTagColor === color ? 'ring-2 ring-hearth-400 ring-offset-1' : 'border-transparent'}"
							></button>
						{/each}
					</div>
				</div>
				
				<div class="flex justify-end gap-2 pt-2">
					<button 
						type="button"
						onclick={() => { isCreating = false; inputValue = ''; }}
						class="rounded-lg px-3 py-1.5 text-sm font-semibold text-text-muted hover:bg-surface-warm"
					>
						Cancel
					</button>
					<button 
						type="button"
						onclick={saveNewTag}
						class="rounded-lg bg-hearth-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-hearth-600"
					>
						Save Tag
					</button>
				</div>
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
		background-color: #e2dfd9;
		border-radius: 4px;
	}
</style>
