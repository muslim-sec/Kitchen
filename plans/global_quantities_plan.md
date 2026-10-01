# Global Quantities & Units Plan

## Purpose
**Type:** 🚀 Feature Extension / UX Improvement
**Summary:** Introduce realistic default quantities and measurement units (kg, g, L, pieces) for all items in the global shopping list, reflecting a logical weekly/monthly shopping cycle.
**Context:** The current system hardcodes `1 unit` for every item in the `createDefaultItem` helper. This means "Tomatoes", "Olive Oil", and "Salt" all default to `1 unit`, which is frustrating for planning weekly vs. monthly shopping.
**Expected Outcome:** 
1. `createDefaultItem` is refactored to accept `quantityAmount` and `quantityUnit`.
2. All 50+ items in `defaultDb.inventory` are updated with realistic defaults (e.g., Tomatoes = 2 kg, Chicken = 1.5 kg, Spices = 100 g).
3. A migration script runs on app boot to update existing users' items to the new defaults *only if* they haven't manually changed them from `1 unit`.

## Proposed Changes (Detailed)

### [MODIFY] [/Users/mac/kitchen/src/lib/store.svelte.ts](file:///Users/mac/kitchen/src/lib/store.svelte.ts)

**1. Update `createDefaultItem` Signature:**
```typescript
function createDefaultItem(
	name: string,
	icon: string,
	category: Category,
	status: ItemStatus = 'to_buy',
	price: number = 0,
	englishName?: string,
	quantityAmount: number = 1,
	quantityUnit: string = 'units'
): MasterInventoryItem
```

**2. Update `defaultDb.inventory`:**
We will run a script to append the appropriate quantities based on categories and item names.
*Examples:*
- **Vegetables/Fruits:** `2, 'kg'` (Tomatoes, Potatoes, Onions, Apples, Oranges)
- **Leafy Greens/Herbs:** `1, 'bunch'` (Lettuce, Parsley, Coriander)
- **Proteins:** `1.5, 'kg'` (Chicken, Mince, Fish)
- **Pantry (Grains):** `1, 'kg'` (Rice, Pasta, Flour, Lentils)
- **Spices:** `100, 'g'` (Salt, Pepper, Cumin)
- **Canned Goods:** `3, 'cans'` (Tuna, Corn, Mushrooms)
- **Dairy:** `1, 'L'` (Milk, Almond Milk) or `500, 'g'` (Cheese, Butter)
- **Beverages:** `1, 'pack'` or `2, 'L'`
- **Condiments:** `1, 'bottle'` (Soy Sauce, Vinegar)

**3. Update Hydration Logic (Data Migration):**
We must upgrade the user's existing items. If an item is currently `1` and `'units'`, it means the user never modified it. We will overwrite it with the new realistic default.
```typescript
// 2. Sync existing user's items with new categories AND quantities
parsed.inventory.forEach(item => {
	const defaultItem = defaultDb.inventory.find(d => d.name === item.name || d.englishName === item.englishName);
	if (defaultItem) {
		item.category = defaultItem.category; // From previous plan
		
		// New: Upgrade legacy '1 units' to realistic defaults
		if (item.quantityAmount === 1 && item.quantityUnit === 'units') {
			item.quantityAmount = defaultItem.quantityAmount;
			item.quantityUnit = defaultItem.quantityUnit;
		}
	}
});
```

## Impact Analysis (Regression Risks)
- **Affected Features:** Shopping List and Consume Modal. Both rely on `quantityAmount` and `quantityUnit`.
- **Regression Risk:** Minimal. The fields already exist in the types. We are simply populating them with real data.

## Execution Recommendation
- **Environment:** Node.js script using Regex/AST replacement to bulk-update the 50+ function calls safely.

## 🔍 Review Notes (Adversarial Review)
- **Reviewer 1 (Frontend):** APPROVED. The UI already has inputs for quantities. Setting better defaults will make the "Consume" and "Add to Cart" modals much more logical.
- **Reviewer 2 (Data):** APPROVED. The migration script cleverly avoids overwriting user data if they already modified the quantity (e.g., if they set Tomatoes to `5 kg`, it stays `5 kg`).

## Verification Plan
- Run `npm run check` to ensure TypeScript signatures match.
