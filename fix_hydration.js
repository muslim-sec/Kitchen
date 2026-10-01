import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const targetBlockStart = "initialDb = { ...defaultDb, ...parsed };";
const replacement = `initialDb = { ...defaultDb, ...parsed };
					
					if (parsed.inventory) {
						// 1. Remove duplicate 'خيار مخلل'
						parsed.inventory = parsed.inventory.filter(i => i.name !== 'خيار مخلل');
						
						// 2. Sync existing user's items with new categories
						parsed.inventory.forEach(item => {
							const defaultItem = defaultDb.inventory.find(d => d.name === item.name || d.englishName === item.englishName);
							if (defaultItem) {
								item.category = defaultItem.category;
							}
						});
						
						// 3. Add any missing new items to the user's inventory
						const existingItemNames = new Set(parsed.inventory.map(i => i.name));
						const missingInventory = defaultDb.inventory.filter(i => !existingItemNames.has(i.name));
						initialDb.inventory = [...parsed.inventory, ...missingInventory];
					}`;

content = content.replace(targetBlockStart, replacement);

// Also fix 'فطر' which was missed earlier
content = content.replace("'فطر', '🍄', 'Supermarket'", "'فطر', '🍄', 'Canned Goods'");

fs.writeFileSync(path, content);
console.log('Hydration fixed!');
