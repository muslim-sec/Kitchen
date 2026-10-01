import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const qtyMap = {
    'Tomato': [2, 'kg'],
    'Potato': [2, 'kg'],
    'Lettuce': [1, 'bunch'],
    'Carrot': [1, 'kg'],
    'Onion': [1.5, 'kg'],
    'Garlic': [3, 'heads'],
    'Lemon': [1, 'kg'],
    'Pepper': [1, 'kg'],
    'Cucumber': [1, 'kg'],
    'Eggplant': [1, 'kg'],
    'Pumpkin': [1, 'kg'],
    'Apples': [1.5, 'kg'],
    'Bananas': [1.5, 'kg'],
    'Avocados': [1, 'kg'],
    'Chicken': [1.5, 'kg'],
    'Eggs': [30, 'pcs'],
    'Minced Meat': [1, 'kg'],
    'Liver': [0.5, 'kg'],
    'Salt': [500, 'g'],
    'Black Pepper': [100, 'g'],
    'Cumin': [100, 'g'],
    'Turmeric': [100, 'g'],
    'Paprika': [100, 'g'],
    'Ginger': [100, 'g'],
    'Nuts': [250, 'g'],
    'Almonds': [250, 'g'],
    'Butter': [500, 'g'],
    'Vinegar': [1, 'L'],
    'Lentils': [1, 'kg'],
    'Tomato Paste': [1, 'jar'],
    'Cheese': [500, 'g'],
    'Corn': [2, 'cans'],
    'Mushrooms': [2, 'cans'],
    'فطر طازج': [500, 'g'],
    'Coffee': [250, 'g'],
    'Oil': [5, 'L'],
    'Flour': [5, 'kg'],
    'Pasta': [1, 'kg'],
    'Rice': [2, 'kg'],
    'Chocolate': [2, 'bars'],
    'Milk': [1, 'L'],
    'Canned Tuna': [3, 'cans'],
    'Canned Beans': [2, 'cans'],
    'Canned Mushrooms': [2, 'cans'],
    'Chickpeas': [1, 'kg'],
    'Cold Cuts': [500, 'g'],
    'Cornichons': [1, 'jar'],
    'Olive Oil': [1, 'L'],
    'Olives': [500, 'g'],
    'White Sauce': [2, 'packs'],
    'Baby Cereal': [1, 'box'],
    'Cereal': [1, 'box'],
    'Oatmeal': [1, 'kg'],
    'Peanut Butter': [1, 'jar'],
    'Honey': [500, 'g'],
    'Jam': [1, 'jar'],
    'Pringles': [1, 'tube'],
    'Popcorn Kernels': [500, 'g'],
    'Dried Fruits': [500, 'g'],
    'Rice Cakes': [1, 'pack'],
    'Dark Chocolate': [2, 'bars'],
    'Yogurt': [4, 'cups'],
    'Energy Drink': [2, 'cans'],
    
    // New items:
    'Broccoli': [1, 'kg'],
    'Spinach': [2, 'bunches'],
    'Peas': [1, 'kg'],
    'Bell Peppers': [1, 'kg'],
    'Green Onion': [1, 'bunch'],
    'Parsley & Coriander': [2, 'bunches'],
    'Basil': [1, 'bunch'],
    'Orange': [2, 'kg'],
    'Strawberry': [500, 'g'],
    'Sole Fish': [1, 'kg'],
    'Calamari': [1, 'kg'],
    'Sardines': [1, 'kg'],
    'Salmon/Mackerel': [1, 'kg'],
    'Shrimp': [1, 'kg'],
    'White Fish Fillet': [1, 'kg'],
    'Dry White Beans': [1, 'kg'],
    'Dry Chickpeas': [1, 'kg'],
    'Fava Beans': [1, 'kg'],
    'Red Lentils': [1, 'kg'],
    'Coconut Milk': [2, 'cans'],
    'Whole Wheat Bread': [2, 'loaves'],
    'Whole Wheat Flour': [2, 'kg'],
    'Brown Rice': [1, 'kg'],
    'Semolina': [1, 'kg'],
    'Greek Yogurt': [4, 'cups'],
    'Almond Milk': [1, 'L'],
    'Kiri Cheese': [1, 'box'],
    'La Vache Qui Rit': [1, 'box'],
    'Red Cheese': [500, 'g'],
    'Dijon Mustard': [1, 'jar'],
    'Tahini': [1, 'jar'],
    'Soy Sauce': [1, 'bottle'],
    'Thyme': [100, 'g'],
    'Chili Pepper': [100, 'g'],
    'Cinnamon': [100, 'g'],
    'Mineral Water': [6, 'L'],
    'Orange Juice': [1, 'L'],
    'Celsius Energy': [2, 'cans'],
    'Matcha Drink': [2, 'cans']
};

// 1. Update function signature
const oldDef = `function createDefaultItem(
	name: string,
	icon: string,
	category: Category,
	status: ItemStatus = 'to_buy',
	price: number = 0,
	englishName?: string
): MasterInventoryItem {
	return {
		id: Math.random().toString(36).substr(2, 9),
		name,
		icon,
		category,
		status,
		price,
		englishName,
		quantityAmount: 1,
		quantityUnit: 'units'
	};
}`;
const newDef = `function createDefaultItem(
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
content = content.replace(oldDef, newDef);

// 2. Loop over lines and update arguments
const lines = content.split('\n');
let insideInventory = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('inventory: [')) insideInventory = true;
    if (lines[i].includes('] as MasterInventoryItem[]')) insideInventory = false;

    if (insideInventory && lines[i].includes('createDefaultItem(')) {
        const match = lines[i].match(/createDefaultItem\((.*?)\)/);
        if (match) {
            const argsStr = match[1];
            // Split carefully, handling strings
            let args = [];
            let currentArg = '';
            let inQuotes = false;
            for (let char of argsStr) {
                if (char === "'" || char === '"') inQuotes = !inQuotes;
                if (char === ',' && !inQuotes) {
                    args.push(currentArg.trim());
                    currentArg = '';
                } else {
                    currentArg += char;
                }
            }
            if (currentArg) args.push(currentArg.trim());

            const arabicName = args[0] ? args[0].replace(/['"]/g, '') : null;
            const englishNameArg = args[5] ? args[5].replace(/['"]/g, '') : null;
            
            let qty = [1, 'units'];
            if (englishNameArg && qtyMap[englishNameArg]) {
                qty = qtyMap[englishNameArg];
            } else if (arabicName && qtyMap[arabicName]) {
                qty = qtyMap[arabicName];
            }

            while(args.length < 6) {
                if (args.length === 3) args.push("'to_buy'");
                if (args.length === 4) args.push("0");
                if (args.length === 5) args.push("undefined");
            }

            args.push(qty[0]);
            args.push(`'${qty[1]}'`);

            const newArgs = args.join(', ');
            lines[i] = lines[i].replace(match[1], newArgs);
        }
    }
}
content = lines.join('\n');

// 3. Update hydration logic to upgrade legacy units
const oldHydration = `						// 2. Sync existing user's items with new categories
						parsed.inventory.forEach((item: any) => {
							const defaultItem = defaultDb.inventory.find((d: any) => d.name === item.name || d.englishName === item.englishName);
							if (defaultItem) {
								item.category = defaultItem.category;
							}
						});`;
const newHydration = `						// 2. Sync existing user's items with new categories AND upgrade quantities
						parsed.inventory.forEach((item: any) => {
							const defaultItem = defaultDb.inventory.find((d: any) => d.name === item.name || d.englishName === item.englishName);
							if (defaultItem) {
								item.category = defaultItem.category;
								
								// Upgrade legacy '1 units' to realistic defaults
								if (item.quantityAmount === 1 && item.quantityUnit === 'units') {
									item.quantityAmount = defaultItem.quantityAmount;
									item.quantityUnit = defaultItem.quantityUnit;
								}
							}
						});`;
content = content.replace(oldHydration, newHydration);

fs.writeFileSync(path, content);
console.log('Quantities injected and hydration upgraded!');
