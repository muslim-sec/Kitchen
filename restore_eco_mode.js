import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// If eco-mode exists but is empty, restore it.
const hydrationTarget = `if (!parsed.hideTemplates || parsed.hideTemplates.length === 0) {`;
const newHydration = `// Restore Eco Mode if it was accidentally wiped
					if (parsed.hideTemplates) {
						const eco = parsed.hideTemplates.find((t: any) => t.id === 'eco-mode');
						if (eco && (!eco.hiddenNames || eco.hiddenNames.length === 0)) {
							eco.hiddenNames = ['سالمون أو ماكريل', 'جمبري', 'حليب اللوز', 'Celsius (طاقة صحي)', 'مشروب ماتشا (طاقة هادئ)', 'مكسرات', 'لوز', 'زبدة الفول السوداني', 'الشوكولاتة الداكنة', 'برينجلز', 'كعك الأرز', 'سمك الصول'];
						}
					}
					
					if (!parsed.hideTemplates || parsed.hideTemplates.length === 0) {`;

content = content.replace(hydrationTarget, newHydration);

// Wait, earlier I added a method to toggle hidden.
// I need to ensure that toggling hidden logic will let us reset the active template in the UI. 
// UI will handle resetting the active template state.

fs.writeFileSync(path, content);
console.log('Restored Eco Mode logic.');
