import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// Find the Milk object and add the comma properly!
content = content.replace(/brandCountry:\s*'🌍'\s*\}/, "brandCountry: '🌍'\n\t\t\t},");
fs.writeFileSync(path, content);
console.log('Done fixing comma properly');
