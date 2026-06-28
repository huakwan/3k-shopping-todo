<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import PinGate from '$lib/components/PinGate.svelte';

	let ready = false;
	let unlocked = false;

	onMount(async () => {
		// เช็คว่าปลดล็อก PIN ไว้แล้วในแท็บนี้หรือยัง (sessionStorage = หายเมื่อปิดแท็บ/แอป)
		unlocked = sessionStorage.getItem('app_unlocked') === '1';

		// แอปนี้ใช้ Anonymous Auth ของ Supabase เพื่อให้ RLS แยกข้อมูลของแต่ละผู้ใช้
		// (เปิดใช้งานได้ที่ Authentication > Providers > Anonymous Sign-Ins)
		const { data: sessionData } = await supabase.auth.getSession();

		if (!sessionData.session) {
			const { error } = await supabase.auth.signInAnonymously();
			if (error) {
				console.error('Anonymous sign-in failed:', error.message);
			}
		}

		ready = true;
	});

	function handleUnlocked() {
		unlocked = true;
	}
</script>

<div class="min-h-screen w-full bg-app-gradient">
	<!-- decorative blurred orbs for extra depth -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
		<div class="absolute right-[-10rem] top-1/3 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"></div>
		<div class="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
	</div>

	<ToastContainer />

	{#if !ready}
		<div class="flex min-h-screen items-center justify-center">
			<svg class="h-10 w-10 animate-spin text-white" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.3" />
				<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
			</svg>
		</div>
	{:else if !unlocked}
		<PinGate on:unlocked={handleUnlocked} />
	{:else}
		<slot />
	{/if}
</div>
