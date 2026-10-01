<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { AlertTriangle, CheckCircle2 } from 'lucide-svelte';

	let { expiresIn = '7 days' } = $props<{ expiresIn?: string }>();

	function parseDays(str: string) {
		const match = str.match(/\d+/);
		return match ? parseInt(match[0]) : 7;
	}

	let days = $derived(parseDays(expiresIn));
	let isExpiringSoon = $derived(days <= 2);

	// Max freshness assumed 14 days
	let targetPercentage = $derived(Math.max(0, Math.min(100, (days / 14) * 100)));

	// Circumference for r=14 is 2 * Math.PI * 14 ~= 87.96
	const CIRCUMFERENCE = 87.96;

	let progressTween = new Tween(0, { duration: 1200, easing: cubicOut });

	$effect(() => {
		progressTween.set(targetPercentage);
	});

	let dashoffset = $derived(CIRCUMFERENCE - (progressTween.current / 100) * CIRCUMFERENCE);
</script>

<div
	class="flex w-fit items-center gap-2 rounded-lg px-2 py-1 {isExpiringSoon
		? 'bg-flame/10 text-flame'
		: 'bg-basil/10 text-basil'}"
>
	<div class="relative flex h-8 w-8 items-center justify-center">
		<!-- Background Ring -->
		<svg class="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
			<circle
				cx="18"
				cy="18"
				r="14"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				class="opacity-20"
			/>
			<!-- Progress Ring -->
			<circle
				cx="18"
				cy="18"
				r="14"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-dasharray={CIRCUMFERENCE}
				stroke-dashoffset={dashoffset}
				stroke-linecap="round"
			/>
		</svg>
		<div class="z-10 {isExpiringSoon ? 'animate-pulse' : ''}">
			{#if isExpiringSoon}
				<AlertTriangle size={12} />
			{:else}
				<CheckCircle2 size={12} />
			{/if}
		</div>
	</div>
	<span class="text-xs font-bold whitespace-nowrap">
		{isExpiringSoon ? 'Expires in ' : 'Good for '}{expiresIn}
	</span>
</div>
