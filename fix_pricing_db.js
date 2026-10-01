import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const oldHydration = `						// 3. Moroccan Pricing Simulation (One-time injection for local account)
						if (!(parsed as any).hasMoroccanPrices) {`;

const newHydration = `						// 3. Moroccan Pricing Simulation (One-time injection for local account - V2 FIX)
						if (!(parsed as any).hasFixedMoroccanPrices_v2) {`;

content = content.replace(oldHydration, newHydration);

const oldLogic = `									if (item.quantityUnit === 'g' && basePrice >= 40) {
										basePrice = basePrice / 1000;
									}
									item.unitPrice = basePrice;
									item.price = parseFloat((item.quantityAmount * basePrice).toFixed(2));
								}
							});
							(parsed as any).hasMoroccanPrices = true;`;

const newLogic = `									if (item.quantityUnit === 'g' || item.quantityUnit === 'ml') {
										basePrice = basePrice / 1000;
									}
									item.unitPrice = parseFloat(basePrice.toFixed(2));
									item.price = parseFloat((item.quantityAmount * basePrice).toFixed(2));
								}
							});
							(parsed as any).hasFixedMoroccanPrices_v2 = true;`;

content = content.replace(oldLogic, newLogic);

const oldInit = `if (!(parsed as any).hasMoroccanPrices) (initialDb as any).hasMoroccanPrices = true;`;
const newInit = `if (!(parsed as any).hasFixedMoroccanPrices_v2) (initialDb as any).hasFixedMoroccanPrices_v2 = true;`;
content = content.replace(oldInit, newInit);

fs.writeFileSync(path, content);
console.log('Fixed DB pricing logic.');
