import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Add cycleFilter state
content = content.replace(
    "let viewMode = $state<'to_buy' | 'all'>('to_buy');",
    "let viewMode = $state<'to_buy' | 'all'>('to_buy');\n\tlet cycleFilter = $state<'all' | 'weekly' | 'biweekly' | 'monthly'>('all');"
);

// 2. Add filter logic to groupedItems
content = content.replace(
    "if (item.isHidden && !showHidden) return;",
    "if (item.isHidden && !showHidden) return;\n\t\t\t\tif (cycleFilter !== 'all' && item.cycle !== cycleFilter) return;"
);

// 3. Add UI buttons for cycleFilter right above the viewMode toggle
const oldViewToggle = `			<!-- View Toggle -->
			<div class="flex rounded-xl border border-border-warm bg-surface-warm p-1">`;
const newViewToggle = `			<!-- Cycle Filter -->
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
			</div>
			<!-- View Toggle -->
			<div class="flex rounded-xl border border-border-warm bg-surface-warm p-1">`;
content = content.replace(oldViewToggle, newViewToggle);

fs.writeFileSync(path, content);
console.log("Phase 2 UI applied");
