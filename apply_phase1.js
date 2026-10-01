import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Qty column header
content = content.replace(
    '<th class="hidden p-3 sm:table-cell">Brand (Healthy)</th>',
    '<th class="p-3 w-32">Qty</th>\n\t\t\t\t\t\t\t\t\t<th class="hidden p-3 sm:table-cell">Brand (Healthy)</th>'
);

// 2. Add Qty data cell
const oldDataCell = '<td class="hidden p-3 text-sm sm:table-cell">';
const newDataCell = `<td class="p-3">
											<div class="flex items-center gap-1">
												<input
													type="number"
													step="any"
													min="0.1"
													bind:value={item.quantityAmount}
													class="w-16 rounded border-none bg-transparent px-1 py-0.5 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
												/>
												<select
													bind:value={item.quantityUnit}
													class="w-20 rounded border-none bg-transparent px-1 py-0.5 text-xs text-text-muted transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
												>
													{#each ['kg', 'g', 'L', 'ml', 'units', 'pcs', 'cans', 'bunch', 'packs', 'jar', 'bottle', 'box', 'tube', 'loaves', 'heads', 'cups', 'bars'] as unit}
														<option value={unit}>{unit}</option>
													{/each}
												</select>
											</div>
										</td>
										<td class="hidden p-3 text-sm sm:table-cell">`;
content = content.replace(oldDataCell, newDataCell);

// 3. Add Qty to "Add new item" draft row
const oldDraftCell = '<td class="hidden p-3 sm:table-cell" colspan="3"></td>';
const newDraftCell = `<td class="p-3">
										<div class="flex items-center gap-1">
											<input
												type="number"
												step="any"
												min="0.1"
												bind:value={newItemsDrafts[category].quantityAmount}
												class="w-16 rounded border-none bg-transparent px-1 py-0.5 text-sm font-bold text-text-espresso transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
											/>
											<select
												bind:value={newItemsDrafts[category].quantityUnit}
												class="w-20 rounded border-none bg-transparent px-1 py-0.5 text-xs text-text-muted transition-all hover:bg-surface-warm focus:ring-1 focus:ring-hearth-400"
											>
												{#each ['kg', 'g', 'L', 'ml', 'units', 'pcs', 'cans', 'bunch', 'packs', 'jar', 'bottle', 'box', 'tube', 'loaves', 'heads', 'cups', 'bars'] as unit}
													<option value={unit}>{unit}</option>
												{/each}
											</select>
										</div>
									</td>
									<td class="hidden p-3 sm:table-cell" colspan="2"></td>`;
content = content.replace(oldDraftCell, newDraftCell);

// 4. Update the "COUNT" footer colspan
content = content.replace(
    '<td class="p-3" colspan="2">',
    '<td class="p-3" colspan="3">'
);

fs.writeFileSync(path, content);
console.log('Phase 1 injected successfully.');
