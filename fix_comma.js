import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// I will find the exact string and replace it
content = content.replace("brandCountry: '🌍'\n\t\t\t\t},\n\t\t\t}\n\t\t\n\t\t\t// --- Canned & Basics ---", "brandCountry: '🌍'\n\t\t\t},\n\t\t\t// --- Canned & Basics ---");
// If that failed, let's use a regex to be safe!
content = content.replace(/brandCountry:\s*'🌍'\s*\}\s*,?\s*\}\s*\/\/\s*---\s*Canned\s*\&\s*Basics\s*---/, "brandCountry: '🌍'\n\t\t\t},\n\n\t\t\t// --- Canned & Basics ---");
content = content.replace(/brandCountry:\s*'🌍'\s*\}\s*\/\/\s*---\s*Canned\s*\&\s*Basics\s*---/, "brandCountry: '🌍'\n\t\t\t},\n\n\t\t\t// --- Canned & Basics ---");


fs.writeFileSync(path, content);
console.log('Fixed comma');
