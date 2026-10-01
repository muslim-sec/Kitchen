import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add HideTemplate type
content = content.replace(
    "export interface RecipeIngredient {",
    "export interface HideTemplate {\n\tid: string;\n\tname: string;\n\thiddenNames: string[];\n}\n\nexport interface RecipeIngredient {"
);

// 2. Add hideTemplates to defaultDb
content = content.replace(
    "recipes: []",
    "recipes: [],\n\thideTemplates: []"
);

// 3. Hydrate hideTemplates and inject Economic Mode
const oldHydrationBlock = `if (!(parsed as any).hasFixedMoroccanPrices_v2) (initialDb as any).hasFixedMoroccanPrices_v2 = true;`;
const newHydrationBlock = `if (!(parsed as any).hasFixedMoroccanPrices_v2) (initialDb as any).hasFixedMoroccanPrices_v2 = true;
					
					// Inject default Economic Mode if hideTemplates doesn't exist or is empty
					if (!parsed.hideTemplates || parsed.hideTemplates.length === 0) {
						initialDb.hideTemplates = [{
							id: 'eco-mode',
							name: '💰 Economic Mode',
							hiddenNames: [
								'سالمون أو ماكريل', 'جمبري', 'حليب اللوز', 'Celsius (طاقة صحي)', 'مشروب ماتشا (طاقة هادئ)', 'مكسرات', 'لوز', 'زبدة الفول السوداني', 'الشوكولاتة الداكنة', 'برينجلز', 'كعك الأرز', 'سمك الصول'
							]
						}];
					}`;
content = content.replace(oldHydrationBlock, newHydrationBlock);

// 4. Expose actions for hideTemplates
const oldActionsEnd = `deleteItem(id: string) {
		db.inventory = db.inventory.filter((i) => i.id !== id);
	},`;
const newActionsEnd = `deleteItem(id: string) {
		db.inventory = db.inventory.filter((i) => i.id !== id);
	},
	saveHideTemplate(name: string, hiddenNames: string[]) {
		db.hideTemplates.push({
			id: Math.random().toString(36).substr(2, 9),
			name,
			hiddenNames
		});
	},
	deleteHideTemplate(id: string) {
		db.hideTemplates = db.hideTemplates.filter((t) => t.id !== id);
	},
	applyHideTemplate(hiddenNames: string[]) {
		db.inventory.forEach(item => {
			if (hiddenNames.includes(item.name)) {
				item.isHidden = true;
			} else {
				item.isHidden = false;
			}
		});
	},
	unhideAll() {
		db.inventory.forEach(item => item.isHidden = false);
	},`;
content = content.replace(oldActionsEnd, newActionsEnd);

fs.writeFileSync(path, content);
console.log('Database updated for Hide Templates.');
