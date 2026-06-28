<script lang="ts">
	import { CATEGORIES, UNITS, type ShoppingItem, type CategoryId } from '$lib/types/shopping';
	import { shoppingStore } from '$lib/stores/shoppingStore';
	import { fade, scale } from 'svelte/transition';
	import { createEventDispatcher, tick } from 'svelte';

	export let open = false;
	export let editingItem: ShoppingItem | null = null;

	const dispatch = createEventDispatcher<{ close: void }>();

	let name = '';
	let quantity = 1;
	let unit: string = UNITS[0];
	let category: CategoryId = 'other';
	let note = '';
	let submitting = false;
	let nameInput: HTMLInputElement | null = null;

	$: if (open) {
		hydrateForm();
	}

	async function hydrateForm() {
		if (editingItem) {
			name = editingItem.name;
			quantity = editingItem.quantity;
			unit = editingItem.unit;
			category = editingItem.category;
			note = editingItem.note ?? '';
		} else {
			resetForm();
		}
		await tick();
		nameInput?.focus();
	}

	function resetForm() {
		name = '';
		quantity = 1;
		unit = UNITS[0];
		category = 'other';
		note = '';
	}

	function close() {
		dispatch('close');
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	async function handleSubmit() {
		if (!name.trim()) {
			nameInput?.focus();
			return;
		}
		submitting = true;

		const payload = {
			name: name.trim(),
			quantity: Number(quantity) || 1,
			unit,
			category,
			note: note.trim() || null
		};

		if (editingItem) {
			await shoppingStore.updateItem(editingItem.id, payload);
		} else {
			await shoppingStore.addItem(payload);
		}

		submitting = false;
		close();
	}
</script>

<svelte:window on:keydown={open ? handleKeydown : undefined} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center sm:p-4"
		on:click={handleBackdropClick}
		transition:fade={{ duration: 180 }}
		role="presentation"
	>
		<div
			class="glass-strong relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-6 shadow-glass-lg sm:rounded-3xl"
			transition:scale={{ duration: 280, start: 0.92, opacity: 0 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby="popup-title"
		>
			<div class="mb-5 flex items-center justify-between">
				<h2 id="popup-title" class="text-xl font-bold text-white">
					{editingItem ? '✏️ แก้ไขสินค้า' : '🛒 เพิ่มสินค้าใหม่'}
				</h2>
				<button
					on:click={close}
					aria-label="ปิดหน้าต่าง"
					class="btn-icon"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<!-- ชื่อสินค้า -->
				<div>
					<label class="label-field" for="item-name">ชื่อสินค้า</label>
					<input
						id="item-name"
						bind:this={nameInput}
						bind:value={name}
						type="text"
						placeholder="เช่น นมสด, ไข่ไก่, แอปเปิ้ล"
						class="input-field"
						required
					/>
				</div>

				<!-- จำนวน + หน่วย -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label-field" for="item-qty">จำนวน</label>
						<input
							id="item-qty"
							bind:value={quantity}
							type="number"
							min="0"
							step="0.5"
							class="input-field"
							required
						/>
					</div>
					<div>
						<label class="label-field" for="item-unit">หน่วย</label>
						<select id="item-unit" bind:value={unit} class="input-field appearance-none">
							{#each UNITS as u}
								<option value={u} class="bg-indigo-900 text-white">{u}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- หมวดหมู่ -->
				<div>
					<label class="label-field" for="item-category">หมวดหมู่</label>
					<div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
						{#each CATEGORIES as cat}
							<button
								type="button"
								on:click={() => (category = cat.id)}
								class="flex flex-col items-center gap-1 rounded-xl border px-1.5 py-2.5 text-center transition-all duration-150
								{category === cat.id
									? 'border-white bg-white/30 shadow-md'
									: 'border-white/20 bg-white/5 hover:bg-white/15'}"
							>
								<span class="text-xl leading-none">{cat.emoji}</span>
								<span class="text-[11px] leading-tight text-white/90">{cat.label}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- หมายเหตุ -->
				<div>
					<label class="label-field" for="item-note">หมายเหตุ (ไม่บังคับ)</label>
					<textarea
						id="item-note"
						bind:value={note}
						rows="2"
						placeholder="เช่น แบรนด์ที่ชอบ, ขนาด, สี"
						class="input-field resize-none"
					></textarea>
				</div>

				<div class="flex gap-3 pt-2">
					<button type="button" on:click={close} class="btn-secondary flex-1">
						ยกเลิก
					</button>
					<button type="submit" class="btn-primary flex-1" disabled={submitting}>
						{#if submitting}
							<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.3" />
								<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
							</svg>
						{:else}
							{editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
