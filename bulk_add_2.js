import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const inserts = {
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
    "Breakfast": [
        "createDefaultItem('خليط البان كيك', '🥞', 'Breakfast', 'in_fridge', 0, 'Pancake Mix', 1, 'box'),"
    ]
};

const anchors = {
    "Fruits": "createDefaultItem('فراولة', '🍓', 'Fruits', 'in_fridge', 0, 'Strawberry', 500, 'g'),",
    "Breakfast": "createDefaultItem('الشوفان', '🌾', 'Breakfast', 'in_fridge', 0, 'Oatmeal', 1, 'kg'),"
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
