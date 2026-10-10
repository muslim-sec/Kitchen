<script lang="ts">
	import { Mascot } from 'page-mascot';
	import { db } from '$lib/store.svelte';
	import { Send, X, RotateCcw, Loader2 } from 'lucide-svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import { elasticOut, cubicOut } from 'svelte/easing';
	import { streamOpenRouterChat, type ChatMessage } from '$lib/services/aiChat';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { onMount, onDestroy } from 'svelte';
	import { createRoot, type Root } from 'react-dom/client';
	import { createElement } from 'react';

	let isOpen = $state(false);
	let messages = $state<ChatMessage[]>([]);
	let inputValue = $state('');
	let isGenerating = $state(false);
	let chatContainer: HTMLElement;
	let mascotContainer: HTMLElement;
	let reactRoot: Root | null = null;

	onMount(() => {
		if (mascotContainer) {
			reactRoot = createRoot(mascotContainer);
			reactRoot.render(
				createElement(Mascot, {
					directions: '/mascots/chef-directions.webp',
					reactions: '/mascots/chef-reactions.webp'
				})
			);
		}
	});

	onDestroy(() => {
		if (reactRoot) {
			setTimeout(() => reactRoot!.unmount(), 0);
		}
	});

	function toggleChat() {
		isOpen = !isOpen;
	}

	function clearChat() {
		messages = [];
	}

	async function handleSubmit(e?: Event) {
		if (e) e.preventDefault();
		const msg = inputValue.trim();
		if (!msg || isGenerating) return;

		const apiKey = db.settings.openRouterApiKey;
		if (!apiKey) {
			messages.push({
				role: 'assistant',
				content: 'Please add your OpenRouter API Key in the Family Settings to use the Chef.'
			});
			return;
		}

		// Add user message
		messages.push({ role: 'user', content: msg });
		inputValue = '';
		isGenerating = true;

		// Add an empty assistant message to stream into
		const aiMsgIndex = messages.length;
		messages.push({ role: 'assistant', content: '' });

		scrollToBottom();

		try {
			await streamOpenRouterChat(messages.slice(0, aiMsgIndex), apiKey, (chunk) => {
				messages[aiMsgIndex].content += chunk;
				scrollToBottom();
			});
		} catch (err: any) {
			messages[aiMsgIndex].content = `**Error:** ${err.message}`;
		} finally {
			isGenerating = false;
		}
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 10);
	}

	function renderMarkdown(content: string) {
		const rawHtml = marked.parse(content) as string;
		return DOMPurify.sanitize(rawHtml);
	}
</script>

<!-- The Mascot Trigger (positioned bottom-right) -->
<div class="fixed bottom-6 right-6 z-[100] cursor-pointer hover:scale-105 transition-transform">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={toggleChat} bind:this={mascotContainer} class="h-[120px] w-[120px]">
	</div>
</div>

<!-- Chat Popup Window -->
{#if isOpen}
	<div
		transition:scale={{ start: 0.9, duration: 400, easing: elasticOut }}
		class="fixed bottom-32 right-6 z-[90] flex h-[500px] max-h-[70vh] w-96 flex-col overflow-hidden rounded-3xl border border-border-warm bg-surface shadow-2xl"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-border-warm bg-hearth-50 px-4 py-3">
			<div class="flex items-center gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-hearth-200 text-lg">
					👨‍🍳
				</div>
				<div>
					<h3 class="text-sm font-bold text-text-espresso">Chef AI</h3>
					<p class="text-xs text-text-muted">Powered by Nemotron</p>
				</div>
			</div>
			<div class="flex items-center gap-1">
				<button
					onclick={clearChat}
					class="rounded-full p-2 text-text-muted transition-colors hover:bg-border-warm hover:text-text-espresso"
					title="Clear Conversation"
				>
					<RotateCcw size={16} />
				</button>
				<button
					onclick={toggleChat}
					class="rounded-full p-2 text-text-muted transition-colors hover:bg-border-warm hover:text-text-espresso"
				>
					<X size={20} />
				</button>
			</div>
		</div>

		<!-- Chat History -->
		<div
			bind:this={chatContainer}
			class="flex-1 overflow-y-auto bg-canvas p-4 space-y-4"
		>
			{#if messages.length === 0}
				<div class="flex h-full flex-col items-center justify-center text-center text-text-muted">
					<div class="mb-3 text-4xl">🥘</div>
					<p class="text-sm">Hi! I'm your virtual chef.</p>
					<p class="text-xs">Ask me about your fridge or what to cook!</p>
				</div>
			{/if}

			{#each messages as msg}
				<div class="flex w-full {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] px-4 py-2 text-sm leading-relaxed
						{msg.role === 'user'
							? 'bg-blue-500 text-white rounded-2xl rounded-tr-sm'
							: 'bg-surface-warm text-text-espresso rounded-2xl rounded-tl-sm border border-border-warm shadow-sm prose prose-sm prose-p:my-1 prose-ul:my-1 prose-ol:my-1'}"
					>
						{#if msg.role === 'assistant'}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html renderMarkdown(msg.content)}
						{:else}
							{msg.content}
						{/if}
					</div>
				</div>
			{/each}

			{#if isGenerating}
				<div class="flex w-full justify-start">
					<div class="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border-warm bg-surface-warm px-4 py-3 text-text-muted shadow-sm">
						<Loader2 size={16} class="animate-spin" />
						<span class="text-xs">Chef is thinking...</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Input Area -->
		<form
			onsubmit={handleSubmit}
			class="flex items-end gap-2 border-t border-border-warm bg-surface p-3"
		>
			<input
				type="text"
				bind:value={inputValue}
				placeholder="Ask the chef..."
				class="max-h-32 flex-1 resize-none rounded-2xl border border-border-warm bg-canvas px-4 py-2.5 text-sm outline-none focus:border-hearth-400 focus:ring-1 focus:ring-hearth-400"
				disabled={isGenerating}
			/>
			<button
				type="submit"
				disabled={!inputValue.trim() || isGenerating}
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
			>
				<Send size={18} class="-ml-0.5 mt-0.5" />
			</button>
		</form>
	</div>
{/if}
