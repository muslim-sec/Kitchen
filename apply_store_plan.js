import fs from 'fs';

const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Category Type
const oldType = `export type Category =
	'Vegetables' | 'Fruits' | 'Proteins' | 'Spices' | 'Supermarket' | 'Grains' | 'Pantry';`;
const newType = `export type Category =
	'Vegetables' | 'Fruits' | 'Proteins' | 'Spices' | 'Supermarket' | 'Grains' | 'Pantry' | 'Canned Goods' | 'Snacks' | 'Breakfast' | 'Beverages' | 'Dairy' | 'Condiments';`;
content = content.replace(oldType, newType);

// 2. Remove 'خيار مخلل' and update 'كورنيشون' to 'Cornichons'
content = content.replace(/createDefaultItem\('خيار مخلل', '🥒', 'Supermarket', 'in_fridge', 0, 'Pickles'\),\n\s*/, '');
content = content.replace(/'كورنيشون', '🥒', 'Supermarket', 'in_fridge', 0, 'Cornichons'/, "'Cornichons', '🥒', 'Condiments', 'in_fridge', 0, 'Cornichons'");

// 3. Re-categorize items in defaultDb.inventory
// Canned Goods
content = content.replace(/'التونة المعلبة', '🐟', 'Supermarket'/, "'التونة المعلبة', '🐟', 'Canned Goods'");
content = content.replace(/'الفاصوليا المعلبة', '🥫', 'Supermarket'/, "'الفاصوليا المعلبة', '🥫', 'Canned Goods'");
content = content.replace(/'الفطر المعلب', '🍄', 'Supermarket'/, "'الفطر المعلب', '🍄', 'Canned Goods'");
content = content.replace(/'الحمص', '🧆', 'Supermarket'/, "'الحمص', '🧆', 'Canned Goods'");
// Snacks
content = content.replace(/'برينجلز', '🥔', 'Supermarket'/, "'برينجلز', '🥔', 'Snacks'");
content = content.replace(/'ذرة الفشار', '🍿', 'Supermarket'/, "'ذرة الفشار', '🍿', 'Snacks'");
content = content.replace(/'فواكه مجففة \/ تمر', '🍇', 'Supermarket'/, "'فواكه مجففة / تمر', '🍇', 'Snacks'");
content = content.replace(/'كعك الأرز', '🍘', 'Supermarket'/, "'كعك الأرز', '🍘', 'Snacks'");
content = content.replace(/'الشوكولاتة الداكنة', '🍫', 'Supermarket'/, "'الشوكولاتة الداكنة', '🍫', 'Snacks'");
content = content.replace(/'Chocolate', '🍫', 'Supermarket'/, "'Chocolate', '🍫', 'Snacks'");
content = content.replace(/'مكسرات', '🥜', 'Supermarket'/, "'مكسرات', '🥜', 'Snacks'");
content = content.replace(/'لوز', '🌰', 'Supermarket'/, "'لوز', '🌰', 'Snacks'");
// Breakfast
content = content.replace(/'سيريلاك \/ حبوب الأطفال', '🥣', 'Supermarket'/, "'سيريلاك / حبوب الأطفال', '🥣', 'Breakfast'");
content = content.replace(/'حبوب الإفطار', '🥣', 'Supermarket'/, "'حبوب الإفطار', '🥣', 'Breakfast'");
content = content.replace(/'الشوفان', '🌾', 'Supermarket'/, "'الشوفان', '🌾', 'Breakfast'");
content = content.replace(/'زبدة الفول السوداني', '🥜', 'Supermarket'/, "'زبدة الفول السوداني', '🥜', 'Breakfast'");
content = content.replace(/'العسل', '🍯', 'Supermarket'/, "'العسل', '🍯', 'Breakfast'");
content = content.replace(/'المربى', '🍓', 'Supermarket'/, "'المربى', '🍓', 'Breakfast'");
// Beverages
content = content.replace(/'مشروب طاقة للتركيز', '⚡', 'Supermarket'/, "'مشروب طاقة للتركيز', '⚡', 'Beverages'");
content = content.replace(/'قهوة', '☕', 'Supermarket'/, "'قهوة', '☕', 'Beverages'");
// Dairy
content = content.replace(/'زبادي \/ دانون', '🥣', 'Supermarket'/, "'زبادي / دانون', '🥣', 'Dairy'");
content = content.replace(/'Milk', '🥛', 'Supermarket'/, "'Milk', '🥛', 'Dairy'");
content = content.replace(/'Cheese', '🧀', 'Supermarket'/, "'Cheese', '🧀', 'Dairy'");
content = content.replace(/'زبدة', '🧈', 'Supermarket'/, "'زبدة', '🧈', 'Dairy'");
// Condiments
content = content.replace(/'زيت الزيتون', '🫒', 'Supermarket'/, "'زيت الزيتون', '🫒', 'Condiments'");
content = content.replace(/'الزيتون', '🫒', 'Supermarket'/, "'الزيتون', '🫒', 'Condiments'");
content = content.replace(/'معجون الطماطم', '🥫', 'Supermarket'/, "'معجون الطماطم', '🥫', 'Condiments'");
content = content.replace(/'صلصة طماطم', '🥫', 'Supermarket'/, "'صلصة طماطم', '🥫', 'Condiments'");
content = content.replace(/'خل', '🧴', 'Supermarket'/, "'خل', '🧴', 'Condiments'");
content = content.replace(/'صلصة بيضاء', '🥛', 'Supermarket'/, "'صلصة بيضاء', '🥛', 'Condiments'");
// Pantry
content = content.replace(/'طحين', '🌾', 'Supermarket'/, "'طحين', '🌾', 'Pantry'");
content = content.replace(/'Pasta', '🍝', 'Supermarket'/, "'Pasta', '🍝', 'Pantry'");
content = content.replace(/'Rice', '🍚', 'Supermarket'/, "'Rice', '🍚', 'Pantry'");
content = content.replace(/'عدس', '🫘', 'Supermarket'/, "'عدس', '🫘', 'Pantry'");
// Others
content = content.replace(/'زيت', '🫙', 'Supermarket'/, "'زيت', '🫙', 'Pantry'");
content = content.replace(/'الكاشير \/ مرتديلا', '🥪', 'Supermarket'/, "'الكاشير / مرتديلا', '🥪', 'Dairy'"); // or maybe Proteins, let's keep it in Proteins
content = content.replace(/'الكاشير \/ مرتديلا', '🥪', 'Dairy'/, "'الكاشير / مرتديلا', '🥪', 'Proteins'");
content = content.replace(/'ذرة', '🌽', 'Supermarket'/, "'ذرة', '🌽', 'Canned Goods'");

// 4. Update Hydration Logic
const oldHydrationBlock = `					if (parsed.inventory) {
						const existingItemNames = new Set(parsed.inventory.map((i: any) => i.name));
						const missingInventory = defaultDb.inventory.filter((i: any) => !existingItemNames.has(i.name));
						initialDb.inventory = [...parsed.inventory, ...missingInventory];
					}`;
const newHydrationBlock = `					if (parsed.inventory) {
						// 1. Remove duplicate 'خيار مخلل'
						parsed.inventory = parsed.inventory.filter((i: any) => i.name !== 'خيار مخلل');
						
						// 2. Sync existing user's items with new categories
						parsed.inventory.forEach((item: any) => {
							const defaultItem = defaultDb.inventory.find(d => d.name === item.name || d.englishName === item.englishName);
							if (defaultItem) {
								item.category = defaultItem.category;
							}
						});
						
						const existingItemNames = new Set(parsed.inventory.map((i: any) => i.name));
						const missingInventory = defaultDb.inventory.filter((i: any) => !existingItemNames.has(i.name));
						initialDb.inventory = [...parsed.inventory, ...missingInventory];
					}`;
if (content.includes("existingItemNames.has(i.name));")) {
	// Find and replace the block
	content = content.replace(oldHydrationBlock, newHydrationBlock);
}

fs.writeFileSync(path, content);
console.log('Store updated');
