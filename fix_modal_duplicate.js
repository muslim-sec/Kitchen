import fs from 'fs';
const path = 'src/routes/recipes/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}`;

content = content.replace(targetStr, `					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}`);

fs.writeFileSync(path, content);
console.log('Fixed duplicated modal tails');
