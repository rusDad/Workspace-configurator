<script setup lang="ts">
import type { WizardStep } from '../workspace/workspaceTypes';

const steps: Array<{ id: WizardStep; label: string; description: string }> = [
  { id: 'cart-selection', label: 'Тележка', description: 'Выбор базы' },
  { id: 'shelf-filling', label: 'Наполнение', description: 'Полки и каталог' },
  { id: 'loose-tools', label: 'Инструмент', description: 'Отдельные позиции' },
  { id: 'summary', label: 'Заявка', description: 'Итоговый состав' },
];

const props = defineProps<{ currentStep: WizardStep }>();

defineEmits<{ goToStep: [step: WizardStep] }>();

function stepState(step: WizardStep) {
  const currentIndex = steps.findIndex((item) => item.id === props.currentStep);
  const stepIndex = steps.findIndex((item) => item.id === step);
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'upcoming';
}
</script>

<template>
  <nav class="wizard-progress" aria-label="Этапы конфигуратора">
    <button
      v-for="(step, index) in steps"
      :key="step.id"
      class="wizard-progress__step"
      :class="`wizard-progress__step--${stepState(step.id)}`"
      type="button"
      @click="$emit('goToStep', step.id)"
    >
      <span class="wizard-progress__number">{{ index + 1 }}</span>
      <span>
        <strong>{{ step.label }}</strong>
        <small>{{ step.description }}</small>
      </span>
    </button>
  </nav>
</template>
