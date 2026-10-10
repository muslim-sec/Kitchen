import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const match = content.match(/inventory: \[\s*([\s\S]*?)\s*\] as MasterInventoryItem\[\]/);
if (match) {
    const lines = match[1].split('\n');
    const db = {};
    
    lines.forEach(line => {
        if (line.includes('createDefaultItem')) {
            const parts = line.match(/createDefaultItem\('([^']+)',\s*'[^']+',\s*'([^']+)',[^,]+,[^,]+,\s*'([^']+)'/);
            if (parts) {
                const nameAr = parts[1];
                const cat = parts[2];
                const nameEn = parts[3];
                if (!db[cat]) db[cat] = [];
                db[cat].push(`${nameEn} (${nameAr})`);
            }
        }
    });
    
    Object.keys(db).forEach(cat => {
        console.log(`\n### ${cat} (${db[cat].length} items):`);
        console.log(db[cat].join(', '));
    });
}
