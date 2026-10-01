<script lang="ts">
	import { X, Users, Mail, Shield, Globe, MapPin, CreditCard } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { db } from '$lib/store.svelte';

	let { isOpen = $bindable(), onClose = () => {} } = $props();

	// Mock state for the UI
	let email = 'user@family.com';
	let inviteEmail = $state('');

	let members = $state([
		{ email: 'user@family.com', role: 'Admin' },
		{ email: 'wife@family.com', role: 'Editor' },
		{ email: 'kid@family.com', role: 'Viewer' }
	]);

	function handleClose() {
		isOpen = false;
		if (onClose) onClose();
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		onclick={handleClose}
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
	>
		<div
			transition:scale={{ start: 0.9, duration: 400, easing: elasticOut }}
			onclick={(e) => e.stopPropagation()}
			class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
				<h2 class="flex items-center gap-2 text-xl font-bold text-amber-700">
					<Users size={24} />
					Family Account Pro
				</h2>
				<button
					onclick={handleClose}
					class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Body -->
			<div class="max-h-[70vh] overflow-y-auto px-6 py-6">
				<div class="space-y-8">
					<!-- 1. Account Information -->
					<section>
						<h3
							class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 uppercase"
						>
							<Mail size={16} /> Account Information
						</h3>
						<div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
							<p class="text-sm font-medium text-gray-700">Signed in as</p>
							<p class="text-lg text-gray-900">{email}</p>
						</div>
					</section>

					<!-- 2. Invite Member -->
					<section>
						<h3
							class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 uppercase"
						>
							<Users size={16} /> Invite Member
						</h3>
						<div class="flex gap-2">
							<input
								type="email"
								bind:value={inviteEmail}
								placeholder="family@member.com"
								class="flex-1 rounded-xl border border-gray-200 px-4 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
							/>
							<button
								class="rounded-xl bg-amber-600 px-6 py-2 font-medium text-white transition-colors hover:bg-amber-700"
							>
								Invite
							</button>
						</div>
					</section>

					<!-- 3. Roles and Permissions -->
					<section>
						<h3
							class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 uppercase"
						>
							<Shield size={16} /> Roles & Permissions
						</h3>
						<div class="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
							{#each members as member}
								<div class="flex items-center justify-between p-4">
									<p class="font-medium text-gray-700">{member.email}</p>
									<select
										class="rounded-lg border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 outline-none"
									>
										<option value="Admin" selected={member.role === 'Admin'}>Admin</option>
										<option value="Editor" selected={member.role === 'Editor'}>Editor</option>
										<option value="Viewer" selected={member.role === 'Viewer'}>Viewer</option>
									</select>
								</div>
							{/each}
						</div>
					</section>

					<!-- Settings Grid -->
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<!-- 4. Subscription -->
						<section>
							<h3
								class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 uppercase"
							>
								<CreditCard size={16} /> Subscription
							</h3>
							<div class="rounded-xl border border-amber-100 bg-amber-50 p-4">
								<p class="font-bold text-amber-800">Pro Plan</p>
								<p class="text-sm text-amber-600">Active (Sync & Sharing Enabled)</p>
							</div>
						</section>

						<!-- 5. Language -->
						<section>
							<h3
								class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 uppercase"
							>
								<Globe size={16} /> Language
							</h3>
							<div class="flex gap-2">
								<button class="flex-1 rounded-xl bg-gray-900 px-4 py-2 font-medium text-white">
									English
								</button>
								<button
									disabled
									class="flex-1 cursor-not-allowed rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-400 opacity-70"
								>
									Arabic (Soon)
								</button>
							</div>
						</section>

						<!-- 6. Country -->
						<section class="md:col-span-2">
							<h3
								class="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 uppercase"
							>
								<MapPin size={16} /> Region (Healthy Brands Database)
							</h3>
							<select
								bind:value={db.settings.country}
								class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
							>
								<option value="US">United States</option>
								<option value="MA">Morocco</option>
								<option value="SA">Saudi Arabia</option>
								<option value="GB">United Kingdom</option>
							</select>
							<p class="mt-2 text-xs text-gray-500">
								Select one country. This optimizes the product scanner to find local food quality
								ratings (Nutri-Score/NOVA).
							</p>
						</section>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t border-gray-100 bg-gray-50 px-6 py-4 text-right">
				<button
					onclick={handleClose}
					class="rounded-xl bg-gray-900 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
				>
					Save & Close
				</button>
			</div>
		</div>
	</div>
{/if}
