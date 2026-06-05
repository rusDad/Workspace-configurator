<script setup lang="ts">
import CatalogKitCard from './CatalogKitCard.vue';
import CurrentShelfPanel from './CurrentShelfPanel.vue';
import type { CatalogFoamInsertKit, CartShelf, ToolCart } from '../catalog/catalogTypes';
import type { LaymentSupplyMode, ShelfPlacement } from '../workspace/workspaceTypes';
import { canAddCatalogKit, getRemainingShelfUnits } from '../workspace/slotRules';

defineProps<{
  cart: ToolCart | null;
  activeShelf: CartShelf | null;
  catalogKits: CatalogFoamInsertKit[];
  laymentSupplyMode: LaymentSupplyMode;
  placements: ShelfPlacement[];
}>();

defineEmits<{
  setLaymentSupplyMode: [mode: LaymentSupplyMode];
  addCatalogKit: [kit: CatalogFoamInsertKit];
  removePlacement: [placementId: string];
  back: [];
  nextShelf: [];
  summary: [];
}>();
</script>

<template>
  <div class="step-panel">
    <div class="step-heading">
      <p class="eyebrow">Шаг 3</p>
      <h2>Наполните выбранную полку</h2>
      <p v-if="cart && activeShelf">{{ cart.name }} · {{ activeShelf.name }}</p>
    </div>

    <div class="mode-toggle" role="group" aria-label="Layment supply mode">
      <button
        class="button"
        :class="{ 'button--selected': laymentSupplyMode === 'empty' }"
        type="button"
        @click="$emit('setLaymentSupplyMode', 'empty')"
      >
        Пустые ложементы
      </button>
      <button
        class="button"
        :class="{ 'button--selected': laymentSupplyMode === 'with-tools' }"
        type="button"
        @click="$emit('setLaymentSupplyMode', 'with-tools')"
      >
        Ложементы с инструментом
      </button>
    </div>

    <div v-if="activeShelf" class="filling-layout">
      <CurrentShelfPanel
        :shelf="activeShelf"
        :placements="placements"
        :layment-supply-mode="laymentSupplyMode"
        @remove="$emit('removePlacement', $event)"
      />

      <section class="catalog-section">
        <div class="catalog-section__header">
          <div>
            <h3>Каталог foam insert kits</h3>
            <p>Осталось {{ getRemainingShelfUnits(placements, activeShelf.capacityUnits) }} из {{ activeShelf.capacityUnits }} shelf units</p>
          </div>
          <button class="button" type="button" disabled>Create custom layment</button>
        </div>
        <div class="kit-grid">
          <CatalogKitCard
            v-for="kit in catalogKits"
            :key="kit.article"
            :kit="kit"
            :layment-supply-mode="laymentSupplyMode"
            :disabled="!canAddCatalogKit(kit, placements, activeShelf.capacityUnits)"
            @add="$emit('addCatalogKit', $event)"
          />
        </div>
      </section>
    </div>

    <div class="step-actions">
      <button class="button" type="button" @click="$emit('back')">Назад к полкам</button>
      <button class="button" type="button" @click="$emit('nextShelf')">Next shelf</button>
      <button class="button button--primary" type="button" @click="$emit('summary')">Go to summary</button>
    </div>
  </div>
</template>
