import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// The block to replace:
/*
				<!-- Cycle Filter -->
				<div class="flex rounded-xl border border-border-warm bg-surface-warm p-1">
					...
				</div>
*/
const cycleRegex = /<!-- Cycle Filter -->\s*<div class="flex rounded-xl border border-border-warm bg-surface-warm p-1">[\s\S]*?<\/div>/;

const newCycleDropdown = `<!-- Cycle Filter Dropdown -->
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
									<button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {cycleFilter === cycle ? 'text-hearth-600 bg-hearth-50' : 'text-text-espresso'}" onclick={() => { cycleFilter = cycle; isCycleMenuOpen = false; }}>
										{cycle === 'all' ? 'All Cycles' : cycle === 'weekly' ? 'Weekly 🛒' : cycle === 'biweekly' ? 'Bi-weekly 📅' : 'Monthly 📦'}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>`;

if (cycleRegex.test(content)) {
    content = content.replace(cycleRegex, newCycleDropdown);
    console.log("Successfully replaced Cycle Dropdown!");
} else {
    console.log("Failed to find Cycle Dropdown regex!");
}

fs.writeFileSync(path, content);
