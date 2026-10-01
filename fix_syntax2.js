import fs from 'fs';
const path = '/Users/mac/kitchen/src/lib/store.svelte.ts';
let content = fs.readFileSync(path, 'utf8');

const broken = `Juhayna',
				brandCountry: '🌍'
				},
			}
		
			// --- Canned & Basics ---`;
const fixed = `Juhayna',
				brandCountry: '🌍'
			},
		
			// --- Canned & Basics ---`;

content = content.replace("brandCountry: '🌍'\n\t\t\t\t},\n\t\t\t}\n\t\t\n\t\t\t// --- Canned & Basics ---", "brandCountry: '🌍'\n\t\t\t},\n\t\t\n\t\t\t// --- Canned & Basics ---");
fs.writeFileSync(path, content);
console.log('Done');
