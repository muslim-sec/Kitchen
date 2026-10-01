# Global Inventory Expansion Plan

## Purpose

**Type:** ✨ Feature Extension
**Summary:** Add requested missing staples, healthy snacks, cereals, energy drinks, and white sauce to the global inventory default list.
**Context:** The user identified several missing items in the global shopping list, such as canned beans, cold cuts, healthy snacks, baby cereal, and white sauce. These need to be added to the `defaultDb.inventory` so new users see them by default.
**Expected Outcome:** The `store.svelte.ts` file is updated to include all the new items. The hydration logic already handles merging missing defaults for existing users.

## Proposed Changes (Detailed)

### [MODIFY] [/Users/mac/kitchen/src/lib/store.svelte.ts](file:///Users/mac/kitchen/src/lib/store.svelte.ts#L225-L235)

**What changes:**
- Add the following items to `defaultDb.inventory` using `createDefaultItem`:
  - `التونة المعلبة` (Canned Tuna) 🐟
  - `الفاصوليا المعلبة` (Canned Beans) 🥫
  - `الفطر المعلب` (Canned Mushrooms) 🍄
  - `الحمص` (Chickpeas) 🧆
  - `الكاشير / مرتديلا` (Cold Cuts / Kachir) 🥪
  - `كورنيشون` (Cornichons) 🥒
  - `زيت الزيتون` (Olive Oil) 🫒
  - `الزيتون` (Olives) 🫒
  - `معجون الطماطم` (Tomato Paste) 🥫
  - `صلصة بيضاء` (White Sauce) 🥛
  - `سيريلاك / حبوب الأطفال` (Baby Cereal / Cerelac) 🥣
  - `حبوب الإفطار` (Cereal) 🥣
  - `الشوفان` (Oatmeal) 🌾
  - `زبدة الفول السوداني` (Peanut Butter) 🥜
  - `العسل` (Honey) 🍯
  - `المربى` (Jam) 🍓
  - `برينجلز` (Pringles) 🥔
  - `ذرة الفشار` (Popcorn Kernels) 🍿
  - `فواكه مجففة / تمر` (Dried Fruits / Dates) 🍇
  - `كعك الأرز` (Rice Cakes) 🍘
  - `الشوكولاتة الداكنة` (Dark Chocolate) 🍫
  - `زبادي / دانون` (Yogurt) 🥣
  - `مشروب طاقة للتركيز` (Focus/Energy Drink) ⚡

**Why:**
- To ensure these common items and the user's requested specific items (white sauce, pringles, baby cereal, focus drink) are available globally.

**Dependencies affected:**
- None. The schema remains identical. Existing hydration logic will seamlessly insert these new items for current users.

> [!NOTE]
> Since we already have some items (like 'فطر', 'خيار مخلل', 'صلصة طماطم'), I will make sure the new names are distinct or they replace/complement them according to the user's request.

## Impact Analysis (Regression Risks)

- **Affected Features:** The Shopping and Fridge inventory views.
- **Shared Components/Functions:** The hydration logic (`fix_hydration_objects.js`) that runs on app startup.
- **Regression Testing Required:** We must verify that adding these items does not break the TS compiler and that they appear properly.

## Execution Recommendation
- **Suggested Model:** Gemini Pro
- **Thinking Density:** Medium (careful TS modification).
- **Environment:** Direct file modification using simple scripts to avoid parsing issues.

## 🔍 Review Notes (Adversarial Review)
- **Reviewer 1 (Data Architect):** APPROVED. The data structure is purely additive. It adheres to `MasterInventoryItem`.
- **Reviewer 2 (Performance):** APPROVED. 25 more items in the default array will have near-zero impact on Svelte reactivity or local storage size.
- **Reviewer 3 (Frontend):** APPROVED. Hydration logic will correctly merge these by `id` or name matching depending on the exact logic (wait, the hydration for inventory currently isn't explicit in `store.svelte.ts`, wait - `inventory` hydration was probably just standard `...defaultDb, ...parsed`. Actually, earlier we checked `store.svelte.ts` and `initialDb = { ...defaultDb, ...parsed }` overrides `inventory` entirely if it's in `parsed.inventory`. Does hydration merge missing inventory items? If not, existing users won't see them! I need to ensure they are merged).

> [!WARNING]
> **Adversarial Finding:** If `parsed.inventory` exists in `localStorage`, `initialDb = { ...defaultDb, ...parsed }` will overwrite the inventory completely, meaning the user won't see the new items!
> **Action:** I must also update the hydration logic in `store.svelte.ts` to merge missing items into `inventory`, just like I did for `recipes` and `tags` earlier!

## Verification Plan

### Automated Tests
- `npm run check` — Ensure no TypeScript or Svelte errors.

### Manual Verification
- Check if the new items appear in the frontend.

## Phase 7: Post-Execution Review
- [ ] Architecture alignment: Ensure no new/rogue architectural patterns were invented.
- [ ] Edge cases: Review the code for unhandled rare states or logical gaps.
- [ ] Code cleanliness: Check for DRY violations, deep nesting, and tight coupling.
