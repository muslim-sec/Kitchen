import fs from 'fs';

const path = 'src/routes/recipes/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
	"let tagEditState = $state<{old: string, new: string} | null>(null);",
	"let tagEditState = $state<{old: string, newName: string, newEmoji: string, newColor: string} | null>(null);"
);

// We need to fix the tabs state because db.tags is now objects
content = content.replace(
	"let categoryTabs = $derived(['All', ...db.tags.filter(t => !['Breakfast', 'Lunch', 'Dinner'].includes(t))]);",
	"let categoryTabs = $derived(['All', ...db.tags.filter(t => !['Breakfast', 'Lunch', 'Dinner'].includes(t.name)).map(t => t.name)]);"
);

// We also need to fix `{#each db.tags as tag}` which used to be string, but is now Tag object
const oldModalRegex = /\{#if isManageTagsOpen\}[\s\S]*?\{\/if\}/;

const newModalHtml = `{#if isManageTagsOpen}
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
{/if}`;

content = content.replace(oldModalRegex, newModalHtml);

fs.writeFileSync(path, content);
console.log('Update 2 done');
