<script lang="ts">
	import type { ShoppingItem } from '$lib/types/shopping';
	import { shoppingStore } from '$lib/stores/shoppingStore';
	import CategoryBadge from './CategoryBadge.svelte';
	import { scale } from 'svelte/transition';

	export let item: ShoppingItem;
	export let onEdit: (item: ShoppingItem) => void;

	let deleting = false;
	let checkBouncing = false;

	function handleToggle() {
		checkBouncing = true;
		shoppingStore.togglePurchased(item);
		setTimeout(() => (checkBouncing = false), 400);
	}

	async function handleDelete() {
		deleting = true;
		await shoppingStore.deleteItem(item.id, item.name);
	}
</script>

{#if !deleting}
	<div
		class="glass group relative flex items-start gap-3 rounded-2xl p-4 shadow-glass transition-all duration-300 hover:bg-white/20 hover:shadow-glass-lg
		{item.is_purchased ? 'opacity-60' : ''}"
		transition:scale={{ duration: 220, start: 0.92 }}
	>
		<!-- Checkbox -->
		<button
			on:click={handleToggle}
			aria-label={item.is_purchased ? 'ยกเลิกสถานะซื้อแล้ว' : 'ทำเครื่องหมายว่าซื้อแล้ว'}
			class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
			{item.is_purchased
				? 'border-emerald-300 bg-emerald-400/90 text-emerald-950'
				: 'border-white/50 bg-white/10 text-transparent hover:border-white/80'}
			{checkBouncing ? 'animate-check-pop' : ''}"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
				<path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<div class="flex items-start justify-between gap-2">
				<h3
					class="truncate text-xl font-semibold text-white {item.is_purchased ? 'line-through' : ''}"
					title={item.name}
				>
					{item.name}
				</h3>
				<span class="shrink-0 text-lg font-medium text-white/80">
					{item.quantity} {item.unit}
				</span>
			</div>

			{#if item.note}
				<p class="mt-0.5 truncate text-sm text-white/65" title={item.note}>
					📝 {item.note}
				</p>
			{/if}

			<div class="mt-2 flex items-center justify-between gap-2">
				<CategoryBadge category={item.category} size="sm" />

				<div class="flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
					<button
						on:click={() => onEdit(item)}
						aria-label="แก้ไขรายการ"
						class="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/20 hover:text-white active:scale-90"
					>
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path
								d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					<button
						on:click={handleDelete}
						aria-label="ลบรายการ"
						class="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-all hover:bg-rose-500/30 hover:text-white active:scale-90"
					>
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path
								d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
