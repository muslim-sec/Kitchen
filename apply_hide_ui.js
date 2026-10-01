import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Strict Exclusion from Totals
content = content.replace(
    "Object.values(groupedItems).flat().reduce((sum, item) => sum + (item.price || 0), 0)",
    "Object.values(groupedItems).flat().filter(i => !i.isHidden).reduce((sum, item) => sum + (item.price || 0), 0)"
);
content = content.replace(
    "SUM {groupedItems[category]\n\t\t\t\t\t\t\t\t\t\t\t\t.reduce((sum, item) => sum + (item.price || 0), 0)\n\t\t\t\t\t\t\t\t\t\t\t\t.toFixed(2)}",
    "SUM {groupedItems[category]\n\t\t\t\t\t\t\t\t\t\t\t\t.filter(i => !i.isHidden)\n\t\t\t\t\t\t\t\t\t\t\t\t.reduce((sum, item) => sum + (item.price || 0), 0)\n\t\t\t\t\t\t\t\t\t\t\t\t.toFixed(2)}"
);
// Also the other possible format of reduce:
content = content.replace(
    ".reduce((sum, item) => sum + (item.price || 0), 0)\n\t\t\t\t\t\t\t\t\t\t\t\t.toFixed(2)",
    ".filter(i => !i.isHidden)\n\t\t\t\t\t\t\t\t\t\t\t\t.reduce((sum, item) => sum + (item.price || 0), 0)\n\t\t\t\t\t\t\t\t\t\t\t\t.toFixed(2)"
);

// 2. Dropdown UI and Delete Modal State
const oldStateEnd = `let cycleFilter = $state<'all' | 'weekly' | 'biweekly' | 'monthly'>('all');
	let showHidden = $state(false);`;
const newStateEnd = `let cycleFilter = $state<'all' | 'weekly' | 'biweekly' | 'monthly'>('all');
	let showHidden = $state(false);
	
	let isHiddenMenuOpen = $state(false);
	let newTemplateName = $state('');
	
	let confirmDeleteModal = $state({ show: false, itemId: '', itemName: '' });
	
	let hiddenCount = $derived(db.inventory.filter(i => i.isHidden).length);`;
content = content.replace(oldStateEnd, newStateEnd);

// 3. Dropdown UI Replacement
const oldShowHiddenToggle = `			<!-- Show Hidden Toggle -->
			<button
				class="group flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 text-sm font-bold {showHidden
					? 'text-text-espresso'
					: 'text-text-muted'} transition-all hover:bg-surface-warm"
				onclick={() => (showHidden = !showHidden)}
			>
				{#if showHidden}
					<Eye size={18} />
					<span class="hidden sm:inline">Hide Exclusions</span>
				{:else}
					<EyeOff size={18} />
					<span class="hidden sm:inline">Show Exclusions</span>
				{/if}
			</button>`;

const newShowHiddenDropdown = `			<!-- Hidden & Templates Dropdown -->
			<div class="relative">
				<button
					class="flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 text-sm font-bold transition-all hover:bg-surface-warm {hiddenCount > 0 ? 'text-text-espresso' : 'text-text-muted'}"
					onclick={() => isHiddenMenuOpen = !isHiddenMenuOpen}
				>
					<EyeOff size={18} />
					<span class="hidden sm:inline">Hidden ({hiddenCount})</span>
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
							<button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-espresso transition-colors hover:bg-surface-warm" onclick={() => { inventoryActions.unhideAll(); isHiddenMenuOpen = false; }}>
								<RotateCcw size={16} /> Unhide All
							</button>
						</div>
						
						<div class="border-y border-border-warm bg-surface-warm/30 px-4 py-2 text-xs font-bold tracking-wider text-text-muted uppercase">
							Templates
						</div>
						<div class="p-2">
							{#each db.hideTemplates as template}
								<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-espresso transition-colors hover:bg-surface-warm" onclick={() => { inventoryActions.applyHideTemplate(template.hiddenNames); isHiddenMenuOpen = false; }}>
									<span class="truncate">{template.name}</span>
									{#if template.id !== 'eco-mode'}
										<button class="opacity-0 transition-opacity group-hover:opacity-100 hover:text-flame" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); }}>
											<Trash2 size={14} />
										</button>
									{/if}
								</button>
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
			</div>`;
content = content.replace(oldShowHiddenToggle, newShowHiddenDropdown);

// 4. Update Delete Logic
content = content.replace(
    "inventoryActions.deleteItem(contextMenu.itemId);",
    "const item = db.inventory.find(i => i.id === contextMenu.itemId);\n\t\tconfirmDeleteModal = { show: true, itemId: contextMenu.itemId, itemName: item?.name || 'this item' };"
);

// 5. Add Modals at the bottom
const oldPageEnd = `</div>
{/if}
</div>`;
const newPageEnd = `</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if confirmDeleteModal.show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-[100] flex items-center justify-center bg-text-espresso/20 p-4 backdrop-blur-sm" transition:fade={{ duration: 200 }} onclick={() => confirmDeleteModal.show = false}>
		<div class="w-full max-w-sm overflow-hidden rounded-3xl border border-border-warm bg-surface shadow-hover" transition:scale={{ duration: 300, start: 0.95, easing: quintOut }} onclick={(e) => e.stopPropagation()}>
			<div class="p-6 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-flame">
					<Trash2 size={32} />
				</div>
				<h3 class="mb-2 text-xl font-bold text-text-espresso">Delete Item?</h3>
				<p class="mb-6 text-sm text-text-muted">Are you sure you want to permanently delete <strong class="text-text-espresso">{confirmDeleteModal.itemName}</strong>? This action cannot be undone.</p>
				<div class="flex gap-3">
					<button class="w-full rounded-xl border border-border-warm px-4 py-3 font-bold text-text-muted transition-colors hover:bg-surface-warm" onclick={() => confirmDeleteModal.show = false}>
						Cancel
					</button>
					<button class="w-full rounded-xl bg-flame px-4 py-3 font-bold text-white transition-colors hover:bg-red-600" onclick={() => {
						inventoryActions.deleteItem(confirmDeleteModal.itemId);
						confirmDeleteModal.show = false;
					}}>
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
</div>`;
content = content.replace(oldPageEnd, newPageEnd);

// Add ChevronDown and RotateCcw to imports if missing
if (!content.includes('ChevronDown')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-svelte';/, "import {$1, ChevronDown, RotateCcw} from 'lucide-svelte';");
}

fs.writeFileSync(path, content);
console.log('UI updated for Hide features.');
