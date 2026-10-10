import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const inserts = {
    "Vegetables": [
        "createDefaultItem('بطاطا حلوة', '🍠', 'Vegetables', 'in_fridge', 0, 'Sweet Potato', 1, 'kg'),",
        "createDefaultItem('زنجبيل طازج', '🫚', 'Vegetables', 'in_fridge', 0, 'Fresh Ginger', 100, 'g'),"
    ],
    "Fruits": [
        "createDefaultItem('بطيخ', '🍉', 'Fruits', 'in_fridge', 0, 'Watermelon', 1, 'whole'),",
        "createDefaultItem('خوخ', '🍑', 'Fruits', 'in_fridge', 0, 'Peach', 1, 'kg'),",
        "createDefaultItem('إجاص / كمثرى', '🍐', 'Fruits', 'in_fridge', 0, 'Pears', 1, 'kg'),",
        "createDefaultItem('مانجو', '🥭', 'Fruits', 'in_fridge', 0, 'Mango', 1, 'kg'),",
        "createDefaultItem('كيوي', '🥝', 'Fruits', 'in_fridge', 0, 'Kiwi', 1, 'kg'),",
        "createDefaultItem('عنب', '🍇', 'Fruits', 'in_fridge', 0, 'Grapes', 1, 'kg'),",
        "createDefaultItem('شمام', '🍈', 'Fruits', 'in_fridge', 0, 'Melon', 1, 'whole'),",
        "createDefaultItem('رمان', '🍎', 'Fruits', 'in_fridge', 0, 'Pomegranate', 1, 'kg'),",
        "createDefaultItem('توت', '🫐', 'Fruits', 'in_fridge', 0, 'Berries', 1, 'box'),"
    ],
    "Proteins": [
        "createDefaultItem('لحم بقر / عجل', '🥩', 'Proteins', 'in_fridge', 0, 'Beef Cuts', 1, 'kg'),",
        "createDefaultItem('لحم غنم', '🥩', 'Proteins', 'in_fridge', 0, 'Lamb', 1, 'kg'),",
        "createDefaultItem('ديك رومي', '🦃', 'Proteins', 'in_fridge', 0, 'Turkey', 500, 'g'),",
        "createDefaultItem('توفو', '🧊', 'Proteins', 'in_fridge', 0, 'Tofu', 1, 'pack'),"
    ],
    "Spices": [
        "createDefaultItem('ثوم بودرة', '🧄', 'Spices', 'in_fridge', 0, 'Garlic Powder', 50, 'g'),",
        "createDefaultItem('بصل بودرة', '🧅', 'Spices', 'in_fridge', 0, 'Onion Powder', 50, 'g'),",
        "createDefaultItem('زعفران', '🌼', 'Spices', 'in_fridge', 0, 'Saffron', 1, 'g'),"
    ],
    "Dairy": [
        "createDefaultItem('جبنة موزاريلا', '🧀', 'Dairy', 'in_fridge', 0, 'Mozzarella', 500, 'g'),"
    ],
    "Condiments": [
        "createDefaultItem('كاتشب', '🍅', 'Condiments', 'in_fridge', 0, 'Ketchup', 1, 'bottle'),",
        "createDefaultItem('مايونيز', '🥚', 'Condiments', 'in_fridge', 0, 'Mayonnaise', 1, 'jar'),",
        "createDefaultItem('صلصة حارة / هريسة', '🌶️', 'Condiments', 'in_fridge', 0, 'Hot Sauce / Harissa', 1, 'jar'),",
        "createDefaultItem('خل أبيض', '🧴', 'Condiments', 'in_fridge', 0, 'White Vinegar', 1, 'bottle'),",
        "createDefaultItem('خل تفاح', '🍎', 'Condiments', 'in_fridge', 0, 'Apple Cider Vinegar', 1, 'bottle'),",
        "createDefaultItem('صلصة ألجيريان', '🌮', 'Condiments', 'in_fridge', 0, 'Algerienne Sauce', 1, 'bottle'),",
        "createDefaultItem('صلصة باستا بيضاء', '🍝', 'Condiments', 'in_fridge', 0, 'Ready White Pasta Sauce', 1, 'jar'),"
    ],
    "Pantry": [
        "createDefaultItem('سكر بني', '🟤', 'Pantry', 'in_fridge', 0, 'Brown Sugar', 500, 'g'),",
        "createDefaultItem('خميرة الحلويات', '🧁', 'Pantry', 'in_fridge', 0, 'Baking Powder', 5, 'sachets'),",
        "createDefaultItem('كاكاو بودرة', '🍫', 'Pantry', 'in_fridge', 0, 'Cocoa Powder', 100, 'g'),",
        "createDefaultItem('شعرية صينية', '🍜', 'Pantry', 'in_fridge', 0, 'Chinese Vermicelli', 1, 'pack'),"
    ],
    "Breakfast": [
        "createDefaultItem('خليط البان كيك', '🥞', 'Breakfast', 'in_fridge', 0, 'Pancake Mix', 1, 'box'),"
    ]
};

const anchors = {
    "Vegetables": "createDefaultItem('فطر طازج', '🍄', 'Vegetables', 'in_fridge', 0, 'Mushrooms', 2, 'cans'),",
    "Fruits": "createDefaultItem('Strawberry', '🍓', 'Fruits', 'in_fridge', 0, 'Strawberry', 1, 'box'),",
    "Proteins": "createDefaultItem('Eggs', '🥚', 'Proteins', 'in_fridge', 0, 'Eggs', 30, 'pcs'),",
    "Spices": "createDefaultItem('سكينجبير', '🫚', 'Spices', 'in_fridge', 0, 'Ginger', 100, 'g'),",
    "Dairy": "createDefaultItem('Cheese', '🧀', 'Dairy', 'in_fridge', 0, 'Cheese', 500, 'g'),",
    "Condiments": "createDefaultItem('خل', '🧴', 'Condiments', 'in_fridge', 0, 'Vinegar', 1, 'L'),",
    "Pantry": "createDefaultItem('Pasta', '🍝', 'Pantry', 'in_fridge', 0, 'Pasta', 1, 'kg'),",
    "Breakfast": "createDefaultItem('Oatmeal', '🥣', 'Breakfast', 'in_fridge', 0, 'Oatmeal', 1, 'kg'),"
};

for (const [cat, items] of Object.entries(inserts)) {
    const anchor = anchors[cat];
    if (content.includes(anchor)) {
        const insertText = anchor + '\n\t\t' + items.join('\n\t\t');
        content = content.replace(anchor, insertText);
        console.log(`Added items for ${cat}`);
    } else {
        console.log(`Could not find anchor for ${cat}: ${anchor}`);
    }
}

fs.writeFileSync(path, content);
console.log("All updates applied.");
