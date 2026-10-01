import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    "onclick={() => { cycleFilter = cycle; isCycleMenuOpen = false; }}",
    "onclick={() => { cycleFilter = cycle as 'all'|'weekly'|'biweekly'|'monthly'; isCycleMenuOpen = false; }}"
);

fs.writeFileSync(path, content);
console.log('Fixed cycle cast.');
