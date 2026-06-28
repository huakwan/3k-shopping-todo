import { writable, derived } from 'svelte/store';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase/client';
import type {
	ShoppingItem,
	NewShoppingItem,
	SortOption,
	FilterStatus,
	CategoryId
} from '$lib/types/shopping';
import { addToast } from './toast';

interface ShoppingState {
	items: ShoppingItem[];
	loading: boolean;
	error: string | null;
	search: string;
	filterCategory: CategoryId | 'all';
	filterStatus: FilterStatus;
	sort: SortOption;
}

const initialState: ShoppingState = {
	items: [],
	loading: true,
	error: null,
	search: '',
	filterCategory: 'all',
	filterStatus: 'all',
	sort: 'created_desc'
};

function createShoppingStore() {
	const state = writable<ShoppingState>(initialState);
	let channel: RealtimeChannel | null = null;

	function upsertLocal(item: ShoppingItem) {
		state.update((s) => {
			const idx = s.items.findIndex((i) => i.id === item.id);
			if (idx === -1) {
				return { ...s, items: [item, ...s.items] };
			}
			const items = [...s.items];
			items[idx] = item;
			return { ...s, items };
		});
	}

	function removeLocal(id: string) {
		state.update((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
	}

	async function fetchAll() {
		state.update((s) => ({ ...s, loading: true, error: null }));
		const { data, error } = await supabase
			.from('shopping_items')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			state.update((s) => ({ ...s, loading: false, error: error.message }));
			addToast('error', 'โหลดข้อมูลไม่สำเร็จ: ' + error.message);
			return;
		}

		state.update((s) => ({ ...s, items: (data as ShoppingItem[]) ?? [], loading: false }));
	}

	function subscribeRealtime() {
		if (channel) return;
		channel = supabase
			.channel('shopping_items_changes')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'shopping_items' },
				(payload) => {
					if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
						upsertLocal(payload.new as ShoppingItem);
					} else if (payload.eventType === 'DELETE') {
						removeLocal((payload.old as { id: string }).id);
					}
				}
			)
			.subscribe();
	}

	function unsubscribeRealtime() {
		if (channel) {
			supabase.removeChannel(channel);
			channel = null;
		}
	}

	async function addItem(newItem: NewShoppingItem) {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		const { data, error } = await supabase
			.from('shopping_items')
			.insert({
				...newItem,
				user_id: user?.id,
				is_purchased: false
			})
			.select()
			.single();

		if (error) {
			addToast('error', 'เพิ่มสินค้าไม่สำเร็จ: ' + error.message);
			return null;
		}

		// Realtime will also push this, but we upsert immediately for snappy UX
		upsertLocal(data as ShoppingItem);
		addToast('success', `เพิ่ม "${newItem.name}" แล้ว`);
		return data;
	}

	async function updateItem(id: string, patch: Partial<NewShoppingItem>) {
		const { data, error } = await supabase
			.from('shopping_items')
			.update({ ...patch, updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();

		if (error) {
			addToast('error', 'แก้ไขสินค้าไม่สำเร็จ: ' + error.message);
			return null;
		}

		upsertLocal(data as ShoppingItem);
		addToast('success', 'แก้ไขรายการแล้ว');
		return data;
	}

	async function togglePurchased(item: ShoppingItem) {
		const { data, error } = await supabase
			.from('shopping_items')
			.update({ is_purchased: !item.is_purchased, updated_at: new Date().toISOString() })
			.eq('id', item.id)
			.select()
			.single();

		if (error) {
			addToast('error', 'อัปเดตสถานะไม่สำเร็จ: ' + error.message);
			return;
		}

		upsertLocal(data as ShoppingItem);
	}

	async function deleteItem(id: string, name: string) {
		const { error } = await supabase.from('shopping_items').delete().eq('id', id);

		if (error) {
			addToast('error', 'ลบสินค้าไม่สำเร็จ: ' + error.message);
			return;
		}

		removeLocal(id);
		addToast('info', `ลบ "${name}" แล้ว`);
	}

	function setSearch(value: string) {
		state.update((s) => ({ ...s, search: value }));
	}
	function setFilterCategory(value: CategoryId | 'all') {
		state.update((s) => ({ ...s, filterCategory: value }));
	}
	function setFilterStatus(value: FilterStatus) {
		state.update((s) => ({ ...s, filterStatus: value }));
	}
	function setSort(value: SortOption) {
		state.update((s) => ({ ...s, sort: value }));
	}

	return {
		subscribe: state.subscribe,
		fetchAll,
		subscribeRealtime,
		unsubscribeRealtime,
		addItem,
		updateItem,
		togglePurchased,
		deleteItem,
		setSearch,
		setFilterCategory,
		setFilterStatus,
		setSort
	};
}

export const shoppingStore = createShoppingStore();

const categoryOrder: Record<string, number> = {
	meat: 0,
	vegetable: 1,
	fruit: 2,
	beverage: 3,
	frozen: 4,
	bakery: 5,
	dry_goods: 6,
	snack: 7,
	seasoning: 8,
	household: 9,
	personal_care: 10,
	other: 11
};

export const filteredItems = derived(shoppingStore, (s) => {
	let items = [...s.items];

	if (s.search.trim()) {
		const q = s.search.trim().toLowerCase();
		items = items.filter(
			(i) => i.name.toLowerCase().includes(q) || (i.note ?? '').toLowerCase().includes(q)
		);
	}

	if (s.filterCategory !== 'all') {
		items = items.filter((i) => i.category === s.filterCategory);
	}

	if (s.filterStatus === 'pending') {
		items = items.filter((i) => !i.is_purchased);
	} else if (s.filterStatus === 'purchased') {
		items = items.filter((i) => i.is_purchased);
	}

	switch (s.sort) {
		case 'created_asc':
			items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
			break;
		case 'created_desc':
			items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
			break;
		case 'name_asc':
			items.sort((a, b) => a.name.localeCompare(b.name, 'th'));
			break;
		case 'category_asc':
			items.sort((a, b) => (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99));
			break;
	}

	return items;
});

export const itemStats = derived(shoppingStore, (s) => {
	const total = s.items.length;
	const purchased = s.items.filter((i) => i.is_purchased).length;
	return { total, purchased, pending: total - purchased };
});
