import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// Fix Celsius
content = content.replace(
    /createDefaultItem\('Celsius \(طاقة صحي, undefined, undefined, undefined, undefined, undefined, 1, 'units'\)', '⚡', 'Beverages', 'in_fridge', 0, 'Celsius Energy'\)/,
    "createDefaultItem('Celsius (طاقة صحي)', '⚡', 'Beverages', 'to_buy', 0, 'Celsius Energy', 2, 'cans')"
);

// Fix Matcha
content = content.replace(
    /createDefaultItem\('مشروب ماتشا \(طاقة هادئ, undefined, undefined, undefined, undefined, undefined, 1, 'units'\)', '🍵', 'Beverages', 'in_fridge', 0, 'Matcha Drink'\)/,
    "createDefaultItem('مشروب ماتشا (طاقة هادئ)', '🍵', 'Beverages', 'to_buy', 0, 'Matcha Drink', 2, 'cans')"
);

fs.writeFileSync(path, content);
console.log('Fixed parentheses parsing bugs');
