import { db } from '$lib/store.svelte';

export interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export function generateContextProjection(): string {
	const fridge = db.inventory
		.filter((item) => item.status === 'in_fridge')
		.map((item) => `- ${item.name}: ${item.quantityAmount} ${item.quantityUnit} (Expires: ${item.expiresIn})`)
		.join('\n');

	const shoppingList = db.inventory
		.filter((item) => item.status === 'to_buy')
		.map((item) => `- ${item.name}: ${item.quantityAmount} ${item.quantityUnit} (Cycle: ${item.cycle})`)
		.join('\n');

	const recipes = db.recipes
		.map(
			(recipe) =>
				`Recipe: ${recipe.title}
Macros: ${recipe.calories} calories, ${recipe.protein} protein
Ingredients: ${recipe.ingredients.map((i) => i.name).join(', ')}`
		)
		.join('\n\n');

	return `
[FRIDGE INVENTORY]
${fridge || 'Empty'}

[SHOPPING LIST]
${shoppingList || 'Empty'}

[RECIPES]
${recipes || 'Empty'}
`;
}

export async function streamOpenRouterChat(
	messages: ChatMessage[],
	apiKey: string,
	onChunk: (text: string) => void
): Promise<void> {
	if (!apiKey) {
		throw new Error('API key is missing.');
	}

	const context = generateContextProjection();
	const systemPrompt = `You are an expert AI Food & Kitchen Assistant.
Your ONLY purpose is to answer questions related to food, cooking, recipes, and grocery shopping.
You have access to the user's kitchen context:

<kitchen_context>
${context}
</kitchen_context>

RULES:
1. You are strictly read-only. You CANNOT mutate the database or modify lists. If a user asks you to add an item, explain how they can add it themselves.
2. Prices and currency are in Moroccan Dirham (MAD / DH) if applicable.
3. Always match the language of the user's prompt (Arabic, French, or English).
4. Do NOT answer non-food questions. Politely decline.
5. Use markdown for lists and emphasis.`;

	const fullMessages = [{ role: 'system', content: systemPrompt }, ...messages];

	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': window.location.href, // Required by OpenRouter
			'X-Title': 'Kitchen AI'
		},
		body: JSON.stringify({
			model: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
			messages: fullMessages,
			stream: true
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
	}

	if (!response.body) {
		throw new Error('ReadableStream not supported in this browser.');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder('utf-8');

	let done = false;
	let buffer = '';

	while (!done) {
		const { value, done: readerDone } = await reader.read();
		done = readerDone;
		if (value) {
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			// Keep the last partial line in the buffer
			buffer = lines.pop() || '';
			
			for (const line of lines) {
				if (line.startsWith('data: ') && line !== 'data: [DONE]') {
					const dataStr = line.slice(6);
					try {
						const data = JSON.parse(dataStr);
						const content = data.choices[0]?.delta?.content;
						if (content) {
							onChunk(content);
						}
					} catch (e) {
						// ignore parse errors for partial chunks
					}
				}
			}
		}
	}
}
