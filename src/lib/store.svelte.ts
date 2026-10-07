export type ItemStatus = 'in_fridge' | 'to_buy' | 'purchased' | 'finished';
export type ShoppingCycle = 'weekly' | 'biweekly' | 'monthly' | 'all';
export type Category =
	'Vegetables' | 'Fruits' | 'Proteins' | 'Spices' | 'Supermarket' | 'Grains' | 'Pantry' | 'Canned Goods' | 'Snacks' | 'Breakfast' | 'Beverages' | 'Dairy' | 'Condiments';

export type BrandCountry = 'global' | 'morocco';
export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E';
export type NovaLevel = 1 | 2 | 3 | 4;

export type Tag = {
	name: string;
	emoji: string;
	color: string;
};

export type DayPlan = {
	day: string;
	breakfast: string | null;
	lunch: string | null;
	dinner: string | null;
};

export interface HideTemplate {
	id: string;
	name: string;
	hiddenNames: string[];
}

export interface RecipeIngredient {
	name: string;
	quantity: string;
	status: 'in_fridge' | 'to_buy';
}

export interface AdvancedStorage {
	container: string;
	location: string;
	temperature: string;
	duration: string;
	storageTip: string;
	fridgeTemp: string;
	fridgeDuration: string;
	freezerTemp: string;
	freezerDuration: string;
	weeklyTable: Array<{
		mealType: string;
		storageMethod: string;
		temperature: string;
		maxDuration: string;
		reheatMethod: string;
		extraNotes: string;
	}>;
	generalTips: string[];
	additionalNotes: string[];
}

export interface Recipe {
	id: string;
	title: string;
	image: string;
	videoUrl?: string; // e.g. embedded youtube url
	description: string;
	prepTime: string;
	cookTime: string;
	totalTime: string;
	servings: number;
	calories: number;
	protein: string;
	tags: string[];
	ingredients: RecipeIngredient[];
	steps: string[];
	storage: AdvancedStorage;
	nutrition: {
		macros: Array<{ name: string; value: string; color: string }>;
		micros: Array<{ name: string; value: string }>;
		aminoAcids: Array<{ name: string; value: string }>;
		fattyAcids: Array<{ name: string; value: string }>;
	};
}

export interface MasterInventoryItem {
	id: string;
	name: string;
	icon: string; // Separated emoji/icon
	category: Category;
	status: ItemStatus;
	price: number;
	brand?: string;
	brandCountry?: string; // e.g. "🇲🇦", "🌍"
	nutriScore?: string; // "a" | "b" | "c" | "d" | "e"
	novaGroup?: number; // 1 | 2 | 3 | 4
	englishName?: string;
	ecoAlternative?: string;
	notes?: string;
	quantity?: string; // Legacy string quantity
	quantityAmount?: number; // Exact float tracking
	quantityUnit?: string; // 'kg' | 'g' | 'L' | 'ml' | '%' | 'units'
	expiresIn?: string; // e.g. "3 days"
	isHidden?: boolean; // For Plan X exclusions
	cycle?: ShoppingCycle;
	unitPrice?: number;
}

export interface CustomBrand {
	name: string;
	country: string; // defaults to "🇲🇦"
}

// Helper to generate default items
export function getDefaultCycle(category: Category): ShoppingCycle {
	switch (category) {
		case 'Vegetables':
		case 'Fruits':
		case 'Proteins':
		case 'Dairy':
			return 'weekly';
		case 'Beverages':
		case 'Snacks':
		case 'Breakfast':
			return 'biweekly';
		case 'Spices':
		case 'Grains':
		case 'Pantry':
		case 'Canned Goods':
		case 'Condiments':
		case 'Supermarket':
			return 'monthly';
		default:
			return 'weekly';
	}
}

function createDefaultItem(
	name: string,
	icon: string,
	category: Category,
	status: ItemStatus = 'to_buy',
	price: number = 0,
	englishName?: string,
	quantityAmount: number = 1,
	quantityUnit: string = 'units',
	cycle?: ShoppingCycle
): MasterInventoryItem {
	return {
		id: Math.random().toString(36).substr(2, 9),
		name,
		icon,
		category,
		status,
		price,
		englishName,
		quantityAmount,
		quantityUnit,
		cycle: cycle || getDefaultCycle(category)
	};
}

export function createEmptyRecipe(): Recipe {
	return {
		id: Math.random().toString(36).substr(2, 9),
		title: 'New Recipe',
		image: '',
		videoUrl: '',
		description: '',
		prepTime: '',
		cookTime: '',
		totalTime: '',
		servings: 1,
		calories: 0,
		protein: '',
		tags: [],
		ingredients: [],
		steps: [],
		storage: {
			container: '',
			location: '',
			temperature: '',
			duration: '',
			storageTip: '',
			fridgeTemp: '',
			fridgeDuration: '',
			freezerTemp: '',
			freezerDuration: '',
			weeklyTable: [],
			generalTips: [],
			additionalNotes: []
		},
		nutrition: {
			macros: [
				{ name: 'Protein', value: '', color: 'bg-paprika' },
				{ name: 'Carbs', value: '', color: 'bg-hearth-500' },
				{ name: 'Healthy Fats', value: '', color: 'bg-flame' },
				{ name: 'Fiber', value: '', color: 'bg-basil' }
			],
			micros: [
				{ name: 'Vitamin C', value: '' },
				{ name: 'Potassium', value: '' }
			],
			aminoAcids: [{ name: 'Leucine', value: '' }],
			fattyAcids: [{ name: 'Omega-3', value: '' }]
		}
	};
}

import { browser } from '$app/environment';

// Global Application State (Simulating Supabase/PowerSync Database for MVP)
const STORAGE_KEY = 'kitchen-db-v1';

const defaultDb = {
	inventory: [
		// --- Vegetables ---
		createDefaultItem('طماطم', '🍅', 'Vegetables', 'in_fridge', 2.5, 'Tomato', 2, 'kg'),
		createDefaultItem('بطاطس', '🥔', 'Vegetables', 'in_fridge', 0, 'Potato', 2, 'kg'),
		createDefaultItem('خس', '🥬', 'Vegetables', 'in_fridge', 0, 'Lettuce', 1, 'bunch'),
		createDefaultItem('جزر', '🥕', 'Vegetables', 'in_fridge', 0, 'Carrot', 1, 'kg'),
		createDefaultItem('بصل', '🧅', 'Vegetables', 'in_fridge', 0, 'Onion', 1.5, 'kg'),
		createDefaultItem('ثوم', '🧄', 'Vegetables', 'in_fridge', 0, 'Garlic', 3, 'heads'),
		createDefaultItem('حامض', '🍋', 'Vegetables', 'in_fridge', 0, 'Lemon', 1, 'kg'),
		createDefaultItem('فلفل', '🫑', 'Vegetables', 'in_fridge', 0, 'Pepper', 1, 'kg'),
		createDefaultItem('خيار', '🥒', 'Vegetables', 'in_fridge', 0, 'Cucumber', 1, 'kg'),
		createDefaultItem('باذنجان', '🍆', 'Vegetables', 'in_fridge', 0, 'Eggplant', 1, 'kg'),
		createDefaultItem('قرع', '🎃', 'Vegetables', 'in_fridge', 0, 'Pumpkin', 1, 'kg'),

		// --- Fruits ---
		createDefaultItem('Apples', '🍎', 'Fruits', 'in_fridge', 0, 'Apples', 1.5, 'kg'),
		createDefaultItem('Bananas', '🍌', 'Fruits', 'in_fridge', 0, 'Bananas', 1.5, 'kg'),
		createDefaultItem('Avocados', '🥑', 'Fruits', 'in_fridge', 3.0, 'Avocados', 1, 'kg'),

		// --- Proteins ---
		createDefaultItem('دجاج', '🍗', 'Proteins', 'in_fridge', 8.5, 'Chicken', 1.5, 'kg'),
		createDefaultItem('Eggs', '🥚', 'Proteins', 'in_fridge', 0, 'Eggs', 30, 'pcs'),
		createDefaultItem('لحم مفروم', '🥩', 'Proteins', 'in_fridge', 0, 'Minced Meat', 1, 'kg'),
		createDefaultItem('نقانق', '🌭', 'Proteins', 'in_fridge', 0, 'Sausages', 1, 'packs'),
		createDefaultItem('كبدة', '🥩', 'Proteins', 'in_fridge', 0, 'Liver', 0.5, 'kg'),

		// --- Spices ---
		createDefaultItem('ملح', '🧂', 'Spices', 'in_fridge', 0, 'Salt', 500, 'g'),
		createDefaultItem('ابزار', '🧂', 'Spices', 'in_fridge', 0, 'Black Pepper', 100, 'g'),
		createDefaultItem('كامون', '🧂', 'Spices', 'in_fridge', 1.2, 'Cumin', 100, 'g'),
		createDefaultItem('خرقوم', '🧂', 'Spices', 'in_fridge', 0, 'Turmeric', 100, 'g'),
		createDefaultItem('تحميرة', '🧂', 'Spices', 'in_fridge', 0, 'Paprika', 100, 'g'),
		createDefaultItem('سكينجبير', '🫚', 'Spices', 'in_fridge', 0, 'Ginger', 100, 'g'),

		// --- Supermarket ---
		createDefaultItem('مكسرات', '🥜', 'Snacks', 'in_fridge', 0, 'Nuts', 250, 'g'),
		createDefaultItem('لوز', '🌰', 'Snacks', 'in_fridge', 0, 'Almonds', 250, 'g'),
		createDefaultItem('زبدة', '🧈', 'Dairy', 'in_fridge', 0, 'Butter', 500, 'g'),
		createDefaultItem('خل', '🧴', 'Condiments', 'in_fridge', 0, 'Vinegar', 1, 'L'),
		createDefaultItem('عدس', '🫘', 'Pantry', 'in_fridge', 0, 'Lentils', 1, 'kg'),
		createDefaultItem('صلصة طماطم', '🥫', 'Condiments', 'in_fridge', 0, 'Tomato Paste', 1, 'jar'),
		createDefaultItem('Cheese', '🧀', 'Dairy', 'in_fridge', 0, 'Cheese', 500, 'g'),
		createDefaultItem('ذرة', '🌽', 'Canned Goods', 'in_fridge', 0, 'Corn', 2, 'cans'),
		createDefaultItem('فطر طازج', '🍄', 'Vegetables', 'in_fridge', 0, 'Mushrooms', 2, 'cans'),
		createDefaultItem('قهوة', '☕', 'Beverages', 'in_fridge', 0, 'Coffee', 250, 'g'),
		{
			...createDefaultItem('زيت', '🫙', 'Pantry', 'in_fridge', 12.0, 'Oil', 5, 'L'),
			brand: 'Oued Souss',
			brandCountry: '🇲🇦'
		},
		createDefaultItem('طحين', '🌾', 'Pantry', 'in_fridge', 0, 'Flour', 5, 'kg'),
		createDefaultItem('Pasta', '🍝', 'Pantry', 'in_fridge', 0, 'Pasta', 1, 'kg'),
		createDefaultItem('سباغيتي', '🍝', 'Pantry', 'in_fridge', 0, 'Spaghetti', 1, 'packs'),
		createDefaultItem('مكرونة روتيني', '🍝', 'Pantry', 'in_fridge', 0, 'Rotini Pasta', 1, 'packs'),
		createDefaultItem('مكرونة تاغلياتيل', '🍝', 'Pantry', 'in_fridge', 0, 'Tagliatelle Pasta', 1, 'packs'),
		createDefaultItem('Rice', '🍚', 'Pantry', 'in_fridge', 0, 'Rice', 2, 'kg'),
		createDefaultItem('Chocolate', '🍫', 'Snacks', 'in_fridge', 0, 'Chocolate', 2, 'bars'),
		{
			...createDefaultItem('Milk', '🥛', 'Dairy', 'in_fridge', 0, 'Milk', 1, 'L'),
			brand: 'Juhayna',
			brandCountry: '🌍'
			},

			// --- Canned & Basics ---
		createDefaultItem('التونة المعلبة', '🐟', 'Canned Goods', 'in_fridge', 0, 'Canned Tuna', 3, 'cans'),
		createDefaultItem('الفاصوليا المعلبة', '🥫', 'Canned Goods', 'in_fridge', 0, 'Canned Beans', 2, 'cans'),
		createDefaultItem('الفطر المعلب', '🍄', 'Canned Goods', 'in_fridge', 0, 'Canned Mushrooms', 2, 'cans'),
		createDefaultItem('الحمص', '🧆', 'Canned Goods', 'in_fridge', 0, 'Chickpeas', 1, 'kg'),
		createDefaultItem('الكاشير / مرتديلا', '🥪', 'Proteins', 'in_fridge', 0, 'Cold Cuts', 500, 'g'),
		createDefaultItem('Cornichons', '🥒', 'Condiments', 'in_fridge', 0, 'Cornichons', 1, 'jar'),
		createDefaultItem('زيت الزيتون', '🫒', 'Condiments', 'in_fridge', 0, 'Olive Oil', 1, 'L'),
		createDefaultItem('الزيتون', '🫒', 'Condiments', 'in_fridge', 0, 'Olives', 500, 'g'),
		createDefaultItem('معجون الطماطم', '🥫', 'Condiments', 'in_fridge', 0, 'Tomato Paste', 1, 'jar'),
		createDefaultItem('صلصة بيضاء', '🥛', 'Condiments', 'in_fridge', 0, 'White Sauce', 2, 'packs'),

		// --- Breakfast & Spreads ---
		createDefaultItem('سيريلاك / حبوب الأطفال', '🥣', 'Breakfast', 'in_fridge', 0, 'Baby Cereal', 1, 'box'),
		createDefaultItem('حبوب الإفطار', '🥣', 'Breakfast', 'in_fridge', 0, 'Cereal', 1, 'box'),
		createDefaultItem('الشوفان', '🌾', 'Breakfast', 'in_fridge', 0, 'Oatmeal', 1, 'kg'),
		createDefaultItem('زبدة الفول السوداني', '🥜', 'Breakfast', 'in_fridge', 0, 'Peanut Butter', 1, 'jar'),
		createDefaultItem('العسل', '🍯', 'Breakfast', 'in_fridge', 0, 'Honey', 500, 'g'),
		createDefaultItem('المربى', '🍓', 'Breakfast', 'in_fridge', 0, 'Jam', 1, 'jar'),

		// --- Snacks & Drinks ---
		createDefaultItem('برينجلز', '🥔', 'Snacks', 'in_fridge', 0, 'Pringles', 1, 'tube'),
		createDefaultItem('ذرة الفشار', '🍿', 'Snacks', 'in_fridge', 0, 'Popcorn Kernels', 500, 'g'),
		createDefaultItem('فواكه مجففة / تمر', '🍇', 'Snacks', 'in_fridge', 0, 'Dried Fruits', 500, 'g'),
		createDefaultItem('كعك الأرز', '🍘', 'Snacks', 'in_fridge', 0, 'Rice Cakes', 1, 'pack'),
		createDefaultItem('الشوكولاتة الداكنة', '🍫', 'Snacks', 'in_fridge', 0, 'Dark Chocolate', 2, 'bars'),
		createDefaultItem('زبادي / دانون', '🥣', 'Dairy', 'in_fridge', 0, 'Yogurt', 4, 'cups'),
		createDefaultItem('مشروب طاقة للتركيز', '⚡', 'Beverages', 'in_fridge', 0, 'Energy Drink', 2, 'cans'),
		createDefaultItem('لويزة', '🌿', 'Beverages', 'in_fridge', 0, 'Lemon Verbena', 1, 'bunch'),
		createDefaultItem('زعتر', '🍃', 'Beverages', 'in_fridge', 0, 'Thyme', 1, 'bunch'),
		createDefaultItem('فليو', '🌱', 'Beverages', 'in_fridge', 0, 'Pennyroyal', 1, 'bunch'),
		createDefaultItem('ماتشا', '🍵', 'Beverages', 'in_fridge', 0, 'Matcha', 1, 'box'),
		
		createDefaultItem('بروكلي', '🥦', 'Vegetables', 'in_fridge', 0, 'Broccoli', 1, 'kg'),
		createDefaultItem('سبانخ', '🥬', 'Vegetables', 'in_fridge', 0, 'Spinach', 2, 'bunches'),
		createDefaultItem('بازلاء', '🫛', 'Vegetables', 'in_fridge', 0, 'Peas', 1, 'kg'),
		createDefaultItem('فلفل أحمر وأخضر', '🫑', 'Vegetables', 'in_fridge', 0, 'Bell Peppers', 1, 'kg'),
		createDefaultItem('بصل أخضر', '🌱', 'Vegetables', 'in_fridge', 0, 'Green Onion', 1, 'bunch'),
		createDefaultItem('بقدونس وكزبرة', '🌿', 'Vegetables', 'in_fridge', 0, 'Parsley & Coriander', 2, 'bunches'),
		createDefaultItem('ريحان', '🌿', 'Vegetables', 'in_fridge', 0, 'Basil', 1, 'bunch'),
		createDefaultItem('برتقال', '🍊', 'Fruits', 'in_fridge', 0, 'Orange', 2, 'kg'),
		createDefaultItem('فراولة', '🍓', 'Fruits', 'in_fridge', 0, 'Strawberry', 500, 'g'),
		createDefaultItem('سمك الصول', '🐟', 'Proteins', 'in_fridge', 0, 'Sole Fish', 1, 'kg'),
		createDefaultItem('كلماري / حبار', '🦑', 'Proteins', 'in_fridge', 0, 'Calamari', 1, 'kg'),
		createDefaultItem('سردين', '🐟', 'Proteins', 'in_fridge', 0, 'Sardines', 1, 'kg'),
		createDefaultItem('سالمون أو ماكريل', '🐟', 'Proteins', 'in_fridge', 0, 'Salmon/Mackerel', 1, 'kg'),
		createDefaultItem('جمبري', '🦐', 'Proteins', 'in_fridge', 0, 'Shrimp', 1, 'kg'),
		createDefaultItem('فيليه سمك أبيض', '🐟', 'Proteins', 'in_fridge', 0, 'White Fish Fillet', 1, 'kg'),
		createDefaultItem('فاصوليا بيضاء جافة', '🫘', 'Pantry', 'in_fridge', 0, 'Dry White Beans', 1, 'kg'),
		createDefaultItem('حمص جاف', '🧆', 'Pantry', 'in_fridge', 0, 'Dry Chickpeas', 1, 'kg'),
		createDefaultItem('فول', '🫘', 'Pantry', 'in_fridge', 0, 'Fava Beans', 1, 'kg'),
		createDefaultItem('عدس أحمر', '🥣', 'Pantry', 'in_fridge', 0, 'Red Lentils', 1, 'kg'),
		createDefaultItem('حليب جوز الهند', '🥥', 'Pantry', 'in_fridge', 0, 'Coconut Milk', 2, 'cans'),
		createDefaultItem('خبز حبوب كاملة', '🥖', 'Grains', 'in_fridge', 0, 'Whole Wheat Bread', 2, 'loaves'),
		createDefaultItem('طحين قمح كامل', '🌾', 'Grains', 'in_fridge', 0, 'Whole Wheat Flour', 2, 'kg'),
		createDefaultItem('أرز بني', '🍚', 'Grains', 'in_fridge', 0, 'Brown Rice', 1, 'kg'),
		createDefaultItem('سميد', '🫓', 'Grains', 'in_fridge', 0, 'Semolina', 1, 'kg'),
		createDefaultItem('زبادي يوناني', '🥣', 'Dairy', 'in_fridge', 0, 'Greek Yogurt', 4, 'cups'),
		createDefaultItem('حليب اللوز', '🥛', 'Dairy', 'in_fridge', 0, 'Almond Milk', 1, 'L'),
		createDefaultItem('جبن كيري', '🧀', 'Dairy', 'in_fridge', 0, 'Kiri Cheese', 1, 'box'),
		createDefaultItem('لاڤاش كيري', '🧀', 'Dairy', 'in_fridge', 0, 'La Vache Qui Rit', 1, 'box'),
		createDefaultItem('الفرماج الأحمر', '🧀', 'Dairy', 'in_fridge', 0, 'Red Cheese', 500, 'g'),
		createDefaultItem('خردل', '🥄', 'Condiments', 'in_fridge', 0, 'Dijon Mustard', 1, 'jar'),
		createDefaultItem('طحينة', '🥜', 'Condiments', 'in_fridge', 0, 'Tahini', 1, 'jar'),
		createDefaultItem('صويا صوص', '🍶', 'Condiments', 'in_fridge', 0, 'Soy Sauce', 1, 'bottle'),
		createDefaultItem('زعتر', '🌿', 'Spices', 'in_fridge', 0, 'Thyme', 100, 'g'),
		createDefaultItem('شطة / فلفل أحمر حار', '🌶️', 'Spices', 'in_fridge', 0, 'Chili Pepper', 100, 'g'),
		createDefaultItem('قرفة', '🪵', 'Spices', 'in_fridge', 0, 'Cinnamon', 100, 'g'),
		createDefaultItem('مياه معدنية', '💧', 'Beverages', 'in_fridge', 0, 'Mineral Water', 6, 'L'),
		createDefaultItem('عصير برتقال معلب', '🧃', 'Beverages', 'in_fridge', 0, 'Orange Juice', 1, 'L'),
		createDefaultItem('Celsius (طاقة صحي)', '⚡', 'Beverages', 'to_buy', 0, 'Celsius Energy', 2, 'cans'),
		createDefaultItem('مشروب ماتشا (طاقة هادئ)', '🍵', 'Beverages', 'to_buy', 0, 'Matcha Drink', 2, 'cans'),
		] as MasterInventoryItem[],
	customBrands: [] as CustomBrand[],
	tags: [
		{ name: 'Breakfast', emoji: '🍳', color: 'bg-hearth-100 text-hearth-700' },
		{ name: 'Lunch', emoji: '🍱', color: 'bg-orange-100 text-paprika' },
		{ name: 'Dinner', emoji: '🍽️', color: 'bg-red-100 text-flame' },
		{ name: 'Sweets', emoji: '🍮', color: 'bg-pink-100 text-pink-700' },
		{ name: 'Kitchen Items', emoji: '🔪', color: 'bg-gray-100 text-gray-700' },
		{ name: 'High Protein', emoji: '💪', color: 'bg-green-100 text-basil' },
		{ name: 'Chicken Food', emoji: '🍗', color: 'bg-orange-100 text-paprika' },
		{ name: 'Juice', emoji: '🥤', color: 'bg-blue-100 text-blue-700' },
		{ name: 'Sweet / Pancakes', emoji: '🥞', color: 'bg-yellow-100 text-yellow-700' }
	] as Tag[],
	settings: { country: 'US' },
	hideTemplates: [] as HideTemplate[],
	weeklyPlan: [
		{ day: 'Monday', breakfast: null, lunch: null, dinner: null },
		{ day: 'Tuesday', breakfast: null, lunch: null, dinner: null },
		{ day: 'Wednesday', breakfast: null, lunch: null, dinner: null },
		{ day: 'Thursday', breakfast: null, lunch: null, dinner: null },
		{ day: 'Friday', breakfast: null, lunch: null, dinner: null },
		{ day: 'Saturday', breakfast: null, lunch: null, dinner: null },
		{ day: 'Sunday', breakfast: null, lunch: null, dinner: null }
	] as DayPlan[],
	recipes: [
		{
			...createEmptyRecipe(),
			id: '1',
			title: 'Eggs with Veggies & Nuts',
			image:
				'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&q=80&w=800',
			videoUrl: '',
			description:
				'A vegetarian breakfast rich in healthy fats and proteins. Perfect to kickstart your day.',
			prepTime: '5 mins',
			cookTime: '5 mins',
			totalTime: '10 mins',
			servings: 1,
			calories: 295,
			protein: '17g',
			tags: ['Breakfast', 'High Protein', 'Kitchen Items'],
			ingredients: [
				{ name: 'Eggs', quantity: '3 large', status: 'in_fridge' },
				{ name: 'Spinach', quantity: '1 handful', status: 'to_buy' },
				{ name: 'Nuts', quantity: '1 tbsp', status: 'in_fridge' }
			],
			steps: [
				'Whisk the eggs in a bowl.',
				'Sauté spinach lightly in a pan.',
				'Pour eggs over spinach and scramble.',
				'Top with crushed nuts before serving.'
			],
			storage: {
				container: 'Glass or safe plastic',
				location: 'Fridge',
				temperature: '4°C',
				duration: 'Up to 3 Days',
				storageTip: 'Reheat in microwave or gently on stove so eggs do not dry out',
				fridgeTemp: '4°C',
				fridgeDuration: '3 Days',
				freezerTemp: 'Not Recommended',
				freezerDuration: 'Freezing cooked eggs is not preferred',
				weeklyTable: [
					{
						mealType: '🍳 Eggs with Veggies',
						storageMethod: 'Fridge',
						temperature: '4°C',
						maxDuration: '3 Days',
						reheatMethod: 'Microwave 1-2 mins',
						extraNotes: 'Add a splash of water before reheating'
					},
					{
						mealType: '🥜 Nuts',
						storageMethod: 'Room Temp',
						temperature: 'Room Temp',
						maxDuration: '5-7 Days',
						reheatMethod: 'No need to reheat',
						extraNotes: 'Store in a closed container away from light'
					}
				],
				generalTips: [
					'Do not reheat eggs more than once.',
					'Add nuts only before serving to keep them crunchy.',
					'You can double the batch for meal prep.'
				],
				additionalNotes: [
					'Add low-fat cheese to increase protein and calcium.',
					'Substitute peppers with mushrooms or onions for different flavor.'
				]
			},
			nutrition: {
				macros: [
					{ name: 'Protein', value: '17g', color: 'bg-paprika' },
					{ name: 'Carbs', value: '5g', color: 'bg-hearth-500' },
					{ name: 'Healthy Fats', value: '20g', color: 'bg-flame' },
					{ name: 'Fiber', value: '3g', color: 'bg-basil' }
				],
				micros: [
					{ name: 'Vitamin C', value: '15 mg' },
					{ name: 'Potassium', value: '450 mg' },
					{ name: 'Iron', value: '1.2 mg' }
				],
				aminoAcids: [
					{ name: 'Leucine', value: '1.4g' },
					{ name: 'Lysine', value: '1.1g' }
				],
				fattyAcids: [
					{ name: 'Omega-3', value: '0.2g' },
					{ name: 'Omega-6', value: '2.5g' }
				]
			}
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_0',
			title: 'Avocado Toast',
			tags: ["Breakfast"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_1',
			title: 'Eggs with Vegetables and Nuts',
			tags: ["Breakfast"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_2',
			title: 'Avocado, Tomato, and Spinach Toast',
			tags: ["Breakfast"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_3',
			title: 'Grilled Egg & Turkey Steak Sandwich',
			tags: ["Breakfast"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_4',
			title: 'Oatmeal with Banana and Honey',
			tags: ["Breakfast"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_5',
			title: 'Chicken Tajine',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_6',
			title: 'Brown Rice with Tandoori Chicken',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_7',
			title: 'Teriyaki Salmon Skewers with Coleslaw and White Rice',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_8',
			title: 'Chicken with White Beans and Tomato Sauce',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_9',
			title: 'Chicken with Broccolini, Egg, and Lemon-Mustard Sauce',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_10',
			title: 'Green Goddess Salad with Grilled Chicken or Meat',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_11',
			title: 'Homemade Chicken Shawarma with Roasted Potatoes and Yogurt Salad',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_12',
			title: 'Chicken Breasts',
			tags: ["Lunch"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_13',
			title: 'Chicken Soup',
			tags: ["Dinner"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_14',
			title: 'Rice Pizza',
			tags: ["Dinner"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_15',
			title: 'Northern Moroccan Bocadillo',
			tags: ["Dinner"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_16',
			title: 'Fish with Peas, Cabbage, and Almond Milk',
			tags: ["Dinner"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_17',
			title: 'Flan',
			tags: ["Sweets"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_18',
			title: 'Granola Yogurt',
			tags: ["Sweets"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_19',
			title: 'Mango Lassi',
			tags: ["Sweets"],
		},
		{
			...createEmptyRecipe(),
			id: 'mock_1787485277566_20',
			title: 'Yogurt Fruit Bowls',
			tags: ["Sweets"],
		},
	] as Recipe[]
};

// Override with localStorage if it exists
let initialDb = defaultDb;
if (browser) {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				
				// Run inventory migration for quantities
				if (parsed.inventory) {
					parsed.inventory.forEach((item: any) => {
						if (item.quantityAmount === undefined) {
							item.quantityAmount = 1;
							item.quantityUnit = 'units';
						}
					});
				}

				initialDb = { ...defaultDb, ...parsed };
					if (!(parsed as any).hasFixedMoroccanPrices_v2) (initialDb as any).hasFixedMoroccanPrices_v2 = true;
					
					// Inject default Economic Mode if hideTemplates doesn't exist or is empty
					// Force Restore Eco Mode to 12 items (User accidentally wiped it)
					if (parsed.hideTemplates) {
						const eco = parsed.hideTemplates.find((t: any) => t.id === 'eco-mode');
						if (eco && (!eco.hiddenNames || eco.hiddenNames.length < 5)) { // Force if less than 5 items
							eco.hiddenNames = ['سالمون أو ماكريل', 'جمبري', 'حليب اللوز', 'Celsius (طاقة صحي)', 'مشروب ماتشا (طاقة هادئ)', 'مكسرات', 'لوز', 'زبدة الفول السوداني', 'الشوكولاتة الداكنة', 'برينجلز', 'كعك الأرز', 'سمك الصول'];
						}
					}
					
					if (!parsed.hideTemplates || parsed.hideTemplates.length === 0) {
						initialDb.hideTemplates = [{
							id: 'eco-mode',
							name: '💰 Economic Mode',
							hiddenNames: [
								'سالمون أو ماكريل', 'جمبري', 'حليب اللوز', 'Celsius (طاقة صحي)', 'مشروب ماتشا (طاقة هادئ)', 'مكسرات', 'لوز', 'زبدة الفول السوداني', 'الشوكولاتة الداكنة', 'برينجلز', 'كعك الأرز', 'سمك الصول'
							]
						}];
					}
					
					if (parsed.inventory) {
						// 1. Remove duplicate 'خيار مخلل'
						parsed.inventory = parsed.inventory.filter((i: any) => i.name !== 'خيار مخلل');
						
						// 2. Sync existing user's items with new categories AND upgrade quantities
						parsed.inventory.forEach((item: any) => {
							const defaultItem = defaultDb.inventory.find((d: any) => d.name === item.name || d.englishName === item.englishName);
							if (defaultItem) {
								item.category = defaultItem.category;
								
								// Upgrade legacy '1 units' to realistic defaults
								if (item.quantityAmount === 1 && item.quantityUnit === 'units') {
									item.quantityAmount = defaultItem.quantityAmount;
									item.quantityUnit = defaultItem.quantityUnit;
								}
								
								if (!item.cycle) {
									item.cycle = defaultItem.cycle || getDefaultCycle(item.category);
								}
							}
						});

						// 3. Moroccan Pricing Simulation (One-time injection for local account - V2 FIX)
						if (!(parsed as any).hasFixedMoroccanPrices_v2) {
							const moroccanUnitPrices: Record<string, number> = {
								'طماطم': 8, 'بطاطس': 6, 'بصل': 6, 'جزر': 6, 'خيار': 7, 'فلفل أحمر وأخضر': 12, 'فلفل': 12, 'باذنجان': 8, 'قرع': 10, 'ثوم': 30 /*per kg, or 10 per head*/,
								'خس': 2, 'بصل أخضر': 2, 'بقدونس وكزبرة': 2, 'ريحان': 3, 'سبانخ': 3,
								'بروكلي': 15, 'بازلاء': 12,
								'برتقال': 10, 'حامض': 10, 'Apples': 15, 'Bananas': 12, 'Avocados': 35, 'فراولة': 40 /* per kg */,
								'دجاج': 22, 'لحم مفروم': 90, 'كبدة': 80, 'Eggs': 1.2, /* 1.2 per piece */
								'الكاشير / مرتديلا': 60, /* per kg */
								'سمك الصول': 60, 'كلماري / حبار': 70, 'سردين': 15, 'سالمون أو ماكريل': 150, 'جمبري': 90, 'فيليه سمك أبيض': 80,
								'فاصوليا بيضاء جافة': 20, 'حمص جاف': 20, 'فول': 15, 'عدس': 18, 'عدس أحمر': 22,
								'طحين': 5, 'طحين قمح كامل': 7, 'سميد': 12, 'Pasta': 15, 'Rice': 16, 'أرز بني': 25, 'خبز حبوب كاملة': 3,
								'زيت': 18, 'زيت الزيتون': 90, 'حليب جوز الهند': 25,
								'Milk': 4, 'حليب اللوز': 30, 'زبادي يوناني': 20 /*per pack*/, 'زبدة': 80 /*per kg*/, 
								'Cheese': 80, 'الفرماج الأحمر': 80, 'جبن كيري': 15, 'لاڤاش كيري': 15,
								'التونة المعلبة': 12, 'الفاصوليا المعلبة': 12, 'الفطر المعلب': 15, 'ذرة': 12,
								'خل': 10, 'صلصة طماطم': 15, 'معجون الطماطم': 10, 'Cornichons': 20, 'الزيتون': 40 /*per kg*/,
								'صلصة بيضاء': 15, 'خردل': 15, 'طحينة': 30, 'صويا صوص': 25,
								'ملح': 5 /*per kg*/, 'ابزار': 150 /*per kg*/, 'كامون': 120, 'خرقوم': 100, 'تحميرة': 100, 'سكينجبير': 120, 'زعتر': 80, 'شطة / فلفل أحمر حار': 100, 'قرفة': 120,
								'مكسرات': 150 /*per kg*/, 'لوز': 120, 'فواكه مجففة / تمر': 40, 'زبدة الفول السوداني': 45, 'العسل': 80, 'المربى': 15,
								'Chocolate': 15, 'الشوكولاتة الداكنة': 20, 'برينجلز': 30, 'ذرة الفشار': 15, 'كعك الأرز': 25,
								'سيريلاك / حبوب الأطفال': 35, 'حبوب الإفطار': 35, 'الشوفان': 25,
								'قهوة': 100 /*per kg*/, 'مياه معدنية': 2 /*per L*/, 'عصير برتقال معلب': 12, 'Celsius (طاقة صحي)': 25, 'مشروب ماتشا (طاقة هادئ)': 35,
								'لويزة': 3, 'زعتر': 3, 'فليو': 3, 'ماتشا': 90
							};

							// Normalize units internally for calculation (assuming default DB units)
							// If unit is kg, price is per kg. If g, price is per g (so we divide by 1000). 
							// If cans/packs, price is per item.
							parsed.inventory.forEach((item: any) => {
								let basePrice = moroccanUnitPrices[item.name] || moroccanUnitPrices[item.englishName];
								if (basePrice) {
									// Adjust basePrice if the unit is 'g' (since basePrice is listed per kg above for many items)
									if (item.quantityUnit === 'g' || item.quantityUnit === 'ml') {
										basePrice = basePrice / 1000;
									}
									item.unitPrice = parseFloat(basePrice.toFixed(2));
									item.price = parseFloat((item.quantityAmount * basePrice).toFixed(2));
								}
							});
							(parsed as any).hasFixedMoroccanPrices_v2 = true;
						}
						
						// 3. Add any missing new items to the user's inventory
						const existingItemNames = new Set(parsed.inventory.map((i: any) => i.name));
						const missingInventory = defaultDb.inventory.filter((i: any) => !existingItemNames.has(i.name));
						initialDb.inventory = [...parsed.inventory, ...missingInventory];
						if (!(parsed as any).hasAddedDrinkPrices_v3) {
							const newPrices: Record<string, number> = { 'لويزة': 3, 'زعتر': 3, 'فليو': 3, 'ماتشا': 90 };
							initialDb.inventory.forEach((item: any) => {
								if (newPrices[item.name]) {
									let basePrice = newPrices[item.name];
									if (item.quantityUnit === 'g' || item.quantityUnit === 'ml') {
										basePrice = basePrice / 1000;
									}
									item.unitPrice = parseFloat(basePrice.toFixed(2));
									item.price = parseFloat((item.quantityAmount * basePrice).toFixed(2));
								}
							});
							(parsed as any).hasAddedDrinkPrices_v3 = true;
						}

					}
				
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
	
export const db = $state(initialDb);

// Subscribe to changes and save to local storage
if (browser) {
	$effect.root(() => {
		$effect(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify($state.snapshot(db)));
		});
	});
}

export const inventoryActions = {
	updateStatus(id: string, newStatus: ItemStatus) {
		const item = db.inventory.find((i) => i.id === id);
		if (!item) return;

		// The Magic State Transitions
		if (newStatus === 'finished') {
			item.status = 'to_buy';
			item.quantity = '';
			item.quantityAmount = 0;
		} else if (newStatus === 'purchased') {
			item.status = 'in_fridge';
			// Mocking newly purchased fresh quantity
			item.quantity = '1 unit';
			item.quantityAmount = item.quantityAmount || 1;
			item.quantityUnit = item.quantityUnit || 'units';
			item.expiresIn = '7 days';
		} else {
			item.status = newStatus;
		}
	},

	updateQuantity(id: string, amount: number, unit?: string) {
		const item = db.inventory.find((i) => i.id === id);
		if (!item) return;
		item.quantityAmount = Math.max(0, amount);
		if (unit) item.quantityUnit = unit;
	},

	consumePartial(id: string, deductedAmount: number) {
		const item = db.inventory.find((i) => i.id === id);
		if (!item) return;

		const currentAmount = item.quantityAmount || 0;
		const newAmount = currentAmount - deductedAmount;
		
		if (newAmount <= 0) {
			this.updateStatus(id, 'finished');
		} else {
			item.quantityAmount = newAmount;
		}
	},

	addItem(item: Omit<MasterInventoryItem, 'id' | 'status'>, status: ItemStatus = 'to_buy') {
		db.inventory.push({
			...item,
			id: Math.random().toString(36).substr(2, 9),
			status,
			quantityAmount: item.quantityAmount ?? 1,
			quantityUnit: item.quantityUnit ?? 'units'
		});
	},

	deleteItem(id: string) {
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
	updateHideTemplate(id: string, newHiddenNames: string[]) {
		const template = db.hideTemplates.find((t) => t.id === id);
		if (template) {
			template.hiddenNames = newHiddenNames;
		}
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
	},

	toggleHidden(id: string) {
		const item = db.inventory.find((i) => i.id === id);
		if (item) {
			item.isHidden = !item.isHidden;
		}
	},

	setBrand(
		itemId: string,
		brand: string,
		country: string,
		nutriScore?: string,
		novaGroup?: number
	) {
		const item = db.inventory.find((i) => i.id === itemId);
		if (!item) return;
		item.brand = brand;
		item.brandCountry = country;
		item.nutriScore = nutriScore;
		item.novaGroup = novaGroup;
	},

	addCustomBrand(name: string, country: string = '🇲🇦') {
		if (db.customBrands.some((b) => b.name.toLowerCase() === name.toLowerCase())) return;
		db.customBrands.push({ name, country });
	}
};

export const plannerActions = {
	setRecipeForMeal(day: string, meal: 'breakfast' | 'lunch' | 'dinner', recipeId: string | null) {
		const targetDay = db.weeklyPlan.find((p) => p.day === day);
		if (targetDay) {
			targetDay[meal] = recipeId;
		}
	}
};

export const recipeActions = {
	addRecipe(newRecipe: Recipe) {
		db.recipes.push(newRecipe);
	},
	updateRecipe(id: string, updatedRecipe: Partial<Recipe>) {
		const index = db.recipes.findIndex((r) => r.id === id);
		if (index !== -1) {
			db.recipes[index] = { ...db.recipes[index], ...updatedRecipe };
		}
	}
};


export const tagActions = {
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
};
