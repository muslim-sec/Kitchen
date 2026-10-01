# Implementation Plan: Item Variants

## 1. Purpose

**Type:** ✨ New Feature
**Summary:** Add "Sub-items" (Variants) capability to the inventory and shopping list.
**Context:** Users want to group flavors or types of an item (e.g., Yogurt: Chocolate, Vanilla) under a single parent item rather than creating separate main items.
**Expected Outcome:** Users can add, edit, and manage sub-items (variants) beneath a main item. Variants will have their own quantities, status, and prices, and will be displayed indented beneath the parent in the shopping list.

---

## 2. Tech Stack & Constraints

- **Framework:** Svelte 5 (Runes `$state`, `$derived`)
- **Styling:** Tailwind CSS
- **State Management:** Svelte 5 Custom Store (`$lib/store.svelte.ts`)
- **Constraints:**
  - Limit the nesting to 1 level deep (Parent -> Variant) to maintain UI simplicity.
  - The sum of variant prices must be aggregated to the parent item.
  - Do not use any external dependencies.

---

## 3. Proposed Changes

### 3.1 Store Schema & Logic

#### [MODIFY] [store.svelte.ts](file:///Users/mac/kitchen/src/lib/store.svelte.ts)

**What changes:**
1. **Schema Update:** Define `ItemVariant` interface.
   ```typescript
   export interface ItemVariant {
       id: string;
       name: string;
       status: ItemStatus;
       quantityAmount: number;
       quantityUnit: string;
       price: number;
   }
   ```
2. **MasterInventoryItem:** Add `variants?: ItemVariant[];`
3. **Migration:** Update the local storage parsing logic around line 620 to ensure all existing items receive `variants: []`.
4. **Actions (inventoryActions):**
   - `addVariant(parentId: string, variant: Omit<ItemVariant, 'id' | 'status'>)`
   - `deleteVariant(parentId: string, variantId: string)`
   - `updateVariantStatus(parentId: string, variantId: string, status: ItemStatus)`
   - Modify `updateStatus(id, newStatus)`: If the ID belongs to a parent item that has variants, it should cascade the new status to all its variants.

**Why:**
- Nested variants within the parent item model keep the state localized and easy to render in a single pass, matching Svelte 5's reactivity patterns perfectly.

### 3.2 Shopping List UI

#### [MODIFY] [+page.svelte](file:///Users/mac/kitchen/src/routes/shopping/+page.svelte)

**What changes:**
1. **Render Loop:** Inside the `{#each groupedItems[category] as item}` loop, immediately after the main `<tr>`, add an inner loop:
   ```svelte
   {#if item.variants && item.variants.length > 0}
       {#each item.variants as variant}
           <tr class="bg-surface-warm/10 text-sm">...</tr>
       {/each}
   {/if}
   ```
2. **Add Variant Draft State:** Add a piece of state to track which item is currently adding a variant (e.g., `let addingVariantTo = $state<string | null>(null);` and `let variantDraftName = $state('');`).
3. **Add Variant Button:** In the parent `<tr>`, add a small `⨁` icon (e.g., using `PlusCircle` from lucide-svelte) next to the item name or in the actions column. Clicking it sets `addingVariantTo = item.id`.
4. **Totals Calculation:** Update the `visibleTotal` derived value to recursively add up variant prices if they exist.

**Why:**
- Visually indenting variants underneath the parent keeps the list organized. Inline drafting provides a frictionless way to add "Chocolate" under "Yogurt".

---

## 4. Rollback & Contingency Strategy

- **Safe Restore Point:** Before applying the changes to `store.svelte.ts`, the agent MUST run `cp src/lib/store.svelte.ts src/lib/store.svelte.ts.bak`. 
- **Local Storage:** If the schema migration fails, the app will log an error. The user can clear `localStorage` or we can revert the backup.

---

## 5. Definition of Done (DoD)

- [ ] A parent item can have 0 to N variants.
- [ ] Variants appear visually indented under the parent item in the Shopping List.
- [ ] Each variant has its own quantity and status toggle.
- [ ] Checking off the Parent item cascades the status to all its variants (e.g., checking Yogurt checks off both Chocolate and Vanilla).
- [ ] The total sum of the shopping list includes variant prices.

---

## 6. Execution Strategy Recommendation

- **Suggested Model:** Pro (for careful state management and UI alignment).
- **Thinking Density:** High (due to Svelte 5 Runes deeply nested reactivity).
- **Pattern:** Direct execution milestone by milestone.

> [!IMPORTANT] 
> **Devil's Advocate Review Note:**
> The main risk is Svelte 5's deep reactivity with nested arrays. In Svelte 5, arrays are deeply reactive by default with `$state`, but mutating a nested property (like `item.variants[0].status`) requires ensuring the proxy traps it. Since `db` is fully wrapped in `$state`, `db.inventory.find(...)` returns a proxy, meaning mutating variants will trigger updates correctly.

---

## 7. Verification Plan

### Automated Tests
- `npm run check` — Ensure TypeScript types (ItemVariant) are properly satisfied across the app.
- `npm run build` — Verify the build succeeds with no type errors.

### Manual Verification
- [ ] Add an item (e.g., "Cheese").
- [ ] Click the new (+) button next to "Cheese" to add variants "Gouda" and "Cheddar".
- [ ] Verify they render indented.
- [ ] Change the quantity of "Gouda".
- [ ] Click the main "Cheese" checkbox and verify both variants switch to the "Purchased/In Fridge" state.
- [ ] Verify the Grand Total increases if variants have prices.
