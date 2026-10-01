# Fix Pricing Math & Display Totals Plan

## Purpose
**Type:** 🐛 Bug Fix & UI Enhancement
**Summary:** Fix the mathematics behind the Moroccan pricing simulation that resulted in inflated prices (e.g., 7500 MAD) due to gram (`g`) conversions, round to 2 decimals, and expose the category/global totals in all views.

## Proposed Changes (Detailed)

### Phase 1: Fix Pricing Mathematics
- **Target File:** `/Users/mac/kitchen/src/lib/store.svelte.ts`
- **Bug Cause:** Base prices for spices and nuts were defined per `kg` (e.g., 150 MAD), but the conversion to grams had a flawed conditional (`basePrice >= 40`), causing 100g of something to multiply directly by 150 (result: 15,000 MAD instead of 15 MAD).
- **Fix:** 
  1. Remove the flawed `basePrice >= 40` condition. If the unit is `g` or `ml`, and the base price is meant for `kg` or `L`, divide the base price by 1000 unconditionally.
  2. Round all prices strictly to 2 decimal places using `parseFloat(number.toFixed(2))`.
  3. Reset the `parsed.hasMoroccanPrices` flag in local storage to force a clean recalculation on next load.

### Phase 2: Show Global and Category Totals in All Views
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **Bug Cause:** The `<tfoot>` (category sum) and the Grand Total section were conditionally rendered *only* when `viewMode === 'to_buy'`. Since the user often checks prices in the "Global List" (`viewMode === 'all'`), they couldn't see the totals.
- **Fix:** 
  1. Remove `viewMode === 'to_buy' &&` from the `<tfoot>` condition so it renders in the Global List as well.
  2. Modify `toBuyTotal` to calculate the sum of whatever items are currently visible (based on `cycleFilter` and `viewMode`), or create a `visibleTotal` derived value.
  3. Ensure the Grand Total block is visible in all modes.

## Impact Analysis
- **Risks:** Forcing `parsed.hasMoroccanPrices = false` will overwrite any manual price edits the user made *since the last refresh*. Given it was just 5 minutes ago and the prices were wrong (7500), this data loss is acceptable and desired.
- **Benefits:** Accurate prices down to the cent, and immediate visibility of the budget.

## 🔍 Review Notes
- **Reviewer 1 (Data Math):** APPROVED. Always divide by 1000 for `g` and `ml` if the base price is modeled on `kg/L`. 
- **Reviewer 2 (UI):** APPROVED. Removing the `to_buy` strict check makes the app vastly more useful as a planning tool.
