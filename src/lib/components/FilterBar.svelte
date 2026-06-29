<script lang="ts">
	import { CATEGORIES } from '$lib/types/shopping';
	import { shoppingStore } from '$lib/stores/shoppingStore';
	import type { FilterStatus, SortOption, CategoryId } from '$lib/types/shopping';

	export let search = '';
	export let filterCategory: CategoryId | 'all' = 'all';
	export let filterStatus: FilterStatus = 'all';
	export let sort: SortOption = 'created_desc';

	let showFilters = false;

	function handleSearchInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		shoppingStore.setSearch(value);
	}

	const statusOptions: { id: FilterStatus; label: string }[] = [
		{ id: 'all', label: 'ทั้งหมด' },
		{ id: 'pending', label: 'ยังไม่ซื้อ' },
		{ id: 'purchased', label: 'ซื้อแล้ว' }
	];

	const sortOptions: { id: SortOption; label: string }[] = [
		{ id: 'created_desc', label: 'ใหม่สุดก่อน' },
		{ id: 'created_asc', label: 'เก่าสุดก่อน' },
		{ id: 'name_asc', label: 'ชื่อ ก-ฮ' },
		{ id: 'category_asc', label: 'หมวดหมู่' }
	];

	function handleSortChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value as SortOption;
		shoppingStore.setSort(value);
	}
</script>

<div class="p-3 space-y-3 glass rounded-2xl shadow-glass sm:p-4">
	<!-- Search + filter toggle -->
	<div class="flex items-center gap-2">
		<div class="relative flex-1">
			<svg
				class="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-white/50"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" stroke-linecap="round" />
			</svg>
			<input
				type="search"
				value={search}
				on:input={handleSearchInput}
				placeholder="ค้นหารายการ"
				class="pl-10 input-field"
			/>
		</div>
		<button
			on:click={() => (showFilters = !showFilters)}
			class="btn-icon h-[42px] w-[42px] shrink-0 {showFilters ? 'border-white bg-white/30' : ''}"
			aria-label="ตัวกรองและการเรียงลำดับ"
			aria-expanded={showFilters}
		>
			<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 6h18M7 12h10M10 18h4" stroke-linecap="round" />
			</svg>
		</button>
	</div>

	{#if showFilters}
		<div class="pt-3 space-y-3 border-t border-white/15">
			<!-- Status filter -->
			<div>
				<p class="mb-1.5 text-xs font-medium text-white/70">สถานะ</p>
				<div class="flex flex-wrap gap-1.5">
					{#each statusOptions as opt}
						<button
							on:click={() => shoppingStore.setFilterStatus(opt.id)}
							class="rounded-full border px-3 py-1.5 text-sm font-medium transition-all
							{filterStatus === opt.id
								? 'border-white bg-white/30 text-white'
								: 'border-white/25 bg-white/5 text-white/75 hover:bg-white/15'}"
						>
							{opt.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Category filter -->
			<div>
				<p class="mb-1.5 text-xs font-medium text-white/70">หมวดหมู่</p>
				<div class="flex flex-wrap gap-1.5">
					<button
						on:click={() => shoppingStore.setFilterCategory('all')}
						class="rounded-full border px-3 py-1.5 text-sm font-medium transition-all
						{filterCategory === 'all'
							? 'border-white bg-white/30 text-white'
							: 'border-white/25 bg-white/5 text-white/75 hover:bg-white/15'}"
					>
						ทั้งหมด
					</button>
					{#each CATEGORIES as cat}
						<button
							on:click={() => shoppingStore.setFilterCategory(cat.id)}
							class="rounded-full border px-3 py-1.5 text-sm font-medium transition-all
							{filterCategory === cat.id
								? 'border-white bg-white/30 text-white'
								: 'border-white/25 bg-white/5 text-white/75 hover:bg-white/15'}"
						>
							<span class="text-base">{cat.emoji}</span> {cat.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Sort -->
			<div>
				<p class="mb-1.5 text-xs font-medium text-white/70">เรียงลำดับ</p>
				<select
					value={sort}
					on:change={handleSortChange}
					class="text-sm appearance-none input-field"
				>
					{#each sortOptions as opt}
						<option value={opt.id} class="text-white bg-indigo-900">{opt.label}</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}
</div>
