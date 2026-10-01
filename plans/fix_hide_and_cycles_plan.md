# Hide Templates Fix & Cycle Dropdown Plan

## Purpose
**Type:** 🐛 Bug Fix & UI Overhaul
**Summary:** Fix the UX disaster of the "Update" button, provide a safe Right-Click Configuration Modal for templates, clearly display the active template in the main button, and successfully apply the Cycle Dropdown that failed to apply previously.

## Proposed Changes (Detailed)

### Phase 1: Cycle Dropdown (The Real Fix)
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **Bug:** The previous script failed to replace the cycle buttons due to formatting mismatches. 
- **Fix:** Use a precise multi-line regex or line-range replacement to completely remove the old `<button>All Cycles</button>` group and inject the `[ 📅 Cycle: All ▼ ]` dropdown.

### Phase 2: Active Template Indicator
- **State Addition:** Add `let activeHideTemplate = $state<string | null>(null);`
- **Logic:**
  - When you click a template (e.g., Economic Mode), `activeHideTemplate` is set to its ID.
  - If you manually Hide/Unhide an item from the main list, `activeHideTemplate` resets to `null` (since you modified the state).
- **UI Update:** The main dropdown button will dynamically change its text.
  - If `activeHideTemplate` == 'eco-mode', it displays: `[ 💰 Economic Mode (X) ▼ ]`.
  - Else if no template, it displays: `[ 👁️ Hidden (X) ▼ ]`.

### Phase 3: Safe Configuration Modal (No More Accidental Updates)
- **Removal:** Delete the `🔄` Update button completely.
- **Trigger:** Add `oncontextmenu` (Right-Click) to the template names in the dropdown.
- **The Modal (`configureTemplateModal`):**
  - Opens a clean window showing: "Configure: [Template Name]".
  - Contains a scrollable list of ALL your inventory items with checkboxes next to them.
  - Checked = Hidden in this template. Unchecked = Visible.
  - Contains a simple "Search" input to quickly find items (like Salmon).
  - A big "Save Template" button at the bottom.
- **Action Update:** The `updateHideTemplate` action will be used by this modal to safely save the checked items.

## Impact Analysis (Adversarial Review)
- **Reviewer 1 (UX):** Removing the 1-click update button prevents disastrous accidental overwrites. The Right-Click -> Modal flow is deliberate and gives full visibility into exactly what the template hides.
- **Reviewer 2 (UI):** The dynamic active template button is a huge win. The user will immediately know if they are shopping in "Economic Mode" without having to check the hidden count.
