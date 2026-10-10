import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// Match the defaultDb inventory array
const match = content.match(/inventory: \[\s*([\s\S]*?)\s*\] as MasterInventoryItem\[\]/);
if (match) {
    const lines = match[1].split('\n');
    const categories = {};
    let total = 0;
    
    lines.forEach(line => {
        if (line.includes('createDefaultItem')) {
            // Extract the englishName or name
            // format: createDefaultItem('اسم', 'أيقونة', 'Category', ...
            const parts = line.match(/createDefaultItem\([^,]+,\s*'[^']+',\s*'([^']+)'/);
            if (parts && parts[1]) {
                const cat = parts[1];
                if (!categories[cat]) categories[cat] = 0;
                categories[cat]++;
                total++;
            }
        }
    });
    
    console.log("Total items:", total);
    console.log("By Category:");
    Object.keys(categories).forEach(cat => {
        console.log(`- ${cat}: ${categories[cat]}`);
    });
} else {
    console.log("Could not parse.");
}
