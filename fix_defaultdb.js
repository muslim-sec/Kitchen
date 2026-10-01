import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    "settings: { country: 'US' },",
    "settings: { country: 'US' },\n\thideTemplates: [] as HideTemplate[],"
);

fs.writeFileSync(path, content);
console.log('Added hideTemplates to defaultDb.');
