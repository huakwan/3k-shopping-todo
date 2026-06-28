<script lang="ts">
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	aria-label="เพิ่มสินค้าใหม่"
	class="fixed bottom-6 right-6 z-40 flex h-[60px] w-[60px] items-center justify-center rounded-full
	border-2 border-white/80 bg-brand-600 text-white shadow-fab transition-all duration-200
	hover:scale-110 hover:bg-brand-500 active:scale-95 sm:bottom-8 sm:right-8"
>
	<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
		<path d="M12 5v14M5 12h14" stroke-linecap="round" />
	</svg>
</button>
