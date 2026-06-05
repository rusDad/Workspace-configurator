<script setup lang="ts">
import WizardProgress from './WizardProgress.vue';
import type { WizardStep, WorkplaceOrderDraft } from '../workspace/workspaceTypes';

defineProps<{
  currentStep: WizardStep;
  orderDraft: WorkplaceOrderDraft;
}>();

defineEmits<{
  goToStep: [step: WizardStep];
}>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">Комплектация рабочего места</p>
        <h1>Конфигуратор рабочего места</h1>
        <p class="app-header__text">Выберите тележку, наполните полки ложементами и подготовьте заявку для отдела продаж.</p>
      </div>
      <div class="app-header__actions">
        <strong class="total-pill">Итого: {{ formatPrice(orderDraft.totals.totalPrice) }}</strong>
        <button
          class="button button--primary"
          type="button"
          :disabled="!orderDraft.cart"
          @click="$emit('goToStep', 'summary')"
        >
          К заявке
        </button>
      </div>
    </header>

    <WizardProgress :current-step="currentStep" @go-to-step="$emit('goToStep', $event)" />

    <main class="workspace-layout">
      <slot />
    </main>
  </div>
</template>
