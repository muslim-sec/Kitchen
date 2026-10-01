import fs from 'fs';

const path = 'src/routes/recipes/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// Update imports
if (!content.includes('Settings2')) {
    content = content.replace("import { Plus, Search", "import { Plus, Search, Settings2, X, Edit2, Trash2");
}

// Update tabs state
content = content.replace(
    "const categoryTabs = ['Kitchen Items', 'Chicken Food', 'Juice', 'Sweet'];",
    "let categoryTabs = $derived(['All', ...db.tags.filter(t => !['Breakfast', 'Lunch', 'Dinner'].includes(t))]);\n\tlet isManageTagsOpen = $state(false);\n\tlet tagEditState = $state<{old: string, new: string} | null>(null);"
);
content = content.replace(
    "let activeCategoryTab = $state('Kitchen Items');",
    "let activeCategoryTab = $state('All');"
);

// Update filter logic
const oldFilter = `		} else if (activeView === 'category') {
			recipes = recipes.filter((r) => r.tags.includes(activeCategoryTab));
		}`;
const newFilter = `		} else if (activeView === 'category' && activeCategoryTab !== 'All') {
			recipes = recipes.filter((r) => r.tags.includes(activeCategoryTab));
		}`;
content = content.replace(oldFilter, newFilter);

// Add Manage Tags button and modal HTML
const subNavTabsHtml = `<!-- Sub-navigation Tabs -->
		<div class="custom-scrollbar flex gap-2 overflow-x-auto pb-2">`;
		
const manageButtonHtml = `
				{#if activeView === 'category'}
					<button
						onclick={() => (isManageTagsOpen = true)}
						class="flex shrink-0 items-center gap-1 rounded-full bg-surface-warm px-4 py-1.5 text-sm font-semibold text-hearth-600 transition-colors hover:bg-hearth-100"
					>
						<Settings2 size={16} /> Manage Tags
					</button>
					<div class="w-px shrink-0 bg-border-warm mx-1"></div>
				{/if}`;

if (!content.includes('Manage Tags')) {
	content = content.replace(subNavTabsHtml, subNavTabsHtml + manageButtonHtml);
}

const modalHtml = `
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
						{#if tagEditState?.old === tag}
							<div class="flex w-full gap-2">
								<input 
									type="text" 
									bind:value={tagEditState.new} 
									class="flex-1 rounded-lg border border-hearth-300 px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-hearth-400"
									autofocus
								/>
								<button 
									onclick={() => { 
										import('$lib/store.svelte').then(m => m.tagActions.renameTag(tagEditState.old, tagEditState.new));
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
							<span class="font-semibold text-text-espresso">{tag}</span>
							<div class="flex items-center gap-1">
								<button 
									onclick={() => tagEditState = {old: tag, new: tag}}
									class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-hearth-100 hover:text-hearth-600"
								><Edit2 size={16} /></button>
								<button 
									onclick={() => import('$lib/store.svelte').then(m => m.tagActions.deleteTag(tag))}
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
`;

if (!content.includes('Manage Tags modal')) {
    content = content.replace("</style>", "</style>\n" + modalHtml);
}

fs.writeFileSync(path, content);
console.log('Recipes page updated');
