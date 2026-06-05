<script setup lang="ts">
import type { ShelfPlacement, WorkplaceOrderDraft } from '../workspace/workspaceTypes';
import { getPlacementPrice } from '../workspace/priceCalculator';

defineProps<{ orderDraft: WorkplaceOrderDraft }>();

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

function placementKindLabel(placement: ShelfPlacement) {
  return placement.kind === 'catalog-foam-set' ? 'каталожный ложемент' : 'индивидуальный ложемент';
}

function placementModeLabel(placement: ShelfPlacement) {
  if (placement.kind !== 'catalog-foam-set') return 'по индивидуальной заявке';
  return placement.laymentSupplyMode === 'empty' ? 'пустой ложемент' : 'ложемент с инструментом';
}
</script>

<template>
  <section class="order-document">
    <header class="order-document__header">
      <div>
        <p class="eyebrow">Коммерческая спецификация</p>
        <h2>Заявка на комплектацию рабочего места</h2>
      </div>
      <strong>{{ formatPrice(orderDraft.totals.totalPrice) }}</strong>
    </header>

    <section v-if="orderDraft.cart" class="order-document__section">
      <h3>Тележка</h3>
      <table>
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ orderDraft.cart.article }}</td>
            <td>{{ orderDraft.cart.name }}</td>
            <td>{{ formatPrice(orderDraft.cart.price) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="order-document__section">
      <h3>Состав рабочего места</h3>
      <article v-for="item in orderDraft.shelves" :key="item.shelf.id" class="order-shelf-document">
        <div class="order-shelf-document__title">
          <strong>{{ item.shelf.name }}</strong>
          <span>{{ item.shelf.widthMm }}×{{ item.shelf.heightMm }} мм</span>
        </div>
        <table v-if="item.placements.length">
          <thead>
            <tr>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Размер</th>
              <th>Режим</th>
              <th>Цена</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="placement in item.placements" :key="placement.id">
              <td>{{ placement.article }}</td>
              <td>
                <strong>{{ placement.name }}</strong>
                <span>{{ placementKindLabel(placement) }}</span>
              </td>
              <td>{{ placement.sizeLabel }}</td>
              <td>{{ placementModeLabel(placement) }}</td>
              <td>{{ formatPrice(getPlacementPrice(placement)) }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section v-if="orderDraft.looseTools.length" class="order-document__section">
      <h3>Отдельный инструмент</h3>
      <table>
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tool, index) in orderDraft.looseTools" :key="`${tool.article}-${index}`">
            <td>{{ tool.article }}</td>
            <td>{{ tool.name }}</td>
            <td>{{ formatPrice(tool.price) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="order-document__section order-totals">
      <h3>Итоги</h3>
      <dl>
        <div>
          <dt>Тележка</dt>
          <dd>{{ formatPrice(orderDraft.totals.cartPrice) }}</dd>
        </div>
        <div>
          <dt>Каталожные ложементы</dt>
          <dd>{{ formatPrice(orderDraft.totals.catalogKitsPrice) }}</dd>
        </div>
        <div>
          <dt>Индивидуальные ложементы</dt>
          <dd>{{ formatPrice(orderDraft.totals.customLaymentsPrice) }}</dd>
        </div>
        <div>
          <dt>Отдельные инструменты</dt>
          <dd>{{ formatPrice(orderDraft.totals.looseToolsPrice) }}</dd>
        </div>
        <div class="order-totals__grand">
          <dt>Итоговая стоимость</dt>
          <dd>{{ formatPrice(orderDraft.totals.totalPrice) }}</dd>
        </div>
      </dl>
    </section>
  </section>
</template>
