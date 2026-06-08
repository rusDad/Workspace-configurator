<script setup lang="ts">
import type { CatalogFoamInsertKit } from '../catalog/catalogTypes';
import type { LaymentSupplyMode } from '../workspace/workspaceTypes';

const props = defineProps<{
  kit: CatalogFoamInsertKit | null;
  defaultNewPlacementMode: LaymentSupplyMode;
  disabled: boolean;
}>();

defineEmits<{
  add: [kit: CatalogFoamInsertKit];
  close: [];
}>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function modePrice(kit: CatalogFoamInsertKit, defaultNewPlacementMode: LaymentSupplyMode) {
  return defaultNewPlacementMode === 'empty' ? kit.priceEmpty : kit.priceWithTools;
}
</script>

<template>
  <aside v-if="kit" class="kit-details card">
    <button class="kit-details__close" type="button" aria-label="Закрыть подробности" @click="$emit('close')">×</button>
    <div class="visual-placeholder visual-placeholder--kit kit-details__image">
      <img v-if="kit.previewUrl" :src="kit.previewUrl" :alt="`Изображение ложемента ${kit.article}`" />
      <span v-else>{{ kit.article }}</span>
    </div>
    <p class="eyebrow">{{ kit.article }}</p>
    <h3>{{ kit.name }}</h3>
    <p>{{ kit.sizeLabel }} · высота {{ kit.laymentHeightMm }} мм · {{ kit.includedTools.length }} инструментов</p>
    <strong>{{ formatPrice(modePrice(kit, props.defaultNewPlacementMode)) }}</strong>

    <button class="button button--primary kit-details__add" type="button" :disabled="disabled" @click="$emit('add', kit)">
      Добавить на полку
    </button>

    <div class="kit-details__tools">
      <h4>Состав</h4>
      <ul>
        <li v-for="tool in kit.includedTools" :key="`${tool.article}-${tool.name}`">
          <span>{{ tool.article }}</span>
          {{ tool.name }}
        </li>
      </ul>
    </div>
  </aside>
</template>
