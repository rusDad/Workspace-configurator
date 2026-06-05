<script setup lang="ts">
import OrderPreview from './OrderPreview.vue';
import type { LaymentSupplyMode, WorkplaceOrderDraft } from '../workspace/workspaceTypes';

defineProps<{
  orderDraft: WorkplaceOrderDraft;
  statusMessage: string | null;
}>();

defineEmits<{
  setLaymentSupplyMode: [mode: LaymentSupplyMode];
  back: [];
  createOrder: [];
}>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <div class="step-panel">
    <div class="step-heading">
      <p class="eyebrow">Шаг 4</p>
      <h2>Проверьте workplace order</h2>
      <p>Это коммерческая заявка родительского заказа. Custom layment orders не подтверждаются в PR 1.</p>
    </div>

    <div class="mode-toggle" role="group" aria-label="Layment supply mode">
      <button
        class="button"
        :class="{ 'button--selected': orderDraft.laymentSupplyMode === 'empty' }"
        type="button"
        @click="$emit('setLaymentSupplyMode', 'empty')"
      >
        Пустые ложементы
      </button>
      <button
        class="button"
        :class="{ 'button--selected': orderDraft.laymentSupplyMode === 'with-tools' }"
        type="button"
        @click="$emit('setLaymentSupplyMode', 'with-tools')"
      >
        Ложементы с инструментом
      </button>
    </div>

    <OrderPreview :order-draft="orderDraft" />

    <div class="summary-total card">
      <span>Итого по заявке</span>
      <strong>{{ formatPrice(orderDraft.totals.totalPrice) }}</strong>
    </div>

    <p v-if="statusMessage" class="success-note">{{ statusMessage }}</p>

    <div class="step-actions">
      <button class="button" type="button" @click="$emit('back')">Назад к наполнению</button>
      <button class="button button--primary" type="button" @click="$emit('createOrder')">Сформировать заявку</button>
    </div>
  </div>
</template>
