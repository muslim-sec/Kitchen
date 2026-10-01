// Open Food Facts API Service
import type { MasterInventoryItem } from './store.svelte';
import { translateText } from './translation';

export interface BrandResult {
	name: string;
	productName: string;
	nutriScore: string; // "a" | "b" | "c" | "d" | "e"
	novaGroup: number | null; // 1 | 2 | 3 | 4
	country: string; // "🇲🇦" or "🌍"
	imageUrl?: string;
}

const BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
const brandCache = new Map<string, BrandResult[]>();

/**
 * Search Open Food Facts for brands matching an item,
 * using English -> French translation fallback chain.
 */
export async function searchBrands(item: MasterInventoryItem): Promise<BrandResult[]> {
	const primarySearchName = item.englishName || item.name;
	const normalized = primarySearchName.trim().toLowerCase();

	if (!normalized) return [];

	if (brandCache.has(item.id)) {
		return brandCache.get(item.id)!;
	}

	async function fetchOFF(term: string): Promise<BrandResult[]> {
		const params = new URLSearchParams({
			search_terms: term,
			search_simple: '1',
			action: 'process',
			json: '1',
			page_size: '20',
			// Request specific fields only
			fields: 'brands,product_name,nutriscore_grade,nova_group,countries_tags,image_small_url'
		});

		try {
			const response = await fetch(`${BASE_URL}?${params.toString()}`);
			if (!response.ok) return [];

			const data = await response.json();
			if (!data.products || data.products.length === 0) return [];

			const seen = new Set<string>();
			const results: BrandResult[] = [];

			for (const product of data.products) {
				const brandName = product.brands?.trim();
				if (!brandName || seen.has(brandName.toLowerCase())) continue;
				seen.add(brandName.toLowerCase());

				const isMoroccan = product.countries_tags?.some(
					(c: string) => c === 'en:morocco' || c === 'fr:maroc'
				);

				results.push({
					name: brandName,
					productName: product.product_name || '',
					nutriScore: product.nutriscore_grade || '',
					novaGroup: product.nova_group || 0,
					country: isMoroccan ? '🇲🇦' : '🌍',
					imageUrl: product.image_small_url || undefined
				});
			}

			// Sort: Nutri-Score A first, then NOVA 1 first
			results.sort((a, b) => {
				const scoreOrder = { a: 0, b: 1, c: 2, d: 3, e: 4, '': 5 };
				const scoreA = scoreOrder[a.nutriScore as keyof typeof scoreOrder] ?? 5;
				const scoreB = scoreOrder[b.nutriScore as keyof typeof scoreOrder] ?? 5;
				if (scoreA !== scoreB) return scoreA - scoreB;
				return (a.novaGroup || 5) - (b.novaGroup || 5);
			});

			return results;
		} catch (error) {
			console.error('Open Food Facts search failed:', error);
			return [];
		}
	}

	// 1. Primary search (English)
	let results = await fetchOFF(normalized);

	// 2. Fallback search (French)
	if (results.length === 0) {
		const frenchTerm = await translateText(normalized, 'fr');
		if (frenchTerm && frenchTerm.toLowerCase() !== normalized) {
			results = await fetchOFF(frenchTerm);
		}
	}

	// Cache it against the item's ID so we don't translate/search again
	brandCache.set(item.id, results);
	return results;
}

/** Color helpers for Nutri-Score badges */
export function nutriScoreColor(score: string): string {
	switch (score?.toLowerCase()) {
		case 'a':
		case 'b':
			return 'bg-emerald-600 text-white';
		case 'c':
			return 'bg-yellow-400 text-black';
		case 'd':
		case 'e':
			return 'bg-red-600 text-white';
		default:
			return 'bg-gray-200 text-gray-500';
	}
}

/** Color helpers for NOVA group badges */
export function novaGroupColor(group: number | null): string {
	switch (group) {
		case 1:
		case 2:
			return 'bg-emerald-500 text-white';
		case 3:
			return 'bg-yellow-400 text-black';
		case 4:
			return 'bg-red-600 text-white';
		default:
			return 'bg-gray-200 text-gray-500';
	}
}
