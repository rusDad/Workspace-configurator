<script setup lang="ts">
import OrderPreview from './OrderPreview.vue';
import type { WorkplaceOrderDraft } from '../workspace/workspaceTypes';

defineProps<{
  orderDraft: WorkplaceOrderDraft;
  statusMessage: string | null;
}>();

defineEmits<{
  back: [];
  createOrder: [];
}>();
</script>

<template>
  <div class="summary-page">
    <div class="summary-toolbar">
      <div>
        <p class="eyebrow">Заявка</p>
        <h2>Проверьте состав перед отправкой</h2>
        <p>Индивидуальные ложементы будут подтверждены только после подтверждения общей заявки.</p>
      </div>
      <div class="summary-toolbar__actions">
        <button class="button" type="button" @click="$emit('back')">Вернуться к наполнению</button>
        <button class="button button--primary" type="button" @click="$emit('createOrder')">Сформировать заявку</button>
      </div>
    </div>

    <p v-if="statusMessage" class="success-note">{{ statusMessage }}</p>

    <OrderPreview :order-draft="orderDraft" />
  </div>
</template>
