# 🧠 Project Memory & Changelog

This file serves as a human-readable log of all features, decisions, and structural changes made to the Kitchen/Shopping application. It acts as our continuous memory.

## [2026-09-29] - The "Smart Shopping" Update

### ✨ Features Added
- **Global Inventory Expansion:** Added over 35 new healthy and Moroccan-friendly items to the default database (including Broccoli, Sole Fish, Calamari, Oats, Greek Yogurt, Red Cheese, Celsius, Matcha, etc.).
- **Smart Categorization System:** 
  - Restructured the categories to prevent the "Supermarket" category from being bloated.
  - Added new specific categories: \`Canned Goods\`, \`Snacks\`, \`Breakfast\`, \`Beverages\`, \`Dairy\`, \`Condiments\`, \`Pantry\`.
  - Re-mapped all items into their correct logical categories.
- **Configurable Default Quantities (Phase 1):**
  - Updated the \`createDefaultItem\` logic to stop defaulting to \`1 unit\` for everything.
  - Assigned highly realistic default quantities and specific units based on the food type (e.g., Tomatoes = \`2 kg\`, Oil = \`5 L\`, Tuna = \`3 cans\`, Eggs = \`30 pcs\`).
  - Added a new \`Qty\` column directly in the **Shopping UI**, allowing users to see and edit the default quantity and unit of any item seamlessly.
- **Shopping Cycle Filters (Phase 2):**
  - Introduced a \`shoppingCycle\` property to the database (\`weekly\`, \`biweekly\`, \`monthly\`).
  - Built an automated categorizer that assigns cycles intelligently (e.g., fresh produce = \`weekly\`, spices/grains = \`monthly\`).
  - Added quick-filter buttons in the Shopping UI (🛒 **Weekly** vs 📦 **Monthly**) to streamline supermarket visits.

### 🛠️ Technical & Data Migrations
- **Safe Hydration Logic:** Wrote complex migration scripts that automatically upgrade existing users' \`localStorage\` to the new categories and quantities *without* deleting their custom modifications.
- **Bug Fixes:** 
  - Removed duplicate items (e.g., overlapping pickle entries).
  - Fixed HTML/Svelte layout corruption bugs inside the Tag modal.
  - Fixed TypeScript typings across the Svelte Store.


### 🇲🇦 Moroccan Pricing & Dynamic Scaling
- **Data Enrichment:** Simulated realistic market prices in Moroccan Dirhams (MAD) for over 60 inventory items (vegetables, meats, dairy, etc.) based on average supermarket rates (Marjane, Carrefour).
- **Safe Local Injection:** Designed a smart hydration script that injects these prices *only* into the local user's browser storage (\`isMoroccanAccount\`), ensuring the core global \`defaultDb\` remains neutral (0 price).
- **Dynamic Price Scaling:** Added a \`unitPrice\` property to items. Now, if the user changes the quantity in the Shopping UI (e.g., from 2 kg to 3 kg), the total price automatically recalculates based on the Moroccan base unit price.

### 🐛 Bug Fixes & UI Enhancements (Pricing & Totals)
- **Math Correction:** Fixed a critical bug where items measured in \`g\` or \`ml\` (like spices) were multiplying by the full \`kg\` price (e.g. 150 MAD * 50g = 7500 MAD). The hydration script now safely divides the base price by 1000 for these units.
- **Price Formatting:** Ensured all generated prices and totals are strictly formatted to 2 decimal places (\`toFixed(2)\`).
- **Global Totals Visibility:** Modified the Shopping UI to always display the Category Sum and Grand Total, even when viewing the "Global List" (\`viewMode === 'all'\`). The total now correctly reflects exactly what is visible on the screen based on the active filters (Weekly/Monthly).

### ✨ Hide Features & Economic Templates
- **UI Consolidation (Dropdown):** Replaced the long "Show Exclusions" button with a sleek dropdown button \`[ 👁️ Hidden (X) ▼ ]\` that groups all hide-related actions in one place.
- **Economic Mode (Templates):** Created a powerful template system (\`hideTemplates\`). Added a default "💰 Economic Mode" that instantly hides luxury items (Salmon, Shrimp, Energy Drinks, Almond Milk, etc.). Users can now save their own templates from the dropdown.
- **Budget Protection:** Hidden items are now *strictly* excluded from the \`visibleTotal\` and Category \`SUM\` at the code level. Even if you view them via the dropdown, their price won't artificially inflate your shopping budget.
- **Safe Delete Modal:** Replaced instant deletion with a \`confirmDeleteModal\` pop-up to prevent accidental data loss.

### ✨ Cycle Dropdown & Template Editing
- **Cycle Dropdown:** Compressed the Shopping Cycle filter buttons (All, Weekly, Monthly) into a single, space-saving dropdown menu \`[ 📅 Cycle: All ▼ ]\`, greatly improving the header UI for mobile devices.
- **Template Editing UX (WYSIWYG):** Added an intuitive way to edit Hide Templates (like Economic Mode). Users can now apply a template, visually Hide/Unhide items in their main shopping list, and then click the new Update icon (\`🔄\`) next to the template name in the dropdown to overwrite and save their exact visual configuration.

### 🐛 Hide Templates Fix & Cycle Dropdown
- **Removed Dangerous UI:** Completely removed the \`🔄 Update\` button from the templates list to prevent accidental wipes.
- **Safe Template Configuration:** Added a full \`configureTemplateModal\`. Users can now **Right-Click** any template (like Economic Mode) to open a clean list with checkboxes, allowing precise and safe selection of which items to hide. Added a final "Confirm Save" state.
- **Active Template Indicator:** The main Hide button now intelligently displays the active template (e.g., \`[ 💰 Economic Mode (12) ▼ ]\`) instead of generic text.
- **Cycle Dropdown Success:** Successfully applied the space-saving Dropdown for Shopping Cycles (\`[ 📅 All Cycles ▼ ]\`), replacing the old clunky buttons.

### ✨ Template UI Refinements
- **Pencil Icon for Editing:** Removed the non-intuitive "Right-click" requirement for editing templates. Added a clear and discoverable \`✏️\` (Edit) icon next to templates (e.g. Economic Mode) that directly opens the configuration modal.
- **Default/Full Mode:** Added a persistent \`🛒 Full List (Default)\` option at the very top of the Templates list. This acts as a clear "reset" button to unhide all items and exit any active template mode, replacing the need for a scattered "Unhide All" action.

### 🛠️ Architecture Fixes (Hide Templates)
- **Pencil Icon Fix (HTML Validation):** Fixed a critical HTML nesting bug where the Pencil button was placed inside another button, causing browsers to silently break the click event. The UI is now properly separated: clicking the name applies the template, clicking the pencil opens the configuration modal.
- **Eco Mode Force Restore:** Added a hydration check to forcefully restore the 12 items of the Economic Mode template if they were accidentally wiped by the previous UI bugs.
