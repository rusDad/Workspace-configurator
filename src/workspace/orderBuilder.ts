import type { ToolCart } from '../catalog/catalogTypes';
import { calculatePriceSummary } from './priceCalculator';
import type { WorkplaceConfigState, WorkplaceOrderDraft } from './workspaceTypes';

export function buildWorkplaceOrderDraft(state: WorkplaceConfigState, cart: ToolCart | null): WorkplaceOrderDraft {
  const totals = calculatePriceSummary({
    cart,
    shelfPlacements: state.shelfPlacements,
    laymentSupplyMode: state.laymentSupplyMode,
    looseToolsPrice: state.looseTools.reduce((sum, tool) => sum + tool.price, 0),
  });

  return {
    schemaVersion: 1,
    cart,
    laymentSupplyMode: state.laymentSupplyMode,
    shelves: cart?.shelves.map((shelf) => ({
      shelf,
      placements: state.shelfPlacements[shelf.id] ?? [],
    })) ?? [],
    looseTools: state.looseTools,
    totals,
  };
}
