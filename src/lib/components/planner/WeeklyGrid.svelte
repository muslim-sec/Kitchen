<script lang="ts">
	import { db } from '$lib/store.svelte';
	import PlannerSlot from './PlannerSlot.svelte';
	import { Calendar } from 'lucide-svelte';

	// We only loop over the simple DayPlan array
</script>

<div class="w-full overflow-x-auto rounded-3xl border border-border-warm bg-surface p-2 shadow-sm">
	<table class="w-full min-w-[800px] border-collapse">
		<thead>
			<tr>
				<th class="w-32 py-4 pl-6 text-left text-sm font-bold text-text-muted"
					><Calendar size={18} class="-mt-0.5 mr-2 inline-block" /> Day</th
				>
				<th class="w-1/3 p-4 text-center text-lg font-bold text-hearth-700">Breakfast</th>
				<th class="w-1/3 p-4 text-center text-lg font-bold text-hearth-700">Lunch</th>
				<th class="w-1/3 p-4 text-center text-lg font-bold text-hearth-700">Dinner</th>
			</tr>
		</thead>
		<tbody>
			{#each db.weeklyPlan as plan, index}
				<tr
					class="group {index !== db.weeklyPlan.length - 1 ? 'border-b border-border-warm/50' : ''}"
				>
					<td class="py-4 pl-6 align-middle font-bold text-text-espresso">
						{plan.day}
					</td>
					<td class="p-2 align-top">
						<PlannerSlot day={plan.day} mealType="breakfast" />
					</td>
					<td class="p-2 align-top">
						<PlannerSlot day={plan.day} mealType="lunch" />
					</td>
					<td class="p-2 align-top">
						<PlannerSlot day={plan.day} mealType="dinner" />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
