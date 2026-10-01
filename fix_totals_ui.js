import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the Total Calculation
const oldTotal = `	// To-Buy Total Calculation
	let toBuyTotal = $derived(
		db.inventory
			.filter((item) => item.status === 'to_buy' && (!item.isHidden || showHidden))
			.reduce((sum, item) => sum + (item.price || 0), 0)
	);`;

const newTotal = `	// Visible Total Calculation
	let visibleTotal = $derived(
		Object.values(groupedItems).flat().reduce((sum, item) => sum + (item.price || 0), 0)
	);`;

content = content.replace(oldTotal, newTotal);

// 2. Remove viewMode strict check for category footers
const oldFooterIf = `{#if viewMode === 'to_buy' && groupedItems[category].length > 0}`;
const newFooterIf = `{#if groupedItems[category].length > 0}`;
// Note: using regex with global flag to replace it in case there are multiple
content = content.replace(/{#if viewMode === 'to_buy' && groupedItems\[category\]\.length > 0}/g, newFooterIf);

// 3. Update Grand Total logic
const oldGrandTotalIf = `{#if viewMode === 'to_buy' && Object.values(groupedItems).flat().length > 0}`;
const newGrandTotalIf = `{#if Object.values(groupedItems).flat().length > 0}`;
content = content.replace(oldGrandTotalIf, newGrandTotalIf);

// 4. Update the grand total display to use visibleTotal and format to 2 decimals
const oldGrandTotalDisplay = `{toBuyTotal.toFixed(2)}`;
const newGrandTotalDisplay = `{visibleTotal.toFixed(2)}`;
content = content.replace(oldGrandTotalDisplay, newGrandTotalDisplay);

fs.writeFileSync(path, content);
console.log('Fixed UI totals logic.');
