import fs from 'fs';
const path = 'src/routes/recipes/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /tagActions.renameTag\(tagEditState\.old, tagEditState\.new\)/g,
    "tagActions.renameTag(tagEditState!.old, tagEditState!.new)"
);
content = content.replace("autofocus\n\t\t\t\t\t\t\t\t/>", "/>");

fs.writeFileSync(path, content);
console.log('Fixed page ts errors');
