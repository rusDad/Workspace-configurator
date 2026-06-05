<script setup lang="ts">
import type { ToolCart } from '../catalog/catalogTypes';

defineProps<{
  cart: ToolCart;
  selected: boolean;
}>();

defineEmits<{ select: [article: string] }>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <article class="cart-card card" :class="{ 'card--selected': selected }">
    <div class="visual-placeholder visual-placeholder--cart">
      <span>{{ cart.article }}</span>
    </div>
    <div class="cart-card__body">
      <p class="eyebrow">{{ cart.article }}</p>
      <h3>{{ cart.name }}</h3>
      <p>{{ cart.shelves.length }} полки · {{ cart.shelves[0]?.widthMm }}×{{ cart.shelves[0]?.heightMm }} мм</p>
      <strong>{{ formatPrice(cart.price) }}</strong>
    </div>
    <button class="button button--primary" type="button" @click="$emit('select', cart.article)">
      {{ selected ? 'Выбрано' : 'Выбрать тележку' }}
    </button>
  </article>
</template>
