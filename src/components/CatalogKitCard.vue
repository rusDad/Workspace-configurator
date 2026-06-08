<script setup lang="ts">
import type { CatalogFoamInsertKit } from '../catalog/catalogTypes';
import type { LaymentSupplyMode } from '../workspace/workspaceTypes';

defineProps<{
  kit: CatalogFoamInsertKit;
  defaultNewPlacementMode: LaymentSupplyMode;
  disabled: boolean;
  fitShelfNames: string[];
}>();

defineEmits<{
  add: [kit: CatalogFoamInsertKit];
  preview: [kit: CatalogFoamInsertKit];
}>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function modePrice(kit: CatalogFoamInsertKit, defaultNewPlacementMode: LaymentSupplyMode) {
  return defaultNewPlacementMode === 'empty' ? kit.priceEmpty : kit.priceWithTools;
}

function sizeBadgeLabel(sizeLabel: string) {
  return sizeLabel.replace(' полки', '').replace('полка целиком', 'полка');
}
</script>

<template>
  <article class="catalog-kit-card card" :class="{ 'catalog-kit-card--disabled': disabled }">
    <button class="visual-placeholder visual-placeholder--kit catalog-kit-card__image-button" type="button" @click="$emit('preview', kit)">
      <img v-if="kit.previewUrl" :src="kit.previewUrl" :alt="`Изображение ложемента ${kit.article}`" />
      <span v-else>Изображение будет добавлено</span>
    </button>
    <div class="catalog-kit-card__content">
      <p class="eyebrow">{{ kit.article }}</p>
      <button class="catalog-kit-card__title" type="button" @click="$emit('preview', kit)">
        {{ kit.name }}
      </button>
      <p>{{ kit.sizeLabel }} · высота {{ kit.laymentHeightMm }} мм · {{ kit.includedTools.length }} инструментов</p>
      <strong>{{ formatPrice(modePrice(kit, defaultNewPlacementMode)) }}</strong>
    </div>
    <div class="catalog-kit-card__footer">
      <span class="size-badge">{{ sizeBadgeLabel(kit.sizeLabel) }}</span>
      <button class="link-button catalog-kit-card__add" type="button" :disabled="disabled" @click="$emit('add', kit)">
        Добавить
      </button>
    </div>
    <p v-if="disabled" class="fit-warning">
      Недоступно для выбранной полки.
    </p>
  </article>
</template>
