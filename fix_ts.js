import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("parsed.inventory.filter(i =>", "parsed.inventory.filter((i: any) =>");
content = content.replace("parsed.inventory.forEach(item =>", "parsed.inventory.forEach((item: any) =>");
content = content.replace("defaultDb.inventory.find(d =>", "defaultDb.inventory.find((d: any) =>");
content = content.replace("parsed.inventory.map(i =>", "parsed.inventory.map((i: any) =>");
content = content.replace("defaultDb.inventory.filter(i =>", "defaultDb.inventory.filter((i: any) =>");

fs.writeFileSync(path, content);
