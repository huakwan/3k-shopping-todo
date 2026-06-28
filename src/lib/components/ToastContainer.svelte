<script lang="ts">
	import { toasts, dismissToast } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';

	const iconFor = {
		success: '✓',
		error: '✕',
		info: 'ℹ'
	};

	const colorFor = {
		success: 'border-emerald-300/50 bg-emerald-500/25',
		error: 'border-rose-300/50 bg-rose-500/25',
		info: 'border-sky-300/50 bg-sky-500/25'
	};

	const iconColorFor = {
		success: 'bg-emerald-400 text-emerald-950',
		error: 'bg-rose-400 text-rose-950',
		info: 'bg-sky-400 text-sky-950'
	};
</script>

<div
	class="pointer-events-none fixed top-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:top-6"
	aria-live="polite"
>
	{#each $toasts as toast (toast.id)}
		<div
			class="glass-strong pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-glass-lg {colorFor[
				toast.type
			]}"
			in:fly={{ y: -20, duration: 300 }}
			out:fly={{ y: -10, duration: 200 }}
			role="status"
		>
			<span
				class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold {iconColorFor[
					toast.type
				]}"
			>
				{iconFor[toast.type]}
			</span>
			<p class="flex-1 text-sm font-medium text-white">{toast.message}</p>
			<button
				on:click={() => dismissToast(toast.id)}
				class="text-white/60 transition-colors hover:text-white"
				aria-label="ปิดการแจ้งเตือน"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
				</svg>
			</button>
		</div>
	{/each}
</div>
