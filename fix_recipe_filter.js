import fs from 'fs';
const path = 'src/routes/recipes/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /recipe\.description\.toLowerCase\(\)\.includes/g,
    "(recipe.description || '').toLowerCase().includes"
);

fs.writeFileSync(path, content);
console.log('Fixed recipe filter safety');
