<script setup lang="ts">
import WizardProgress from './WizardProgress.vue';
import PriceSummary from './PriceSummary.vue';
import type { WizardStep, WorkplaceOrderDraft } from '../workspace/workspaceTypes';

defineProps<{
  currentStep: WizardStep;
  orderDraft: WorkplaceOrderDraft;
}>();

defineEmits<{
  goToStep: [step: WizardStep];
}>();
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Demo prototype</p>
        <h1>Workplace Configurator Demo</h1>
        <p class="hero__text">Подберите тележку, заполните полки ложементами и подготовьте коммерческую заявку.</p>
      </div>
      <div class="hero__badge">Vue 3 · Vite · TypeScript</div>
    </header>

    <WizardProgress :current-step="currentStep" @go-to-step="$emit('goToStep', $event)" />

    <main class="workspace-layout">
      <section class="workspace-layout__content">
        <slot />
      </section>
      <aside class="workspace-layout__summary">
        <PriceSummary :totals="orderDraft.totals" />
      </aside>
    </main>
  </div>
</template>
