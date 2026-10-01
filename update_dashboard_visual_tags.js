import fs from 'fs';

const path = 'src/routes/recipes/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

const oldCategoryTabsHtml = `{#each categoryTabs as tab}
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
					{/each}`;

// We need to render the emoji in the category tabs. We'll use a function to lookup the emoji.
const getEmojiScript = `
	function getTagEmoji(tagName: string) {
		const tag = db.tags.find(t => t.name === tagName);
		return tag ? tag.emoji + ' ' : '';
	}
`;
if (!content.includes('getTagEmoji')) {
	content = content.replace("let searchQuery = $state('');", getEmojiScript + "\n\tlet searchQuery = $state('');");
}

const newCategoryTabsHtml = `{#each categoryTabs as tab}
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
							<span class="relative z-10">{tab === 'All' ? '' : getTagEmoji(tab)}{tab}</span>
						</button>
					{/each}`;
content = content.replace(oldCategoryTabsHtml, newCategoryTabsHtml);

// Now update the Manage Tags modal logic
const oldModalHtml = `{#if isManageTagsOpen}
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
									
								/>
								<button 
									onclick={() => { 
										tagActions.renameTag(tagEditState!.old, tagEditState!.new);
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
									onclick={() => tagActions.deleteTag(tag)}
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

// Since oldModalHtml might not match EXACTLY due to formatting or slight changes we made before, I will use regex or search and replace for smaller parts.
