<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ToolItem } from '../catalog/catalogTypes';

const props = defineProps<{
  tools: ToolItem[];
  selectedTools: ToolItem[];
}>();

defineEmits<{
  addTool: [tool: ToolItem];
  removeTool: [article: string];
  back: [];
  summary: [];
}>();

const searchQuery = ref('');

const filteredTools = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU');
  if (!query) return props.tools;

  return props.tools.filter((tool) => (
    tool.article.toLocaleLowerCase('ru-RU').includes(query)
    || tool.name.toLocaleLowerCase('ru-RU').includes(query)
  ));
});

const selectedRows = computed(() => {
  const rows = new Map<string, { tool: ToolItem; quantity: number; total: number }>();

  for (const tool of props.selectedTools) {
    const existing = rows.get(tool.article);
    if (existing) {
      existing.quantity += 1;
      existing.total += tool.price;
    } else {
      rows.set(tool.article, { tool, quantity: 1, total: tool.price });
    }
  }

  return Array.from(rows.values());
});

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <div class="loose-tools-step">
    <section class="loose-tools-selection card">
      <div class="catalog-section__header">
        <div>
          <p class="eyebrow">Дополнительный инструмент</p>
          <h2>Добавьте отдельные позиции</h2>
          <p>Эти инструменты попадут в заявку отдельно от наполнения полок.</p>
        </div>
        <button class="button button--primary" type="button" @click="$emit('summary')">К заявке</button>
      </div>

      <label class="catalog-search">
        <span>Поиск</span>
        <input v-model="searchQuery" type="search" placeholder="Название или артикул" />
      </label>

      <div class="loose-tool-grid">
        <article v-for="tool in filteredTools" :key="`${tool.article}-${tool.name}`" class="loose-tool-card">
          <div>
            <p class="eyebrow">{{ tool.article }}</p>
            <h3>{{ tool.name }}</h3>
          </div>
          <div class="loose-tool-card__side">
            <strong>{{ formatPrice(tool.price) }}</strong>
            <button class="add-circle" type="button" aria-label="Добавить инструмент" @click="$emit('addTool', tool)">+</button>
          </div>
        </article>
      </div>

      <p v-if="!filteredTools.length" class="empty-note">По заданным условиям ничего не найдено.</p>
    </section>

    <aside class="selected-loose-tools card">
      <p class="eyebrow">Выбрано</p>
      <h2>Отдельный инструмент</h2>

      <div v-if="selectedRows.length" class="selected-tool-list">
        <article v-for="row in selectedRows" :key="row.tool.article" class="selected-tool-row">
          <div>
            <strong>{{ row.tool.name }}</strong>
            <span>{{ row.tool.article }} · {{ row.quantity }} шт.</span>
          </div>
          <div>
            <strong>{{ formatPrice(row.total) }}</strong>
            <button class="button button--ghost" type="button" @click="$emit('removeTool', row.tool.article)">Убрать</button>
          </div>
        </article>
      </div>
      <p v-else class="empty-note">Отдельные инструменты пока не добавлены.</p>

      <div class="step-actions">
        <button class="button" type="button" @click="$emit('back')">Назад к наполнению</button>
        <button class="button button--primary" type="button" @click="$emit('summary')">К заявке</button>
      </div>
    </aside>
  </div>
</template>
