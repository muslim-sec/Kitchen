# Moroccan Pricing & Dynamic Scaling Plan

## Purpose
**Type:** 📊 Data Personalization & Dynamic Logic
**Summary:** Gather realistic Moroccan Dirham (MAD) prices for inventory items, apply them locally to the user's account, and introduce **Dynamic Price Scaling** (so changing the quantity automatically updates the total price).

## Proposed Changes (Detailed)

### Phase 1: Data Gathering (Web Search / Estimations)
- Compile a JSON map of `itemName -> unitPrice` (Price per 1 unit of their default measurement).
- Example: 
  - `طماطم` (Tomato): default unit is `kg`. Price per 1 kg = ~8 MAD.
  - `زيت` (Oil): default unit is `L`. Price per 1 L = ~18 MAD.
  - `دجاج` (Chicken): default unit is `kg`. Price per 1 kg = ~22 MAD.

### Phase 2: Updating the Store & Hydration (Local Application)
- **Target File:** `/Users/mac/kitchen/src/lib/store.svelte.ts`
- Add `unitPrice?: number;` to `MasterInventoryItem`.
- Write a one-time hydration script that:
  1. Iterates over the user's `parsed.inventory`.
  2. Applies the Moroccan `unitPrice` to the item.
  3. Recalculates the current `price` based on `quantityAmount * unitPrice`.
  4. Flags `parsed.isMoroccanAccount = true` to prevent re-running.

### Phase 3: Dynamic UI Logic
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- Update the `quantityAmount` input in the Shopping List table to recalculate the price automatically:
```svelte
<input
	type="number"
	bind:value={item.quantityAmount}
	oninput={() => {
		if (item.unitPrice) {
			item.price = parseFloat((item.quantityAmount * item.unitPrice).toFixed(2));
		}
	}}
/>
```
- This satisfies the requirement: "if I control the unit or the quantity, the price must be changed", while still allowing the user to manually override the final price if they find a discount.

## Impact Analysis
- **Risks:** If the user changes the `quantityUnit` from `kg` to `g`, the math will be wrong (e.g., 500g * 8 MAD/kg = 4000 MAD!). 
- **Mitigation:** We will lock the unit conversion logic, or assume the `unitPrice` is strictly tied to the selected unit. If they change the unit, we might need a complex conversion, but for now, we will bind `unitPrice` to the *default* unit. To be safe, we will add an `onchange` to the `quantityUnit` select to warn or reset.

## 🔍 Review Notes
- **Reviewer 1 (Frontend):** APPROVED. The `oninput` handler on `bind:value` in Svelte 5 works perfectly for dependent reactive state without creating infinite loops.
- **Reviewer 2 (Data):** APPROVED. Storing `unitPrice` separately from `price` is the correct database normalization for this feature.
