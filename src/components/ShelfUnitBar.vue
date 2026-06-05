<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  usedUnits: number;
  capacityUnits: number;
}>();

const units = computed(() => Array.from({ length: props.capacityUnits }, (_, index) => index < props.usedUnits));
</script>

<template>
  <div class="shelf-unit-bar" :aria-label="`Занято ${usedUnits} из ${capacityUnits} shelf units`">
    <span v-for="(filled, index) in units" :key="index" :class="{ 'is-filled': filled }" />
  </div>
</template>
