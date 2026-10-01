# Categorization & Inventory Migration Plan

## Purpose

**Type:** 🔧 Feature Extension / ♻️ Refactor
**Summary:** Overhaul the inventory categorization system and fix duplicate items.
**Context:** The current `Supermarket` category is too broad, acting as a dumping ground for snacks, canned goods, breakfast items, etc. The user requested we break this down into specific, logical categories (e.g., Canned Goods, Snacks). Additionally, we need to remove the duplicate pickle entry (`خيار مخلل` vs `كورنيشون`).
**Expected Outcome:** `Category` type is expanded. `defaultDb.inventory` is meticulously re-categorized. The hydration logic is updated to migrate existing users' stored items to the new categories and safely remove the duplicate pickle item.

## Proposed Changes (Detailed)

### [MODIFY] [/Users/mac/kitchen/src/lib/store.svelte.ts](file:///Users/mac/kitchen/src/lib/store.svelte.ts)

**What changes:**
1. **Update `Category` Type (line 2):**
   - Expand the type to include new distinct categories: `'Canned Goods' | 'Snacks' | 'Breakfast' | 'Beverages' | 'Dairy' | 'Condiments'`.

2. **Remove Duplicate Item:**
   - Delete `createDefaultItem('خيار مخلل', '🥒', 'Supermarket', 'in_fridge', 0, 'Pickles')`.
   - Ensure the remaining item is named `Cornichons` in English and `كورنيشون` in Arabic.

3. **Re-categorize `defaultDb.inventory`:**
   - `التونة المعلبة`, `الفاصوليا المعلبة`, `الفطر المعلب`, `الحمص` ➡️ `Canned Goods`
   - `برينجلز`, `ذرة الفشار`, `فواكه مجففة / تمر`, `كعك الأرز`, `الشوكولاتة الداكنة`, `مكسرات`, `لوز` ➡️ `Snacks`
   - `سيريلاك`, `حبوب الإفطار`, `الشوفان`, `زبدة الفول السوداني`, `العسل`, `المربى` ➡️ `Breakfast`
   - `مشروب طاقة للتركيز`, `قهوة` ➡️ `Beverages`
   - `Milk`, `Cheese`, `زبدة`, `زبادي / دانون` ➡️ `Dairy`
   - `كورنيشون`, `زيت الزيتون`, `الزيتون`, `معجون الطماطم`, `خل`, `ملح`, `ابزار`... ➡️ `Condiments` (or keep Spices as `Spices` and others as `Condiments`).
   - `طحين`, `Pasta`, `Rice`, `عدس` ➡️ `Pantry`

4. **Update Hydration Logic (Data Migration):**
   - Add a migration block inside `if (parsed.inventory)`:
     ```typescript
     // 1. Remove the old duplicate 'خيار مخلل'
     parsed.inventory = parsed.inventory.filter((i: any) => i.name !== 'خيار مخلل');
     
     // 2. Sync existing user's items with the new categories from defaultDb
     parsed.inventory.forEach((item: any) => {
         const defaultItem = defaultDb.inventory.find(d => d.name === item.name || d.englishName === item.englishName);
         if (defaultItem) {
             item.category = defaultItem.category;
         }
     });
     ```

**Why:**
- Changing `defaultDb` alone doesn't change the local storage for existing users. Without the migration block, the user's app would still show old categories.
- Removing duplicates directly from `parsed.inventory` ensures the user's UI is instantly cleaned up.

## Impact Analysis (Regression Risks)

- **Affected Features:** Inventory filtering, category tabs, and local storage state.
- **Shared Components/Functions:** The hydration logic on app boot.
- **Regression Testing Required:** We must verify that `npm run check` passes, specifically checking that the `Category` string literals match perfectly across the app.

## Execution Recommendation
- **Suggested Model:** Gemini Pro
- **Thinking Density:** High (Requires careful AST-level/RegEx replacement for the inventory array).
- **Environment:** Execute via Node scripts for precision.

## 🔍 Review Notes (Adversarial Review)
- **Reviewer 1 (Data Architect):** APPROVED. The migration script is crucial. Good catch on syncing existing user items' categories!
- **Reviewer 2 (Performance):** APPROVED. A loop over ~50 items on startup takes <1ms.
- **Reviewer 3 (Frontend):** REVISE. Wait, if we change the `Category` strings, do any UI components strictly expect ONLY the old categories?
  *Action taken:* Checked the codebase. The `Category` type is used, but UI tabs (like in the Fridge) usually map over whatever categories exist in the inventory. We will verify this.

## Verification Plan

### Automated Tests
- `npm run check` — No TypeScript errors.

### Manual Verification
- Review `store.svelte.ts` to ensure no syntax errors.
- Ensure the `Category` type matches the strings used in `createDefaultItem`.

## Phase 7: Post-Execution Review
- [ ] Architecture alignment: Ensure no new/rogue architectural patterns were invented.
- [ ] Edge cases: Addressed existing users via migration script.
- [ ] Code cleanliness: Re-categorized accurately.


### [MODIFY] [/Users/mac/kitchen/src/routes/shopping/+page.svelte](file:///Users/mac/kitchen/src/routes/shopping/+page.svelte)
**What changes:**
- Update `const categories` array to include the new categories: `'Canned Goods'`, `'Snacks'`, `'Breakfast'`, `'Beverages'`, `'Dairy'`, `'Condiments'`.
- Update `const categoryEmojis` mapping to include emojis for these new categories.

### [MODIFY] [/Users/mac/kitchen/src/routes/fridge/+page.svelte](file:///Users/mac/kitchen/src/routes/fridge/+page.svelte)
**What changes:**
- Same as above. Update `categories` and `categoryEmojis` to include the new tabs.

