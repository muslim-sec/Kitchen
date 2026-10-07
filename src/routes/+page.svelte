<script lang="ts">
	import { Flame, Droplets, Leaf, ChevronRight, CheckCircle2, Clock, ExternalLink } from '@lucide/svelte';

	const platforms = [
		{ name: 'BBC Good Food', url: 'https://www.bbcgoodfood.com', icon: '🌍' },
		{ name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
		{ name: 'Epicurious', url: 'https://www.epicurious.com', icon: '🍽️' },
		{ name: 'NYT Cooking', url: 'https://cooking.nytimes.com', icon: '📰' },
		{ name: "What's For Dinner", url: 'https://whatsfordinner.com/recipes/', icon: '🥘' },
		{ name: "America's Test Kitchen", url: 'https://www.americastestkitchen.com/', icon: '🧪' },
		{ name: 'Food Network', url: 'https://www.foodnetwork.com/', icon: '📺' },
		{ name: 'ChefSteps', url: 'https://www.chefsteps.com/', icon: '👨‍🍳' },
		{ name: 'Food Wishes', url: 'https://www.youtube.com/user/foodwishes', icon: '🌟' },
		{ name: 'VideoCulinary', url: 'https://videoculinary.com/', icon: '🎬' },
		{ name: 'The Novice Chef', url: 'https://thenovicechefblog.com/', icon: '👩‍🍳' },
		{ name: 'Tasty', url: 'https://tasty.co/', icon: '🍕' },
		{ name: 'Serious Eats', url: 'https://www.seriouseats.com/', icon: '🔬' },
		{ name: 'RecipeTin Eats', url: 'https://www.recipetineats.com/', icon: '🍲' },
		{ name: 'The Woks of Life', url: 'https://thewoksoflife.com/', icon: '🥡' },
		{ name: 'Just One Cookbook', url: 'https://www.justonecookbook.com/', icon: '🍱' },
		{ name: 'Hot Thai Kitchen', url: 'https://hot-thai-kitchen.com/', icon: '🌶️' },
		{ name: "Omnivore's Cookbook", url: 'https://omnivorescookbook.com/', icon: '🥢' },
		{ name: 'Chef in Disguise', url: 'https://chefindisguise.com/', icon: '🥙' },
		{ name: 'Hungry Paprikas', url: 'https://www.hungrypaprikas.com/', icon: '🧆' },
		{ name: "Fufu's Kitchen", url: 'https://www.fufuskitchen.com/', icon: '🍋' },
		{ name: 'The Mediterranean Dish', url: 'https://www.themediterraneandish.com/', icon: '🍅' }
	];

	// Mock data for MVP
	const todayMeals = [
		{ id: 1, type: 'Breakfast', name: 'Eggs & Veg', cals: 295, status: 'prepped', time: null },
		{ id: 2, type: 'Lunch', name: 'Chicken Bowl', cals: 480, status: 'prepped', time: null },
		{ id: 3, type: 'Dinner', name: 'Kabsa', cals: 680, status: 'cook', time: '25m' }
	];
</script>

<div class="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700 ease-spring">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-text-espresso">Good Evening!</h1>
		<p class="mt-1 text-lg text-text-muted">Something delicious simmering today?</p>
	</div>

	<!-- Nutrition Ring Card (Luminous Glow) -->
	<section class="glass-panel relative overflow-hidden rounded-3xl p-6">
		<div
			class="pointer-events-none absolute inset-0 bg-gradient-to-br from-hearth-100/40 to-transparent"
		></div>

		<div class="relative flex flex-col items-center gap-8 md:flex-row">
			<!-- Circular Progress Placeholder -->
			<div class="relative flex h-40 w-40 shrink-0 items-center justify-center">
				<!-- Outer ring -->
				<div class="absolute inset-0 rounded-full border-[12px] border-hearth-100"></div>
				<!-- Progress arc (simulated with CSS for now) -->
				<svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
					<circle
						cx="50"
						cy="50"
						r="44"
						fill="none"
						stroke="currentColor"
						stroke-width="12"
						class="text-hearth-500 drop-shadow-md"
						stroke-dasharray="276"
						stroke-dashoffset="88"
						stroke-linecap="round"
					/>
				</svg>
				<div class="text-center">
					<Flame size={28} class="mx-auto mb-1 text-paprika" />
					<div class="text-2xl leading-none font-bold">1,420</div>
					<div class="mt-1 text-xs text-text-muted">/ 2,100 kcal</div>
				</div>
			</div>

			<!-- Macro Breakdown -->
			<div class="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="rounded-2xl border border-border-warm bg-surface-warm/50 p-4">
					<div class="mb-2 flex items-center justify-between">
						<span class="flex items-center gap-1 text-sm font-semibold"
							><Flame size={16} class="text-paprika" /> Protein</span
						>
						<span class="text-sm font-bold">85g</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-border-warm">
						<div class="h-full rounded-full bg-paprika" style="width: 70%"></div>
					</div>
				</div>
				<div class="rounded-2xl border border-border-warm bg-surface-warm/50 p-4">
					<div class="mb-2 flex items-center justify-between">
						<span class="flex items-center gap-1 text-sm font-semibold"
							><Leaf size={16} class="text-hearth-500" /> Carbs</span
						>
						<span class="text-sm font-bold">140g</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-border-warm">
						<div class="h-full rounded-full bg-hearth-500" style="width: 60%"></div>
					</div>
				</div>
				<div class="rounded-2xl border border-border-warm bg-surface-warm/50 p-4">
					<div class="mb-2 flex items-center justify-between">
						<span class="flex items-center gap-1 text-sm font-semibold"
							><Droplets size={16} class="text-flame" /> Fats</span
						>
						<span class="text-sm font-bold">48g</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-border-warm">
						<div class="h-full rounded-full bg-flame" style="width: 45%"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Expiring Soon Banner -->
	<section
		class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-flame/20 bg-flame/10 p-4 sm:flex-row"
	>
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flame/20 text-flame"
			>
				⚠️
			</div>
			<div>
				<h3 class="font-semibold text-flame">Expiring Soon</h3>
				<p class="text-sm text-text-espresso">Greek Yogurt (1d), Spinach (2d)</p>
			</div>
		</div>
		<button
			class="rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold text-hearth-700 shadow-sm transition-all hover:shadow-md"
		>
			Find Recipes ✨
		</button>
	</section>

	<!-- Today's Meals -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="flex items-center gap-2 text-xl font-bold">🍳 Today's Meals</h2>
			<a
				href="/recipes"
				class="flex items-center text-sm font-semibold text-hearth-600 hover:underline"
			>
				View all <ChevronRight size={16} />
			</a>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each todayMeals as meal}
				<div
					class="glass-panel group cursor-pointer rounded-2xl p-5 transition-all hover:shadow-cozy"
				>
					<div class="mb-1 text-xs font-semibold tracking-wider text-hearth-600 uppercase">
						{meal.type}
					</div>
					<h3 class="mb-1 text-lg font-bold transition-colors group-hover:text-hearth-600">
						{meal.name}
					</h3>
					<div class="mb-4 text-sm text-text-muted">{meal.cals} kcal</div>

					{#if meal.status === 'prepped'}
						<div
							class="inline-flex items-center gap-1.5 rounded-lg bg-basil/10 px-3 py-1.5 text-xs font-bold text-basil"
						>
							<CheckCircle2 size={14} /> Prepped
						</div>
					{:else}
						<div
							class="inline-flex items-center gap-1.5 rounded-lg bg-paprika/10 px-3 py-1.5 text-xs font-bold text-paprika"
						>
							<Clock size={14} /> Cook Mode ({meal.time})
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- My Platforms / Sources -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="flex items-center gap-2 text-xl font-bold">🌍 My Recipe Platforms</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
			{#each platforms as platform}
				<a
					href={platform.url}
					target="_blank"
					rel="noopener noreferrer"
					class="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-all hover:shadow-cozy"
				>
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-warm text-xl">
							{platform.icon}
						</div>
						<div class="font-bold text-sm transition-colors group-hover:text-hearth-600">
							{platform.name}
						</div>
					</div>
					<ExternalLink size={16} class="text-text-muted group-hover:text-hearth-600" />
				</a>
			{/each}
		</div>
	</section>
</div>
