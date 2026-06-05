<script setup lang="ts">
import CartCard from './CartCard.vue';
import type { ToolCart } from '../catalog/catalogTypes';

defineProps<{
  carts: ToolCart[];
  selectedCartArticle: string | null;
}>();

defineEmits<{ selectCart: [article: string] }>();
</script>

<template>
  <div class="step-panel">
    <div class="step-heading">
      <p class="eyebrow">Шаг 1</p>
      <h2>Выберите инструментальную тележку</h2>
      <p>Выберите базовую тележку для комплектации рабочего места.</p>
    </div>
    <div class="cart-grid">
      <CartCard
        v-for="cart in carts"
        :key="cart.article"
        :cart="cart"
        :selected="selectedCartArticle === cart.article"
        @select="$emit('selectCart', $event)"
      />
    </div>
  </div>
</template>
