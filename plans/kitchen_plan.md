# Hide Features Fix Plan

**Status:** Pending Execution

## Task 1: Fix Pencil and Icons Visibility
- **Target File:** `src/routes/shopping/+page.svelte`
- **Description:** Remove `opacity-0 group-hover:opacity-100` from the action buttons (Pencil and Trash) inside the template dropdown. This ensures the icons are always visible and fully clickable on mobile devices (touchscreens) where "hover" does not exist.

## Task 2: Restore Safe "Update/Save" Button
- **Target File:** `src/routes/shopping/+page.svelte`
- **Description:** Re-add the "Update Template" (`🔄`) button next to the active template. However, to prevent the accidental wipe issue, clicking this button will NOT save instantly. Instead, it will immediately open the confirmation modal ("Are you sure you want to save these hidden items to Economic Mode?") to guarantee absolute safety.

## Task 3: Clarify Default Mode Logic
- **Target File:** `src/routes/shopping/+page.svelte`
- **Description:** Maintain "🛒 Full List (Default)" as the master reset button. Its job is explicitly to call `unhideAll()` and reset `activeHideTemplate` to `null`.

## Task 4: Add Search Bar
- **Target File:** `src/routes/shopping/+page.svelte`
- **Description:** Implement a search bar directly above the first category (similar to the one in the Fridge page). This will allow users to quickly search for specific items (by English or Arabic name) across the entire shopping list without scrolling.
