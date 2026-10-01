import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// The problematic nested button code:
const buggyTemplateTarget = /<button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-surface-warm \{activeHideTemplate === template\.id \? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'\}"[\s\S]*?<\/button>/g;

const fixedTemplateItem = `<div class="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-surface-warm {activeHideTemplate === template.id ? 'bg-hearth-50 text-hearth-700' : 'text-text-espresso'}">
									<button class="flex-1 text-left flex items-center gap-2 py-1 outline-none" onclick={() => { inventoryActions.applyHideTemplate(template.hiddenNames); activeHideTemplate = template.id; isHiddenMenuOpen = false; }}>
										<span class="truncate">{template.name}</span>
									</button>
									<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 pl-2">
										<button class="text-text-muted hover:text-hearth-600 outline-none" title="Edit Template" onclick={(e) => { e.stopPropagation(); configTemplateModal = { show: true, templateId: template.id, templateName: template.name, selectedNames: [...template.hiddenNames], confirmSave: false }; isHiddenMenuOpen = false; }}>
											<Edit2 size={14} />
										</button>
										{#if template.id !== 'eco-mode'}
											<button class="hover:text-flame outline-none" title="Delete Template" onclick={(e) => { e.stopPropagation(); inventoryActions.deleteHideTemplate(template.id); if (activeHideTemplate === template.id) activeHideTemplate = null; }}>
												<Trash2 size={14} />
											</button>
										{/if}
									</div>
								</div>`;

content = content.replace(buggyTemplateTarget, fixedTemplateItem);

fs.writeFileSync(path, content);
console.log('Fixed Pencil HTML bug.');
