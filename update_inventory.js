import fs from 'fs';

const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add new items to inventory
const newItems = `
		// --- Canned & Basics ---
		createDefaultItem('التونة المعلبة', '🐟', 'Supermarket', 'in_fridge', 0, 'Canned Tuna'),
		createDefaultItem('الفاصوليا المعلبة', '🥫', 'Supermarket', 'in_fridge', 0, 'Canned Beans'),
		createDefaultItem('الفطر المعلب', '🍄', 'Supermarket', 'in_fridge', 0, 'Canned Mushrooms'),
		createDefaultItem('الحمص', '🧆', 'Supermarket', 'in_fridge', 0, 'Chickpeas'),
		createDefaultItem('الكاشير / مرتديلا', '🥪', 'Supermarket', 'in_fridge', 0, 'Cold Cuts'),
		createDefaultItem('كورنيشون', '🥒', 'Supermarket', 'in_fridge', 0, 'Cornichons'),
		createDefaultItem('زيت الزيتون', '🫒', 'Supermarket', 'in_fridge', 0, 'Olive Oil'),
		createDefaultItem('الزيتون', '🫒', 'Supermarket', 'in_fridge', 0, 'Olives'),
		createDefaultItem('معجون الطماطم', '🥫', 'Supermarket', 'in_fridge', 0, 'Tomato Paste'),
		createDefaultItem('صلصة بيضاء', '🥛', 'Supermarket', 'in_fridge', 0, 'White Sauce'),

		// --- Breakfast & Spreads ---
		createDefaultItem('سيريلاك / حبوب الأطفال', '🥣', 'Supermarket', 'in_fridge', 0, 'Baby Cereal'),
		createDefaultItem('حبوب الإفطار', '🥣', 'Supermarket', 'in_fridge', 0, 'Cereal'),
		createDefaultItem('الشوفان', '🌾', 'Supermarket', 'in_fridge', 0, 'Oatmeal'),
		createDefaultItem('زبدة الفول السوداني', '🥜', 'Supermarket', 'in_fridge', 0, 'Peanut Butter'),
		createDefaultItem('العسل', '🍯', 'Supermarket', 'in_fridge', 0, 'Honey'),
		createDefaultItem('المربى', '🍓', 'Supermarket', 'in_fridge', 0, 'Jam'),

		// --- Snacks & Drinks ---
		createDefaultItem('برينجلز', '🥔', 'Supermarket', 'in_fridge', 0, 'Pringles'),
		createDefaultItem('ذرة الفشار', '🍿', 'Supermarket', 'in_fridge', 0, 'Popcorn Kernels'),
		createDefaultItem('فواكه مجففة / تمر', '🍇', 'Supermarket', 'in_fridge', 0, 'Dried Fruits'),
		createDefaultItem('كعك الأرز', '🍘', 'Supermarket', 'in_fridge', 0, 'Rice Cakes'),
		createDefaultItem('الشوكولاتة الداكنة', '🍫', 'Supermarket', 'in_fridge', 0, 'Dark Chocolate'),
		createDefaultItem('زبادي / دانون', '🥣', 'Supermarket', 'in_fridge', 0, 'Yogurt'),
		createDefaultItem('مشروب طاقة للتركيز', '⚡', 'Supermarket', 'in_fridge', 0, 'Energy Drink'),
`;

// Insert the new items before `] as MasterInventoryItem[],`
content = content.replace("] as MasterInventoryItem[],", newItems + "\t\t] as MasterInventoryItem[],");


// 2. Update Hydration Logic
const hydrationUpdate = `					initialDb = { ...defaultDb, ...parsed };
					
					if (parsed.inventory) {
						const existingItemNames = new Set(parsed.inventory.map((i) => i.name));
						const missingInventory = defaultDb.inventory.filter((i) => !existingItemNames.has(i.name));
						initialDb.inventory = [...parsed.inventory, ...missingInventory];
					}`;

content = content.replace("					initialDb = { ...defaultDb, ...parsed };", hydrationUpdate);


fs.writeFileSync(path, content);
console.log('Successfully updated store.svelte.ts with new inventory items and hydration logic!');
