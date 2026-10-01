import fs from 'fs';
const path = 'src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const tagType = `export type Tag = {
	name: string;
	emoji: string;
	color: string;
};\n\n`;

if (!content.includes('export type Tag')) {
	content = content.replace("export type DayPlan = {", tagType + "export type DayPlan = {");
}
fs.writeFileSync(path, content);
console.log('Fixed Tag type');
