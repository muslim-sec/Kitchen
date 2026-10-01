import fs from 'fs';

const path = 'src/routes/recipes/new/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes("import TagInput")) {
    content = content.replace(
        "import { recipeActions",
        "import TagInput from '$lib/components/TagInput.svelte';\n\timport { recipeActions"
    );
}

const oldTagBlock = `{#each newRecipe.tags as tag, i}
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
									bind:value={newTagInput}
									placeholder="Add tag..."
									class="w-32 rounded-full border border-border-warm px-3 py-1 text-sm focus:ring-1 focus:ring-hearth-400 focus:outline-none"
									onkeydown={(e) => e.key === 'Enter' && addTag()}
								/>
								<button
									type="button"
									onclick={addTag}
									class="rounded-full bg-hearth-500 p-1 text-white hover:bg-hearth-600"
									><Plus size={16} /></button
								>
							</div>`;

if(content.includes('bind:value={newTagInput}')) {
	content = content.replace(oldTagBlock, '<div class="w-full"><TagInput bind:selectedTags={newRecipe.tags} /></div>');
}

fs.writeFileSync(path, content);
console.log('New recipe page updated with TagInput');
