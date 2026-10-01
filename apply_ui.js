import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Add isCycleMenuOpen state
const oldStateEnd = `let isHiddenMenuOpen = $state(false);`;
const newStateEnd = `let isHiddenMenuOpen = $state(false);\n\tlet isCycleMenuOpen = $state(false);`;
content = content.replace(oldStateEnd, newStateEnd);

// 2. Replace Cycle Filter UI
const oldCycleFilter = `				<!-- Cycle Filter -->
				<div class="flex rounded-xl border border-border-warm bg-surface-warm p-1">
					<button
						class="rounded-lg px-3 py-2 text-xs font-bold transition-all {cycleFilter === 'all'
							? 'bg-surface text-text-espresso shadow-sm'
							: 'text-text-muted hover:text-text-espresso'}"
						onclick={() => (cycleFilter = 'all')}
					>
						All Cycles
					</button>
					<button
						class="rounded-lg px-3 py-2 text-xs font-bold transition-all {cycleFilter === 'weekly'
							? 'bg-surface text-text-espresso shadow-sm'
							: 'text-text-muted hover:text-text-espresso'}"
						onclick={() => (cycleFilter = 'weekly')}
					>
						Weekly 🛒
					</button>
					<button
						class="rounded-lg px-3 py-2 text-xs font-bold transition-all {cycleFilter === 'monthly'
							? 'bg-surface text-text-espresso shadow-sm'
							: 'text-text-muted hover:text-text-espresso'}"
						onclick={() => (cycleFilter = 'monthly')}
					>
						Monthly 📦
					</button>
				</div>`;

const newCycleDropdown = `				<!-- Cycle Filter Dropdown -->
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
									<button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {cycleFilter === cycle ? 'text-hearth-600 bg-hearth-50' : 'text-text-espresso'}" onclick={() => { cycleFilter = cycle as 'all' | 'weekly' | 'biweekly' | 'monthly'; isCycleMenuOpen = false; }}>
										{cycle === 'all' ? 'All Cycles' : cycle === 'weekly' ? 'Weekly 🛒' : cycle === 'biweekly' ? 'Bi-weekly 📅' : 'Monthly 📦'}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>`;

content = content.replace(oldCycleFilter, newCycleDropdown);

// 3. Update the Template editing UX (add Save/Update icon)
const oldTemplateBtn = `									{#if template.id !== 'eco-mode'}
										<div role="button" tabindex="0" class="opacity-0 transition-opacity group-hover:opacity-100 hover:text-flame" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); }} onkeydown={(e) => { if (e.key === 'Enter') inventoryActions.deleteHideTemplate(template.id); }}>
											<Trash2 size={14} />
										</div>
									{/if}`;

const newTemplateBtn = `									<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										<div role="button" tabindex="0" class="text-text-muted hover:text-hearth-600" title="Update Template with current hidden items" onclick={(e) => { e.stopPropagation(); inventoryActions.updateHideTemplate(template.id, db.inventory.filter(i => i.isHidden).map(i => i.name)); isHiddenMenuOpen = false; }} onkeydown={(e) => { if (e.key === 'Enter') { inventoryActions.updateHideTemplate(template.id, db.inventory.filter(i => i.isHidden).map(i => i.name)); isHiddenMenuOpen = false; } }}>
											<RefreshCw size={14} />
										</div>
										{#if template.id !== 'eco-mode'}
											<div role="button" tabindex="0" class="hover:text-flame" title="Delete Template" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); }} onkeydown={(e) => { if (e.key === 'Enter') inventoryActions.deleteHideTemplate(template.id); }}>
												<Trash2 size={14} />
											</div>
										{/if}
									</div>`;

content = content.replace(oldTemplateBtn, newTemplateBtn);

// 4. Add RefreshCw import to lucide-svelte
if (!content.includes('RefreshCw')) {
    content = content.replace(
        "Trash2,\n\t\t\tRotateCcw",
        "Trash2,\n\t\t\tRotateCcw,\n\t\t\tRefreshCw"
    );
}

fs.writeFileSync(path, content);
console.log('UI updated for cycle dropdown and template editing.');
