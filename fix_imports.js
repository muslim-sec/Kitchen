import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    "EyeOff,\n\t\t\tEye,\n\t\t\tTrash2",
    "EyeOff,\n\t\t\tEye,\n\t\t\tTrash2,\n\t\t\tRotateCcw"
);

fs.writeFileSync(path, content);
console.log('Fixed imports.');
