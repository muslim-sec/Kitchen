import fs from 'fs';

const path = 'src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Tag type
const typeDefinition = `
export type Tag = {
	name: string;
	emoji: string;
	color: string;
};
`;

if (!content.includes('export type Tag =')) {
	content = content.replace("export type Recipe = {", typeDefinition + "\nexport type Recipe = {");
}

// 2. Change tags array in defaultDb
const oldTags = `tags: ['Breakfast', 'Lunch', 'Dinner', 'Sweets', 'Kitchen Items', 'High Protein', 'Chicken Food', 'Juice', 'Sweet / Pancakes'] as string[],`;
const newTags = `tags: [
		{ name: 'Breakfast', emoji: '🍳', color: 'bg-hearth-100 text-hearth-700' },
		{ name: 'Lunch', emoji: '🍱', color: 'bg-orange-100 text-paprika' },
		{ name: 'Dinner', emoji: '🍽️', color: 'bg-red-100 text-flame' },
		{ name: 'Sweets', emoji: '🍮', color: 'bg-pink-100 text-pink-700' },
		{ name: 'Kitchen Items', emoji: '🔪', color: 'bg-gray-100 text-gray-700' },
		{ name: 'High Protein', emoji: '💪', color: 'bg-green-100 text-basil' },
		{ name: 'Chicken Food', emoji: '🍗', color: 'bg-orange-100 text-paprika' },
		{ name: 'Juice', emoji: '🥤', color: 'bg-blue-100 text-blue-700' },
		{ name: 'Sweet / Pancakes', emoji: '🥞', color: 'bg-yellow-100 text-yellow-700' }
	] as Tag[],`;
content = content.replace(oldTags, newTags);

// 3. Update tagActions
const oldTagActions = `export const tagActions = {
	addTag(name: string) {
		const trimmed = name.trim();
		if (trimmed && !db.tags.includes(trimmed)) {
			db.tags.push(trimmed);
		}
	},
	deleteTag(name: string) {
		db.tags = db.tags.filter(t => t !== name);
		db.recipes.forEach(r => {
			r.tags = r.tags.filter(t => t !== name);
		});
	},
	renameTag(oldName: string, newName: string) {
		const trimmed = newName.trim();
		if (!trimmed || db.tags.includes(trimmed)) return;
		
		const idx = db.tags.indexOf(oldName);
		if (idx !== -1) {
			db.tags[idx] = trimmed;
		}
		
		db.recipes.forEach(r => {
			const rIdx = r.tags.indexOf(oldName);
			if (rIdx !== -1) {
				r.tags[rIdx] = trimmed;
			}
		});
	}
};`;

const newTagActions = `export const tagActions = {
	addTag(name: string, emoji: string = '🏷️', color: string = 'bg-gray-100 text-gray-700') {
		const trimmed = name.trim();
		if (trimmed && !db.tags.find(t => t.name === trimmed)) {
			db.tags.push({ name: trimmed, emoji, color });
		}
	},
	deleteTag(name: string) {
		db.tags = db.tags.filter(t => t.name !== name);
		db.recipes.forEach(r => {
			r.tags = r.tags.filter(t => t !== name);
		});
	},
	updateTag(oldName: string, newName: string, newEmoji: string, newColor: string) {
		const trimmed = newName.trim();
		if (!trimmed) return;
		
		// If trying to rename to an existing tag (that is not itself), abort
		if (trimmed !== oldName && db.tags.some(t => t.name === trimmed)) return;
		
		const idx = db.tags.findIndex(t => t.name === oldName);
		if (idx !== -1) {
			db.tags[idx] = { name: trimmed, emoji: newEmoji, color: newColor };
		}
		
		// If name changed, update recipes
		if (trimmed !== oldName) {
			db.recipes.forEach(r => {
				const rIdx = r.tags.indexOf(oldName);
				if (rIdx !== -1) {
					r.tags[rIdx] = trimmed;
				}
			});
		}
	}
};`;
content = content.replace(oldTagActions, newTagActions);

// 4. Fix Hydration
const oldHydrationLogic = `				if (parsed.tags) {
					const existingTags = new Set(parsed.tags);
					const missingTags = defaultDb.tags.filter(t => !existingTags.has(t));
					initialDb.tags = [...parsed.tags, ...missingTags];
				} else {
					initialDb.tags = defaultDb.tags;
				}`;

const newHydrationLogic = `				if (parsed.tags) {
					// Migrate old string tags to object tags
					let normalizedTags = parsed.tags.map(t => {
						if (typeof t === 'string') {
							const defaultTag = defaultDb.tags.find(dt => dt.name === t);
							return defaultTag || { name: t, emoji: '🏷️', color: 'bg-gray-100 text-gray-700' };
						}
						return t;
					});
					
					const existingTagNames = new Set(normalizedTags.map(t => t.name));
					const missingTags = defaultDb.tags.filter(t => !existingTagNames.has(t.name));
					initialDb.tags = [...normalizedTags, ...missingTags];
				} else {
					initialDb.tags = defaultDb.tags;
				}`;
content = content.replace(oldHydrationLogic, newHydrationLogic);

fs.writeFileSync(path, content);
console.log('Store updated with object tags');
