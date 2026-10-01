import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add ShoppingCycle type
content = content.replace(
    "export type ItemStatus = 'in_fridge' | 'to_buy' | 'purchased' | 'finished';",
    "export type ItemStatus = 'in_fridge' | 'to_buy' | 'purchased' | 'finished';\nexport type ShoppingCycle = 'weekly' | 'biweekly' | 'monthly' | 'all';"
);

// 2. Add to MasterInventoryItem
content = content.replace(
    "isHidden?: boolean; // For Plan X exclusions",
    "isHidden?: boolean; // For Plan X exclusions\n\tcycle?: ShoppingCycle;"
);

// 3. Add getDefaultCycle function and update createDefaultItem
const createDefOld = `function createDefaultItem(
	name: string,
	icon: string,
	category: Category,
	status: ItemStatus = 'to_buy',
	price: number = 0,
	englishName?: string,
	quantityAmount: number = 1,
	quantityUnit: string = 'units'
): MasterInventoryItem {
	return {
		id: Math.random().toString(36).substr(2, 9),
		name,
		icon,
		category,
		status,
		price,
		englishName,
		quantityAmount,
		quantityUnit
	};
}`;

const createDefNew = `export function getDefaultCycle(category: Category): ShoppingCycle {
	switch (category) {
		case 'Vegetables':
		case 'Fruits':
		case 'Proteins':
		case 'Dairy':
			return 'weekly';
		case 'Beverages':
		case 'Snacks':
		case 'Breakfast':
			return 'biweekly';
		case 'Spices':
		case 'Grains':
		case 'Pantry':
		case 'Canned Goods':
		case 'Condiments':
		case 'Supermarket':
			return 'monthly';
		default:
			return 'weekly';
	}
}

function createDefaultItem(
	name: string,
	icon: string,
	category: Category,
	status: ItemStatus = 'to_buy',
	price: number = 0,
	englishName?: string,
	quantityAmount: number = 1,
	quantityUnit: string = 'units',
	cycle?: ShoppingCycle
): MasterInventoryItem {
	return {
		id: Math.random().toString(36).substr(2, 9),
		name,
		icon,
		category,
		status,
		price,
		englishName,
		quantityAmount,
		quantityUnit,
		cycle: cycle || getDefaultCycle(category)
	};
}`;

content = content.replace(createDefOld, createDefNew);

// 4. Update hydration to add cycle to existing users
const oldHyd = `item.quantityUnit = defaultItem.quantityUnit;
								}`;
const newHyd = `item.quantityUnit = defaultItem.quantityUnit;
								}
								
								if (!item.cycle) {
									item.cycle = defaultItem.cycle || getDefaultCycle(item.category);
								}`;
content = content.replace(oldHyd, newHyd);

fs.writeFileSync(path, content);
console.log("Phase 2 Store applied");
