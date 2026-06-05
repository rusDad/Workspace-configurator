import type { CartShelf, ModuleSizeLabel, ShelfUnits, ToolCart, ToolItem } from '../catalog/catalogTypes';

export type LaymentSupplyMode = 'empty' | 'with-tools';

export type WizardStep = 'cart-selection' | 'shelf-filling' | 'summary';

export interface CatalogFoamSetPlacement {
  id: string;
  kind: 'catalog-foam-set';
  article: string;
  name: string;
  shelfUnits: ShelfUnits;
  sizeLabel: ModuleSizeLabel;
  laymentSupplyMode: LaymentSupplyMode;
  priceEmpty: number;
  priceWithTools: number;
  previewUrl: string | null;
  includedTools: ToolItem[];
}

export interface CustomLaymentPlacement {
  id: string;
  kind: 'custom-layment';
  article: string;
  name: string;
  orderId: string;
  orderNumber?: string;
  shelfUnits: ShelfUnits;
  sizeLabel: ModuleSizeLabel;
  price: number;
  previewPngUrl: string | null;
  tools: ToolItem[];
}

export type ShelfPlacement = CatalogFoamSetPlacement | CustomLaymentPlacement;

export type ShelfPlacements = Record<string, ShelfPlacement[]>;

export interface WorkplaceConfigState {
  selectedCartArticle: string | null;
  activeShelfId: string | null;
  defaultNewPlacementMode: LaymentSupplyMode;
  shelfPlacements: ShelfPlacements;
  looseTools: ToolItem[];
  customLaymentResults: CustomLaymentPlacement[];
  wizardStep: WizardStep;
  orderStatusMessage: string | null;
}

export interface PriceSummaryTotals {
  cartPrice: number;
  catalogKitsPrice: number;
  customLaymentsPrice: number;
  looseToolsPrice: number;
  totalPrice: number;
}

export interface WorkplaceOrderDraftShelf {
  shelf: CartShelf;
  placements: ShelfPlacement[];
}

export interface WorkplaceOrderDraft {
  schemaVersion: 1;
  cart: ToolCart | null;
  shelves: WorkplaceOrderDraftShelf[];
  looseTools: ToolItem[];
  totals: PriceSummaryTotals;
}
