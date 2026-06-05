<script setup lang="ts">
import type { CatalogFoamInsertKit } from '../catalog/catalogTypes';
import type { LaymentSupplyMode } from '../workspace/workspaceTypes';

defineProps<{
  kit: CatalogFoamInsertKit;
  laymentSupplyMode: LaymentSupplyMode;
  disabled: boolean;
}>();

defineEmits<{ add: [kit: CatalogFoamInsertKit] }>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <article class="catalog-kit-card card">
    <div class="visual-placeholder visual-placeholder--kit">
      <span>{{ kit.sizeLabel }}</span>
    </div>
    <div class="catalog-kit-card__content">
      <p class="eyebrow">{{ kit.article }}</p>
      <h3>{{ kit.name }}</h3>
      <p>{{ kit.shelfUnits }} из 6 shelf units · инструментов: {{ kit.includedTools.length }}</p>
      <strong>{{ formatPrice(laymentSupplyMode === 'empty' ? kit.priceEmpty : kit.priceWithTools) }}</strong>
    </div>
    <button class="button button--primary" type="button" :disabled="disabled" @click="$emit('add', kit)">
      {{ disabled ? 'Недостаточно места' : 'Добавить' }}
    </button>
  </article>
</template>
