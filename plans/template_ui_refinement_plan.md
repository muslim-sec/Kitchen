# Template UI Refinements Plan

## Purpose
**Type:** ✨ UX/UI Refinement
**Summary:** Improve discoverability of template editing by replacing the hidden "Right-Click" action with a clear "Pencil" icon. Introduce a permanent "Default/Full Mode" option to easily reset the list and view all items.

## Proposed Changes (Detailed)

### Phase 1: Pencil Icon for Editing
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **Current Issue:** Editing relies on `oncontextmenu` (Right-click), which is completely invisible to users and not intuitive on web/mobile.
- **Fix:** 
  - Remove the right-click logic.
  - Add a small Pencil (`✏️` or `Edit2` Lucide icon) next to the template name (e.g., Economic Mode).
  - Clicking the Pencil directly opens the Configuration Modal we built earlier.

### Phase 2: "Default Mode" Switch
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **Current Issue:** To restore all items, the user clicks "Unhide All", but logically they think of it as switching back to the "Default Template".
- **Fix:**
  - Inside the "Templates" section of the dropdown, add a permanent top option: `🛒 Full List (Default Mode)`.
  - Clicking this acts like applying a template: it calls `unhideAll()` and resets the `activeHideTemplate` to `null`.
  - This option will NOT have a Pencil icon, as the default state cannot be edited (it inherently means "show everything").

## User Experience Flow (What You Will See)
1. You open the `[ 👁️ ]` dropdown.
2. Under "Templates", the first option is **🛒 Full List (Default Mode)**. You can click it anytime to restore everything.
3. Below it is **💰 Economic Mode**. Next to it is a **✏️ Pencil Icon**.
4. If you click the name "Economic Mode", it *applies* the mode.
5. If you click the **✏️ Pencil**, it *opens the configuration modal* so you can check/uncheck items.

## Impact Analysis
- **Reviewer 1 (UX):** Replacing right-click with a Pencil icon solves the discoverability issue completely. Users instantly know how to configure a template.
- **Reviewer 2 (UI):** Treating "Full List" as a template makes the conceptual model much easier to grasp for the user.
