import fs from 'fs';

const path = 'src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('tags: [')) {
    content = content.replace(
        "customBrands: [] as CustomBrand[],",
        "customBrands: [] as CustomBrand[],\n\ttags: ['Breakfast', 'Lunch', 'Dinner', 'Sweets', 'Kitchen Items', 'High Protein', 'Chicken Food', 'Juice', 'Sweet / Pancakes'] as string[],"
    );
}

const tagActionsStr = `
export const tagActions = {
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
};
`;

if (!content.includes('export const tagActions')) {
    content += '\n' + tagActionsStr;
}

const newRecipesData = [
  { title: 'Avocado Toast', tags: ['Breakfast'] },
  { title: 'Eggs with Vegetables and Nuts', tags: ['Breakfast'] },
  { title: 'Avocado, Tomato, and Spinach Toast', tags: ['Breakfast'] },
  { title: 'Grilled Egg & Turkey Steak Sandwich', tags: ['Breakfast'] },
  { title: 'Oatmeal with Banana and Honey', tags: ['Breakfast'] },

  { title: 'Chicken Tajine', tags: ['Lunch'] },
  { title: 'Brown Rice with Tandoori Chicken', tags: ['Lunch'] },
  { title: 'Teriyaki Salmon Skewers with Coleslaw and White Rice', tags: ['Lunch'] },
  { title: 'Chicken with White Beans and Tomato Sauce', tags: ['Lunch'] },
  { title: 'Chicken with Broccolini, Egg, and Lemon-Mustard Sauce', tags: ['Lunch'] },
  { title: 'Green Goddess Salad with Grilled Chicken or Meat', tags: ['Lunch'] },
  { title: 'Homemade Chicken Shawarma with Roasted Potatoes and Yogurt Salad', tags: ['Lunch'] },
  { title: 'Chicken Breasts', tags: ['Lunch'] },

  { title: 'Chicken Soup', tags: ['Dinner'] },
  { title: 'Rice Pizza', tags: ['Dinner'] },
  { title: 'Northern Moroccan Bocadillo', tags: ['Dinner'] },
  { title: 'Fish with Peas, Cabbage, and Almond Milk', tags: ['Dinner'] },

  { title: 'Flan', tags: ['Sweets'] },
  { title: 'Granola Yogurt', tags: ['Sweets'] },
  { title: 'Mango Lassi', tags: ['Sweets'] },
  { title: 'Yogurt Fruit Bowls', tags: ['Sweets'] }
];

let recipesArrString = "";
newRecipesData.forEach((r, i) => {
    let id = "mock_" + Date.now() + "_" + i;
    recipesArrString += `
		{
			...createEmptyRecipe(),
			id: '${id}',
			title: '${r.title}',
			tags: ${JSON.stringify(r.tags)},
		},`;
});

content = content.replace("] as Recipe[]", recipesArrString + "\n\t] as Recipe[]");

fs.writeFileSync(path, content);
console.log('Store updated');
