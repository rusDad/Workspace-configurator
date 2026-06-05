import { reactive } from 'vue';
import type { WorkplaceConfigState } from './workspaceTypes';

export function createInitialWorkspaceState(): WorkplaceConfigState {
  return reactive({
    selectedCartArticle: null,
    activeShelfId: null,
    laymentSupplyMode: 'empty',
    shelfPlacements: {},
    looseTools: [],
    customLaymentResults: [],
    wizardStep: 'cart-selection',
    orderStatusMessage: null,
  });
}
