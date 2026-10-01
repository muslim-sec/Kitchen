# Add User Shopping Items Plan

## Purpose
**Type:** ✨ Feature Extension
**Summary:** Add the user's comprehensive list of healthy, Moroccan-friendly groceries into the correct categories in the global default inventory.
**Context:** The user provided an extensive list of vegetables, proteins (seafood), legumes, grains, dairy, condiments, spices, and beverages to be added.
**Expected Outcome:** The `store.svelte.ts` file's `defaultDb.inventory` will contain all the requested items. Hydration logic (already fixed previously) will merge these seamlessly for the user on reload.

## Proposed Changes (Detailed)

### [MODIFY] [/Users/mac/kitchen/src/lib/store.svelte.ts](file:///Users/mac/kitchen/src/lib/store.svelte.ts)

**What changes:**
- Rename the existing `فطر` (which was incorrectly moved to Canned Goods) to `فطر طازج` and move it to `Vegetables`.
- Add new `Vegetables`: بروكلي, سبانخ, بازلاء, فلفل أحمر وأخضر, بصل أخضر, بقدونس وكزبرة, ريحان.
- Add new `Fruits`: برتقال, فراولة.
- Add new `Proteins`: سمك الصول, كلماري / حبار, سردين, سالمون أو ماكريل, جمبري, فيليه سمك أبيض.
- Add new `Pantry`: فاصوليا بيضاء جافة, حمص جاف, فول, عدس أحمر, حليب جوز الهند.
- Add new `Grains`: خبز حبوب كاملة, طحين قمح كامل, أرز بني, سميد.
- Add new `Dairy`: زبادي يوناني, حليب اللوز, جبن كيري, لاڤاش كيري, الفرماج الأحمر.
- Add new `Condiments`: خردل, طحينة, صويا صوص.
- Add new `Spices`: زعتر, شطة / فلفل أحمر حار, قرفة.
- Add new `Beverages`: مياه معدنية, عصير برتقال معلب, Celsius مشروب طاقة, مشروب ماتشا.

**Dependencies affected:**
- None. Hydration script handles syncing perfectly now.

## Impact Analysis (Regression Risks)
- **Regression Risks:** Missing commas or malformed TypeScript syntax during string replacement. 

## Execution Recommendation
- **Environment:** Direct Node.js string replacement/insertion script.

## 🔍 Review Notes (Adversarial Review)
- **Reviewer 1 (Frontend):** APPROVED. The emojis and names fit the UI layout.
- **Reviewer 2 (Data):** APPROVED. Categories perfectly match the `Category` type we expanded in the previous step (`Vegetables`, `Fruits`, `Proteins`, `Spices`, `Canned Goods`, `Snacks`, `Breakfast`, `Beverages`, `Dairy`, `Condiments`, `Pantry`, `Grains`).

## Verification Plan
- `npm run check` to verify TypeScript syntax is valid.
