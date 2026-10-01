import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

const oldCall = `		inventoryActions.addItem(
			{
				name,
				icon,
				category: category as Category
			},
			viewMode === 'all' ? 'in_fridge' : 'to_buy'
		);`;

const newCall = `		inventoryActions.addItem(
			{
				name,
				icon,
				category: category as Category,
				quantityAmount: draft.quantityAmount || 1,
				quantityUnit: draft.quantityUnit || 'units'
			},
			viewMode === 'all' ? 'in_fridge' : 'to_buy'
		);`;

content = content.replace(oldCall, newCall);
fs.writeFileSync(path, content);
console.log('Fixed addItem call in shopping page.');
