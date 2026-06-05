<script setup lang="ts">
import type { PriceSummaryTotals } from '../workspace/workspaceTypes';

defineProps<{ totals: PriceSummaryTotals }>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <div class="price-summary card">
    <p class="eyebrow">Итого</p>
    <h2>{{ formatPrice(totals.totalPrice) }}</h2>
    <dl>
      <div>
        <dt>Тележка</dt>
        <dd>{{ formatPrice(totals.cartPrice) }}</dd>
      </div>
      <div>
        <dt>Каталожные ложементы</dt>
        <dd>{{ formatPrice(totals.catalogKitsPrice) }}</dd>
      </div>
      <div>
        <dt>Индивидуальные ложементы</dt>
        <dd>{{ formatPrice(totals.customLaymentsPrice) }}</dd>
      </div>
      <div>
        <dt>Отдельные инструменты</dt>
        <dd>{{ formatPrice(totals.looseToolsPrice) }}</dd>
      </div>
    </dl>
  </div>
</template>
