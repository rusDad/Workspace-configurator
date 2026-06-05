import type { ToolCart } from '../catalog/catalogTypes';
import type { PriceSummaryTotals, ShelfPlacements, ShelfPlacement } from './workspaceTypes';

export function getPlacementPrice(placement: ShelfPlacement): number {
  if (placement.kind === 'catalog-foam-set') {
    return placement.laymentSupplyMode === 'empty' ? placement.priceEmpty : placement.priceWithTools;
  }

  return placement.price;
}

export function calculatePriceSummary(params: {
  cart: ToolCart | null;
  shelfPlacements: ShelfPlacements;
  looseToolsPrice?: number;
}): PriceSummaryTotals {
  const cartPrice = params.cart?.price ?? 0;
  const allPlacements = Object.values(params.shelfPlacements).flat();
  const catalogKitsPrice = allPlacements
    .filter((placement) => placement.kind === 'catalog-foam-set')
    .reduce((sum, placement) => sum + getPlacementPrice(placement), 0);
  const customLaymentsPrice = allPlacements
    .filter((placement) => placement.kind === 'custom-layment')
    .reduce((sum, placement) => sum + getPlacementPrice(placement), 0);
  const looseToolsPrice = params.looseToolsPrice ?? 0;

  return {
    cartPrice,
    catalogKitsPrice,
    customLaymentsPrice,
    looseToolsPrice,
    totalPrice: cartPrice + catalogKitsPrice + customLaymentsPrice + looseToolsPrice,
  };
}
