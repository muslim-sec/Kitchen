import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    "RotateCcw",
    "RotateCcw,\n\t\t\tRefreshCw"
);

fs.writeFileSync(path, content);
console.log('Fixed RefreshCw import.');
