import fs from 'fs';
const path = '/Users/mac/kitchen/src/routes/shopping/+page.svelte';
let content = fs.readFileSync(path, 'utf8');

// Add cycleFilter state
content = content.replace(
    "let viewMode = $state<'to_buy' | 'all'>('all');",
    "let viewMode = $state<'to_buy' | 'all'>('all');\n\tlet cycleFilter = $state<'all' | 'weekly' | 'biweekly' | 'monthly'>('all');"
);

fs.writeFileSync(path, content);
console.log('Fixed state');
