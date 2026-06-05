<script setup lang="ts">
import ShelfUnitBar from './ShelfUnitBar.vue';
import type { CartShelf } from '../catalog/catalogTypes';
import type { ShelfPlacement } from '../workspace/workspaceTypes';
import { getUsedShelfUnits } from '../workspace/slotRules';

defineProps<{
  shelf: CartShelf;
  placements: ShelfPlacement[];
  selected: boolean;
}>();

defineEmits<{ select: [shelfId: string] }>();
</script>

<template>
  <article class="shelf-card card" :class="{ 'card--selected': selected }">
    <div>
      <p class="eyebrow">{{ shelf.widthMm }}×{{ shelf.heightMm }} мм</p>
      <h3>{{ shelf.name }}</h3>
      <p>{{ getUsedShelfUnits(placements) }} / {{ shelf.capacityUnits }} единиц полки занято</p>
      <ShelfUnitBar :used-units="getUsedShelfUnits(placements)" :capacity-units="shelf.capacityUnits" />
    </div>
    <button class="button button--primary" type="button" @click="$emit('select', shelf.id)">
      {{ selected ? 'Открыть наполнение' : 'Выбрать полку' }}
    </button>
  </article>
</template>
