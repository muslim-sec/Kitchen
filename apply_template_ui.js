import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Edit2 to imports
if (!content.includes('Edit2')) {
    content = content.replace(
        "Trash2,\n\t\t\tRotateCcw,\n\t\t\tRefreshCw",
        "Trash2,\n\t\t\tRotateCcw,\n\t\t\tRefreshCw,\n\t\t\tEdit2"
    );
}

// 2. Add Default Template item at the top of the Templates list
const templateSectionTarget = `<div class="border-y border-border-warm bg-surface-warm/30 px-4 py-2 text-xs font-bold tracking-wider text-text-muted uppercase">
							Templates
						</div>
						<div class="p-2">`;

const newTemplateSection = `<div class="border-y border-border-warm bg-surface-warm/30 px-4 py-2 text-xs font-bold tracking-wider text-text-muted uppercase">
							Templates
						</div>
						<div class="p-2">
							<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {!activeHideTemplate ? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'}" 
								onclick={() => { inventoryActions.unhideAll(); activeHideTemplate = null; isHiddenMenuOpen = false; }}
							>
								<div class="flex items-center gap-2">
									<span>🛒 Full List (Default)</span>
								</div>
							</button>`;

content = content.replace(templateSectionTarget, newTemplateSection);

// 3. Update the dynamic template rendering
// Current dynamic template code:
const dynamicTemplateRegex = /<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm \{\w+ === template\.id \? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'\}"\s+onclick=\{\(\) => \{ inventoryActions\.applyHideTemplate\(template\.hiddenNames\); activeHideTemplate = template\.id; isHiddenMenuOpen = false; \}\}\s+oncontextmenu=\{\(e\) => \{[\s\S]*?<\/button>/g;

const newDynamicTemplate = `<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {activeHideTemplate === template.id ? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'}" 
									onclick={() => { inventoryActions.applyHideTemplate(template.hiddenNames); activeHideTemplate = template.id; isHiddenMenuOpen = false; }}
								>
									<div class="flex items-center gap-2">
										<span class="truncate">{template.name}</span>
									</div>
									<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										<div role="button" tabindex="0" class="text-text-muted hover:text-hearth-600" title="Edit Template" onclick={(e) => { e.stopPropagation(); configTemplateModal = { show: true, templateId: template.id, templateName: template.name, selectedNames: [...template.hiddenNames], confirmSave: false }; isHiddenMenuOpen = false; }} onkeydown={(e) => { if (e.key === 'Enter') { configTemplateModal = { show: true, templateId: template.id, templateName: template.name, selectedNames: [...template.hiddenNames], confirmSave: false }; isHiddenMenuOpen = false; } }}>
											<Edit2 size={14} />
										</div>
										{#if template.id !== 'eco-mode'}
											<div role="button" tabindex="0" class="hover:text-flame" title="Delete Template" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); if (activeHideTemplate === template.id) activeHideTemplate = null; }} onkeydown={(e) => { if (e.key === 'Enter') inventoryActions.deleteHideTemplate(template.id); }}>
												<Trash2 size={14} />
											</div>
										{/if}
									</div>
								</button>`;

if (dynamicTemplateRegex.test(content)) {
    content = content.replace(dynamicTemplateRegex, newDynamicTemplate);
    console.log("Successfully replaced dynamic template rendering!");
} else {
    console.log("Failed to match dynamic template regex!");
}

// 4. Clean up Visibility section (Remove Unhide All from visibility section, since it's now "Full List")
// Wait, user might still want "Unhide All" in visibility. Let's just keep it, or remove it since it's duplicate?
// Better to remove "Unhide All" from Visibility to avoid clutter, since "Full List (Default)" does the same.
const visibilitySectionTarget = `<button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-espresso transition-colors hover:bg-surface-warm" onclick={() => { inventoryActions.unhideAll(); activeHideTemplate = null; isHiddenMenuOpen = false; }}>
								<RotateCcw size={16} /> Unhide All
							</button>`;
content = content.replace(visibilitySectionTarget, "");

fs.writeFileSync(path, content);
