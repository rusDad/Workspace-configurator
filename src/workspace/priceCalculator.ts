import type { ToolCart } from '../catalog/catalogTypes';
import type { LaymentSupplyMode, PriceSummaryTotals, ShelfPlacements, ShelfPlacement } from './workspaceTypes';

export function getPlacementPrice(placement: ShelfPlacement, laymentSupplyMode: LaymentSupplyMode): number {
  if (placement.kind === 'catalog-foam-set') {
    return laymentSupplyMode === 'empty' ? placement.priceEmpty : placement.priceWithTools;
  }

  const toolsPrice = laymentSupplyMode === 'with-tools'
    ? placement.tools.reduce((sum, tool) => sum + tool.price, 0)
    : 0;

  return placement.price + toolsPrice;
}

export function calculatePriceSummary(params: {
  cart: ToolCart | null;
  shelfPlacements: ShelfPlacements;
  laymentSupplyMode: LaymentSupplyMode;
  looseToolsPrice?: number;
}): PriceSummaryTotals {
  const cartPrice = params.cart?.price ?? 0;
  const allPlacements = Object.values(params.shelfPlacements).flat();
  const catalogKitsPrice = allPlacements
    .filter((placement) => placement.kind === 'catalog-foam-set')
    .reduce((sum, placement) => sum + getPlacementPrice(placement, params.laymentSupplyMode), 0);
  const customLaymentsPrice = allPlacements
    .filter((placement) => placement.kind === 'custom-layment')
    .reduce((sum, placement) => sum + getPlacementPrice(placement, params.laymentSupplyMode), 0);
  const looseToolsPrice = params.looseToolsPrice ?? 0;

  return {
    cartPrice,
    catalogKitsPrice,
    customLaymentsPrice,
    looseToolsPrice,
    totalPrice: cartPrice + catalogKitsPrice + customLaymentsPrice + looseToolsPrice,
  };
}
