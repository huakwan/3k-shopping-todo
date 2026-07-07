<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher<{ unlocked: void }>();

	const PIN_LENGTH = 6; // ปรับได้ 4-6 ตามที่ตั้งไว้ใน .env (APP_PIN)
	const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

	let digits: string[] = [];
	let error = '';
	let checking = false;
	let shake = false;

	function pressKey(key: string) {
		if (checking || !key) return;
		error = '';

		if (key === 'backspace') {
			digits = digits.slice(0, -1);
			return;
		}

		if (digits.length >= PIN_LENGTH) return;

		digits = [...digits, key];

		if (digits.length === PIN_LENGTH) {
			verifyPin(digits.join(''));
		}
	}

	async function verifyPin(pin: string) {
		if (checking) return;
		checking = true;
		error = '';

		try {
			const res = await fetch('/api/verify-pin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pin })
			});
			const data = await res.json();

			if (data.ok) {
				sessionStorage.setItem('app_unlocked', '1');
				dispatch('unlocked');
			} else {
				error = data.error || 'รหัสไม่ถูกต้อง';
				digits = [];
				shake = true;
				setTimeout(() => (shake = false), 400);
			}
		} catch {
			error = 'เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่';
			digits = [];
		} finally {
			checking = false;
		}
	}
</script>

<div
	class="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-app-gradient p-4"
	transition:fade={{ duration: 200 }}
>
	<div
		class="glass-strong w-full max-w-xs rounded-3xl p-6 text-center shadow-glass-lg sm:p-8"
		transition:scale={{ duration: 280, start: 0.92, opacity: 0 }}
	>
		<div class="mb-1 text-4xl">🔒</div>
		<h1 class="mb-1 text-xl font-bold text-white">ใส่รหัสเพื่อเข้าใช้งาน</h1>
		<p class="mb-6 text-sm text-white/70">กรอกรหัส {PIN_LENGTH} หลักเพื่อปลดล็อก</p>

		<div class="mb-2 flex justify-center gap-3" class:animate-shake={shake}>
			{#each Array(PIN_LENGTH) as _, i}
				<span
					class="h-3.5 w-3.5 rounded-full border transition-all
					{error
						? 'border-rose-400 bg-rose-400'
						: digits[i] !== undefined
							? 'border-white bg-white'
							: 'border-white/40 bg-transparent'}"
				></span>
			{/each}
		</div>

		<div class="mb-4 h-5">
			{#if error}
				<p class="text-sm font-medium text-rose-300" transition:fade={{ duration: 150 }}>
					{error}
				</p>
			{:else if checking}
				<div class="flex justify-center">
					<svg class="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.3" />
						<path
							d="M22 12a10 10 0 0 1-10 10"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
						/>
					</svg>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-3 gap-3">
			{#each KEYPAD as key}
				{#if key === ''}
					<div></div>
				{:else if key === 'backspace'}
					<button
						type="button"
						disabled={checking}
						on:click={() => pressKey(key)}
						aria-label="ลบตัวเลข"
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white/80 transition-all active:scale-90 active:bg-white/10 disabled:opacity-40 sm:h-16 sm:w-16"
					>
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
							<path
								d="M9 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-6-6 6-6Z"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linejoin="round"
							/>
							<path
								d="M14 10l4 4m0-4-4 4"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				{:else}
					<button
						type="button"
						disabled={checking}
						on:click={() => pressKey(key)}
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-semibold text-white transition-all active:scale-90 active:bg-white/25 disabled:opacity-40 sm:h-16 sm:w-16"
					>
						{key}
					</button>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	@keyframes shake {
		10%,
		90% {
			transform: translateX(-2px);
		}
		20%,
		80% {
			transform: translateX(4px);
		}
		30%,
		50%,
		70% {
			transform: translateX(-8px);
		}
		40%,
		60% {
			transform: translateX(8px);
		}
	}

	.animate-shake {
		animation: shake 0.4s ease-in-out;
	}
</style>
