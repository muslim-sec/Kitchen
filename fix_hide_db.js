import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const oldActionsEnd = `	deleteItem(id: string) {
		db.inventory = db.inventory.filter((item) => item.id !== id);
	},`;

const newActionsEnd = `	deleteItem(id: string) {
		db.inventory = db.inventory.filter((item) => item.id !== id);
	},
	saveHideTemplate(name: string, hiddenNames: string[]) {
		db.hideTemplates.push({
			id: Math.random().toString(36).substr(2, 9),
			name,
			hiddenNames
		});
	},
	deleteHideTemplate(id: string) {
		db.hideTemplates = db.hideTemplates.filter((t) => t.id !== id);
	},
	applyHideTemplate(hiddenNames: string[]) {
		db.inventory.forEach(item => {
			if (hiddenNames.includes(item.name)) {
				item.isHidden = true;
			} else {
				item.isHidden = false;
			}
		});
	},
	unhideAll() {
		db.inventory.forEach(item => item.isHidden = false);
	},`;

content = content.replace(oldActionsEnd, newActionsEnd);

fs.writeFileSync(path, content);
console.log('Fixed DB actions.');
