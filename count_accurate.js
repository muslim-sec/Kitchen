import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
const content = fs.readFileSync(path, 'utf8');

// Match everything inside defaultDb.inventory
const match = content.match(/inventory:\s*\[([\s\S]*?)\]\s*as/);
if (match) {
    const inventoryText = match[1];
    // Find all createDefaultItem calls
    const items = [...inventoryText.matchAll(/createDefaultItem\(\s*'([^']+)',\s*'[^']+',\s*'([^']+)'/g)];
    const categories = {};
    let total = 0;
    
    items.forEach(item => {
        const cat = item[2];
        if (!categories[cat]) categories[cat] = 0;
        categories[cat]++;
        total++;
    });
    
    console.log("Total items:", total);
    Object.keys(categories).forEach(cat => {
        console.log(`- ${cat}: ${categories[cat]}`);
    });
}
