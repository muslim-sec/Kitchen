import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const oldActionsEnd = `	deleteHideTemplate(id: string) {
		db.hideTemplates = db.hideTemplates.filter((t) => t.id !== id);
	},
	applyHideTemplate(hiddenNames: string[]) {`;

const newActionsEnd = `	deleteHideTemplate(id: string) {
		db.hideTemplates = db.hideTemplates.filter((t) => t.id !== id);
	},
	updateHideTemplate(id: string, newHiddenNames: string[]) {
		const template = db.hideTemplates.find((t) => t.id === id);
		if (template) {
			template.hiddenNames = newHiddenNames;
		}
	},
	applyHideTemplate(hiddenNames: string[]) {`;

content = content.replace(oldActionsEnd, newActionsEnd);

fs.writeFileSync(path, content);
console.log('Added updateHideTemplate to store.');
