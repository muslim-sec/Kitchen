import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const oldHydration = `// Restore Eco Mode if it was accidentally wiped
					if (parsed.hideTemplates) {
						const eco = parsed.hideTemplates.find((t: any) => t.id === 'eco-mode');
						if (eco && (!eco.hiddenNames || eco.hiddenNames.length === 0)) {
							eco.hiddenNames = ['سالمون أو ماكريل', 'جمبري', 'حليب اللوز', 'Celsius (طاقة صحي)', 'مشروب ماتشا (طاقة هادئ)', 'مكسرات', 'لوز', 'زبدة الفول السوداني', 'الشوكولاتة الداكنة', 'برينجلز', 'كعك الأرز', 'سمك الصول'];
						}
					}`;

const newHydration = `// Force Restore Eco Mode to 12 items (User accidentally wiped it)
					if (parsed.hideTemplates) {
						const eco = parsed.hideTemplates.find((t: any) => t.id === 'eco-mode');
						if (eco && (!eco.hiddenNames || eco.hiddenNames.length < 5)) { // Force if less than 5 items
							eco.hiddenNames = ['سالمون أو ماكريل', 'جمبري', 'حليب اللوز', 'Celsius (طاقة صحي)', 'مشروب ماتشا (طاقة هادئ)', 'مكسرات', 'لوز', 'زبدة الفول السوداني', 'الشوكولاتة الداكنة', 'برينجلز', 'كعك الأرز', 'سمك الصول'];
						}
					}`;

content = content.replace(oldHydration, newHydration);

fs.writeFileSync(path, content);
console.log('Forced eco-mode reset.');
