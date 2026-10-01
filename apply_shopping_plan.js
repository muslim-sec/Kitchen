import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

const oldCategories = `	const categories: Category[] = [
		'Vegetables',
		'Fruits',
		'Proteins',
		'Spices',
		'Supermarket',
		'Grains',
		'Pantry'
	];`;
const newCategories = `	const categories: Category[] = [
		'Vegetables',
		'Fruits',
		'Proteins',
		'Dairy',
		'Breakfast',
		'Snacks',
		'Beverages',
		'Canned Goods',
		'Condiments',
		'Pantry',
		'Grains',
		'Spices',
		'Supermarket'
	];`;

const oldEmojis = `	const categoryEmojis: Record<Category, string> = {
		Vegetables: '🥦',
		Fruits: '🍎',
		Proteins: '🍗',
		Spices: '🌶️',
		Supermarket: '🛍️',
		Grains: '🌾',
		Pantry: '🥫'
	};`;
const newEmojis = `	const categoryEmojis: Record<Category, string> = {
		Vegetables: '🥦',
		Fruits: '🍎',
		Proteins: '🍗',
		Dairy: '🧀',
		Breakfast: '🥣',
		Snacks: '🍪',
		Beverages: '🧃',
		'Canned Goods': '🥫',
		Condiments: '🧂',
		Pantry: '📦',
		Grains: '🌾',
		Spices: '🌶️',
		Supermarket: '🛍️'
	};`;

content = content.replace(oldCategories, newCategories);
content = content.replace(oldEmojis, newEmojis);

fs.writeFileSync(path, content);
console.log('Shopping updated');
