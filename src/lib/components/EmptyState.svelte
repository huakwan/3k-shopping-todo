<script lang="ts">
	export let hasItems: boolean;
</script>

<div class="glass flex flex-col items-center gap-3 rounded-2xl p-10 text-center shadow-glass">
	<span class="text-5xl">{hasItems ? '🔍' : '🛒'}</span>
	<h3 class="text-lg font-semibold text-white">
		{hasItems ? 'ไม่พบรายการที่ตรงกับการค้นหา' : 'ยังไม่มีรายการในตะกร้า'}
	</h3>
	<p class="max-w-xs text-sm text-white/65">
		{hasItems
			? 'ลองปรับคำค้นหาหรือตัวกรองดูใหม่'
			: 'แตะปุ่ม + ด้านขวาล่างเพื่อเริ่มเพิ่มสินค้าที่ต้องซื้อ'}
	</p>
</div>
