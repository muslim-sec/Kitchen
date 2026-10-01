import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Add new states
const stateTarget = `let confirmDeleteModal = $state({ show: false, itemId: '', itemName: '' });`;
const newState = `let confirmDeleteModal = $state({ show: false, itemId: '', itemName: '' });
	
	let activeHideTemplate = $state<string | null>(null);
	let configTemplateModal = $state({ show: false, templateId: '', templateName: '', selectedNames: [] as string[], confirmSave: false });`;
content = content.replace(stateTarget, newState);

// 2. Active Template Display
const hiddenButtonTarget = `<button
					class="flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 text-sm font-bold transition-all hover:bg-surface-warm {hiddenCount > 0 ? 'text-text-espresso' : 'text-text-muted'}"
					onclick={() => isHiddenMenuOpen = !isHiddenMenuOpen}
				>
					<EyeOff size={18} />
					<span class="hidden sm:inline">Hidden ({hiddenCount})</span>
					<ChevronDown size={14} class="ml-1 transition-transform {isHiddenMenuOpen ? 'rotate-180' : ''}" />
				</button>`;

const newHiddenButton = `<button
					class="flex items-center gap-2 rounded-xl border border-border-warm bg-surface px-4 py-2 text-sm font-bold transition-all hover:bg-surface-warm {hiddenCount > 0 || activeHideTemplate ? 'text-text-espresso' : 'text-text-muted'} {activeHideTemplate === 'eco-mode' ? 'bg-hearth-50 border-hearth-200' : ''}"
					onclick={() => isHiddenMenuOpen = !isHiddenMenuOpen}
				>
					{#if activeHideTemplate === 'eco-mode'}
						<span>💰</span>
						<span class="hidden sm:inline text-hearth-700">Economic Mode ({hiddenCount})</span>
					{:else if activeHideTemplate}
						<EyeOff size={18} class="text-hearth-600" />
						<span class="hidden sm:inline text-hearth-700">Template Active ({hiddenCount})</span>
					{:else}
						<EyeOff size={18} />
						<span class="hidden sm:inline">Hidden ({hiddenCount})</span>
					{/if}
					<ChevronDown size={14} class="ml-1 transition-transform {isHiddenMenuOpen ? 'rotate-180' : ''}" />
				</button>`;
content = content.replace(hiddenButtonTarget, newHiddenButton);

// 3. Remove RefreshCw button and add oncontextmenu to templates
const templateItemTarget = /<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-text-espresso transition-colors hover:bg-surface-warm" onclick=\{\(\) => \{ inventoryActions.applyHideTemplate\(template.hiddenNames\); isHiddenMenuOpen = false; \}\}>[\s\S]*?<\/button>/g;

const newTemplateItem = `<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm {activeHideTemplate === template.id ? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'}" 
									onclick={() => { inventoryActions.applyHideTemplate(template.hiddenNames); activeHideTemplate = template.id; isHiddenMenuOpen = false; }}
									oncontextmenu={(e) => { e.preventDefault(); configTemplateModal = { show: true, templateId: template.id, templateName: template.name, selectedNames: [...template.hiddenNames], confirmSave: false }; isHiddenMenuOpen = false; }}
								>
									<div class="flex items-center gap-2">
										<span class="truncate">{template.name}</span>
										<span class="rounded bg-canvas px-1.5 py-0.5 text-[10px] font-bold text-text-muted opacity-50 group-hover:opacity-100">Right-click to edit</span>
									</div>
									<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										{#if template.id !== 'eco-mode'}
											<div role="button" tabindex="0" class="hover:text-flame" title="Delete Template" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); if (activeHideTemplate === template.id) activeHideTemplate = null; }} onkeydown={(e) => { if (e.key === 'Enter') inventoryActions.deleteHideTemplate(template.id); }}>
												<Trash2 size={14} />
											</div>
										{/if}
									</div>
								</button>`;
content = content.replace(templateItemTarget, newTemplateItem);

// 4. Reset active template on manual toggle or unhide all
content = content.replace(
    "inventoryActions.unhideAll(); isHiddenMenuOpen = false;",
    "inventoryActions.unhideAll(); activeHideTemplate = null; isHiddenMenuOpen = false;"
);

// We need to also hook into right-click context menu "Hide" and "Unhide" to reset active template.
// But those are in handleContextMenu functions. Let's just reset activeHideTemplate when toggling manually.
content = content.replace(
    "function toggleHidden() {",
    "function toggleHidden() {\n\t\tactiveHideTemplate = null;"
);
// Also unhide context menu
content = content.replace(
    "function unhideItem() {",
    "function unhideItem() {\n\t\tactiveHideTemplate = null;"
);

// 5. Append the Configuration Modal at the end of the file
const modalsEnd = `</div>
{/if}
</div>`;
const newModalsEnd = `</div>
{/if}

<!-- Configuration Modal -->
{#if configTemplateModal.show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-[100] flex items-center justify-center bg-text-espresso/20 p-4 backdrop-blur-sm" transition:fade={{ duration: 200 }} onclick={() => configTemplateModal.show = false}>
		<div class="w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] rounded-3xl border border-border-warm bg-surface shadow-hover" transition:scale={{ duration: 300, start: 0.95, easing: quintOut }} onclick={(e) => e.stopPropagation()}>
			<div class="border-b border-border-warm bg-surface-warm/50 px-5 py-4">
				<h3 class="text-lg font-bold text-text-espresso">Configure: {configTemplateModal.templateName}</h3>
				<p class="text-xs text-text-muted">Select the items you want this template to hide.</p>
			</div>
			
			{#if configTemplateModal.confirmSave}
				<div class="flex-1 p-6 text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-hearth-50 text-hearth-500">
						<CheckCircle2 size={32} />
					</div>
					<h3 class="mb-2 text-xl font-bold text-text-espresso">Confirm Changes?</h3>
					<p class="mb-6 text-sm text-text-muted">Are you sure you want to save these hidden items to <strong>{configTemplateModal.templateName}</strong>?</p>
					<div class="flex gap-3">
						<button class="w-full rounded-xl border border-border-warm px-4 py-3 font-bold text-text-muted transition-colors hover:bg-surface-warm" onclick={() => configTemplateModal.confirmSave = false}>
							Back
						</button>
						<button class="w-full rounded-xl bg-hearth-500 px-4 py-3 font-bold text-white transition-colors hover:bg-hearth-600" onclick={() => {
							inventoryActions.updateHideTemplate(configTemplateModal.templateId, configTemplateModal.selectedNames);
							if (activeHideTemplate === configTemplateModal.templateId) {
								inventoryActions.applyHideTemplate(configTemplateModal.selectedNames);
							}
							configTemplateModal.show = false;
						}}>
							Yes, Save
						</button>
					</div>
				</div>
			{:else}
				<div class="flex-1 overflow-y-auto p-2">
					{#each db.inventory as item}
						<label class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-surface-warm">
							<div class="flex items-center gap-3">
								<span class="text-2xl">{item.icon}</span>
								<span class="font-bold text-text-espresso">{item.name}</span>
							</div>
							<input type="checkbox" class="h-5 w-5 rounded border-border-warm text-hearth-500 focus:ring-hearth-400" 
								checked={configTemplateModal.selectedNames.includes(item.name)} 
								onchange={(e) => {
									if (e.currentTarget.checked) {
										configTemplateModal.selectedNames.push(item.name);
									} else {
										configTemplateModal.selectedNames = configTemplateModal.selectedNames.filter(n => n !== item.name);
									}
								}}
							/>
						</label>
					{/each}
				</div>
				<div class="border-t border-border-warm p-4 flex gap-3">
					<button class="w-full rounded-xl border border-border-warm px-4 py-3 font-bold text-text-muted transition-colors hover:bg-surface-warm" onclick={() => configTemplateModal.show = false}>
						Cancel
					</button>
					<button class="w-full rounded-xl bg-text-espresso px-4 py-3 font-bold text-white transition-colors hover:bg-text-muted" onclick={() => configTemplateModal.confirmSave = true}>
						Save Configuration
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
</div>`;
content = content.replace(modalsEnd, newModalsEnd);

fs.writeFileSync(path, content);
console.log('UI updated for Modal and Active Template.');
