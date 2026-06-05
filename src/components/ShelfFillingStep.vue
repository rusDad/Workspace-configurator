<script setup lang="ts">
import { computed, ref } from 'vue';
import CatalogKitCard from './CatalogKitCard.vue';
import CatalogKitDetails from './CatalogKitDetails.vue';
import CurrentShelfPanel from './CurrentShelfPanel.vue';
import type { CatalogFoamInsertKit, CartShelf, ModuleSizeLabel, ToolCart } from '../catalog/catalogTypes';
import type { LaymentSupplyMode, ShelfPlacement, ShelfPlacements } from '../workspace/workspaceTypes';
import { canAddCatalogKit, getRemainingShelfUnits, getUsedShelfUnits } from '../workspace/slotRules';

const props = defineProps<{
  cart: ToolCart | null;
  activeShelf: CartShelf | null;
  activeShelfId: string | null;
  catalogKits: CatalogFoamInsertKit[];
  defaultNewPlacementMode: LaymentSupplyMode;
  shelfPlacements: ShelfPlacements;
  placements: ShelfPlacement[];
}>();

const emit = defineEmits<{
  selectShelf: [shelfId: string];
  addCatalogKit: [kit: CatalogFoamInsertKit];
  removePlacement: [placementId: string];
  updatePlacementMode: [placementId: string, mode: LaymentSupplyMode];
  resetActiveShelf: [];
  resetAllShelves: [];
  summary: [];
}>();

function relayPlacementMode(placementId: string, mode: LaymentSupplyMode) {
  emit('updatePlacementMode', placementId, mode);
}

const searchQuery = ref('');
const selectedSizeLabel = ref<ModuleSizeLabel | 'all'>('all');
const selectedKit = ref<CatalogFoamInsertKit | null>(null);

const sizeFilters: Array<{ label: string; value: ModuleSizeLabel | 'all' }> = [
  { label: 'Все', value: 'all' },
  { label: '1/6', value: '1/6 полки' },
  { label: '1/3', value: '1/3 полки' },
  { label: '2/3', value: '2/3 полки' },
  { label: 'полка целиком', value: 'полка целиком' },
];

const filteredCatalogKits = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase('ru-RU');

  return props.catalogKits.filter((kit) => {
    const matchesSearch = !normalizedQuery
      || kit.name.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
      || kit.article.toLocaleLowerCase('ru-RU').includes(normalizedQuery);
    const matchesSize = selectedSizeLabel.value === 'all' || kit.sizeLabel === selectedSizeLabel.value;

    return matchesSearch && matchesSize;
  });
});

function shelfPlacements(shelfId: string) {
  return props.shelfPlacements[shelfId] ?? [];
}

function shelfRemainingUnits(shelf: CartShelf) {
  return getRemainingShelfUnits(shelfPlacements(shelf.id), shelf.capacityUnits);
}

function fitShelfNames(kit: CatalogFoamInsertKit) {
  return props.cart?.shelves
    .filter((shelf) => shelf.id !== props.activeShelfId && canAddCatalogKit(kit, shelfPlacements(shelf.id), shelf.capacityUnits))
    .map((shelf) => shelf.name) ?? [];
}

function previewKit(kit: CatalogFoamInsertKit) {
  selectedKit.value = kit;
}

function selectedKitDisabled() {
  if (!selectedKit.value || !props.activeShelf) return true;
  return !canAddCatalogKit(selectedKit.value, props.placements, props.activeShelf.capacityUnits);
}
</script>

<template>
  <div v-if="cart && activeShelf" class="configurator-grid">
    <section class="configurator-left">
      <div class="configurator-context">
        <span>Тележка: <strong>{{ cart.name }}</strong> · {{ cart.article }}</span>
        <button class="button button--compact" type="button" @click="$emit('summary')">Далее</button>
      </div>

      <nav class="shelf-tabs" aria-label="Полки тележки">
        <button
          v-for="shelf in cart.shelves"
          :key="shelf.id"
          class="shelf-tab"
          :class="{ 'shelf-tab--active': shelf.id === activeShelfId }"
          type="button"
          @click="$emit('selectShelf', shelf.id)"
        >
          <strong>{{ shelf.name.replace('Полка ', '') }}</strong>
          <span>{{ getUsedShelfUnits(shelfPlacements(shelf.id)) }}/{{ shelf.capacityUnits }}</span>
        </button>
      </nav>

      <CurrentShelfPanel
        :shelf="activeShelf"
        :placements="placements"
        @remove="$emit('removePlacement', $event)"
        @update-mode="relayPlacementMode"
        @reset-active-shelf="$emit('resetActiveShelf')"
        @reset-all-shelves="$emit('resetAllShelves')"
      />

      <CatalogKitDetails
        :kit="selectedKit"
        :default-new-placement-mode="defaultNewPlacementMode"
        :disabled="selectedKitDisabled()"
        @add="$emit('addCatalogKit', $event)"
        @close="selectedKit = null"
      />
    </section>

    <section class="catalog-section card">
      <div class="catalog-section__header">
        <div>
          <p class="eyebrow">Каталог ложементов</p>
          <h2>Выберите наполнение</h2>
          <p>{{ activeShelf.name }}: {{ shelfRemainingUnits(activeShelf) }} / {{ activeShelf.capacityUnits }} свободно</p>
        </div>
      </div>

      <div class="catalog-tools">
        <label class="catalog-search">
          <span>Поиск</span>
          <input v-model="searchQuery" type="search" placeholder="Название или артикул" />
        </label>
        <div class="size-filters" role="group" aria-label="Фильтр по размеру">
          <button
            v-for="filter in sizeFilters"
            :key="filter.value"
            class="filter-button"
            :class="{ 'filter-button--active': selectedSizeLabel === filter.value }"
            type="button"
            @click="selectedSizeLabel = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="kit-grid kit-grid--catalog">
        <CatalogKitCard
          v-for="kit in filteredCatalogKits"
          :key="kit.article"
          :kit="kit"
          :default-new-placement-mode="defaultNewPlacementMode"
          :disabled="!canAddCatalogKit(kit, placements, activeShelf.capacityUnits)"
          :fit-shelf-names="fitShelfNames(kit)"
          @add="$emit('addCatalogKit', $event)"
          @preview="previewKit"
        />
      </div>

      <p v-if="!filteredCatalogKits.length" class="empty-note">По заданным условиям ничего не найдено.</p>
    </section>
  </div>
</template>
