import fs from 'fs';
const path = 'src/lib/components/TagInput.svelte';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
	"db.tags.some((tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase())",
	"db.tags.some((tag: Tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase())"
);
content = content.replace(
	"selectedTags.some((tag) => tag.toLowerCase() === inputValue.trim().toLowerCase())",
	"selectedTags.some((tag: string) => tag.toLowerCase() === inputValue.trim().toLowerCase())"
);

fs.writeFileSync(path, content);
console.log('Fixed tag typing in TagInput');
