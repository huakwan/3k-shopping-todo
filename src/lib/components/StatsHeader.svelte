<script lang="ts">
	export let total: number;
	export let purchased: number;
	export let pending: number;

	$: progress = total > 0 ? Math.round((purchased / total) * 100) : 0;
</script>

<div class="glass rounded-2xl p-4 shadow-glass sm:p-5">
	<div class="flex items-center justify-between gap-3">
		<div>
			<h1 class="text-xl font-bold text-white sm:text-2xl">🛍️ รายการซื้อของ</h1>
			<p class="mt-0.5 text-sm text-white/70">
				เหลือ <span class="font-semibold text-white">{pending}</span> รายการ จากทั้งหมด {total} รายการ
			</p>
		</div>
		<div
			class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-sm font-bold text-white sm:h-16 sm:w-16 sm:text-base"
		>
			{progress}%
		</div>
	</div>

	{#if total > 0}
		<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15">
			<div
				class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500 ease-out"
				style="width: {progress}%"
			></div>
		</div>
	{/if}
</div>
