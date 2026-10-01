import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /<button class="opacity-0 transition-opacity group-hover:opacity-100 hover:text-flame" onclick=\{\(e\) => \{ e.stopPropagation\(\); inventoryActions.deleteHideTemplate\(template.id\); \}\}>/g,
    "<div role=\"button\" tabindex=\"0\" class=\"opacity-0 transition-opacity group-hover:opacity-100 hover:text-flame\" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); }} onkeydown={(e) => { if (e.key === 'Enter') inventoryActions.deleteHideTemplate(template.id); }}>"
);

content = content.replace(
    /<\/button>\n\t\t\t\t\t\t\t\t\t\{\/if\}\n\t\t\t\t\t\t\t\t<\/button>/g,
    "</div>\n\t\t\t\t\t\t\t\t\t{/if}\n\t\t\t\t\t\t\t\t</button>"
);

fs.writeFileSync(path, content);
console.log('Fixed HTML warning.');
