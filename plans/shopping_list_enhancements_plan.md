# Shopping List Enhancements Plan (Phase 1 & Phase 2)

## Purpose
**Type:** ✨ Feature Extension
**Summary:** We need to make the default quantity configurable directly in the Global Shopping List (Phase 1) and introduce a `shoppingCycle` property to separate weekly vs. monthly items (Phase 2).
**Context:** The user rightly pointed out that they cannot see or configure the default quantities in the Shopping List, and we haven't actually added the `shoppingCycle` logic yet.
**Expected Outcome:** 
- **Phase 1:** The Shopping List table will display the `quantityAmount` and `quantityUnit` so the user can see and configure the defaults immediately.
- **Phase 2:** Items will have a `shoppingCycle` property (`weekly`, `biweekly`, `monthly`), which will allow smart filtering when generating lists.

## Proposed Changes (Detailed)

### Phase 1: Show & Configure Quantity in Shopping List (Execute Now)
**Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- Add a new `Qty` column to the table header in the `shopping/+page.svelte` file (between "Item" and "Brand").
- Render two inputs in the `Qty` column:
  1. `<input type="number">` bound to `item.quantityAmount`.
  2. `<select>` bound to `item.quantityUnit` (options: kg, g, L, ml, cans, units, pcs, bunch, packs, jar, bottle, box, tube, loaves).
- Update the "Add new item" draft row to also include default quantity inputs.

### Phase 2: Add Shopping Cycle Logic (To Execute Later)
**Target File:** `/Users/mac/kitchen/src/lib/store.svelte.ts`
- Add `cycle: 'weekly' | 'biweekly' | 'monthly'` to the `MasterInventoryItem` type.
- Update `createDefaultItem` to accept `cycle`.
- Assign `weekly` to Vegetables, Fruits, Proteins, Dairy.
- Assign `monthly` to Pantry, Canned Goods, Condiments, Spices.
- Add UI tabs/filters in `shopping/+page.svelte`: "All", "Weekly Reset", "Monthly Restock".

## Impact Analysis (Regression Risks)
- **Phase 1:** Adding a column to the table might squish the mobile view. We will ensure the inputs are compact (e.g., `w-16` for number, `w-20` for unit).
- **Phase 2:** Modifying the data type requires another migration script to assign defaults to existing items without overriding user data.

## Execution Recommendation
- **Environment:** Edit `src/routes/shopping/+page.svelte` to inject the new column and input bindings for Phase 1.

## 🔍 Review Notes (Adversarial Review)
- **Reviewer 1 (Frontend):** APPROVED. A compact `Qty` column makes the Shopping List infinitely more actionable.
- **Reviewer 2 (Data):** APPROVED. Binding directly to `item.quantityAmount` means changes save immediately to local storage via Svelte 5 runes.

## Verification Plan
- Run `npm run check` to ensure Svelte compilation succeeds.
