<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  usedUnits: number;
  capacityUnits: number;
}>();

const segmentCount = 3;
const fillPercent = computed(() => Math.round((props.usedUnits / props.capacityUnits) * 100));
const filledSegments = computed(() => (props.usedUnits === 0 ? 0 : Math.ceil((props.usedUnits / props.capacityUnits) * segmentCount)));
const units = computed(() => Array.from({ length: segmentCount }, (_, index) => index < filledSegments.value));
</script>

<template>
  <div class="shelf-unit-bar" :aria-label="`Заполнено ${fillPercent}% полки`">
    <span v-for="(filled, index) in units" :key="index" :class="{ 'is-filled': filled }" />
  </div>
</template>
