import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix the mushrooms
content = content.replace(/'فطر', '🍄', 'Canned Goods'/, "'فطر طازج', '🍄', 'Vegetables'");
content = content.replace(/'فطر', '🍄', 'Supermarket'/, "'فطر طازج', '🍄', 'Vegetables'"); // Fallback

// 2. Prepare new items
const newVegetables = `		createDefaultItem('بروكلي', '🥦', 'Vegetables', 'in_fridge', 0, 'Broccoli'),
		createDefaultItem('سبانخ', '🥬', 'Vegetables', 'in_fridge', 0, 'Spinach'),
		createDefaultItem('بازلاء', '🫛', 'Vegetables', 'in_fridge', 0, 'Peas'),
		createDefaultItem('فلفل أحمر وأخضر', '🫑', 'Vegetables', 'in_fridge', 0, 'Bell Peppers'),
		createDefaultItem('بصل أخضر', '🌱', 'Vegetables', 'in_fridge', 0, 'Green Onion'),
		createDefaultItem('بقدونس وكزبرة', '🌿', 'Vegetables', 'in_fridge', 0, 'Parsley & Coriander'),
		createDefaultItem('ريحان', '🌿', 'Vegetables', 'in_fridge', 0, 'Basil'),
`;
const newFruits = `		createDefaultItem('برتقال', '🍊', 'Fruits', 'in_fridge', 0, 'Orange'),
		createDefaultItem('فراولة', '🍓', 'Fruits', 'in_fridge', 0, 'Strawberry'),
`;
const newProteins = `		createDefaultItem('سمك الصول', '🐟', 'Proteins', 'in_fridge', 0, 'Sole Fish'),
		createDefaultItem('كلماري / حبار', '🦑', 'Proteins', 'in_fridge', 0, 'Calamari'),
		createDefaultItem('سردين', '🐟', 'Proteins', 'in_fridge', 0, 'Sardines'),
		createDefaultItem('سالمون أو ماكريل', '🐟', 'Proteins', 'in_fridge', 0, 'Salmon/Mackerel'),
		createDefaultItem('جمبري', '🦐', 'Proteins', 'in_fridge', 0, 'Shrimp'),
		createDefaultItem('فيليه سمك أبيض', '🐟', 'Proteins', 'in_fridge', 0, 'White Fish Fillet'),
`;
const newPantry = `		createDefaultItem('فاصوليا بيضاء جافة', '🫘', 'Pantry', 'in_fridge', 0, 'Dry White Beans'),
		createDefaultItem('حمص جاف', '🧆', 'Pantry', 'in_fridge', 0, 'Dry Chickpeas'),
		createDefaultItem('فول', '🫘', 'Pantry', 'in_fridge', 0, 'Fava Beans'),
		createDefaultItem('عدس أحمر', '🥣', 'Pantry', 'in_fridge', 0, 'Red Lentils'),
		createDefaultItem('حليب جوز الهند', '🥥', 'Pantry', 'in_fridge', 0, 'Coconut Milk'),
`;
const newGrains = `		createDefaultItem('خبز حبوب كاملة', '🥖', 'Grains', 'in_fridge', 0, 'Whole Wheat Bread'),
		createDefaultItem('طحين قمح كامل', '🌾', 'Grains', 'in_fridge', 0, 'Whole Wheat Flour'),
		createDefaultItem('أرز بني', '🍚', 'Grains', 'in_fridge', 0, 'Brown Rice'),
		createDefaultItem('سميد', '🫓', 'Grains', 'in_fridge', 0, 'Semolina'),
`;
const newDairy = `		createDefaultItem('زبادي يوناني', '🥣', 'Dairy', 'in_fridge', 0, 'Greek Yogurt'),
		createDefaultItem('حليب اللوز', '🥛', 'Dairy', 'in_fridge', 0, 'Almond Milk'),
		createDefaultItem('جبن كيري', '🧀', 'Dairy', 'in_fridge', 0, 'Kiri Cheese'),
		createDefaultItem('لاڤاش كيري', '🧀', 'Dairy', 'in_fridge', 0, 'La Vache Qui Rit'),
		createDefaultItem('الفرماج الأحمر', '🧀', 'Dairy', 'in_fridge', 0, 'Red Cheese'),
`;
const newCondiments = `		createDefaultItem('خردل', '🥄', 'Condiments', 'in_fridge', 0, 'Dijon Mustard'),
		createDefaultItem('طحينة', '🥜', 'Condiments', 'in_fridge', 0, 'Tahini'),
		createDefaultItem('صويا صوص', '🍶', 'Condiments', 'in_fridge', 0, 'Soy Sauce'),
`;
const newSpices = `		createDefaultItem('زعتر', '🌿', 'Spices', 'in_fridge', 0, 'Thyme'),
		createDefaultItem('شطة / فلفل أحمر حار', '🌶️', 'Spices', 'in_fridge', 0, 'Chili Pepper'),
		createDefaultItem('قرفة', '🪵', 'Spices', 'in_fridge', 0, 'Cinnamon'),
`;
const newBeverages = `		createDefaultItem('مياه معدنية', '💧', 'Beverages', 'in_fridge', 0, 'Mineral Water'),
		createDefaultItem('عصير برتقال معلب', '🧃', 'Beverages', 'in_fridge', 0, 'Orange Juice'),
		createDefaultItem('Celsius (طاقة صحي)', '⚡', 'Beverages', 'in_fridge', 0, 'Celsius Energy'),
		createDefaultItem('مشروب ماتشا (طاقة هادئ)', '🍵', 'Beverages', 'in_fridge', 0, 'Matcha Drink'),
`;

// 3. Insert blocks. I will append them all at the end of the inventory array (right before `] as MasterInventoryItem[],`) to avoid fragile regex insertions.
const combinedNewItems = "\n" + newVegetables + newFruits + newProteins + newPantry + newGrains + newDairy + newCondiments + newSpices + newBeverages;

content = content.replace("] as MasterInventoryItem[],", combinedNewItems + "\t\t] as MasterInventoryItem[],");

fs.writeFileSync(path, content);
console.log('Items injected successfully!');
