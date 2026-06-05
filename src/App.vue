<script setup lang="ts">
import { computed } from 'vue';
import AppShell from './components/AppShell.vue';
import CartSelectionStep from './components/CartSelectionStep.vue';
import LooseToolsStep from './components/LooseToolsStep.vue';
import ShelfFillingStep from './components/ShelfFillingStep.vue';
import SummaryStep from './components/SummaryStep.vue';
import { demoCatalogKits, demoToolCarts } from './catalog/demoCatalog';
import type { CatalogFoamInsertKit, ToolItem } from './catalog/catalogTypes';
import { createInitialWorkspaceState } from './workspace/workspaceState';
import type { CatalogFoamSetPlacement, LaymentSupplyMode, ShelfPlacement, WizardStep } from './workspace/workspaceTypes';
import { buildWorkplaceOrderDraft } from './workspace/orderBuilder';
import { canAddCatalogKit } from './workspace/slotRules';

const state = createInitialWorkspaceState();

const selectedCart = computed(() => demoToolCarts.find((cart) => cart.article === state.selectedCartArticle) ?? null);
const activeShelf = computed(() => selectedCart.value?.shelves.find((shelf) => shelf.id === state.activeShelfId) ?? null);
const activePlacements = computed(() => (state.activeShelfId ? state.shelfPlacements[state.activeShelfId] ?? [] : []));
const orderDraft = computed(() => buildWorkplaceOrderDraft(state, selectedCart.value));
const looseToolCatalog = computed(() => {
  const tools = new Map<string, ToolItem>();

  for (const kit of demoCatalogKits) {
    for (const tool of kit.includedTools) {
      if (!tools.has(tool.article)) {
        tools.set(tool.article, tool);
      }
    }
  }

  return Array.from(tools.values()).sort((left, right) => left.article.localeCompare(right.article));
});

function selectCart(article: string) {
  state.selectedCartArticle = article;
  const cart = demoToolCarts.find((item) => item.article === article);
  state.activeShelfId = cart?.shelves[0]?.id ?? null;
  state.shelfPlacements = {};
  state.looseTools = [];
  state.orderStatusMessage = null;
  state.wizardStep = 'shelf-filling';
}

function selectShelf(shelfId: string) {
  state.activeShelfId = shelfId;
  state.orderStatusMessage = null;
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

  state.wizardStep = step;
}

function addCatalogKit(kit: CatalogFoamInsertKit) {
  if (!state.activeShelfId || !activeShelf.value) return;

  const shelfPlacements = state.shelfPlacements[state.activeShelfId] ?? [];
  if (!canAddCatalogKit(kit, shelfPlacements, activeShelf.value.capacityUnits)) return;

  const placement: CatalogFoamSetPlacement = {
    id: `${kit.article}-${crypto.randomUUID()}`,
    kind: 'catalog-foam-set',
    article: kit.article,
    name: kit.name,
    shelfUnits: kit.shelfUnits,
    sizeLabel: kit.sizeLabel,
    laymentSupplyMode: state.defaultNewPlacementMode,
    priceEmpty: kit.priceEmpty,
    priceWithTools: kit.priceWithTools,
    previewUrl: kit.previewUrl,
    includedTools: kit.includedTools,
  };

  state.shelfPlacements[state.activeShelfId] = [
    ...shelfPlacements,
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

function updatePlacementMode(placementId: string, mode: LaymentSupplyMode) {
  if (!state.activeShelfId) return;

  state.shelfPlacements[state.activeShelfId] = (state.shelfPlacements[state.activeShelfId] ?? [])
    .map((placement) => {
      if (placement.id !== placementId || placement.kind !== 'catalog-foam-set') return placement;
      return { ...placement, laymentSupplyMode: mode };
    });
  state.orderStatusMessage = null;
}

function resetActiveShelf() {
  if (!state.activeShelfId) return;

  state.shelfPlacements[state.activeShelfId] = [];
  state.orderStatusMessage = null;
}

function resetAllShelves() {
  state.shelfPlacements = {};
  state.orderStatusMessage = null;
}

function addLooseTool(tool: ToolItem) {
  state.looseTools = [...state.looseTools, tool];
  state.orderStatusMessage = null;
}

function removeLooseTool(article: string) {
  const toolIndex = state.looseTools.findIndex((tool) => tool.article === article);
  if (toolIndex === -1) return;

  state.looseTools = state.looseTools.filter((_, index) => index !== toolIndex);
  state.orderStatusMessage = null;
}

function createDemoOrder() {
  state.orderStatusMessage = 'Заявка сформирована для передачи в отдел продаж.';
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

    <ShelfFillingStep
      v-else-if="state.wizardStep === 'shelf-filling'"
      :cart="selectedCart"
      :active-shelf="activeShelf"
      :active-shelf-id="state.activeShelfId"
      :catalog-kits="demoCatalogKits"
      :default-new-placement-mode="state.defaultNewPlacementMode"
      :shelf-placements="state.shelfPlacements"
      :placements="activePlacements"
      @select-shelf="selectShelf"
      @add-catalog-kit="addCatalogKit"
      @remove-placement="removePlacement"
      @update-placement-mode="updatePlacementMode"
      @reset-active-shelf="resetActiveShelf"
      @reset-all-shelves="resetAllShelves"
      @summary="goToStep('loose-tools')"
    />

    <LooseToolsStep
      v-else-if="state.wizardStep === 'loose-tools'"
      :tools="looseToolCatalog"
      :selected-tools="state.looseTools"
      @add-tool="addLooseTool"
      @remove-tool="removeLooseTool"
      @back="goToStep('shelf-filling')"
      @summary="goToStep('summary')"
    />

    <SummaryStep
      v-else
      :order-draft="orderDraft"
      :status-message="state.orderStatusMessage"
      @back="goToStep('loose-tools')"
      @create-order="createDemoOrder"
    />
  </AppShell>
</template>
