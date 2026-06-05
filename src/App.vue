<script setup lang="ts">
import { computed } from 'vue';
import AppShell from './components/AppShell.vue';
import CartSelectionStep from './components/CartSelectionStep.vue';
import ShelfSelectionStep from './components/ShelfSelectionStep.vue';
import ShelfFillingStep from './components/ShelfFillingStep.vue';
import SummaryStep from './components/SummaryStep.vue';
import { demoCatalogKits, demoToolCarts } from './catalog/demoCatalog';
import type { CatalogFoamInsertKit } from './catalog/catalogTypes';
import { createInitialWorkspaceState } from './workspace/workspaceState';
import type { CatalogFoamSetPlacement, LaymentSupplyMode, ShelfPlacement, WizardStep } from './workspace/workspaceTypes';
import { buildWorkplaceOrderDraft } from './workspace/orderBuilder';

const state = createInitialWorkspaceState();

const selectedCart = computed(() => demoToolCarts.find((cart) => cart.article === state.selectedCartArticle) ?? null);
const activeShelf = computed(() => selectedCart.value?.shelves.find((shelf) => shelf.id === state.activeShelfId) ?? null);
const orderDraft = computed(() => buildWorkplaceOrderDraft(state, selectedCart.value));

function selectCart(article: string) {
  state.selectedCartArticle = article;
  const cart = demoToolCarts.find((item) => item.article === article);
  state.activeShelfId = cart?.shelves[0]?.id ?? null;
  state.shelfPlacements = {};
  state.orderStatusMessage = null;
  state.wizardStep = 'shelf-selection';
}

function selectShelf(shelfId: string) {
  state.activeShelfId = shelfId;
  state.orderStatusMessage = null;
  state.wizardStep = 'shelf-filling';
}

function goToStep(step: WizardStep) {
  if (step === 'cart-selection') {
    state.wizardStep = step;
    return;
  }

  if (!selectedCart.value) {
    state.wizardStep = 'cart-selection';
    return;
  }

  if ((step === 'shelf-filling' || step === 'summary') && !state.activeShelfId) {
    state.wizardStep = 'shelf-selection';
    return;
  }

  state.wizardStep = step;
}

function setLaymentSupplyMode(mode: LaymentSupplyMode) {
  state.laymentSupplyMode = mode;
}

function addCatalogKit(kit: CatalogFoamInsertKit) {
  if (!state.activeShelfId) return;

  const placement: CatalogFoamSetPlacement = {
    id: `${kit.article}-${crypto.randomUUID()}`,
    kind: 'catalog-foam-set',
    article: kit.article,
    name: kit.name,
    shelfUnits: kit.shelfUnits,
    sizeLabel: kit.sizeLabel,
    priceEmpty: kit.priceEmpty,
    priceWithTools: kit.priceWithTools,
    previewUrl: kit.previewUrl,
    includedTools: kit.includedTools,
  };

  state.shelfPlacements[state.activeShelfId] = [
    ...(state.shelfPlacements[state.activeShelfId] ?? []),
    placement,
  ];
  state.orderStatusMessage = null;
}

function removePlacement(placementId: string) {
  if (!state.activeShelfId) return;

  state.shelfPlacements[state.activeShelfId] = (state.shelfPlacements[state.activeShelfId] ?? [])
    .filter((placement: ShelfPlacement) => placement.id !== placementId);
  state.orderStatusMessage = null;
}

function chooseNextShelf() {
  if (!selectedCart.value || !state.activeShelfId) return;

  const currentIndex = selectedCart.value.shelves.findIndex((shelf) => shelf.id === state.activeShelfId);
  const nextShelf = selectedCart.value.shelves[currentIndex + 1];

  if (nextShelf) {
    state.activeShelfId = nextShelf.id;
    state.wizardStep = 'shelf-filling';
  } else {
    state.wizardStep = 'summary';
  }
}

function createDemoOrder() {
  state.orderStatusMessage = 'Демо-заявка сформирована. Реальная отправка на backend не выполняется.';
}
</script>

<template>
  <AppShell
    :current-step="state.wizardStep"
    :order-draft="orderDraft"
    @go-to-step="goToStep"
  >
    <CartSelectionStep
      v-if="state.wizardStep === 'cart-selection'"
      :carts="demoToolCarts"
      :selected-cart-article="state.selectedCartArticle"
      @select-cart="selectCart"
    />

    <ShelfSelectionStep
      v-else-if="state.wizardStep === 'shelf-selection'"
      :cart="selectedCart"
      :active-shelf-id="state.activeShelfId"
      :shelf-placements="state.shelfPlacements"
      @select-shelf="selectShelf"
      @back="goToStep('cart-selection')"
    />

    <ShelfFillingStep
      v-else-if="state.wizardStep === 'shelf-filling'"
      :cart="selectedCart"
      :active-shelf="activeShelf"
      :catalog-kits="demoCatalogKits"
      :layment-supply-mode="state.laymentSupplyMode"
      :placements="state.activeShelfId ? state.shelfPlacements[state.activeShelfId] ?? [] : []"
      @set-layment-supply-mode="setLaymentSupplyMode"
      @add-catalog-kit="addCatalogKit"
      @remove-placement="removePlacement"
      @back="goToStep('shelf-selection')"
      @next-shelf="chooseNextShelf"
      @summary="goToStep('summary')"
    />

    <SummaryStep
      v-else
      :order-draft="orderDraft"
      :status-message="state.orderStatusMessage"
      @set-layment-supply-mode="setLaymentSupplyMode"
      @back="goToStep('shelf-filling')"
      @create-order="createDemoOrder"
    />
  </AppShell>
</template>
