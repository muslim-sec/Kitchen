import fs from 'fs';
const content = fs.readFileSync('/Users/mac/kitchen/src/lib/store.svelte.ts', 'utf8');

const inventoryMatch = content.match(/const defaultDb = \{[\s\S]*?inventory:\s*\[([\s\S]*?)\] as MasterInventoryItem\[\],/);
if (!inventoryMatch) {
    console.log("Could not find inventory.");
    process.exit(1);
}

const inventoryText = inventoryMatch[1];
const items = [];
const lines = inventoryText.split('\n');

for (let line of lines) {
    if (line.includes('createDefaultItem')) {
        const match = line.match(/createDefaultItem\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'/);
        if (match) {
            items.push({ name: match[1], emoji: match[2], category: match[3] });
        }
    }
}

const categories = {};
for (let item of items) {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
}

let result = "";
for (let cat in categories) {
    result += `### ${cat}\n`;
    for (let item of categories[cat]) {
        result += `- ${item.emoji} ${item.name}\n`;
    }
    result += `\n`;
}

console.log(result);
