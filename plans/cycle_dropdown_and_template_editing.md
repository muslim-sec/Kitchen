# Cycle Dropdown & Template Editing Plan

## Purpose
**Type:** ✨ UX/UI Refinement & Feature Extension
**Summary:** Compress the Shopping Cycle buttons into a single dropdown to save header space, and introduce an intuitive "Update/Overwrite" mechanic to modify existing Hide Templates (like Economic Mode) directly from the UI without complex menus.

## Proposed Changes (Detailed)

### Phase 1: Compress Shopping Cycle Filters
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **Current State:** The cycle filters (All, Weekly, Monthly) are separate buttons taking up horizontal space.
- **New UI (Dropdown):** 
  - Create a state `isCycleMenuOpen`.
  - Replace the buttons with a single dropdown button: `[ 📅 Cycle: All ▼ ]`.
  - The dropdown will contain a clean list: `All Cycles`, `Weekly 🛒`, `Bi-weekly 📅`, and `Monthly 📦`.
  - Clicking an option updates `cycleFilter` and closes the dropdown.

### Phase 2: Template Editing UX (The "Update" Button)
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte` & `src/lib/store.svelte.ts`
- **User Problem:** How to configure or update "Economic Mode" (e.g., adding a new item to hide, or removing one).
- **Proposed UX Flow:** We will use the visual list itself as the editor. 
  1. You click "Economic Mode" to apply it.
  2. You go to your shopping list and manually Hide a new item (e.g., "Nutella") or Unhide an item.
  3. You open the Hidden dropdown again.
  4. Next to the template name, we will add a new **Update/Save (🔄)** icon button.
  5. Clicking it will overwrite that template with the items currently hidden on your screen.
- **Code Changes:**
  - Add `updateHideTemplate(id: string, newHiddenNames: string[])` to `inventoryActions` in `store.svelte.ts`.
  - In the UI, render a `🔄` (Rotate or Save icon) next to each template name.
  - Clicking it triggers `updateHideTemplate(template.id, currentHiddenNames)`.

## Impact Analysis
- **Reviewer 1 (UX):** This is the most intuitive way to configure templates. It avoids building a complex modal with checkboxes. "What you see is what you save."
- **Reviewer 2 (UI):** Condensing the cycle filters into a dropdown will make the header incredibly clean and responsive on mobile devices.
