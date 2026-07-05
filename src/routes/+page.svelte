<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    shoppingStore,
    filteredItems,
    itemStats,
  } from "$lib/stores/shoppingStore";
  import type { ShoppingItem } from "$lib/types/shopping";
  import StatsHeader from "$lib/components/StatsHeader.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import FloatingAddButton from "$lib/components/FloatingAddButton.svelte";
  import ItemFormPopup from "$lib/components/ItemFormPopup.svelte";

  let popupOpen = false;
  let editingItem: ShoppingItem | null = null;

  function openAddPopup() {
    editingItem = null;
    popupOpen = true;
  }

  function openEditPopup(item: ShoppingItem) {
    editingItem = item;
    popupOpen = true;
  }

  function closePopup() {
    popupOpen = false;
    editingItem = null;
  }

  $: pendingItems = $filteredItems.filter((item) => !item.is_purchased);
  $: purchasedItems = $filteredItems.filter((item) => item.is_purchased);

  onMount(() => {
    shoppingStore.fetchAll();
    shoppingStore.subscribeRealtime();
  });

  onDestroy(() => {
    shoppingStore.unsubscribeRealtime();
  });
</script>

<svelte:head>
  <title>3K Shopping Todo</title>
</svelte:head>

<main class="w-full max-w-6xl px-4 py-6 mx-auto sm:py-10 lg:px-8">
  <div class="space-y-4">
    <div class="w-full max-w-2xl mx-auto sm:max-w-none">
      <StatsHeader
        total={$itemStats.total}
        purchased={$itemStats.purchased}
        pending={$itemStats.pending}
      />
    </div>

    <div class="w-full max-w-2xl mx-auto sm:max-w-none">
      <FilterBar
        search={$shoppingStore.search}
        filterCategory={$shoppingStore.filterCategory}
        filterStatus={$shoppingStore.filterStatus}
        sort={$shoppingStore.sort}
      />
    </div>

    {#if $shoppingStore.loading}
      <div class="flex justify-center py-16">
        <svg
          class="w-8 h-8 text-white animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
            opacity="0.3"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    {:else if $filteredItems.length === 0}
      <div class="w-full max-w-2xl mx-auto sm:max-w-none">
        <EmptyState hasItems={$shoppingStore.items.length > 0} />
      </div>
    {:else}
      {#if pendingItems.length > 0}
        <div class="space-y-3">
          <h2 class="text-sm font-semibold text-white/70">
            ยังไม่ซื้อ ({pendingItems.length})
          </h2>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each pendingItems as item (item.id)}
              <ItemCard {item} onEdit={openEditPopup} />
            {/each}
          </div>
        </div>
      {/if}

      {#if purchasedItems.length > 0}
        <div class="pt-2 space-y-3">
          <h2 class="text-sm font-semibold text-white/70">
            ซื้อแล้ว ({purchasedItems.length})
          </h2>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each purchasedItems as item (item.id)}
              <ItemCard {item} onEdit={openEditPopup} />
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </div>
</main>

<FloatingAddButton onClick={openAddPopup} />

<ItemFormPopup open={popupOpen} {editingItem} on:close={closePopup} />
