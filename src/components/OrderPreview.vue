<script setup lang="ts">
import type { WorkplaceOrderDraft, ShelfPlacement } from '../workspace/workspaceTypes';
import { getPlacementPrice } from '../workspace/priceCalculator';

defineProps<{ orderDraft: WorkplaceOrderDraft }>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function placementTitle(placement: ShelfPlacement) {
  return placement.kind === 'catalog-foam-set' ? 'Catalog foam kit' : 'Custom layment order';
}
</script>

<template>
  <section class="order-preview card">
    <div class="order-preview__header">
      <div>
        <p class="eyebrow">Parent workplace order</p>
        <h3>Состав демо-заявки</h3>
      </div>
      <strong>Schema v{{ orderDraft.schemaVersion }}</strong>
    </div>

    <div v-if="orderDraft.cart" class="order-cart">
      <p class="eyebrow">Тележка</p>
      <h4>{{ orderDraft.cart.name }}</h4>
      <p>{{ orderDraft.cart.article }} · {{ formatPrice(orderDraft.cart.price) }}</p>
    </div>

    <div class="order-shelves">
      <article v-for="item in orderDraft.shelves" :key="item.shelf.id" class="order-shelf">
        <div class="order-shelf__title">
          <strong>{{ item.shelf.name }}</strong>
          <span>{{ item.shelf.widthMm }}×{{ item.shelf.heightMm }} мм</span>
        </div>
        <div v-if="item.placements.length" class="order-placement-list">
          <div v-for="placement in item.placements" :key="placement.id" class="order-placement">
            <div>
              <p class="eyebrow">{{ placementTitle(placement) }}</p>
              <strong>{{ placement.name }}</strong>
              <span>{{ placement.article }} · {{ placement.sizeLabel }} · {{ placement.shelfUnits }} units</span>
            </div>
            <strong>{{ formatPrice(getPlacementPrice(placement, orderDraft.laymentSupplyMode)) }}</strong>
          </div>
        </div>
        <p v-else class="empty-note">Полка не заполнена.</p>
      </article>
    </div>
  </section>
</template>
