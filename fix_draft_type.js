import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /let newItemsDrafts = \$state<Record<string, \{ icon: string; name: string \}>>\(\{\}\);/g,
    "let newItemsDrafts = $state<Record<string, { icon: string; name: string; quantityAmount: number; quantityUnit: string }>>({});"
);

fs.writeFileSync(path, content);
console.log('Fixed newItemsDrafts type.');
