import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add unitPrice to MasterInventoryItem
content = content.replace(
    "cycle?: ShoppingCycle;",
    "cycle?: ShoppingCycle;\n\tunitPrice?: number;"
);

// 2. Add hydration block
const oldHydrationEnd = `if (!item.cycle) {
									item.cycle = defaultItem.cycle || getDefaultCycle(item.category);
								}
							}
						});`;

const newHydrationEnd = `if (!item.cycle) {
									item.cycle = defaultItem.cycle || getDefaultCycle(item.category);
								}
							}
						});

						// 3. Moroccan Pricing Simulation (One-time injection for local account)
						if (!parsed.hasMoroccanPrices) {
							const moroccanUnitPrices: Record<string, number> = {
								'طماطم': 8, 'بطاطس': 6, 'بصل': 6, 'جزر': 6, 'خيار': 7, 'فلفل أحمر وأخضر': 12, 'فلفل': 12, 'باذنجان': 8, 'قرع': 10, 'ثوم': 30 /*per kg, or 10 per head*/,
								'خس': 2, 'بصل أخضر': 2, 'بقدونس وكزبرة': 2, 'ريحان': 3, 'سبانخ': 3,
								'بروكلي': 15, 'بازلاء': 12,
								'برتقال': 10, 'حامض': 10, 'Apples': 15, 'Bananas': 12, 'Avocados': 35, 'فراولة': 40 /* per kg */,
								'دجاج': 22, 'لحم مفروم': 90, 'كبدة': 80, 'Eggs': 1.2, /* 1.2 per piece */
								'الكاشير / مرتديلا': 60, /* per kg */
								'سمك الصول': 60, 'كلماري / حبار': 70, 'سردين': 15, 'سالمون أو ماكريل': 150, 'جمبري': 90, 'فيليه سمك أبيض': 80,
								'فاصوليا بيضاء جافة': 20, 'حمص جاف': 20, 'فول': 15, 'عدس': 18, 'عدس أحمر': 22,
								'طحين': 5, 'طحين قمح كامل': 7, 'سميد': 12, 'Pasta': 15, 'Rice': 16, 'أرز بني': 25, 'خبز حبوب كاملة': 3,
								'زيت': 18, 'زيت الزيتون': 90, 'حليب جوز الهند': 25,
								'Milk': 4, 'حليب اللوز': 30, 'زبادي يوناني': 20 /*per pack*/, 'زبدة': 80 /*per kg*/, 
								'Cheese': 80, 'الفرماج الأحمر': 80, 'جبن كيري': 15, 'لاڤاش كيري': 15,
								'التونة المعلبة': 12, 'الفاصوليا المعلبة': 12, 'الفطر المعلب': 15, 'ذرة': 12,
								'خل': 10, 'صلصة طماطم': 15, 'معجون الطماطم': 10, 'Cornichons': 20, 'الزيتون': 40 /*per kg*/,
								'صلصة بيضاء': 15, 'خردل': 15, 'طحينة': 30, 'صويا صوص': 25,
								'ملح': 5 /*per kg*/, 'ابزار': 150 /*per kg*/, 'كامون': 120, 'خرقوم': 100, 'تحميرة': 100, 'سكينجبير': 120, 'زعتر': 80, 'شطة / فلفل أحمر حار': 100, 'قرفة': 120,
								'مكسرات': 150 /*per kg*/, 'لوز': 120, 'فواكه مجففة / تمر': 40, 'زبدة الفول السوداني': 45, 'العسل': 80, 'المربى': 15,
								'Chocolate': 15, 'الشوكولاتة الداكنة': 20, 'برينجلز': 30, 'ذرة الفشار': 15, 'كعك الأرز': 25,
								'سيريلاك / حبوب الأطفال': 35, 'حبوب الإفطار': 35, 'الشوفان': 25,
								'قهوة': 100 /*per kg*/, 'مياه معدنية': 2 /*per L*/, 'عصير برتقال معلب': 12, 'Celsius (طاقة صحي)': 25, 'مشروب ماتشا (طاقة هادئ)': 35
							};

							// Normalize units internally for calculation (assuming default DB units)
							// If unit is kg, price is per kg. If g, price is per g (so we divide by 1000). 
							// If cans/packs, price is per item.
							parsed.inventory.forEach((item: any) => {
								let basePrice = moroccanUnitPrices[item.name] || moroccanUnitPrices[item.englishName];
								if (basePrice) {
									// Adjust basePrice if the unit is 'g' (since basePrice is listed per kg above for many items)
									if (item.quantityUnit === 'g' && basePrice >= 40) {
										basePrice = basePrice / 1000;
									}
									item.unitPrice = basePrice;
									item.price = parseFloat((item.quantityAmount * basePrice).toFixed(2));
								}
							});
							parsed.hasMoroccanPrices = true;
						}`;

content = content.replace(oldHydrationEnd, newHydrationEnd);

// Allow state overriding
content = content.replace(
    "initialDb = { ...defaultDb, ...parsed };",
    "initialDb = { ...defaultDb, ...parsed };\n\t\t\t\t\tif (!parsed.hasMoroccanPrices) initialDb.hasMoroccanPrices = true;"
);

fs.writeFileSync(path, content);
console.log('Database updated with pricing logic.');
