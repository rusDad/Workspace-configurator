import type { ToolCart } from '../catalog/catalogTypes';
import { calculatePriceSummary } from './priceCalculator';
import type { WorkplaceConfigState, WorkplaceOrderDraft } from './workspaceTypes';

export function buildWorkplaceOrderDraft(state: WorkplaceConfigState, cart: ToolCart | null): WorkplaceOrderDraft {
  const totals = calculatePriceSummary({
    cart,
    shelfPlacements: state.shelfPlacements,
    looseToolsPrice: state.looseTools.reduce((sum, tool) => sum + tool.price, 0),
  });

  return {
    schemaVersion: 1,
    cart,
    shelves: cart?.shelves
      .map((shelf) => ({
        shelf,
        placements: state.shelfPlacements[shelf.id] ?? [],
      }))
      .filter((item) => item.placements.length > 0) ?? [],
    looseTools: state.looseTools,
    totals,
  };
}
