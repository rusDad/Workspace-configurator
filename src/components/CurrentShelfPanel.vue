<script setup lang="ts">
import ShelfUnitBar from './ShelfUnitBar.vue';
import type { CartShelf } from '../catalog/catalogTypes';
import type { LaymentSupplyMode, ShelfPlacement } from '../workspace/workspaceTypes';
import { getPlacementPrice } from '../workspace/priceCalculator';
import { getRemainingShelfUnits, getUsedShelfUnits } from '../workspace/slotRules';

defineProps<{
  shelf: CartShelf;
  placements: ShelfPlacement[];
}>();

defineEmits<{
  remove: [placementId: string];
  updateMode: [placementId: string, mode: LaymentSupplyMode];
  resetActiveShelf: [];
  resetAllShelves: [];
}>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function placementModeLabel(placement: ShelfPlacement) {
  if (placement.kind !== 'catalog-foam-set') return 'индивидуальный ложемент';
  return placement.laymentSupplyMode === 'empty' ? 'пустое ложемент' : 'с инструментом';
}

function placementShelfImageUrl(placement: ShelfPlacement) {
  if (placement.kind === 'custom-layment') return placement.previewPngUrl;
  if (!placement.previewUrl?.startsWith('/catalog-assets/kits/')) return null;
  return placement.previewUrl.replace('/catalog-assets/kits/', '/catalog-assets/shelf-kits/');
}
</script>

<template>
  <section class="current-shelf card">
    <div class="current-shelf__header">
      <div>
        <p class="eyebrow">Активная полка</p>
        <h3>{{ shelf.name }}</h3>
        <p>{{ shelf.widthMm }}×{{ shelf.heightMm }} мм</p>
      </div>
      <strong class="capacity-pill">{{ getRemainingShelfUnits(placements, shelf.capacityUnits) }} / {{ shelf.capacityUnits }} свободно</strong>
    </div>

    <ShelfUnitBar :used-units="getUsedShelfUnits(placements)" :capacity-units="shelf.capacityUnits" />

    <div class="shelf-visual" :class="{ 'shelf-visual--empty': !placements.length }">
      <article
        v-for="placement in placements"
        :key="placement.id"
        class="shelf-visual__placement"
        :style="{ '--placement-units': placement.shelfUnits }"
      >
        <img
          v-if="placementShelfImageUrl(placement)"
          :src="placementShelfImageUrl(placement) ?? undefined"
          :alt="`Изображение ложемента ${placement.article}`"
        />
        <div v-else class="shelf-visual__fallback">
          <span>{{ placement.sizeLabel }}</span>
          <strong>{{ placement.article }}</strong>
        </div>
        <button
          class="shelf-visual__remove"
          type="button"
          :aria-label="`Удалить ложемент ${placement.article}`"
          @click="$emit('remove', placement.id)"
        >
          −
        </button>
      </article>
      <p v-if="!placements.length">Полка свободна. Добавьте ложемент из каталога справа.</p>
    </div>

    <div class="shelf-actions-inline">
      <button class="link-button" type="button" @click="$emit('resetActiveShelf')">Очистить полку</button>
      <button class="link-button" type="button" @click="$emit('resetAllShelves')">Очистить все полки</button>
    </div>

    <div v-if="placements.length" class="placement-list">
      <article v-for="placement in placements" :key="placement.id" class="placement-row">
        <div class="placement-row__main">
          <p class="eyebrow">{{ placement.kind === 'catalog-foam-set' ? 'Каталог' : 'Индивидуально' }}</p>
          <strong>{{ placement.name }}</strong>
          <span>{{ placement.article }} · {{ placement.sizeLabel }} · {{ placementModeLabel(placement) }}</span>
          <div v-if="placement.kind === 'catalog-foam-set'" class="placement-mode" role="group" aria-label="Режим поставки ложемента">
            <button
              class="segmented-button"
              :class="{ 'segmented-button--active': placement.laymentSupplyMode === 'empty' }"
              type="button"
              @click="$emit('updateMode', placement.id, 'empty')"
            >
              Пустое
            </button>
            <button
              class="segmented-button"
              :class="{ 'segmented-button--active': placement.laymentSupplyMode === 'with-tools' }"
              type="button"
              @click="$emit('updateMode', placement.id, 'with-tools')"
            >
              С инструментом
            </button>
          </div>
        </div>
        <div class="placement-row__side">
          <strong>{{ formatPrice(getPlacementPrice(placement)) }}</strong>
          <button class="button button--ghost" type="button" @click="$emit('remove', placement.id)">Удалить</button>
        </div>
      </article>
    </div>
    <p v-else class="empty-note">На полке пока нет ложементов.</p>
  </section>
</template>
