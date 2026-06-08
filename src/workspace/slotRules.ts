import type { CartShelf, CatalogFoamInsertKit } from '../catalog/catalogTypes';
import type { ShelfPlacement } from './workspaceTypes';

export const SHELF_CAPACITY_UNITS = 6;

export function getUsedShelfUnits(placements: ShelfPlacement[]): number {
  return placements.reduce((sum, placement) => sum + placement.shelfUnits, 0);
}

export function getRemainingShelfUnits(placements: ShelfPlacement[], shelfCapacityUnits = SHELF_CAPACITY_UNITS): number {
  return Math.max(shelfCapacityUnits - getUsedShelfUnits(placements), 0);
}

export function canAddCatalogKit(
  kit: CatalogFoamInsertKit,
  placements: ShelfPlacement[],
  shelfCapacityUnits = SHELF_CAPACITY_UNITS,
  shelfMaxLaymentHeightMm?: number,
): boolean {
  const fitsShelfUnits = kit.shelfUnits <= getRemainingShelfUnits(placements, shelfCapacityUnits);
  const fitsShelfHeight = shelfMaxLaymentHeightMm === undefined || kit.laymentHeightMm <= shelfMaxLaymentHeightMm;

  return fitsShelfUnits && fitsShelfHeight;
}

export function canAddCatalogKitToShelf(kit: CatalogFoamInsertKit, placements: ShelfPlacement[], shelf: CartShelf): boolean {
  return canAddCatalogKit(kit, placements, shelf.capacityUnits, shelf.maxLaymentHeightMm);
}
