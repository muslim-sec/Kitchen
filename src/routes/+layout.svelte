<script lang="ts">
	import './layout.css';
	import {
		BookOpen,
		CalendarDays,
		Refrigerator,
		ShoppingCart,
		UserCircle,
		Menu,
		X
	} from '@lucide/svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade, crossfade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import FamilySettingsModal from '$lib/components/FamilySettingsModal.svelte';
	import AIChatWidget from '$lib/components/AIChatWidget.svelte';

	const [send, receive] = crossfade({
		duration: 300,
		easing: cubicOut
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();

	let sidebarOpen = $state(false);
	let showFamilyModal = $state(false);

	const navItems = [
		{ name: 'Dashboard', path: '/', icon: CalendarDays },
		{ name: 'Recipes', path: '/recipes', icon: BookOpen },
		{ name: 'Fridge', path: '/fridge', icon: Refrigerator },
		{ name: 'Shopping', path: '/shopping', icon: ShoppingCart }
	];
</script>

<div class="flex min-h-screen w-full">
	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen}
		<button
			class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
			transition:fade={{ duration: 200 }}
			onclick={() => (sidebarOpen = false)}
			aria-label="Close sidebar"
		></button>
	{/if}

	<!-- Sidebar -->
	<aside
		class="
		fixed top-0 z-50 flex h-screen
		w-64 flex-col border-e border-border-warm bg-surface transition-transform
		duration-400 ease-bounce lg:sticky
		{sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
	"
	>
		<div class="flex items-center justify-between p-6">
			<h1 class="flex items-center gap-2 text-2xl font-bold text-hearth-600">🍽️ Kitchen</h1>
			<button class="text-text-muted lg:hidden" onclick={() => (sidebarOpen = false)}>
				<X size={24} />
			</button>
		</div>

		<nav class="flex-1 space-y-2 px-4">
			{#each navItems as item (item.path)}
				<a
					href={item.path}
					class="relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors duration-150 {$page
						.url.pathname === item.path
						? 'text-hearth-700'
						: 'text-text-espresso hover:bg-hearth-50 hover:text-hearth-600'}"
					onclick={() => (sidebarOpen = false)}
				>
					{#if $page.url.pathname === item.path}
						<div
							class="absolute inset-0 rounded-xl bg-hearth-100"
							in:receive={{ key: 'nav-pill' }}
							out:send={{ key: 'nav-pill' }}
						></div>
					{/if}
					<item.icon
						size={20}
						class="relative z-10 {$page.url.pathname === item.path
							? 'text-hearth-600'
							: 'text-text-subtle'}"
					/>
					<span class="relative z-10">{item.name}</span>
				</a>
			{/each}
		</nav>

		<div class="border-t border-border-warm p-4">
			<button
				onclick={() => (showFamilyModal = true)}
				class="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-hearth-50"
			>
				<UserCircle size={24} class="text-text-muted" />
				<div class="text-start">
					<p class="text-sm font-semibold">Family Account</p>
					<p class="text-xs text-text-muted">Pro Plan</p>
				</div>
			</button>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="flex min-w-0 flex-1 flex-col">
		<!-- Mobile Header -->
		<header
			class="glass-panel sticky top-0 z-30 flex items-center justify-between border-b-0 px-4 py-3 lg:hidden"
		>
			<button class="text-text-espresso" onclick={() => (sidebarOpen = true)}>
				<Menu size={24} />
			</button>
			<h1 class="text-lg font-bold text-hearth-600">🍽️ Kitchen</h1>
			<div class="w-6"></div>
			<!-- Spacer for centering -->
		</header>

		<!-- Page Content -->
		<div class="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
			{@render children()}
		</div>
	</main>

	<FamilySettingsModal bind:isOpen={showFamilyModal} />
	<AIChatWidget />
</div>
