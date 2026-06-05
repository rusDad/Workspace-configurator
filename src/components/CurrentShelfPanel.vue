<script setup lang="ts">
import ShelfUnitBar from './ShelfUnitBar.vue';
import type { CartShelf } from '../catalog/catalogTypes';
import type { LaymentSupplyMode, ShelfPlacement } from '../workspace/workspaceTypes';
import { getPlacementPrice } from '../workspace/priceCalculator';
import { getRemainingShelfUnits, getUsedShelfUnits } from '../workspace/slotRules';

defineProps<{
  shelf: CartShelf;
  placements: ShelfPlacement[];
  laymentSupplyMode: LaymentSupplyMode;
}>();

defineEmits<{ remove: [placementId: string] }>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
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
      <strong>{{ getUsedShelfUnits(placements) }} / {{ shelf.capacityUnits }}</strong>
    </div>

    <ShelfUnitBar :used-units="getUsedShelfUnits(placements)" :capacity-units="shelf.capacityUnits" />
    <p class="muted">Осталось {{ getRemainingShelfUnits(placements, shelf.capacityUnits) }} shelf units</p>

    <div v-if="placements.length" class="placement-list">
      <article v-for="placement in placements" :key="placement.id" class="placement-row">
        <div>
          <p class="eyebrow">{{ placement.kind === 'catalog-foam-set' ? 'Каталог kit' : 'Custom layment' }}</p>
          <strong>{{ placement.name }}</strong>
          <span>{{ placement.article }} · {{ placement.sizeLabel }}</span>
        </div>
        <div class="placement-row__side">
          <strong>{{ formatPrice(getPlacementPrice(placement, laymentSupplyMode)) }}</strong>
          <button class="button button--ghost" type="button" @click="$emit('remove', placement.id)">Remove</button>
        </div>
      </article>
    </div>
    <p v-else class="empty-note">Пока нет добавленных foam insert kits.</p>
  </section>
</template>
