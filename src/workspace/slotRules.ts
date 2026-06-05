import type { CatalogFoamInsertKit } from '../catalog/catalogTypes';
import type { ShelfPlacement } from './workspaceTypes';

export const SHELF_CAPACITY_UNITS = 6;

export function getUsedShelfUnits(placements: ShelfPlacement[]): number {
  return placements.reduce((sum, placement) => sum + placement.shelfUnits, 0);
}

export function getRemainingShelfUnits(placements: ShelfPlacement[], shelfCapacityUnits = SHELF_CAPACITY_UNITS): number {
  return Math.max(shelfCapacityUnits - getUsedShelfUnits(placements), 0);
}

export function canAddCatalogKit(kit: CatalogFoamInsertKit, placements: ShelfPlacement[], shelfCapacityUnits = SHELF_CAPACITY_UNITS): boolean {
  return kit.shelfUnits <= getRemainingShelfUnits(placements, shelfCapacityUnits);
}
