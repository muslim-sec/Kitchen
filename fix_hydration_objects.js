import fs from 'fs';
const path = 'src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const regex = /if \(browser\) \{[\s\S]*?export const db = \$state\(initialDb\);/m;

const newBlock = `if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				initialDb = { ...defaultDb, ...parsed };
				
				if (parsed.recipes) {
					const existingIds = new Set(parsed.recipes.map((r: any) => r.id));
					const missingDefaults = defaultDb.recipes.filter((r: any) => !existingIds.has(r.id));
					initialDb.recipes = [...parsed.recipes, ...missingDefaults];
				}
				
				if (parsed.tags) {
					// Migrate old string tags to object tags
					let normalizedTags = parsed.tags.map((t: any) => {
						if (typeof t === 'string') {
							const defaultTag = defaultDb.tags.find((dt: any) => dt.name === t);
							return defaultTag || { name: t, emoji: '🏷️', color: 'bg-gray-100 text-gray-700' };
						}
						return t;
					});
					
					const existingTagNames = new Set(normalizedTags.map((t: any) => t.name));
					const missingTags = defaultDb.tags.filter((t: any) => !existingTagNames.has(t.name));
					initialDb.tags = [...normalizedTags, ...missingTags];
				} else {
					initialDb.tags = defaultDb.tags;
				}

				if (!initialDb.settings) {
					initialDb.settings = { country: 'US' };
				}
			} catch (e) {
				console.error('Failed to parse stored DB', e);
			}
		}
	}
	
export const db = $state(initialDb);`;

content = content.replace(regex, newBlock);
fs.writeFileSync(path, content);
console.log('Hydration correctly fixed!');
