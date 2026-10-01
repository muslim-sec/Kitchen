import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// Update item.quantityAmount input
const oldQuantityInput = `												bind:value={item.quantityAmount}
												class="w-16 rounded border-none bg-transparent px-1 py-0.5 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"`;

const newQuantityInput = `												bind:value={item.quantityAmount}
												oninput={(e) => {
													const val = parseFloat(e.currentTarget.value) || 0;
													if (item.unitPrice) {
														item.price = parseFloat((val * item.unitPrice).toFixed(2));
													}
												}}
												class="w-16 rounded border-none bg-transparent px-1 py-0.5 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"`;

content = content.replace(oldQuantityInput, newQuantityInput);

fs.writeFileSync(path, content);
console.log('UI updated for dynamic pricing.');
