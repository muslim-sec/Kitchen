# Hide Features & Economic Templates Plan (Updated)

## Purpose
**Type:** ✨ Feature Extension & UX Improvement
**Summary:** Enhance the "Hide" functionality by strictly excluding hidden items from budget totals, adding a safe Delete confirmation, and consolidating all Hide/Unhide/Template actions into a single, clean dropdown menu. The "Economic Mode" template will be included by default.

## Proposed Changes (Detailed)

### Phase 1: UX & Budget Calculation Fixes
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **Total Calculations:** Update `visibleTotal` and the Category `SUM` footers to strictly filter out hidden items (`!item.isHidden`), regardless of the `viewMode` or `showHidden` state.
- **Delete Confirmation:** 
  - Instead of calling `inventoryActions.deleteItem(id)` directly from the context menu, trigger a custom confirmation modal `confirmDeleteModal`.

### Phase 2: Unified "Hidden & Templates" Dropdown UI
- **Target File:** `/Users/mac/kitchen/src/lib/store.svelte.ts`
- **Data Model:** Add `hideTemplates: { id: string, name: string, hiddenNames: string[] }[]` to the master DB state.
- **Default Template:** During hydration, inject the "Economic Mode" template (hiding Salmon, Shrimp, Almond Milk, Celsius, Matcha, Nuts, Dark Chocolate) if it doesn't exist.
- **Target File:** `/Users/mac/kitchen/src/routes/shopping/+page.svelte`
- **UI Consolidation:** Replace the old "Show Exclusions" button with a single dropdown button: `[ 👁️ Hidden (X) ▼ ]`.
- **Dropdown Contents:**
  - **Visibility Section:**
    - `Toggle: Show Hidden Items in List`
    - `Button: 🔄 Unhide All Items`
  - **Templates Section:**
    - `Button: 💰 Economic Mode` (Applies the default template)
    - `[List of any custom user templates]`
    - `Button: 💾 Save Current as Template...` (Opens a prompt to name and save the current hidden state).

## Impact Analysis (Adversarial Review)
- **Reviewer 1 (Frontend):** Consolidating all hide/template features into a single dropdown is brilliant UI design. It saves space on the header and groups related logical actions perfectly.
- **Reviewer 2 (Data):** Ensuring the template matches by `item.name` guarantees that the default Economic Mode works on the user's customized database.

## Execution Sequence
1. Implement Phase 1 (Budget fix, Delete Modal).
2. Implement Phase 2 (State update for Templates, Unified Dropdown UI).
