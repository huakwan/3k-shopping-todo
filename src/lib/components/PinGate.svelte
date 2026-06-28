<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher<{ unlocked: void }>();

	const PIN_LENGTH = 6; // ปรับได้ 4-6 ตามที่ตั้งไว้ใน .env (APP_PIN)

	let digits: string[] = Array(PIN_LENGTH).fill('');
	let inputs: HTMLInputElement[] = [];
	let error = '';
	let checking = false;

	$: pinValue = digits.join('');

	async function focusInput(index: number) {
		await tick();
		inputs[index]?.focus();
	}

	function handleInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value.replace(/[^0-9]/g, '').slice(-1);
		digits[index] = value;
		error = '';

		if (value && index < PIN_LENGTH - 1) {
			focusInput(index + 1);
		}

		if (digits.every((d) => d !== '') && digits.length === PIN_LENGTH) {
			verifyPin();
		}
	}

	function handleKeydown(index: number, e: KeyboardEvent) {
		if (e.key === 'Backspace' && !digits[index] && index > 0) {
			focusInput(index - 1);
		}
	}

	function handlePaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text') ?? '';
		const nums = text.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH).split('');
		if (nums.length === 0) return;
		e.preventDefault();
		digits = Array(PIN_LENGTH)
			.fill('')
			.map((_, i) => nums[i] ?? '');
		const nextEmpty = digits.findIndex((d) => d === '');
		focusInput(nextEmpty === -1 ? PIN_LENGTH - 1 : nextEmpty);
		if (nums.length === PIN_LENGTH) verifyPin();
	}

	async function verifyPin() {
		if (checking) return;
		checking = true;
		error = '';

		try {
			const res = await fetch('/api/verify-pin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pin: pinValue })
			});
			const data = await res.json();

			if (data.ok) {
				sessionStorage.setItem('app_unlocked', '1');
				dispatch('unlocked');
			} else {
				error = data.error || 'รหัสไม่ถูกต้อง';
				digits = Array(PIN_LENGTH).fill('');
				focusInput(0);
			}
		} catch {
			error = 'เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่';
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
		class="glass-strong w-full max-w-sm rounded-3xl p-6 text-center shadow-glass-lg sm:p-8"
		transition:scale={{ duration: 280, start: 0.92, opacity: 0 }}
	>
		<div class="mb-1 text-4xl">🔒</div>
		<h1 class="mb-1 text-xl font-bold text-white">ใส่รหัสเพื่อเข้าใช้งาน</h1>
		<p class="mb-6 text-sm text-white/70">กรอกรหัส {PIN_LENGTH} หลักเพื่อปลดล็อก</p>

		<div class="mb-4 flex justify-center gap-2" on:paste={handlePaste}>
			{#each digits as digit, i}
				<input
					bind:this={inputs[i]}
					bind:value={digits[i]}
					on:input={(e) => handleInput(i, e)}
					on:keydown={(e) => handleKeydown(i, e)}
					type="tel"
					inputmode="numeric"
					maxlength="1"
					autocomplete="off"
					disabled={checking}
					aria-label={`หลักที่ ${i + 1}`}
					class="h-12 w-10 rounded-xl border text-center text-xl font-bold text-white outline-none transition-all
					{error
						? 'border-rose-400 bg-rose-500/10'
						: 'border-white/30 bg-white/10 focus:border-white focus:bg-white/20'}
					sm:h-14 sm:w-12"
				/>
			{/each}
		</div>

		{#if error}
			<p class="mb-2 text-sm font-medium text-rose-300" transition:fade={{ duration: 150 }}>
				{error}
			</p>
		{/if}

		{#if checking}
			<div class="flex justify-center pt-1">
				<svg class="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.3" />
					<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
				</svg>
			</div>
		{/if}
	</div>
</div>
