<script lang="ts">
	import { CATEGORIES, type CategoryId } from '$lib/types/shopping';

	export let category: CategoryId;
	export let size: 'sm' | 'md' = 'md';

	$: meta = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[CATEGORIES.length - 1];
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 font-medium text-white backdrop-blur-md
	{size === 'sm' ? 'px-2.5 py-1 text-sm' : 'px-3.5 py-1.5 text-base'}"
>
	<span class={size === 'sm' ? 'text-base' : 'text-lg'}>{meta.emoji}</span>
	<span>{meta.label}</span>
</span>
