import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /newItemsDrafts\[cat\] = \{ icon: '', name: '' \};/g,
    "newItemsDrafts[cat] = { icon: '', name: '', quantityAmount: 1, quantityUnit: 'units' };"
);

content = content.replace(
    /newItemsDrafts\[category\] = \{ icon: '', name: '' \};/g,
    "newItemsDrafts[category] = { icon: '', name: '', quantityAmount: 1, quantityUnit: 'units' };"
);

fs.writeFileSync(path, content);
console.log('Draft initializers fixed.');
