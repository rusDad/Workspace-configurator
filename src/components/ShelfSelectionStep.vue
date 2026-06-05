<script setup lang="ts">
import ShelfCard from './ShelfCard.vue';
import type { ToolCart } from '../catalog/catalogTypes';
import type { ShelfPlacements } from '../workspace/workspaceTypes';

defineProps<{
  cart: ToolCart | null;
  activeShelfId: string | null;
  shelfPlacements: ShelfPlacements;
}>();

defineEmits<{
  selectShelf: [shelfId: string];
  back: [];
}>();
</script>

<template>
  <div class="step-panel">
    <div class="step-heading">
      <p class="eyebrow">Шаг 2</p>
      <h2>Выберите полку для наполнения</h2>
      <p v-if="cart">{{ cart.name }} · {{ cart.article }}</p>
    </div>

    <div v-if="cart" class="shelf-grid">
      <ShelfCard
        v-for="shelf in cart.shelves"
        :key="shelf.id"
        :shelf="shelf"
        :placements="shelfPlacements[shelf.id] ?? []"
        :selected="activeShelfId === shelf.id"
        @select="$emit('selectShelf', $event)"
      />
    </div>

    <div class="step-actions">
      <button class="button" type="button" @click="$emit('back')">Назад к тележкам</button>
    </div>
  </div>
</template>
