import { reactive } from 'vue';
import type { WorkplaceConfigState } from './workspaceTypes';

export function createInitialWorkspaceState(): WorkplaceConfigState {
  return reactive({
    selectedCartArticle: null,
    activeShelfId: null,
    defaultNewPlacementMode: 'with-tools',
    shelfPlacements: {},
    looseTools: [],
    customLaymentResults: [],
    wizardStep: 'cart-selection',
    orderStatusMessage: null,
  });
}
